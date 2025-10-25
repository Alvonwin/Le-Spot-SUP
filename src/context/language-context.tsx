'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'fr' | 'en';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  fr: {
    'landing.title': 'Découvrez les meilleurs spots de SUP',
    'landing.subtitle': 'Partagez et explorez les spots de stand up paddle dans votre région',
    'landing.explore': 'Explorer la carte',
    'landing.features.title': 'Fonctionnalités',
    'landing.features.subtitle': 'Tout ce dont vous avez besoin',
    'landing.features.description': 'Une plateforme complète pour les amateurs de SUP',
    'landing.features.interactiveMap.title': 'Carte Interactive',
    'landing.features.interactiveMap.description': 'Explorez les spots sur une carte interactive',
    'landing.features.aiRecommendations.title': 'Recommandations IA',
    'landing.features.aiRecommendations.description': 'Obtenez des suggestions personnalisées',
    'landing.features.communityDriven.title': 'Communauté',
    'landing.features.communityDriven.description': 'Partagez vos spots favoris',
    'landing.features.sessionLog.title': 'Journal de sessions',
    'landing.features.sessionLog.description': 'Suivez vos sorties SUP',
    'landing.footer': '© 2025 Le Spot SUP. Tous droits réservés.',
    'nav.features': 'Fonctionnalités',
    'theme.light': 'Clair',
    'theme.dark': 'Sombre',
    'theme.system': 'Système',
    'guidePage.title': 'Guide de sécurité SUP',
    'guidePage.subtitle': 'Tout ce que vous devez savoir pour pagayer en toute sécurité',
    'guidePage.goldenRules.title': 'Règles d\'or du SUP',
    'guidePage.beforeYouGo.title': 'Avant de partir',
    'guidePage.essentialGear.title': 'Équipement essentiel',
    'guidePage.onTheWater.title': 'Sur l\'eau',
    'guidePage.weatherAwareness.title': 'Vigilance météo'
  },
  en: {
    'landing.title': 'Discover the best SUP spots',
    'landing.subtitle': 'Share and explore stand up paddle spots in your area',
    'landing.explore': 'Explore the map',
    'landing.features.title': 'Features',
    'landing.features.subtitle': 'Everything you need',
    'landing.features.description': 'A complete platform for SUP enthusiasts',
    'landing.features.interactiveMap.title': 'Interactive Map',
    'landing.features.interactiveMap.description': 'Explore spots on an interactive map',
    'landing.features.aiRecommendations.title': 'AI Recommendations',
    'landing.features.aiRecommendations.description': 'Get personalized suggestions',
    'landing.features.communityDriven.title': 'Community',
    'landing.features.communityDriven.description': 'Share your favorite spots',
    'landing.features.sessionLog.title': 'Session Log',
    'landing.features.sessionLog.description': 'Track your SUP outings',
    'landing.footer': '© 2025 Le Spot SUP. All rights reserved.',
    'nav.features': 'Features',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.system': 'System',
    'guidePage.title': 'SUP Safety Guide',
    'guidePage.subtitle': 'Everything you need to know to paddle safely',
    'guidePage.goldenRules.title': 'Golden Rules of SUP',
    'guidePage.beforeYouGo.title': 'Before You Go',
    'guidePage.essentialGear.title': 'Essential Gear',
    'guidePage.onTheWater.title': 'On the Water',
    'guidePage.weatherAwareness.title': 'Weather Awareness'
  }
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.fr] || key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
}