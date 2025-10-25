
'use client';

import { useAuth } from '@/lib/auth-provider';
import Header from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTranslation } from '@/context/language-context';
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { localUser } from '@/lib/local-storage';
import { Input } from '@/components/ui/input';
import { useLoading } from '@/context/loading-context';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { setIsLoading: setAppIsLoading } = useLoading();


  const [isSaving, setIsSaving] = useState(false);
  const [newAvatar, setNewAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Redirect if not logged in after loading
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    setAppIsLoading(loading || isSaving);
  }, [loading, isSaving, setAppIsLoading]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = async () => {
    if (!newAvatar || !user) return;
    setIsSaving(true);
    try {
      // Sauvegarder l'image en base64 dans localStorage
      const updatedUser = {
        ...user,
        photoURL: newAvatar
      };

      localUser.save(updatedUser);

      toast({
        title: t('profilePage.avatarSuccessTitle'),
        description: t('profilePage.avatarSuccessDescription'),
      });
      setNewAvatar(null);

      // Recharger la page pour afficher le nouvel avatar
      window.location.reload();
    } catch (error) {
       console.error("Erreur détaillée de sauvegarde d'avatar:", error);
       toast({
        variant: 'destructive',
        title: t('profilePage.saveErrorTitle'),
        description: (error instanceof Error ? error.message : t('profilePage.saveErrorDescription')),
      });
    } finally {
      setIsSaving(false);
    }
  }


  if (loading || !user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">En chargement...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-secondary/50">
        <div className="container mx-auto max-w-2xl py-12">
          <Card>
            <CardHeader className="text-center">
               <div className="mx-auto mb-4">
                  <Avatar className="h-24 w-24 text-4xl">
                    <AvatarImage src={newAvatar || user.photoURL || undefined} alt={user.displayName || ''} />
                    <AvatarFallback>{user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                  </Avatar>
              </div>
              <CardTitle className="text-3xl">{user.displayName}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Card className='bg-background/50'>
                  <CardHeader>
                    <CardTitle className='text-lg flex items-center gap-2'>
                       <Upload className='text-primary'/>
                       Changer de photo de profil
                    </CardTitle>
                    <CardDescription>
                      Sélectionnez une nouvelle image depuis votre appareil.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                      <Input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/png, image/jpeg, image/gif"
                        className="hidden"
                      />
                      <Button onClick={() => fileInputRef.current?.click()} className="w-full">
                        Télécharger une image
                      </Button>
                  </CardContent>

                  {newAvatar && (
                    <CardFooter className='flex-col gap-4 items-stretch'>
                       <Button onClick={handleSaveAvatar} disabled={isSaving} >
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSaving ? "En chargement..." : "Enregistrer la photo"}
                      </Button>
                      <Button variant="ghost" onClick={() => setNewAvatar(null)} disabled={isSaving}>
                        Annuler
                      </Button>
                    </CardFooter>
                  )}
                </Card>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
