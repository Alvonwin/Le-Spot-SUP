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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Sparkles, AlertTriangle, MapPin, Search } from 'lucide-react';
import {
  paddleSpotRecommendation,
  type PaddleSpotRecommendationOutput,
} from '@/ai/flows/paddle-spot-recommendation';
import { useTranslation } from '@/context/language-context';
import { useLoading } from '@/context/loading-context';

const formSchema = z.object({
  distance: z.string().min(1, 'Veuillez sélectionner une distance.'),
  skillLevel: z.string().min(1, 'Veuillez sélectionner votre niveau de compétence.'),
  locationType: z.string().min(1, 'Veuillez sélectionner un type de lieu.'),
  otherPreferences: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function AiPanel() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<PaddleSpotRecommendationOutput | null>(null);
  const { setIsLoading: setAppIsLoading } = useLoading();

  useEffect(() => {
    setAppIsLoading(isLoading);
  }, [isLoading, setAppIsLoading]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      distance: '25',
      skillLevel: 'intermediate',
      locationType: 'lake',
      otherPreferences: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    setRecommendation(null);
    try {
      const userLevel = data.skillLevel;
      const preferences = [data.locationType, data.otherPreferences || ''].filter(Boolean);
      const results = await paddleSpotRecommendation(userLevel, preferences);
      const result: PaddleSpotRecommendationOutput = {
        recommendations: results,
        timestamp: new Date().toISOString(),
        recommendedSpot: results.length > 0 ? results[0].spotId : 'Aucune recommandation disponible',
        reasoning: results.length > 0 ? results[0].reasons.join('. ') : 'Aucune raison disponible',
        safetyConsiderations: 'Assurez-vous de vérifier les conditions météorologiques avant votre sortie.',
      };
      setRecommendation(result);
    } catch (e: any) {
      setError(e.message || 'Une erreur inattendue est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {t('aiPanel.title')}
          </CardTitle>
          <CardDescription>
            {t('aiPanel.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
               <FormField
                control={form.control}
                name="distance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distance maximale</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un rayon" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="10">10 km</SelectItem>
                        <SelectItem value="25">25 km</SelectItem>
                        <SelectItem value="50">50 km</SelectItem>
                        <SelectItem value="100">100 km</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="skillLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('aiPanel.skillLevel')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('aiPanel.skillPlaceholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">{t('aiPanel.skillBeginner')}</SelectItem>
                        <SelectItem value="intermediate">{t('aiPanel.skillIntermediate')}</SelectItem>
                        <SelectItem value="advanced">{t('aiPanel.skillAdvanced')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="locationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('aiPanel.locationType')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('aiPanel.locationPlaceholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="lake">{t('aiPanel.locationLake')}</SelectItem>
                        <SelectItem value="ocean">{t('aiPanel.locationOcean')}</SelectItem>
                        <SelectItem value="river">{t('aiPanel.locationRiver')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="otherPreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('aiPanel.otherPreferences')}</FormLabel>
                    <FormControl>
                      <Textarea placeholder={t('aiPanel.otherPreferencesPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                {isLoading ? t('aiPanel.findingSpot') : t('aiPanel.findSpot')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{t('aiPanel.errorTitle')}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {recommendation && (
        <Card className="bg-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-accent" />
              {t('aiPanel.recommendationTitle')}
            </CardTitle>
            <CardDescription>{recommendation.recommendedSpot}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold">{t('aiPanel.reasoningTitle')}</h4>
              <p className="text-sm text-muted-foreground">{recommendation.reasoning}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Alert variant="default" className="border-accent">
                <AlertTriangle className="h-4 w-4 text-accent" />
                <AlertTitle>{t('aiPanel.safetyTitle')}</AlertTitle>
                <AlertDescription>{recommendation.safetyConsiderations}</AlertDescription>
            </Alert>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
