export interface PaddleSpot {
  id: string
  name: string
  latitude: number
  longitude: number
  description?: string
  address?: string
  photoURL?: string
  type?: string
  rating?: number
}

export interface PaddleSession {
  id?: string
  spotId: string
  spotName?: string
  date: Date | string
  startTime?: string
  endTime?: string
  duration: number
  durationMinutes?: number
  distance?: number
  distanceKilometers?: number
  conditions?: string
  notes?: string
  userId?: string
  createdAt?: Date | string
}

export interface User {
  uid: string
  email: string | null
  displayName?: string | null
  photoURL?: string | null
}