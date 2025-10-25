'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-provider';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/context/language-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, MapPin, Trash2, AlertTriangle } from 'lucide-react';
import { localSpots, localUser } from '@/lib/local-storage';
import { PaddleSpot, User } from '@/lib/types';

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const [spots, setSpots] = useState<PaddleSpot[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      router.push('/login');
      return;
    }

    // Simple admin check - in production, this should be a proper role check
    const adminEmails = ['admin@lespot.com', 'contact@lespot.com'];
    setIsAdmin(adminEmails.includes(user.email || ''));

    // Load data
    loadData();
  }, [user, router]);

  const loadData = () => {
    const spotsData = localSpots.getAll();
    setSpots(spotsData);

    // Get all users from localStorage (in a real app, this would be from a database)
    const allUsers = JSON.parse(localStorage.getItem('sup_users') || '[]');
    setUsers(allUsers);
  };

  const deleteSpot = (spotId: string) => {
    if (confirm(t('admin.confirmDeleteSpot') || 'Êtes-vous sûr de vouloir supprimer ce spot ?')) {
      const updatedSpots = spots.filter(s => s.id !== spotId);
      localSpots.save(updatedSpots);
      setSpots(updatedSpots);
    }
  };

  const deleteUser = (userId: string) => {
    if (confirm(t('admin.confirmDeleteUser') || 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      const updatedUsers = users.filter(u => u.uid !== userId);
      localStorage.setItem('sup_users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
    }
  };

  if (!user) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              <CardTitle>Accès refusé</CardTitle>
            </div>
            <CardDescription>
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/')}>
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Administration</h1>
        </div>
        <p className="text-muted-foreground">
          Gérez les spots, les utilisateurs et le contenu de la plateforme
        </p>
      </div>

      <Tabs defaultValue="spots" className="space-y-4">
        <TabsList>
          <TabsTrigger value="spots" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Spots ({spots.length})
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Utilisateurs ({users.length})
          </TabsTrigger>
          <TabsTrigger value="stats">
            Statistiques
          </TabsTrigger>
        </TabsList>

        {/* Spots Management */}
        <TabsContent value="spots" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des spots</CardTitle>
              <CardDescription>
                Liste complète des spots de paddle avec options de modération
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Coordonnées</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {spots.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          Aucun spot enregistré
                        </TableCell>
                      </TableRow>
                    ) : (
                      spots.map((spot) => (
                        <TableRow key={spot.id}>
                          <TableCell className="font-medium">{spot.name}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {spot.latitude.toFixed(4)}, {spot.longitude.toFixed(4)}
                          </TableCell>
                          <TableCell className="max-w-md truncate">
                            {spot.description || 'Aucune description'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteSpot(spot.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Management */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des utilisateurs</CardTitle>
              <CardDescription>
                Liste des utilisateurs inscrits sur la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          Aucun utilisateur enregistré
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((u) => (
                        <TableRow key={u.uid}>
                          <TableCell className="font-medium">{u.email}</TableCell>
                          <TableCell>{u.displayName || 'Non défini'}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {u.uid}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteUser(u.uid)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics */}
        <TabsContent value="stats" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spots</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{spots.length}</div>
                <p className="text-xs text-muted-foreground">
                  Spots de paddle référencés
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
                <p className="text-xs text-muted-foreground">
                  Utilisateurs inscrits
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Stockage</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Local</div>
                <p className="text-xs text-muted-foreground">
                  Mode localStorage actif
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informations système</CardTitle>
              <CardDescription>
                État actuel de la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Stockage</span>
                <Badge>localStorage</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Firebase</span>
                <Badge variant="outline">Non connecté</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Mode</span>
                <Badge variant="secondary">Développement</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
