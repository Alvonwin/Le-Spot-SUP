const fs = require('fs');

let content = fs.readFileSync('E:/Le Spot SUP/app/page.tsx', 'utf8');

// 1. Replace hardcoded "À Propos de Le Spot SUP" with translation
content = content.replace(
  'À Propos de Le Spot SUP',
  '{t.about.title}'
);

// 2. Replace hardcoded description
content = content.replace(
  'LA plateforme mondiale de référence pour le stand-up paddle. Découvrez, partagez et explorez les meilleurs spots SUP partout dans le monde, avec une couverture initiale exceptionnelle de <span className="font-bold text-ocean">250+ spots au Québec</span>.',
  '{t.about.description} <span className="font-bold text-ocean">{t.about.quebecSpots}</span>.'
);

// 3. Replace "Spots au Québec"
content = content.replace(
  /<p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Spots au Québec<\/p>/,
  '<p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{t.about.stats.spots}</p>'
);

// 4. Replace "Temps Réel"
content = content.replace(
  /<h3 className="text-xl sm:text-2xl font-bold text-ocean mb-1 sm:mb-2">Temps Réel<\/h3>/,
  '<h3 className="text-xl sm:text-2xl font-bold text-ocean mb-1 sm:mb-2">{t.about.stats.realtime}</h3>'
);

// 5. Replace "Météo et conditions"
content = content.replace(
  /<p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Météo et conditions<\/p>/,
  '<p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{t.about.stats.weather}</p>'
);

// 6. Replace "Communauté"
content = content.replace(
  /<h3 className="text-xl sm:text-2xl font-bold text-ocean mb-1 sm:mb-2">Communauté<\/h3>/,
  '<h3 className="text-xl sm:text-2xl font-bold text-ocean mb-1 sm:mb-2">{t.about.stats.community}</h3>'
);

// 7. Replace "Mondiale de passionnés"
content = content.replace(
  /<p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Mondiale de passionnés<\/p>/,
  '<p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{t.about.stats.worldwide}</p>'
);

// 8. Replace "Découvrir les Spots"
content = content.replace(
  '>Découvrir les Spots<',
  '>{t.about.discoverButton}<'
);

// 9. Replace footer copyright
content = content.replace(
  '© 2025 Le Spot SUP. Tous droits réservés.',
  '{t.footer.copyright}'
);

fs.writeFileSync('E:/Le Spot SUP/app/page.tsx', content);
console.log('✅ HomePage i18n updated');
