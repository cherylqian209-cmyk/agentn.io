export type DatasetColumnType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'email'
  | 'url'
  | 'phone'
  | 'json'
  | 'unknown'

export type DatasetColumn = {
  id: string
  name: string
  type: DatasetColumnType
  nullable: boolean
  uniqueCount?: number
  emptyCount?: number
  sampleValues?: string[]
}

export type DatasetRow = {
  id: string
  cells: Record<string, unknown>
  status?: 'new' | 'edited' | 'enriched' | 'flagged' | 'error'
  source?: string
  createdAt: string
  updatedAt: string
}

export type Dataset = {
  id: string
  name: string
  description?: string
  columns: DatasetColumn[]
  rows: DatasetRow[]
  rowCount: number
  createdAt: string
  updatedAt: string
  sourceType: 'csv' | 'json' | 'manual' | 'sample' | 'api' | 'google_sheets'
  tags?: string[]
}

export type DatasetOperation = {
  id: string
  datasetId: string
  type:
    | 'import'
    | 'edit_cell'
    | 'edit_row'
    | 'add_row'
    | 'delete_row'
    | 'add_column'
    | 'delete_column'
    | 'filter'
    | 'sort'
    | 'dedupe'
    | 'normalize'
    | 'enrich'
    | 'export'
    | 'agent_run'
  title: string
  description: string
  createdAt: string
  affectedRows?: number
  status: 'pending' | 'running' | 'completed' | 'failed'
  metadata?: Record<string, unknown>
}
