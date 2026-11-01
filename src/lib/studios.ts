export const STUDIO_CATEGORIES = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
] as const

export type Studio = {
  _id: string
  title: string
  category: string
  hourlyRate: number
  securityDeposit: number
  maxCapacity: number
  location: string
  imageUrl: string
  amenities: string[]
  gallery: string[]
  overview: string
  ownerId: string
  ownerEmail: string
  ownerName: string
  ownerImage?: string
  rating: number
  reviewCount: number
  createdAt: string
}

export type ListResponse<T> = { success: boolean; data: T }