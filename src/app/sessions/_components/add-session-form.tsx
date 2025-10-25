
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useTranslation } from '@/context/language-context';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-provider';
import type { PaddleSpot, PaddleSession } from '@/lib/types';
import { getSpots } from '@/services/spot-service';
import { addSession } from '@/services/session-service';
import { useLoading } from '@/context/loading-context';


const formSchema = z.object({
  spotId: z.string().min(1, 'Veuillez sélectionner un spot.'),
  date: z.date({ message: 'La date est requise.' }),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format HH:mm invalide.'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format HH:mm invalide.'),
  notes: z.string().optional(),
}).refine(data => {
    const start = new Date(`1970-01-01T${data.startTime}:00`);
    const end = new Date(`1970-01-01T${data.endTime}:00`);
    return end > start;
}, {
    message: "L'heure de fin doit être après l'heure de début.",
    path: ['endTime'],
});

type FormData = z.infer<typeof formSchema>;

interface AddSessionFormProps {
  onFinished: (newSession: PaddleSession) => void;
}

export default function AddSessionForm({ onFinished }: AddSessionFormProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { setIsLoading: setAppIsLoading } = useLoading();


  const [spots, setSpots] = useState<PaddleSpot[]>([]);
  useEffect(() => {
    async function loadSpots() {
      const fetchedSpots = await getSpots({ sortBy: 'name' });
      setSpots(fetchedSpots);
    }
    loadSpots();
  }, []);

  useEffect(() => {
    setAppIsLoading(isLoading);
  }, [isLoading, setAppIsLoading]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      spotId: '',
      date: new Date(),
      startTime: '10:00',
      endTime: '12:00',
      notes: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!user) {
        toast({
            variant: 'destructive',
            title: 'Utilisateur non connecté',
            description: "Vous devez être connecté pour ajouter une session.",
        });
        return;
    };
    setIsLoading(true);

    const startDateTime = new Date(data.date);
    const [startHours, startMinutes] = data.startTime.split(':').map(Number);
    startDateTime.setHours(startHours, startMinutes);

    const endDateTime = new Date(data.date);
    const [endHours, endMinutes] = data.endTime.split(':').map(Number);
    endDateTime.setHours(endHours, endMinutes);

    const durationMinutes = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60);

    const sessionData = {
      spotId: data.spotId,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      durationMinutes,
      distanceKilometers: 0, // Mock distance for now
      notes: data.notes || '',
    };
    
    try {
        const newSession = await addSession(user.uid, sessionData);
        
        toast({
            title: t('addSessionForm.success'),
            description: t('addSessionForm.successDescription'),
        });
        
        form.reset();
        onFinished(newSession);

    } catch (error) {
        console.error("Error adding session:", error);
         toast({
            variant: 'destructive',
            title: 'Erreur',
            description: "Impossible d'enregistrer la session.",
        });
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <FormField
            control={form.control}
            name="spotId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('addSessionForm.spot')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('addSessionForm.selectSpot')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {spots?.map(spot => (
                      <SelectItem key={spot.id} value={spot.id}>
                        {spot.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t('addSessionForm.date')}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP', { locale: fr })
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={date => date > new Date() || date < new Date('1900-01-01')}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
                <FormItem>
                <FormLabel>{t('addSessionForm.startTime')}</FormLabel>
                <FormControl>
                    <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
                <FormItem>
                <FormLabel>{t('addSessionForm.endTime')}</FormLabel>
                <FormControl>
                    <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <div className="sm:col-span-2">
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('addSessionForm.notes')}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t('addSessionForm.notesPlaceholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="sm:col-span-2">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'En chargement...' : t('addSessionForm.submit')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
