
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/context/language-context';
import { CheckCircle, LifeBuoy, Anchor, Wind, Sun } from 'lucide-react';
import React from 'react';

const getSafetyData = (language: 'fr' | 'en') => {
  const data = {
    fr: {
      goldenRules: [
        { icon: '⚠️', title: 'Toujours porter un VFI', text: 'Le port du gilet de sauvetage est obligatoire et peut vous sauver la vie.' },
        { icon: '👥', title: 'Ne pagayez jamais seul', text: 'Privilégiez les sorties en groupe ou prévenez quelqu\'un de votre itinéraire.' },
        { icon: '📱', title: 'Restez connecté', text: 'Emportez un téléphone étanche ou une radio VHF.' },
        { icon: '🌊', title: 'Connaissez vos limites', text: 'Adaptez vos sorties à votre niveau d\'expérience.' },
      ],
      beforeYouGo: [
        { icon: '☁️', title: 'Vérifiez la météo', text: 'Consultez les prévisions et les alertes météorologiques avant chaque sortie.' },
        { icon: '🗺️', title: 'Planifiez votre parcours', text: 'Étudiez la zone, les courants et les points de sortie d\'urgence.' },
        { icon: '🔋', title: 'Préparez votre équipement', text: 'Vérifiez que votre planche est gonflée correctement et que tout fonctionne.' },
        { icon: '💪', title: 'Échauffez-vous', text: 'Faites des étirements pour préparer vos muscles.' },
      ],
      essentialGear: [
        { icon: '🦺', title: 'VFI/Gilet de sauvetage', text: 'Obligatoire et doit être porté en tout temps sur l\'eau.' },
        { icon: '🏄', title: 'Leash (cordon de sécurité)', text: 'Vous garde connecté à votre planche en cas de chute.' },
        { icon: '☀️', title: 'Protection solaire', text: 'Crème solaire, chapeau et lunettes de soleil.' },
        { icon: '💧', title: 'Hydratation', text: 'Emportez de l\'eau, surtout pour les longues sorties.' },
        { icon: '📢', title: 'Sifflet de sécurité', text: 'Pour signaler votre présence en cas d\'urgence.' },
      ],
      onTheWater: [
        { icon: '👀', title: 'Restez vigilant', text: 'Surveillez les bateaux, nageurs et obstacles.' },
        { icon: '⬅️', title: 'Respectez la priorité', text: 'Les pagayeurs cèdent la priorité aux voiliers et bateaux à moteur.' },
        { icon: '🌬️', title: 'Pagayez face au vent', text: 'Débutez face au vent pour avoir le vent dans le dos au retour.' },
        { icon: '🏖️', title: 'Restez près des côtes', text: 'Surtout si vous débutez, ne vous éloignez pas trop.' },
      ],
      weatherAwareness: [
        { icon: '💨', title: 'Vent', text: 'Évitez de pagayer si le vent dépasse 20 km/h.' },
        { icon: '⛈️', title: 'Orages', text: 'Ne sortez jamais en cas d\'orage ou si un orage est prévu.' },
        { icon: '🌡️', title: 'Température', text: 'Portez une combinaison si l\'eau est froide (moins de 15°C).' },
        { icon: '🌊', title: 'Vagues et courants', text: 'Renseignez-vous sur les conditions locales avant de partir.' },
      ],
    },
    en: {
      goldenRules: [
        { icon: '⚠️', title: 'Always wear a PFD', text: 'Wearing a life jacket is mandatory and can save your life.' },
        { icon: '👥', title: 'Never paddle alone', text: 'Prefer group outings or inform someone of your route.' },
        { icon: '📱', title: 'Stay connected', text: 'Bring a waterproof phone or VHF radio.' },
        { icon: '🌊', title: 'Know your limits', text: 'Adapt your outings to your experience level.' },
      ],
      beforeYouGo: [
        { icon: '☁️', title: 'Check the weather', text: 'Consult forecasts and weather alerts before each outing.' },
        { icon: '🗺️', title: 'Plan your route', text: 'Study the area, currents and emergency exit points.' },
        { icon: '🔋', title: 'Prepare your equipment', text: 'Check that your board is properly inflated and everything works.' },
        { icon: '💪', title: 'Warm up', text: 'Do stretches to prepare your muscles.' },
      ],
      essentialGear: [
        { icon: '🦺', title: 'PFD/Life jacket', text: 'Mandatory and must be worn at all times on water.' },
        { icon: '🏄', title: 'Leash (safety cord)', text: 'Keeps you connected to your board in case of a fall.' },
        { icon: '☀️', title: 'Sun protection', text: 'Sunscreen, hat and sunglasses.' },
        { icon: '💧', title: 'Hydration', text: 'Bring water, especially for long outings.' },
        { icon: '📢', title: 'Safety whistle', text: 'To signal your presence in an emergency.' },
      ],
      onTheWater: [
        { icon: '👀', title: 'Stay vigilant', text: 'Watch for boats, swimmers and obstacles.' },
        { icon: '⬅️', title: 'Respect priority', text: 'Paddlers yield to sailboats and motorboats.' },
        { icon: '🌬️', title: 'Paddle into the wind', text: 'Start into the wind to have wind at your back on return.' },
        { icon: '🏖️', title: 'Stay close to shore', text: 'Especially if you\'re a beginner, don\'t go too far.' },
      ],
      weatherAwareness: [
        { icon: '💨', title: 'Wind', text: 'Avoid paddling if wind exceeds 20 km/h.' },
        { icon: '⛈️', title: 'Storms', text: 'Never go out during a storm or if one is forecast.' },
        { icon: '🌡️', title: 'Temperature', text: 'Wear a wetsuit if water is cold (below 15°C).' },
        { icon: '🌊', title: 'Waves and currents', text: 'Learn about local conditions before heading out.' },
      ],
    },
  };

  return data[language];
};

const sections = [
  {
    key: 'goldenRules' as const,
    icon: Anchor,
  },
  {
    key: 'beforeYouGo' as const,
    icon: CheckCircle,
  },
  {
    key: 'essentialGear' as const,
    icon: LifeBuoy,
  },
  {
    key: 'onTheWater' as const,
    icon: Wind,
  },
  {
    key: 'weatherAwareness' as const,
    icon: Sun,
  },
];

export default function GuidePage() {
  const { t, language } = useTranslation();
  const safetyData = getSafetyData(language);

  const safetyInfo = sections.map(section => ({
    category: t(`guidePage.${section.key}.title`),
    icon: section.icon,
    tips: safetyData[section.key],
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-background">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <div className="text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
              {t('guidePage.title')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {t('guidePage.subtitle')}
            </p>
          </div>

          <div className="mt-12 grid gap-8">
            {safetyInfo.map((section) => (
              <Card key={section.category} className="shadow-md">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <section.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="font-headline text-2xl">{section.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {section.tips.map((tip, index: number) => (
                      <li key={index} className="flex items-start">
                        {tip.icon && <span className="mr-4 mt-1 text-2xl">{tip.icon}</span>}
                        <div className='flex-1'>
                           <p className="font-semibold">{tip.title}</p>
                           <p className="text-muted-foreground">{tip.text}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
