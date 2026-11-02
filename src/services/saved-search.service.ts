import { apiRequest, unwrapCollection } from './api'

export interface SavedSearch {
  id: string
  name: string
  query: Record<string, string>
  createdAt: string
}

function normalizeSavedSearch(input: unknown): SavedSearch {
  const row = input && typeof input === 'object' ? input as Record<string, unknown> : {}
  const query = row.query && typeof row.query === 'object' ? row.query as Record<string, unknown> : {}
  return {
    id: String(row.id || ''), name: String(row.name || 'Saved search'),
    query: Object.fromEntries(Object.entries(query).filter((entry): entry is [string, string] => typeof entry[1] === 'string')),
    createdAt: String(row.createdAt || ''),
  }
}

export async function getSavedSearches() {
  return unwrapCollection(await apiRequest('/saved-searches')).map(normalizeSavedSearch)
}

export async function saveSearch(name: string, query: Record<string, string>) {
  return normalizeSavedSearch(await apiRequest('/saved-searches', { method: 'POST', body: JSON.stringify({ name, query }) }))
}

export function deleteSavedSearch(id: string) {
  return apiRequest(`/saved-searches/${encodeURIComponent(id)}`, { method: 'DELETE' })
}
