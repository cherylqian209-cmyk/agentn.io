export type GeneratedItemsPayload = {
  items: Array<Record<string, unknown>>
  requestedCount: number
  generatedCount: number
  createdAt: string
}

function toRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  return value as Record<string, unknown>
}

export function normalizeGeneratedItems(input: unknown, requestedCount: number): GeneratedItemsPayload {
  const normalizedRequestedCount = Math.max(1, Math.floor(requestedCount || 1))

  let rawItems: unknown[] = []
  if (Array.isArray(input)) {
    rawItems = input
  } else if (input && typeof input === 'object') {
    const obj = input as Record<string, unknown>
    if (Array.isArray(obj.items)) {
      rawItems = obj.items
    } else {
      rawItems = [obj]
    }
  }

  const items = rawItems
    .map(toRecord)
    .filter((value): value is Record<string, unknown> => value !== null)
    .slice(0, normalizedRequestedCount)

  return {
    items,
    requestedCount: normalizedRequestedCount,
    generatedCount: items.length,
    createdAt: new Date().toISOString(),
  }
}

function flattenObject(value: unknown, prefix = ''): Record<string, string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return prefix ? { [prefix]: value == null ? '' : String(value) } : {}
  }

  return Object.entries(value as Record<string, unknown>).reduce((acc, [key, nextValue]) => {
    const nextKey = prefix ? `${prefix}.${key}` : key
    if (nextValue && typeof nextValue === 'object' && !Array.isArray(nextValue)) {
      Object.assign(acc, flattenObject(nextValue, nextKey))
    } else if (Array.isArray(nextValue)) {
      acc[nextKey] = JSON.stringify(nextValue)
    } else {
      acc[nextKey] = nextValue == null ? '' : String(nextValue)
    }
    return acc
  }, {} as Record<string, string>)
}

function csvEscape(value: string): string {
  return `"${value.replaceAll('"', '""')}"`
}

export function toJsonExport(itemsPayload: GeneratedItemsPayload) {
  return {
    items: itemsPayload.items,
    count: itemsPayload.items.length,
  }
}

export function toCsvExport(itemsPayload: GeneratedItemsPayload): string {
  const flatRows = itemsPayload.items.map(item => flattenObject(item))
  const columns = Array.from(new Set(flatRows.flatMap(row => Object.keys(row))))

  if (columns.length === 0) return ''

  const header = columns.join(',')
  const rows = flatRows.map(row => columns.map(column => csvEscape(row[column] ?? '')).join(','))
  return [header, ...rows].join('\n')
}
