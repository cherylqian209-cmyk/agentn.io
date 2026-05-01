'use client'

import { ChangeEvent, useMemo, useState } from 'react'
import { useMvp } from '@/lib/mvpStore'
import { Dataset, DatasetColumn, DatasetOperation, DatasetRow } from '@/lib/dataLab'

const sampleRows = [
  { company: 'Northstar AI', email: 'ops@northstar.ai', website: 'https://northstar.ai', headcount: 48, priority: true },
  { company: 'Orbit Labs', email: 'hello@orbitlabs.io', website: 'https://orbitlabs.io', headcount: 19, priority: false },
]

const inferType = (v: unknown): DatasetColumn['type'] => {
  if (typeof v === 'number') return 'number'
  if (typeof v === 'boolean') return 'boolean'
  const value = String(v ?? '').trim()
  if (!value) return 'unknown'
  if (/^\S+@\S+\.\S+$/.test(value)) return 'email'
  if (/^https?:\/\//.test(value)) return 'url'
  if (/^\+?[0-9\-()\s]{7,}$/.test(value)) return 'phone'
  if (!Number.isNaN(Date.parse(value))) return 'date'
  return 'string'
}

const mkDataset = (name: string, sourceType: Dataset['sourceType'], objects: Record<string, unknown>[]): Dataset => {
  const now = new Date().toISOString()
  const colNames = Array.from(new Set(objects.flatMap(o => Object.keys(o))))
  const columns: DatasetColumn[] = colNames.map(c => {
    const vals = objects.map(r => r[c]).filter(Boolean)
    return {
      id: crypto.randomUUID(),
      name: c,
      type: inferType(vals[0]),
      nullable: objects.some(r => !r[c]),
      uniqueCount: new Set(vals.map(v => String(v))).size,
      emptyCount: objects.filter(r => !r[c]).length,
      sampleValues: vals.slice(0, 3).map(v => String(v)),
    }
  })
  const rows: DatasetRow[] = objects.map(o => ({ id: crypto.randomUUID(), cells: o, status: 'new', source: sourceType, createdAt: now, updatedAt: now }))
  return { id: crypto.randomUUID(), name, columns, rows, rowCount: rows.length, createdAt: now, updatedAt: now, sourceType }
}

const parseCsv = (raw: string) => {
  const lines = raw.trim().split(/\r?\n/)
  const headers = lines[0].split(',').map(h => h.trim())
  return lines.slice(1).map(line => {
    const values = line.split(',')
    return headers.reduce((acc, h, idx) => ({ ...acc, [h]: values[idx]?.trim() ?? '' }), {})
  })
}

export default function DataLab() {
  const { recordDataOperation } = useMvp()
  const [dataset, setDataset] = useState<Dataset | null>(null)
  const [operations, setOperations] = useState<DatasetOperation[]>([])
  const [query, setQuery] = useState('')

  const logOperation = (type: DatasetOperation['type'], title: string, description: string, affectedRows?: number) => {
    if (!dataset) return
    const op: DatasetOperation = { id: crypto.randomUUID(), datasetId: dataset.id, type, title, description, createdAt: new Date().toISOString(), status: 'completed', affectedRows }
    setOperations(prev => [op, ...prev])
    recordDataOperation(dataset.id, title, description, affectedRows)
  }

  const importObjects = (name: string, sourceType: Dataset['sourceType'], objects: Record<string, unknown>[]) => {
    const next = mkDataset(name, sourceType, objects)
    setDataset(next)
    setOperations([])
    setTimeout(() => logOperation('import', `Imported ${sourceType.toUpperCase()} dataset`, `${next.rowCount} rows parsed into ${next.columns.length} columns.`, next.rowCount), 0)
  }

  const onUpload = async (event: ChangeEvent<HTMLInputElement>, mode: 'csv' | 'json') => {
    const file = event.target.files?.[0]
    if (!file) return
    const text = await file.text()
    const objects = mode === 'csv' ? parseCsv(text) : JSON.parse(text)
    importObjects(file.name, mode, Array.isArray(objects) ? objects : [objects])
    event.target.value = ''
  }

  const filteredRows = useMemo(() => {
    if (!dataset) return []
    if (!query) return dataset.rows
    return dataset.rows.filter(r => JSON.stringify(r.cells).toLowerCase().includes(query.toLowerCase()))
  }, [dataset, query])

  return <div className='page-scroll'><div className='page-header'><div><div className='page-title'>DATA LAB</div><div className='page-sub'>IMPORT, CLEAN, ENRICH & OPERATE ON LARGE DATASETS</div></div></div>
    <div className='page-body'>
      <div className='toolbar'>
        <button className='mbtn-ok' onClick={() => importObjects('Sample Leads Dataset', 'sample', sampleRows)}>Import Sample Dataset</button>
        <label className='mbtn-cancel'>Upload CSV<input type='file' accept='.csv,text/csv' hidden onChange={e => onUpload(e, 'csv')} /></label>
        <label className='mbtn-cancel'>Upload JSON<input type='file' accept='.json,application/json' hidden onChange={e => onUpload(e, 'json')} /></label>
        <button className='mbtn-cancel' onClick={() => importObjects('Empty Dataset', 'manual', [])}>Create Empty Dataset</button>
      </div>
      {dataset && <>
        <div className='kpi-grid'>
          <div className='kpi'><div className='kpi-label'>DATASET</div><div className='kpi-value'>{dataset.name}</div></div>
          <div className='kpi'><div className='kpi-label'>ROWS</div><div className='kpi-value'>{dataset.rowCount}</div></div>
          <div className='kpi'><div className='kpi-label'>COLUMNS</div><div className='kpi-value'>{dataset.columns.length}</div></div>
        </div>
        <input placeholder='Search rows...' value={query} onChange={e => { setQuery(e.target.value); logOperation('filter', 'Row search', `Query: ${e.target.value || 'none'}`) }} />
        <div className='table-wrap'><table className='tbl'><thead><tr>{dataset.columns.map(c => <th key={c.id}>{c.name}</th>)}</tr></thead><tbody>{filteredRows.slice(0, 100).map(r => <tr key={r.id}>{dataset.columns.map(c => <td key={c.id}>{String(r.cells[c.name] ?? '')}</td>)}</tr>)}</tbody></table></div>
        <div className='artifact-box'>
          <strong>Operation Log</strong>
          {operations.map(op => <div key={op.id}>[{new Date(op.createdAt).toLocaleTimeString()}] {op.title} · {op.description}</div>)}
        </div>
      </>}
    </div>
  </div>
}
