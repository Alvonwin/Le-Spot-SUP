import { localSpots } from '@/lib/local-storage'
import { PaddleSpot } from '@/lib/types'

export const getSpots = async (options?: { sortBy?: string }) => {
  return localSpots.getAll()
}

export const addSpot = async (spot: PaddleSpot) => {
  localSpots.add(spot)
  return spot
}

export const getSpotsNearLocation = async (
  lat: number,
  lng: number,
  radiusKm: number = 50
): Promise<PaddleSpot[]> => {
  const allSpots = localSpots.getAll()

  // Filter spots within radius
  return allSpots.filter(spot => {
    const distance = calculateDistance(lat, lng, spot.latitude, spot.longitude)
    return distance <= radiusKm
  })
}

// Calculate distance between 2 GPS points (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

export const spotService = {
  getSpots,
  addSpot,
  getSpotsNearLocation
}