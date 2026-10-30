import { apiRequest, unwrapCollection } from './api'

export interface ContactPayload {
  name: string
  email: string
  subject: string
  message: string
  adId?: string
}

export interface ContactReceipt {
  id: string
  sellerNotified: boolean | null
}

export interface SellerEnquiry extends ContactPayload {
  id: string
  adId: string
  createdAt: string
  ad: { id: string; title: string; slug: string } | null
}

export function submitContact(payload: ContactPayload): Promise<ContactReceipt> {
  return apiRequest('/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getSellerEnquiries(): Promise<SellerEnquiry[]> {
  return apiRequest('/contact/me').then((result) => unwrapCollection(result) as SellerEnquiry[])
}
