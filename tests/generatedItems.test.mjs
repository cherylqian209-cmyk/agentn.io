import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeGeneratedItems, toCsvExport, toJsonExport } from '../src/lib/generatedItems.ts'

test('Exporting 1 item to CSV', () => {
  const payload = normalizeGeneratedItems([{ id: 1, name: 'A' }], 1)
  const csv = toCsvExport(payload)
  assert.equal(csv.split('\n').length, 2)
})

test('Exporting 50 items to CSV', () => {
  const rows = Array.from({ length: 50 }, (_, i) => ({ id: i + 1, name: `Lead ${i + 1}` }))
  const payload = normalizeGeneratedItems(rows, 50)
  const csv = toCsvExport(payload)
  assert.equal(csv.split('\n').length, 51)
})

test('Exporting 50 items to JSON', () => {
  const rows = Array.from({ length: 50 }, (_, i) => ({ id: i + 1 }))
  const payload = normalizeGeneratedItems(rows, 50)
  const json = toJsonExport(payload)
  assert.equal(json.items.length, 50)
  assert.equal(json.count, 50)
})

test('Mixed object keys across rows', () => {
  const payload = normalizeGeneratedItems([{ a: 1 }, { b: 2 }], 2)
  const csv = toCsvExport(payload)
  assert.ok(csv.startsWith('a,b') || csv.startsWith('b,a'))
})

test('Empty item array', () => {
  const payload = normalizeGeneratedItems([], 10)
  assert.equal(payload.generatedCount, 0)
  assert.equal(toCsvExport(payload), '')
})

test('Nested object fields', () => {
  const payload = normalizeGeneratedItems([{ company: { name: 'Acme' }, stats: { score: 9 } }], 1)
  const csv = toCsvExport(payload)
  assert.ok(csv.includes('company.name'))
  assert.ok(csv.includes('stats.score'))
})

test('Requested count greater than generated count', () => {
  const payload = normalizeGeneratedItems([{ id: 1 }, { id: 2 }], 50)
  assert.equal(payload.requestedCount, 50)
  assert.equal(payload.generatedCount, 2)
})
