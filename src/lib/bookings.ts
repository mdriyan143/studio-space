export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled"

export type Booking = {
  _id: string
  studioId: string
  studioTitle: string
  studioImage: string
  studioLocation: string
  hourlyRate: number
  securityDeposit: number
  date: string
  startTime: string
  endTime: string
  hours: number
  totalPrice: number
  notes: string
  status: BookingStatus
  userId: string
  userEmail: string
  userName: string
  hostId: string
  hostEmail: string
  hostName: string
  createdAt: string
}