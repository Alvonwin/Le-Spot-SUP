'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-provider';
import { useTranslation } from '@/context/language-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, Users, Clock, Plus, User2, Trash2 } from 'lucide-react';
import { format, parseISO, isBefore, isAfter } from 'date-fns';
import { fr } from 'date-fns/locale';
import { localSpots } from '@/lib/local-storage';
import { PaddleSpot } from '@/lib/types';

interface PaddleEvent {
  id: string;
  title: string;
  description: string;
  spotId: string;
  spotName: string;
  date: string;
  time: string;
  duration: number; // in hours
  maxParticipants?: number;
  level: 'débutant' | 'intermédiaire' | 'avancé' | 'tous niveaux';
  type: 'sortie' | 'compétition' | 'formation' | 'nettoyage' | 'social';
  organizerId: string;
  organizerName: string;
  participants: Array<{ userId: string; userName: string }>;
  createdAt: string;
}

const EVENT_TYPES = {
  sortie: { label: 'Sortie de groupe', color: 'bg-blue-500' },
  compétition: { label: 'Compétition', color: 'bg-red-500' },
  formation: { label: 'Formation', color: 'bg-green-500' },
  nettoyage: { label: 'Nettoyage', color: 'bg-emerald-500' },
  social: { label: 'Rencontre sociale', color: 'bg-purple-500' },
};

const LEVEL_LABELS = {
  'débutant': 'Débutant',
  'intermédiaire': 'Intermédiaire',
  'avancé': 'Avancé',
  'tous niveaux': 'Tous niveaux',
};

export default function EventsPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [events, setEvents] = useState<PaddleEvent[]>([]);
  const [spots, setSpots] = useState<PaddleSpot[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [filter, setFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    spotId: '',
    date: '',
    time: '',
    duration: '2',
    maxParticipants: '',
    level: 'tous niveaux' as PaddleEvent['level'],
    type: 'sortie' as PaddleEvent['type'],
  });

  useEffect(() => {
    loadEvents();
    loadSpots();
  }, []);

  const loadEvents = () => {
    const saved = localStorage.getItem('sup_events');
    if (saved) {
      setEvents(JSON.parse(saved));
    }
  };

  const loadSpots = () => {
    const spotsData = localSpots.getAll();
    setSpots(spotsData);
  };

  const saveEvents = (updatedEvents: PaddleEvent[]) => {
    localStorage.setItem('sup_events', JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
  };

  const handleCreateEvent = () => {
    if (!user || !formData.title || !formData.spotId || !formData.date || !formData.time) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const spot = spots.find(s => s.id === formData.spotId);
    if (!spot) return;

    const newEvent: PaddleEvent = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      spotId: formData.spotId,
      spotName: spot.name,
      date: formData.date,
      time: formData.time,
      duration: parseInt(formData.duration),
      maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
      level: formData.level,
      type: formData.type,
      organizerId: user.uid,
      organizerName: user.displayName || user.email?.split('@')[0] || 'Organisateur',
      participants: [],
      createdAt: new Date().toISOString(),
    };

    saveEvents([...events, newEvent]);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      spotId: '',
      date: '',
      time: '',
      duration: '2',
      maxParticipants: '',
      level: 'tous niveaux',
      type: 'sortie',
    });
  };

  const handleJoinEvent = (eventId: string) => {
    if (!user) {
      alert('Veuillez vous connecter pour rejoindre un événement');
      return;
    }

    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        const isAlreadyParticipant = event.participants.some(p => p.userId === user.uid);

        if (isAlreadyParticipant) {
          // Leave event
          return {
            ...event,
            participants: event.participants.filter(p => p.userId !== user.uid),
          };
        } else {
          // Join event
          if (event.maxParticipants && event.participants.length >= event.maxParticipants) {
            alert('Cet événement est complet');
            return event;
          }

          return {
            ...event,
            participants: [
              ...event.participants,
              {
                userId: user.uid,
                userName: user.displayName || user.email?.split('@')[0] || 'Utilisateur',
              },
            ],
          };
        }
      }
      return event;
    });

    saveEvents(updatedEvents);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      saveEvents(events.filter(e => e.id !== eventId));
    }
  };

  const getFilteredEvents = () => {
    const now = new Date();

    return events
      .filter(event => {
        const eventDate = new Date(`${event.date}T${event.time}`);

        if (filter === 'upcoming') {
          return isAfter(eventDate, now);
        } else if (filter === 'past') {
          return isBefore(eventDate, now);
        }
        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateB.getTime() - dateA.getTime();
      });
  };

  const filteredEvents = getFilteredEvents();

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Événements SUP</h1>
          </div>

          {user && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un événement
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Nouvel événement</DialogTitle>
                  <DialogDescription>
                    Organisez une sortie, une compétition ou une formation
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre de l'événement *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Ex: Sortie matinale au lac"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Détails de l'événement..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Type d'événement</Label>
                      <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as PaddleEvent['type'] })}>
                        <SelectTrigger id="type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(EVENT_TYPES).map(([key, value]) => (
                            <SelectItem key={key} value={key}>
                              {value.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="level">Niveau</Label>
                      <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value as PaddleEvent['level'] })}>
                        <SelectTrigger id="level">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(LEVEL_LABELS).map(([key, value]) => (
                            <SelectItem key={key} value={key}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="spot">Spot *</Label>
                    <Select value={formData.spotId} onValueChange={(value) => setFormData({ ...formData, spotId: value })}>
                      <SelectTrigger id="spot">
                        <SelectValue placeholder="Choisir un spot" />
                      </SelectTrigger>
                      <SelectContent>
                        {spots.map((spot) => (
                          <SelectItem key={spot.id} value={spot.id}>
                            {spot.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">Heure *</Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Durée (heures)</Label>
                      <Input
                        id="duration"
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxParticipants">Max participants (optionnel)</Label>
                      <Input
                        id="maxParticipants"
                        type="number"
                        min="1"
                        value={formData.maxParticipants}
                        onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                        placeholder="Illimité"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleCreateEvent} className="flex-1">
                      Créer l'événement
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Annuler
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <p className="text-muted-foreground">
          Participez aux événements SUP et rencontrez d'autres passionnés
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === 'upcoming' ? 'default' : 'outline'}
          onClick={() => setFilter('upcoming')}
        >
          À venir
        </Button>
        <Button
          variant={filter === 'past' ? 'default' : 'outline'}
          onClick={() => setFilter('past')}
        >
          Passés
        </Button>
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          Tous
        </Button>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              {filter === 'upcoming' && "Aucun événement à venir. Créez le premier !"}
              {filter === 'past' && "Aucun événement passé."}
              {filter === 'all' && "Aucun événement pour le moment."}
            </CardContent>
          </Card>
        ) : (
          filteredEvents.map((event) => {
            const isParticipant = event.participants.some(p => p.userId === user?.uid);
            const isOrganizer = event.organizerId === user?.uid;
            const isFull = event.maxParticipants && event.participants.length >= event.maxParticipants;

            return (
              <Card key={event.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle>{event.title}</CardTitle>
                        {isOrganizer && <Badge variant="outline">Organisateur</Badge>}
                      </div>
                      <CardDescription>{event.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={EVENT_TYPES[event.type].color}>
                        {EVENT_TYPES[event.type].label}
                      </Badge>
                      {isOrganizer && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEvent(event.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{format(parseISO(event.date), 'd MMMM yyyy', { locale: fr })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{event.time} ({event.duration}h)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{event.spotName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {event.participants.length}
                        {event.maxParticipants && `/${event.maxParticipants}`} participants
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{LEVEL_LABELS[event.level]}</Badge>
                      <span className="text-sm text-muted-foreground">
                        par {event.organizerName}
                      </span>
                    </div>

                    {user && !isOrganizer && (
                      <Button
                        onClick={() => handleJoinEvent(event.id)}
                        variant={isParticipant ? 'outline' : 'default'}
                        disabled={!isParticipant && isFull}
                      >
                        {isParticipant ? 'Se désinscrire' : isFull ? 'Complet' : 'Participer'}
                      </Button>
                    )}

                    {!user && (
                      <Button onClick={() => window.location.href = '/login'}>
                        Se connecter pour participer
                      </Button>
                    )}
                  </div>

                  {event.participants.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm font-semibold mb-2">Participants :</p>
                      <div className="flex flex-wrap gap-2">
                        {event.participants.map((participant) => (
                          <Badge key={participant.userId} variant="secondary">
                            <User2 className="h-3 w-3 mr-1" />
                            {participant.userName}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
