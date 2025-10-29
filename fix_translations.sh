#!/bin/bash
# Add missing translations

FILE="lib/translations.ts"

# Read the current content
CONTENT=$(cat "$FILE")

# Create the new content with additions
cat > "$FILE" << 'EOF'
export type Language = "fr" | "en";

export const translations = {
  fr: {
    nav: {
      map: "Carte",
      guide: "Le Guide",
      sessions: "Mes Sessions",
      login: "Se connecter",
      signup: "S'inscrire",
    },
    home: {
      hero: {
        title: "Trouvez le Spot de Paddle Idéal.",
        subtitle:
          "Le Spot SUP vous aide à trouver les meilleurs endroits pour faire du stand-up paddle, grâce à l'IA et à une communauté d'explorateurs.",
        cta: "Explorer la Carte",
      },
      features: {
        badge: "Caractéristiques Clés",
        title: "Tout ce Dont Vous Avez Besoin pour Votre Prochaine Aventure",
        description:
          "De la carte interactive aux recommandations par IA, nous avons tout prévu.",
        items: [
          {
            title: "Carte Interactive",
            description:
              "Explorez les spots de paddle du monde entier. Consultez les détails, les photos et les commodités en un coup d'œil.",
          },
          {
            title: "Recommandations par IA",
            description:
              "Notre IA vous suggère les meilleurs spots en fonction de la météo, de votre niveau et de vos préférences.",
          },
          {
            title: "Piloté par la Communauté",
            description:
              "Ajoutez de nouveaux spots, partagez vos expériences et faites partie de la communauté mondiale du paddle.",
          },
          {
            title: "Registre de Sessions",
            description:
              "Enregistrez vos sorties, suivez vos performances et recevez des conseils de notre coach IA pour vous améliorer.",
          },
        ],
      },
    },
    about: {
      title: "À Propos de Le Spot SUP",
      description:
        "LA plateforme mondiale de référence pour le stand-up paddle. Découvrez, partagez et explorez les meilleurs spots SUP partout dans le monde, avec une couverture initiale exceptionnelle de",
      quebecSpots: "250+ spots au Québec",
      stats: {
        spots: "Spots au Québec",
        realtime: "Temps Réel",
        weather: "Météo et conditions",
        community: "Communauté",
        worldwide: "Mondiale de passionnés",
      },
      discoverButton: "Découvrir les Spots",
    },
    footer: {
      copyright: "© 2025 Le Spot SUP. Tous droits réservés.",
    },
    auth: {
      signup: {
        title: "Créer un Compte",
        subtitle: "Rejoignez la communauté Le Spot SUP.",
        name: "Nom",
        namePlaceholder: "Votre Nom",
        email: "Email",
        emailPlaceholder: "nom@example.com",
        password: "Mot de passe",
        submitButton: "S'inscrire",
        hasAccount: "Vous avez déjà un compte ?",
        loginLink: "Se Connecter",
      },
      login: {
        title: "Content de vous revoir",
        subtitle: "Connectez-vous pour continuer votre aventure.",
        email: "Email",
        emailPlaceholder: "nom@example.com",
        password: "Mot de passe",
        submitButton: "Se Connecter",
        noAccount: "Vous n'avez pas de compte ?",
        signupLink: "S'inscrire",
      },
    },
  },
  en: {
    nav: {
      map: "Map",
      guide: "The Guide",
      sessions: "My Sessions",
      login: "Log In",
      signup: "Sign Up",
    },
    home: {
      hero: {
        title: "Find Your Perfect Paddle Spot",
        subtitle:
          "Le Spot SUP helps you find the best stand-up paddleboarding spots, powered by AI and a community of explorers.",
        cta: "Explore the Map",
      },
      features: {
        badge: "Key Features",
        title: "Everything You Need for Your Next Adventure",
        description:
          "From interactive maps to AI recommendations, we've got you covered.",
        items: [
          {
            title: "Interactive Map",
            description:
              "Explore paddle spots from around the world. View details, photos, and amenities at a glance.",
          },
          {
            title: "AI Recommendations",
            description:
              "Our AI suggests the best spots based on weather, your skill level, and preferences.",
          },
          {
            title: "Community Driven",
            description:
              "Add new spots, share your experiences, and be part of the global paddle community.",
          },
          {
            title: "Session Tracker",
            description:
              "Log your outings, track your performance, and receive advice from our AI coach to improve.",
          },
        ],
      },
    },
    about: {
      title: "About Le Spot SUP",
      description:
        "THE global reference platform for stand-up paddleboarding. Discover, share and explore the best SUP spots around the world, with exceptional initial coverage of",
      quebecSpots: "250+ spots in Quebec",
      stats: {
        spots: "Spots in Quebec",
        realtime: "Real-Time",
        weather: "Weather and conditions",
        community: "Community",
        worldwide: "Worldwide enthusiasts",
      },
      discoverButton: "Discover Spots",
    },
    footer: {
      copyright: "© 2025 Le Spot SUP. All rights reserved.",
    },
    auth: {
      signup: {
        title: "Create an Account",
        subtitle: "Join the Le Spot SUP community.",
        name: "Name",
        namePlaceholder: "Your Name",
        email: "Email",
        emailPlaceholder: "name@example.com",
        password: "Password",
        submitButton: "Sign Up",
        hasAccount: "Already have an account?",
        loginLink: "Log In",
      },
      login: {
        title: "Welcome Back",
        subtitle: "Log in to continue your adventure.",
        email: "Email",
        emailPlaceholder: "name@example.com",
        password: "Password",
        submitButton: "Log In",
        noAccount: "Don't have an account?",
        signupLink: "Sign Up",
      },
    },
  },
};
EOF

echo "✅ Translations updated"
