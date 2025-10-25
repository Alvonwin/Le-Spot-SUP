import type { PaddleSpot, PaddleSession, User } from './types'
import quebecSpots from './quebec-spots-data'

// Clés de stockage
const KEYS = {
  SPOTS: 'sup_spots',
  SESSIONS: 'sup_sessions',
  USER: 'sup_user',
  SPOTS_INITIALIZED: 'sup_spots_initialized',
}

// Initialize spots with Quebec data if not already done
const initializeSpots = () => {
  if (typeof window === 'undefined') return

  const isInitialized = localStorage.getItem(KEYS.SPOTS_INITIALIZED)
  if (!isInitialized) {
    localStorage.setItem(KEYS.SPOTS, JSON.stringify(quebecSpots))
    localStorage.setItem(KEYS.SPOTS_INITIALIZED, 'true')
    console.log(`✅ Initialized ${quebecSpots.length} Quebec SUP spots`)
  }
}

// Fonctions pour les spots
export const localSpots = {
  getAll: (): PaddleSpot[] => {
    if (typeof window === 'undefined') return []

    // Auto-initialize on first call
    initializeSpots()

    const data = localStorage.getItem(KEYS.SPOTS)
    return data ? JSON.parse(data) : []
  },
  
  save: (spots: PaddleSpot[]) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(KEYS.SPOTS, JSON.stringify(spots))
  },
  
  add: (spot: PaddleSpot) => {
    const spots = localSpots.getAll()
    spots.push(spot)
    localSpots.save(spots)
  }
}

// Fonctions pour les sessions
export const localSessions = {
  getAll: (): PaddleSession[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(KEYS.SESSIONS)
    return data ? JSON.parse(data) : []
  },
  
  save: (sessions: PaddleSession[]) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions))
  },
  
  add: (session: PaddleSession) => {
    const sessions = localSessions.getAll()
    const newSession = {
      ...session,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    sessions.push(newSession)
    localSessions.save(sessions)
    return newSession
  },
  
  delete: (id: string) => {
    const sessions = localSessions.getAll()
    const filtered = sessions.filter(s => s.id !== id)
    localSessions.save(filtered)
  }
}

// Fonction pour l'utilisateur
export const localUser = {
  get: (): User | null => {
    if (typeof window === 'undefined') return null
    const data = localStorage.getItem(KEYS.USER)
    return data ? JSON.parse(data) : null
  },
  
  save: (user: User) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(KEYS.USER, JSON.stringify(user))
  },
  
  clear: () => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(KEYS.USER)
  }
}