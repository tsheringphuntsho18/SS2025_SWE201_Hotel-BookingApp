export interface Hotel {
  id: string
  name: string
  description: string
  image_url: string
  location: string
  rating: number
  price_per_night: number
}

export interface Room {
  id: string
  hotel_id: string
  room_type: string
  description: string
  price_per_night: number
  available: boolean
  image_url: string
}

export interface Booking {
  id: string
  user_id: string
  hotel_id: string
  room_id: string
  check_in_date: string
  check_out_date: string
  total_amount: number
  status: "pending" | "confirmed" | "cancelled"
}
