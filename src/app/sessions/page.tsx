'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

interface Session {
  id: number;
  spot: string;
  date: string;
  heure: string;
  duree: number;
  distance: number;
  conditions: string;
  vent: string;
  notes: string;
}

export default function SessionsPage() {
  const [activeTab, setActiveTab] = useState('nouvelle');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [spots, setSpots] = useState<string[]>(['Lac des Deux-Montagnes', 'Parc de la Rivière-des-Mille-Îles', 'Plage de Saint-Eustache']);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newSpot, setNewSpot] = useState('');

  // Charger les données depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem('lespot_sessions');
    const savedSpots = localStorage.getItem('lespot_spots');

    if (saved) setSessions(JSON.parse(saved));
    if (savedSpots) setSpots(JSON.parse(savedSpots));
  }, []);

  // Formulaire
  const [formData, setFormData] = useState({
    spot: '',
    date: new Date().toISOString().split('T')[0],
    heure: '',
    duree: '',
    distance: '',
    conditions: 'Calme',
    vent: 'Aucun',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newSession: Session = {
      id: Date.now(),
      spot: formData.spot,
      date: formData.date,
      heure: formData.heure,
      duree: parseInt(formData.duree),
      distance: parseFloat(formData.distance) || 0,
      conditions: formData.conditions,
      vent: formData.vent,
      notes: formData.notes
    };

    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    localStorage.setItem('lespot_sessions', JSON.stringify(updatedSessions));

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);

    // Reset form
    setFormData({
      spot: '',
      date: new Date().toISOString().split('T')[0],
      heure: '',
      duree: '',
      distance: '',
      conditions: 'Calme',
      vent: 'Aucun',
      notes: ''
    });
  };

  const deleteSession = (id: number) => {
    if (confirm('Voulez-vous vraiment supprimer cette session ?')) {
      const updatedSessions = sessions.filter(s => s.id !== id);
      setSessions(updatedSessions);
      localStorage.setItem('lespot_sessions', JSON.stringify(updatedSessions));
    }
  };

  const addSpot = () => {
    const spotName = newSpot.trim();
    if (spotName && !spots.includes(spotName)) {
      const updatedSpots = [...spots, spotName];
      setSpots(updatedSpots);
      localStorage.setItem('lespot_spots', JSON.stringify(updatedSpots));
      setNewSpot('');
    }
  };

  // Statistiques
  const totalSessions = sessions.length;
  const totalDistance = sessions.reduce((sum, s) => sum + s.distance, 0);
  const totalMinutes = sessions.reduce((sum, s) => sum + s.duree, 0);
  const totalHours = Math.round(totalMinutes / 60);

  const spotCounts: Record<string, number> = {};
  sessions.forEach(s => {
    spotCounts[s.spot] = (spotCounts[s.spot] || 0) + 1;
  });

  let favoriteSpot = '-';
  let maxCount = 0;
  for (const [spot, count] of Object.entries(spotCounts)) {
    if (count > maxCount) {
      maxCount = count;
      favoriteSpot = spot;
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>🏄‍♂️ Mes Sessions SUP</h1>
          <p className={styles.pageSubtitle}>Suivez vos sessions de Stand Up Paddle</p>
        </header>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'nouvelle' ? styles.active : ''}`}
            onClick={() => setActiveTab('nouvelle')}
          >
            ➕ Nouvelle Session
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'sessions' ? styles.active : ''}`}
            onClick={() => setActiveTab('sessions')}
          >
            📊 Mes Sessions
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'spots' ? styles.active : ''}`}
            onClick={() => setActiveTab('spots')}
          >
            📍 Mes Spots
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'stats' ? styles.active : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            📈 Statistiques
          </button>
        </div>

        <div className={styles.content}>
          {/* Nouvelle Session */}
          <div className={`${styles.tabContent} ${activeTab === 'nouvelle' ? styles.active : ''}`}>
            {showSuccess && (
              <div className={`${styles.successMessage} ${styles.show}`}>
                ✅ Session enregistrée avec succès !
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="spot">🏖️ Spot</label>
                <select
                  className={styles.select}
                  id="spot"
                  required
                  value={formData.spot}
                  onChange={(e) => setFormData({...formData, spot: e.target.value})}
                >
                  <option value="">Sélectionnez un spot</option>
                  {spots.map(spot => (
                    <option key={spot} value={spot}>{spot}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="date">📅 Date</label>
                <input
                  className={styles.input}
                  type="date"
                  id="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="heure">⏰ Heure de début</label>
                <input
                  className={styles.input}
                  type="time"
                  id="heure"
                  required
                  value={formData.heure}
                  onChange={(e) => setFormData({...formData, heure: e.target.value})}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="duree">⏱️ Durée (minutes)</label>
                <input
                  className={styles.input}
                  type="number"
                  id="duree"
                  min="1"
                  placeholder="Ex: 60"
                  required
                  value={formData.duree}
                  onChange={(e) => setFormData({...formData, duree: e.target.value})}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="distance">📏 Distance (km)</label>
                <input
                  className={styles.input}
                  type="number"
                  id="distance"
                  step="0.1"
                  min="0"
                  placeholder="Ex: 5.2"
                  value={formData.distance}
                  onChange={(e) => setFormData({...formData, distance: e.target.value})}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="conditions">🌊 Conditions</label>
                <select
                  className={styles.select}
                  id="conditions"
                  value={formData.conditions}
                  onChange={(e) => setFormData({...formData, conditions: e.target.value})}
                >
                  <option value="Calme">Calme</option>
                  <option value="Modéré">Modéré</option>
                  <option value="Agité">Agité</option>
                  <option value="Très agité">Très agité</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="vent">💨 Vent</label>
                <select
                  className={styles.select}
                  id="vent"
                  value={formData.vent}
                  onChange={(e) => setFormData({...formData, vent: e.target.value})}
                >
                  <option value="Aucun">Aucun</option>
                  <option value="Léger">Léger</option>
                  <option value="Modéré">Modéré</option>
                  <option value="Fort">Fort</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="notes">📝 Notes</label>
                <textarea
                  className={styles.textarea}
                  id="notes"
                  placeholder="Commentaires sur la session..."
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>

              <button type="submit" className={styles.button}>Enregistrer la Session</button>
            </form>
          </div>

          {/* Mes Sessions */}
          <div className={`${styles.tabContent} ${activeTab === 'sessions' ? styles.active : ''}`}>
            <div className={styles.sessionsList}>
              {sessions.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyStateIcon}>🏄‍♂️</div>
                  <p>Aucune session enregistrée</p>
                  <p>Commencez par ajouter votre première session !</p>
                </div>
              ) : (
                sessions.map(session => (
                  <div key={session.id} className={styles.sessionCard}>
                    <div className={styles.sessionHeader}>
                      <div className={styles.sessionSpot}>{session.spot}</div>
                      <div className={styles.sessionDate}>
                        {new Date(session.date).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <div className={styles.sessionDetails}>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Heure</span>
                        <span className={styles.detailValue}>{session.heure}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Durée</span>
                        <span className={styles.detailValue}>{session.duree} min</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Distance</span>
                        <span className={styles.detailValue}>{session.distance} km</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Conditions</span>
                        <span className={styles.detailValue}>{session.conditions}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Vent</span>
                        <span className={styles.detailValue}>{session.vent}</span>
                      </div>
                    </div>
                    {session.notes && (
                      <p style={{ marginTop: '1rem', color: '#94a3b8', fontStyle: 'italic' }}>
                        {session.notes}
                      </p>
                    )}
                    <div className={styles.sessionActions}>
                      <button
                        onClick={() => deleteSession(session.id)}
                        className={`${styles.button} ${styles.buttonSmall} ${styles.buttonDanger}`}
                      >
                        🗑️ Supprimer
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Mes Spots */}
          <div className={`${styles.tabContent} ${activeTab === 'spots' ? styles.active : ''}`}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="newSpot">➕ Ajouter un nouveau spot</label>
              <input
                className={styles.input}
                type="text"
                id="newSpot"
                placeholder="Nom du spot"
                value={newSpot}
                onChange={(e) => setNewSpot(e.target.value)}
              />
              <button
                onClick={addSpot}
                className={styles.button}
                style={{ marginTop: '0.625rem' }}
              >
                Ajouter
              </button>
            </div>
            <div className={styles.spotsGrid}>
              {spots.map(spot => {
                const count = sessions.filter(s => s.spot === spot).length;
                return (
                  <div key={spot} className={styles.spotCard}>
                    <div className={styles.spotName}>{spot}</div>
                    <div className={styles.spotSessions}>
                      {count} session{count !== 1 ? 's' : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Statistiques */}
          <div className={`${styles.tabContent} ${activeTab === 'stats' ? styles.active : ''}`}>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{totalSessions}</div>
                <div className={styles.statLabel}>Sessions totales</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{totalDistance.toFixed(1)} km</div>
                <div className={styles.statLabel}>Distance totale</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{totalHours}h</div>
                <div className={styles.statLabel}>Temps total</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{favoriteSpot}</div>
                <div className={styles.statLabel}>Spot préféré</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
