"use client";

import { useState } from "react";
import { Plus, Calendar, Clock, MapPin, Info, Trash2, X } from "lucide-react";

type Session = {
  id: number;
  date: string;
  duration: number;
  distance: number;
  spot: string;
  notes?: string;
};

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([
    { id: 1, date: "1 juin 2024", duration: 90, distance: 5.5, spot: "Parc Jean-Drapeau" },
    { id: 2, date: "25 mai 2024", duration: 120, distance: 7.2, spot: "Canal de Lachine" },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSession, setNewSession] = useState({
    spot: "",
    date: "2025-10-21",
    startTime: "10:00",
    endTime: "12:00",
    notes: "",
  });

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    const duration = calculateDuration(newSession.startTime, newSession.endTime);
    const newSessionData: Session = {
      id: sessions.length + 1,
      date: new Date(newSession.date).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      duration,
      distance: 0,
      spot: newSession.spot,
      notes: newSession.notes,
    };
    setSessions([newSessionData, ...sessions]);
    setIsModalOpen(false);
    setNewSession({
      spot: "",
      date: "2025-10-21",
      startTime: "10:00",
      endTime: "12:00",
      notes: "",
    });
  };

  const calculateDuration = (start: string, end: string) => {
    const [startHour, startMin] = start.split(":").map(Number);
    const [endHour, endMin] = end.split(":").map(Number);
    return (endHour * 60 + endMin) - (startHour * 60 + startMin);
  };

  const deleteSession = (id: number) => {
    setSessions(sessions.filter((s) => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-ocean-dark">
      {/* Header */}
      <div className="bg-ocean-dark text-white py-12 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="text-4xl">🏄</div>
              <h1 className="text-4xl font-bold">Mes Sessions de Paddle</h1>
            </div>
            <div className="flex items-center gap-2 text-ocean-light">
              <div className="w-5 h-5 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded"></div>
              <p>Suivez vos progrès, analysez vos performances et revivez vos aventures.</p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-ocean-light hover:bg-ocean px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Plus size={20} />
            Ajouter une Session
          </button>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-8 h-8 text-ocean" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Sessions Récentes
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-600">
                  <th className="text-left py-4 px-4 text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <Calendar size={18} />
                      Date
                    </div>
                  </th>
                  <th className="text-left py-4 px-4 text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <Clock size={18} />
                      Durée (min)
                    </div>
                  </th>
                  <th className="text-left py-4 px-4 text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <MapPin size={18} />
                      Distance (km)
                    </div>
                  </th>
                  <th className="text-left py-4 px-4 text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <Info size={18} />
                      IA
                    </div>
                  </th>
                  <th className="text-left py-4 px-4 text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr
                    key={session.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="py-4 px-4 text-gray-900 dark:text-white">
                      {session.date}
                    </td>
                    <td className="py-4 px-4 text-gray-900 dark:text-white">
                      {session.duration}
                    </td>
                    <td className="py-4 px-4 text-gray-900 dark:text-white">
                      {session.distance}
                    </td>
                    <td className="py-4 px-4">
                      <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full">
                        <Info size={18} className="text-ocean" />
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => deleteSession(session.id)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-full"
                      >
                        <Trash2 size={18} className="text-red-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Session Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full p-8 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-white mb-2">
              Enregistrer une Nouvelle Session
            </h2>
            <p className="text-gray-400 mb-6">
              Ajoutez les détails de votre dernière sortie.
            </p>

            <form onSubmit={handleAddSession} className="space-y-6">
              <div>
                <label htmlFor="spot" className="block text-white mb-2">
                  Spot
                </label>
                <select
                  id="spot"
                  value={newSession.spot}
                  onChange={(e) =>
                    setNewSession({ ...newSession, spot: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-ocean-light focus:outline-none"
                  required
                >
                  <option value="">Sélectionnez un spot</option>
                  <option value="Parc Jean-Drapeau">Parc Jean-Drapeau, Montréal</option>
                  <option value="Canal de Lachine">Canal de Lachine, Montréal</option>
                  <option value="Parc des Îles-de-Boucherville">
                    Parc des Îles-de-Boucherville, QC
                  </option>
                </select>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="date" className="block text-white mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={newSession.date}
                    onChange={(e) =>
                      setNewSession({ ...newSession, date: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-ocean-light focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="startTime" className="block text-white mb-2">
                    Heure de début
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    value={newSession.startTime}
                    onChange={(e) =>
                      setNewSession({ ...newSession, startTime: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-ocean-light focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="endTime" className="block text-white mb-2">
                    Heure de fin
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    value={newSession.endTime}
                    onChange={(e) =>
                      setNewSession({ ...newSession, endTime: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-ocean-light focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-white mb-2">
                  Notes de session
                </label>
                <textarea
                  id="notes"
                  placeholder="Conditions, sensations, etc."
                  value={newSession.notes}
                  onChange={(e) =>
                    setNewSession({ ...newSession, notes: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-ocean-light focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-ocean-light hover:bg-ocean text-white font-semibold py-3 rounded transition-colors"
              >
                Enregistrer la Session
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
