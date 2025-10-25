'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Droplet, Sun, Thermometer, Wind, Loader2, ShieldCheck, ShieldAlert, MapPin } from 'lucide-react';
import { useTranslation } from '@/context/language-context';
import { Progress } from '@/components/ui/progress';
import React, { useEffect } from 'react';
import type { PaddleSpot } from '@/lib/types';
import {
  spotConditionAnalysis,
  type SpotConditionAnalysisOutput,
} from '@/ai/flows/spot-condition-analysis';
import { useLoading } from '@/context/loading-context';

interface SpotDetailsPanelProps {
  spot: PaddleSpot;
}

const amenityLabels: { [key: string]: string } = {
  parking: 'Parking',
  restrooms: 'Toilettes',
  rentals: 'Locations',
  dog_friendly: 'Chiens autorisés',
};


export default function SpotDetailsPanel({ spot }: SpotDetailsPanelProps) {
  const { t } = useTranslation();
  const { setIsLoading: setAppIsLoading } = useLoading();

  const [analysis, setAnalysis] = React.useState<SpotConditionAnalysisOutput | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    setAppIsLoading(loading);
  }, [loading, setAppIsLoading]);

  React.useEffect(() => {
    async function getConditions() {
      if (!spot) return;
      setLoading(true);
      setError(null);
      setAnalysis(null);
      try {
        const result = await spotConditionAnalysis(spot.id);
        // Map safety level to recommendation score
        const safetyToScore = {
          excellent: 95,
          good: 75,
          moderate: 50,
          poor: 25,
          dangerous: 10
        };
        const analysis: SpotConditionAnalysisOutput = {
          ...result,
          spotId: spot.id,
          timestamp: new Date().toISOString(),
          recommendationLevel: safetyToScore[result.safety],
          weather: {
            temperature: 20,
            humidity: 65,
            windSpeed: 15,
            conditions: 'Ensoleillé',
            waterTemperature: 18
          },
          levelLabel: result.safety === 'excellent' ? 'Excellent' : result.safety === 'good' ? 'Bon' : result.safety === 'moderate' ? 'Moyen' : 'Attention',
          playfulAdvice: 'Profitez de votre sortie en toute sécurité !',
          gearSuggestion: 'Gilet de sauvetage, leash, pagaie de secours'
        };
        setAnalysis(analysis);

      } catch (err) {
        setError('Erreur lors de la récupération des conditions météo.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    getConditions();
  }, [spot]);

  const getRecommendationIcon = () => {
    if (!analysis) return null;
    if (analysis.recommendationLevel >= 75) return <ShieldCheck className="h-8 w-8 text-green-500 flex-shrink-0"/>;
    if (analysis.recommendationLevel >= 40) return <ShieldAlert className="h-8 w-8 text-yellow-500 flex-shrink-0"/>;
    return <ShieldAlert className="h-8 w-8 text-destructive flex-shrink-0"/>;
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full bg-gradient-to-br from-blue-400 to-blue-600 rounded-t-lg flex items-center justify-center">
          <MapPin className="h-16 w-16 text-white/50" />
        </div>
        <div className="p-4 pb-0">
          <CardTitle>{spot.name}</CardTitle>
          <CardDescription className="pt-2">{spot.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-4">
        {/* Amenities section removed - not in PaddleSpot type */}

        <div>
          <h4 className="mb-2 text-sm font-semibold text-muted-foreground">{t('spotDetailsPanel.currentConditions')}</h4>
          <div className="grid grid-cols-2 gap-4 rounded-lg border bg-secondary/50 p-4">
            {loading ? <p className="col-span-2 text-sm text-muted-foreground mx-auto">En chargement...</p> :
             analysis?.weather ? (
              <>
                <div className="flex items-center gap-3">
                  <Sun className="h-6 w-6 text-accent" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('spotDetailsPanel.weather')}</p>
                    <p className="font-semibold">{analysis.weather.conditions}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Thermometer className="h-6 w-6 text-accent" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('spotDetailsPanel.airTemp')}</p>
                    <p className="font-semibold">{analysis.weather.temperature}°C</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Wind className="h-6 w-6 text-accent" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('spotDetailsPanel.wind')}</p>
                    <p className="font-semibold">{analysis.weather.windSpeed} km/h</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Droplet className="h-6 w-6 text-accent" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('spotDetailsPanel.waterTemp')}</p>
                    <p className="font-semibold">{analysis.weather.waterTemperature}°C</p>
                  </div>
                </div>
              </>
            ) : <p className="col-span-2 text-sm text-destructive">{error || "Impossible de charger les données météo."}</p>}
          </div>
        </div>

        <div>
           <h4 className="mb-2 text-sm font-semibold text-muted-foreground">{t('spotDetailsPanel.aiTitle')}</h4>
           <Card className='overflow-hidden'>
            {loading && <div className="flex items-center justify-center p-8"><p>En chargement...</p></div>}
            {error && <div className="p-4 text-center text-sm text-destructive">{error}</div>}
            {analysis && (
              <>
                <CardContent className='space-y-2 p-4'>
                   <Progress value={analysis.recommendationLevel} className="h-3" />
                  <div className='flex justify-between items-center text-xs text-muted-foreground'>
                    <span>Difficile</span>
                    <span>Moyen</span>
                    <span>Idéal</span>
                  </div>
                </CardContent>
                <CardContent className='bg-secondary/50 p-4'>
                    <div className="flex items-start gap-4 text-left">
                        {getRecommendationIcon()}
                        <div>
                            <p className="font-semibold">{analysis.levelLabel}</p>
                            <p className="text-sm text-muted-foreground">{analysis.playfulAdvice}</p>
                            <p className="mt-2 text-xs italic text-muted-foreground"><b>{t('spotDetailsPanel.gear')}:</b> {analysis.gearSuggestion}</p>
                        </div>
                    </div>
                </CardContent>
              </>
            )}
           </Card>
        </div>

      </CardContent>
    </Card>
  );
}
