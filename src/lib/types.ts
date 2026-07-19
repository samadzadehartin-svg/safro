export interface Hotel {
  name: string
  stars: number
  price: number
  capacity: number
  bookingUrl?: string
}

export interface Tour {
  id: string
  name: string
  destination: string
  image: string
  price: number
  currency?: string
  duration: string
  airline: string
  hotels: Hotel[]
  dates: string[]
  tag?: string
  description?: string
  itinerary?: string
  visible: boolean
  specialOffer: boolean
  createdAt: string
  updatedAt: string
}

export interface VisaService {
  id: string
  country: string
  flag: string
  processingTime: string
  price: string
  visible: boolean
  documents?: string
  notes?: string
}

export interface Lead {
  id: string
  name: string
  phone: string
  destination: string
  budget: string
  timestamp: string
  status: 'new' | 'contacted' | 'followup' | 'noanswer' | 'booked' | 'cancelled'
  note: string
  assignedTo?: string
  toursViewed?: string[]
}

export interface Order {
  id: string
  tourId: string
  tourName: string
  passengerName: string
  phone: string
  date: string
  hotelPreference?: string
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
}

export interface StaffAccount {
  username: string
  password: string
  name: string
  role: 'staff' | 'admin'
}

export interface AppSettings {
  agencyName: string
  phone: string
  email: string
  address: string
  supabaseUrl: string
  supabaseKey: string
}
