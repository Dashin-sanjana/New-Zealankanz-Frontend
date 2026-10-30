export interface CategoryOption {
  id: string
  name: string
  slug: string
  count?: number
  description?: string
  children: Array<CategoryOption | string>
  parentId?: string
  fields?: CategoryField[]
  capabilities?: string[]
}

export interface CategoryField {
  key: string
  label: string
  type: 'text' | 'number' | 'select' | 'textarea'
  required?: boolean
  filterable?: boolean
  options?: string[]
  min?: number
  max?: number
  unit?: string
}

export interface LocationOption {
  id: string
  name: string
  slug: string
}

export interface Banner {
  id: string
  sponsor: string
  title: string
  description: string
  imageUrl: string
  linkUrl: string
  placement?: string
  active?: boolean
}

export interface AdminUser {
  id: string
  email: string
  role: string
  active: boolean
  label?: string
}

export interface SelectOption {
  value: string
  label: string
}

export interface AdminItem {
  id?: string
  label?: string
  name?: string
  title?: string
  sponsor?: string
  description?: string
  imageUrl?: string
  placement?: string
  email?: string
  role?: string
  active?: boolean
}
