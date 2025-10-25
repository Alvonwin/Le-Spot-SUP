import type { PaddleSession } from '@/lib/types'

interface SessionStatsProps {
  sessions?: PaddleSession[]
}

export default function SessionStats({ sessions = [] }: SessionStatsProps) {
  const totalSessions = sessions.length
  const totalDistance = sessions.reduce((sum, session) => sum + (session.distance || 0), 0)
  const totalDuration = sessions.reduce((sum, session) => sum + (session.duration || 0), 0)

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="p-4 border rounded-lg">
        <h3 className="font-semibold text-sm text-muted-foreground">Total Sessions</h3>
        <p className="text-2xl font-bold mt-2">{totalSessions}</p>
      </div>
      <div className="p-4 border rounded-lg">
        <h3 className="font-semibold text-sm text-muted-foreground">Distance totale</h3>
        <p className="text-2xl font-bold mt-2">{totalDistance.toFixed(1)} km</p>
      </div>
      <div className="p-4 border rounded-lg">
        <h3 className="font-semibold text-sm text-muted-foreground">Temps total</h3>
        <p className="text-2xl font-bold mt-2">{Math.floor(totalDuration / 60)}h {totalDuration % 60}m</p>
      </div>
    </div>
  )
}