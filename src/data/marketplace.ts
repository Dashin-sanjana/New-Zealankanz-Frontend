import { slugify } from '../lib/slugify'

export const categories = [
  { id: 'property', name: 'Property', slug: 'property', count: 86, children: ['Sale', 'Rent', 'Flatmates'] },
  { id: 'motor', name: 'Motor', slug: 'motor', count: 43, children: [] },
  { id: 'jobs', name: 'Jobs', slug: 'jobs', count: 29, children: [] },
  { id: 'services', name: 'Services', slug: 'services', count: 58, children: [] },
]

export const locations = [
  'Auckland',
  'Wellington',
  'Christchurch',
  'Hamilton',
  'Tauranga',
  'Dunedin',
  'Queenstown',
  'Palmerston North',
  'Napier/Hastings',
  'Rotorua',
  'Invercargill',
].map((name) => ({ id: slugify(name), name, slug: slugify(name) }))

export const fallbackAds = [
  {
    id: '1',
    title: 'Sunny two bedroom unit near train station',
    slug: 'sunny-two-bedroom-unit-near-train-station',
    category: 'Property',
    categorySlug: 'property',
    subcategory: 'Rent',
    location: 'Auckland',
    locationSlug: 'auckland',
    price: '$620 / week',
    status: 'APPROVED',
    featured: true,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80',
    description:
      'Warm and tidy unit with open plan living, off-street parking, and quick access to local shops.',
    contactName: 'Maya',
    contactEmail: 'maya@example.com',
  },
  {
    id: '2',
    title: 'Toyota Aqua hybrid, tidy condition',
    slug: 'toyota-aqua-hybrid-tidy-condition',
    category: 'Motor',
    categorySlug: 'motor',
    location: 'Christchurch',
    locationSlug: 'christchurch',
    price: '$9,800',
    status: 'APPROVED',
    featured: true,
    image: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=80',
    description: 'Economical hybrid with current WOF, recent service, and clean interior.',
    contactName: 'Sam',
    contactEmail: 'sam@example.com',
  },
  {
    id: '3',
    title: 'Weekend cafe assistant wanted',
    slug: 'weekend-cafe-assistant-wanted',
    category: 'Jobs',
    categorySlug: 'jobs',
    location: 'Wellington',
    locationSlug: 'wellington',
    price: '$26 / hour',
    status: 'APPROVED',
    featured: false,
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=80',
    description: 'Friendly cafe team needs a reliable weekend assistant. Barista experience preferred.',
    contactName: 'Aro Cafe',
    contactEmail: 'jobs@example.com',
  },
  {
    id: '4',
    title: 'End of tenancy cleaning service',
    slug: 'end-of-tenancy-cleaning-service',
    category: 'Services',
    categorySlug: 'services',
    location: 'Hamilton',
    locationSlug: 'hamilton',
    price: 'From $180',
    status: 'APPROVED',
    featured: false,
    image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=900&q=80',
    description: 'Professional cleaning for rentals, flats, and small offices with flexible booking.',
    contactName: 'Bright Clean',
    contactEmail: 'hello@example.com',
  },
]

export const fallbackBanners = {
  HOME_AFTER_HERO: [
    {
      sponsor: 'Southern Solar Co.',
      title: 'Winter solar installs from $89/week',
      description: 'Book a free home energy check across Auckland and Hamilton.',
      imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80',
      linkUrl: '/contact',
    },
    {
      sponsor: 'KiwiMove Rentals',
      title: 'Moving this weekend?',
      description: 'Vans, trailers, and moving boxes ready for same-day pickup.',
      imageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80',
      linkUrl: '/category/services',
    },
    {
      sponsor: 'Aro Street Cafe',
      title: 'Two coffees for $9 before 10am',
      description: 'Show this marketplace ad in store, Monday to Friday.',
      imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
      linkUrl: '/location/wellington',
    },
  ],
  HOME_SIDEBAR: [
    {
      sponsor: 'Bright Clean',
      title: 'End of tenancy cleaning deals',
      description: 'Fixed-price cleaning for rentals and small offices.',
      imageUrl: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=600&q=80',
      linkUrl: '/category/services',
    },
  ],
  CATEGORY_TOP: [
    {
      sponsor: 'Marketplace partner',
      title: 'Advertise beside category shoppers',
      description: 'Reach buyers as they browse local listings.',
      imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
      linkUrl: '/contact',
    },
  ],
  LISTING_SIDEBAR: [
    {
      sponsor: 'NZ Delivery',
      title: 'Need this item delivered?',
      description: 'Compare local delivery quotes before you buy.',
      imageUrl: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&w=800&q=80',
      linkUrl: '/contact',
    },
  ],
  FOOTER_TOP: [
    {
      sponsor: 'NewZealankans',
      title: 'Promote your local business',
      description: 'Simple ad placements for local services, shops, and events.',
      imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80',
      linkUrl: '/contact',
    },
  ],
  HOME: [
    {
      sponsor: 'Southern Solar Co.',
      title: 'Winter solar installs from $89/week',
      description: 'Book a free home energy check across Auckland and Hamilton.',
      imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80',
      linkUrl: '/contact',
    },
    {
      sponsor: 'KiwiMove Rentals',
      title: 'Moving this weekend?',
      description: 'Vans, trailers, and moving boxes ready for same-day pickup.',
      imageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80',
      linkUrl: '/category/services',
    },
    {
      sponsor: 'Aro Street Cafe',
      title: 'Two coffees for $9 before 10am',
      description: 'Show this marketplace ad in store, Monday to Friday.',
      imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
      linkUrl: '/location/wellington',
    },
  ],
  SIDEBAR: [
    {
      sponsor: 'Bright Clean',
      title: 'End of tenancy cleaning deals',
      description: 'Fixed-price cleaning for rentals and small offices.',
      imageUrl: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=600&q=80',
      linkUrl: '/category/services',
    },
  ],
  CATEGORY: [
    {
      sponsor: 'Marketplace partner',
      title: 'Advertise beside category shoppers',
      description: 'Reach buyers as they browse local listings.',
      imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
      linkUrl: '/contact',
    },
  ],
  LISTING: [
    {
      sponsor: 'NZ Delivery',
      title: 'Need this item delivered?',
      description: 'Compare local delivery quotes before you buy.',
      imageUrl: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&w=800&q=80',
      linkUrl: '/contact',
    },
  ],
  FOOTER: [
    {
      sponsor: 'NewZealankans',
      title: 'Promote your local business',
      description: 'Simple ad placements for local services, shops, and events.',
      imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80',
      linkUrl: '/contact',
    },
  ],
}

export const adPlacementOptions = [
  ['HOME_AFTER_HERO', 'Home: after hero'],
  ['HOME_SIDEBAR', 'Home: sidebar'],
  ['CATEGORY_TOP', 'Category: top'],
  ['CATEGORY_AFTER_SEARCH', 'Category: after advanced search'],
  ['SEARCH_TOP', 'Search results: top'],
  ['LISTING_SIDEBAR', 'Listing detail: sidebar'],
  ['FOOTER_TOP', 'Footer: top'],
]

export const adminCards = [
  ['Pending Ads', '/admin/ads/pending', 'Review, approve, reject, or feature submitted listings.'],
  ['All Ads', '/admin/ads', 'Manage every listing and inspect moderation status.'],
  ['Categories', '/admin/categories', 'Maintain marketplace categories and subcategories.'],
  ['Locations', '/admin/locations', 'Add or update NZ city filters.'],
  ['Banners', '/admin/banners', 'Control homepage, sidebar, listing, and footer ad slots.'],
  ['Users', '/admin/users', 'Review members and account status.'],
]

export const quickTabs = [
  ['Marketplace', '/search'],
  ['Property', '/category/property'],
  ['Motors', '/category/motor'],
  ['Jobs', '/category/jobs'],
  ['Services', '/category/services'],
  ['Browse all', '/search'],
]

export const popularSearches = {
  Marketplace: ['Furniture', 'iPhone', 'Computers', 'Electronics', 'Sports gear', 'Clothing'],
  Property: ['Auckland rentals', 'Wellington homes', 'Flatmates', 'Queenstown property', 'Christchurch rentals'],
  Motors: ['Toyota', 'Hybrid cars', 'Car parts', 'Motorbikes', 'Campervans'],
  Jobs: ['Hospitality', 'Construction', 'Healthcare', 'Retail', 'Office admin'],
}
