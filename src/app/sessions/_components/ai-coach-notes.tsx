import type { PaddleSession } from '@/lib/types'

interface AICoachNotesProps {
  session?: PaddleSession
}

export default function AICoachNotes({ session }: AICoachNotesProps) {
  return (
    <div className="p-6 border rounded-lg bg-muted/50">
      <h3 className="text-lg font-semibold mb-4">Notes du Coach IA</h3>
      <div className="space-y-4">
        {session ? (
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Analyse de votre session du {new Date(session.date).toLocaleDateString()}
            </p>
            <div className="space-y-2">
              <p className="text-sm">
                • Durée: {session.duration} minutes
              </p>
              {session.distance && (
                <p className="text-sm">
                  • Distance: {session.distance} km
                </p>
              )}
              {session.notes && (
                <p className="text-sm">
                  • Notes: {session.notes}
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Aucune session enregistrée pour le moment. Commencez à enregistrer vos sessions pour obtenir des recommandations personnalisées !
          </p>
        )}
      </div>
    </div>
  )
}