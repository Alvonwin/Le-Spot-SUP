import { localSessions } from '@/lib/local-storage'
import type { PaddleSession } from '@/lib/types'

export const addSession = async (
  userId: string,
  sessionData: Partial<PaddleSession>
): Promise<PaddleSession> => {
  const newSession = localSessions.add(sessionData as PaddleSession)
  return newSession
}

export const getSessions = async (userId: string): Promise<PaddleSession[]> => {
  return localSessions.getAll()
}

export const deleteSession = async (sessionId: string): Promise<void> => {
  localSessions.delete(sessionId)
}