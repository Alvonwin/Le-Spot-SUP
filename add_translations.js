const fs = require('fs');

// Read current translations
let content = fs.readFileSync('E:/Le Spot SUP/lib/translations.ts', 'utf8');

// Find the position to add about and footer sections for French
const frAuthEnd = content.indexOf('    },\n  },\n  en: {');

if (frAuthEnd === -1) {
  console.error('Could not find insertion point');
  process.exit(1);
}

const frAdditions = `    },
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
  },
  en: {`;

// Replace the section
content = content.replace('    },\n  },\n  en: {', frAdditions);

// Now add English translations before the closing
const enAuthEnd = content.lastIndexOf('    },\n  },\n};');

if (enAuthEnd === -1) {
  console.error('Could not find English insertion point');
  process.exit(1);
}

const enAdditions = `    },
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
  },
};`;

content = content.replace(/    },\n  },\n};$/, enAdditions);

// Write back
fs.writeFileSync('E:/Le Spot SUP/lib/translations.ts', content);
console.log('✅ Translations added successfully');
