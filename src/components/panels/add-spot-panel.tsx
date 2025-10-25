'use client';

import { useState, useEffect } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Loader2, PlusCircle, Locate, Wand2, Search } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { findPotentialSpots, PotentialSpot } from '@/ai/flows/find-potential-spots';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NewSpotInfo } from '../map-container';
import { findSpotImage } from '@/ai/flows/find-spot-image';
import { useLoading } from '@/context/loading-context';

const amenities = [
  { id: 'parking', label: 'Parking disponible' },
  { id: 'restrooms', label: 'Toilettes à proximité' },
  { id: 'rentals', label: 'Location d\'équipement' },
  { id: 'dog_friendly', label: 'Chiens autorisés' },
] as const;

const formSchema = z.object({
  name: z.string().min(3, 'Le nom du spot doit contenir au moins 3 caractères.'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères.'),
  latitude: z.number().min(-90, 'Latitude invalide').max(90, 'Latitude invalide'),
  longitude: z.number().min(-180, 'Longitude invalide').max(180, 'Longitude invalide'),
  amenities: z.array(z.string()).optional(),
  imageDataUri: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;


interface AddSpotPanelProps {
  newSpotInfo: NewSpotInfo | null;
  isGenerating: boolean;
  onSpotAdded: (newSpotData: any) => void;
  centerCoordinates: { latitude: number, longitude: number };
}

export default function AddSpotPanel({ newSpotInfo, isGenerating, onSpotAdded, centerCoordinates }: AddSpotPanelProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<PotentialSpot[]>([]);
  const { toast } = useToast();
  const { setIsLoading: setAppIsLoading } = useLoading();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      latitude: 0,
      longitude: 0,
      amenities: [],
      imageDataUri: '',
    },
  });

  useEffect(() => {
    setAppIsLoading(isSubmitting || isScanning || isGenerating);
  }, [isSubmitting, isScanning, isGenerating, setAppIsLoading]);

  useEffect(() => {
    if (newSpotInfo) {
      form.setValue('latitude', Number(newSpotInfo.latitude.toFixed(6)));
      form.setValue('longitude', Number(newSpotInfo.longitude.toFixed(6)));
      if (newSpotInfo.name) form.setValue('name', newSpotInfo.name);
      if (newSpotInfo.description) form.setValue('description', newSpotInfo.description);
      if (newSpotInfo.suggestedAmenities) form.setValue('amenities', newSpotInfo.suggestedAmenities);
      // We no longer pre-generate the image, so we clear this field
      form.setValue('imageDataUri', '');

      form.clearErrors(['name', 'description', 'latitude', 'longitude']);
    }
  }, [newSpotInfo, form]);

  const handleScan = async () => {
    setIsScanning(true);
    setScanResults([]);
    try {
        const results = await findPotentialSpots(centerCoordinates.latitude, centerCoordinates.longitude, 5000);
        setScanResults(results);
    } catch (error) {
        console.error("Erreur du scan IA:", error);
        toast({
            variant: 'destructive',
            title: "Erreur du Scan",
            description: "L'IA n'a pas pu trouver de spots. Veuillez réessayer."
        })
    } finally {
        setIsScanning(false);
    }
  }

  const handleSelectSuggestion = (spot: PotentialSpot) => {
    form.reset({
        name: spot.name,
        description: spot.description,
        latitude: Number(spot.latitude.toFixed(6)),
        longitude: Number(spot.longitude.toFixed(6)),
        amenities: [],
        imageDataUri: '', // Clear previous image data
    });
    setScanResults([]);
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // Generate image only on final submission
      const imageResult = await findSpotImage(data.name, data.latitude, data.longitude);
      const imageDataUri = imageResult?.url || '';
      const finalData = { ...data, imageDataUri };

      onSpotAdded(finalData);

    } catch(error) {
      console.error("Error adding spot:", error);
      toast({
          variant: 'destructive',
          title: "Erreur lors de l'ajout",
          description: "Une erreur est survenue lors de la génération de l'image ou de la soumission."
      });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="space-y-4">
      <Alert className="mb-4 bg-secondary">
        <Locate className="h-4 w-4" />
        <AlertDescription>
          Cliquez sur la carte pour une suggestion assistée par IA, ou lancez un scan pour explorer les environs.
        </AlertDescription>
      </Alert>

      <Card>
          <CardContent className='p-4 space-y-4'>
              <Button className='w-full' onClick={handleScan} disabled={isScanning}>
                  {isScanning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className='mr-2 h-4 w-4'/>}
                  {isScanning ? 'En chargement...' : 'Lancer un scan des environs'}
              </Button>
              {scanResults.length > 0 && (
                <div className='space-y-2'>
                  <p className='text-sm font-medium text-center'>Suggestions de l'IA</p>
                  <ScrollArea className='h-48 rounded-md border'>
                      <div className='p-2 space-y-2'>
                      {scanResults.map((spot, index) => (
                          <Button key={index} variant='ghost' className='w-full justify-start h-auto' onClick={() => handleSelectSuggestion(spot)}>
                              <div className='text-left'>
                                  <p className='font-semibold'>{spot.name}</p>
                                  <p className='text-xs text-muted-foreground'>{spot.description.substring(0, 50)}...</p>
                              </div>
                          </Button>
                      ))}
                      </div>
                  </ScrollArea>
                </div>
              )}
          </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
           <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex items-center'>
                  Nom du Spot
                  {isGenerating && <Wand2 className="ml-2 h-4 w-4 animate-pulse" />}
                </FormLabel>
                <FormControl>
                  <Input placeholder="ex: Crique Secrète" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                 <FormLabel className='flex items-center'>
                  Description
                  {isGenerating && <Wand2 className="ml-2 h-4 w-4 animate-pulse" />}
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="Dites-nous ce qui rend ce spot génial..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Latitude</FormLabel>
                  <FormControl>
                    <Input type="number" step="any" placeholder="ex: 38.9531" {...field} value={field.value ?? ''}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <Input type="number" step="any" placeholder="ex: -120.1098" {...field} value={field.value ?? ''}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="amenities"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base flex items-center">
                    Commodités
                    {isGenerating && <Wand2 className="ml-2 h-4 w-4 animate-pulse" />}
                    </FormLabel>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                {amenities.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="amenities"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting || isGenerating}>
            {(isSubmitting || isGenerating) ? 'En chargement...' : <><PlusCircle className="mr-2 h-4 w-4" /> Soumettre le Spot</>}
          </Button>
        </form>
      </Form>
    </div>
  );
}
