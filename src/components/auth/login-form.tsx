'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-provider';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/context/language-context';
import { localUser } from '@/lib/local-storage';


const formSchema = z.object({
  email: z.string().email({ message: 'Veuillez entrer une adresse e-mail valide.' }),
  password: z.string().min(1, { message: 'Le mot de passe est requis.' }),
});

export function LoginForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    // Redirect if user is already logged in
    if (!loading && user) {
      router.push('/map');
    }
  }, [user, loading, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // Authentification locale simple
      if (values.email && values.password) {
        const newUser = {
          uid: 'local-user-' + Date.now(),
          email: values.email,
          displayName: values.email.split('@')[0],
          photoURL: null
        };

        localUser.save(newUser);

        toast({
          title: t('loginForm.successTitle') || 'Connexion réussie',
          description: t('loginForm.successDescription') || 'Bienvenue sur Le Spot SUP !',
        });

        // Rafraîchir pour charger l'utilisateur
        router.push('/map');
        window.location.href = '/map';
      } else {
        throw new Error('Email et mot de passe requis');
      }
    } catch (error) {
       console.error("Login Error:", error);
       toast({
        variant: "destructive",
        title: t('loginForm.errorTitle'),
        description: t('loginForm.errorDescription'),
      });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('loginForm.emailLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('loginForm.emailPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('loginForm.passwordLabel')}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading || loading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('loginForm.submitButton')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
