import { apiRequest } from './api'

export function submitContact(payload) {
  return apiRequest('/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
