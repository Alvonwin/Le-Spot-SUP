const fs = require('fs');

// Read HomePage
let content = fs.readFileSync('E:/Le Spot SUP/app/page.tsx', 'utf8');

// Fix 1: Hero section - smaller height on mobile
content = content.replace(
  'className="relative h-[60vh] min-h-[500px]',
  'className="relative h-[50vh] min-h-[400px] sm:h-[60vh] sm:min-h-[500px]'
);

// Fix 2: Hero title - smaller on mobile
content = content.replace(
  'className="text-5xl md:text-6xl font-bold mb-6"',
  'className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6"'
);

// Fix 3: Hero subtitle - smaller on mobile
content = content.replace(
  'className="text-xl md:text-2xl mb-8',
  'className="text-base sm:text-xl md:text-2xl mb-6 sm:mb-8'
);

// Fix 4: Hero CTA button - smaller on mobile
content = content.replace(
  'className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-4 rounded-lg text-lg',
  'className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 sm:px-8 sm:py-4 rounded-lg text-base sm:text-lg'
);

// Fix 5: Features section padding - reduce on mobile
content = content.replace(
  '<section className="py-16 px-4 bg-white',
  '<section className="py-12 sm:py-16 px-4 bg-white'
);

// Fix 6: Features title - smaller on mobile
content = content.replace(
  'className="text-4xl md:text-5xl font-bold text-center mb-4',
  'className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4'
);

// Fix 7: Features grid - 1 column on small mobile, 2 on tablet
content = content.replace(
  '<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">',
  '<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">'
);

// Fix 8: Feature icons - smaller on mobile
content = content.replace(
  'className="w-20 h-20 bg-ocean-light',
  'className="w-16 h-16 sm:w-20 sm:h-20 bg-ocean-light'
);

content = content.replace(
  /className="w-10 h-10 text-ocean-dark/g,
  'className="w-8 h-8 sm:w-10 sm:h-10 text-ocean-dark'
);

// Fix 9: Feature title - smaller on mobile
content = content.replace(
  /<h3 className="text-xl font-bold mb-3/g,
  '<h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3'
);

// Fix 10: Feature description - smaller on mobile
content = content.replace(
  /<p className="text-gray-600 dark:text-gray-300">/g,
  '<p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">'
);

// Fix 11: About section padding - reduce on mobile
content = content.replace(
  '<section className="py-16 px-4 bg-gradient-to-br',
  '<section className="py-12 sm:py-16 px-4 bg-gradient-to-br'
);

// Fix 12: About emoji - smaller on mobile
content = content.replace(
  '<div className="text-6xl mb-6">',
  '<div className="text-5xl sm:text-6xl mb-4 sm:mb-6">'
);

// Fix 13: About title - smaller on mobile
content = content.replace(
  'className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"',
  'className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6"'
);

// Fix 14: About description - smaller on mobile
content = content.replace(
  'className="text-xl text-gray-700 dark:text-gray-300 mb-8',
  'className="text-base sm:text-xl text-gray-700 dark:text-gray-300 mb-6 sm:mb-8'
);

// Fix 15: Stats grid - smaller gap on mobile
content = content.replace(
  '<div className="grid md:grid-cols-3 gap-6',
  '<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6'
);

// Fix 16: Stats cards - smaller padding on mobile
content = content.replace(
  /className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">/g,
  'className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">'
);

// Fix 17: Stats emoji - smaller on mobile
content = content.replace(
  /<div className="text-4xl mb-3">/g,
  '<div className="text-3xl sm:text-4xl mb-2 sm:mb-3">'
);

// Fix 18: Stats number - smaller on mobile
content = content.replace(
  /<h3 className="text-2xl font-bold text-ocean mb-2">/g,
  '<h3 className="text-xl sm:text-2xl font-bold text-ocean mb-1 sm:mb-2">'
);

// Fix 19: Footer padding - reduce on mobile
content = content.replace(
  '<footer className="bg-ocean-dark text-white py-8',
  '<footer className="bg-ocean-dark text-white py-6 sm:py-8'
);

// Write changes
fs.writeFileSync('E:/Le Spot SUP/app/page.tsx', content);
console.log('✅ Mobile responsive fixes applied to HomePage');
