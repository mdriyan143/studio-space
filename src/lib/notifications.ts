export type AppNotification = {
  _id: string
  type: string
  message: string
  bookingId: string | null
  studioId: string | null
  read: boolean
  createdAt: string
}