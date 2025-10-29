const fs = require('fs');

// Read MapPage
let content = fs.readFileSync('E:/Le Spot SUP/app/map/page.tsx', 'utf8');

// Fix 1: Change flex layout to flex-col on mobile
content = content.replace(
  '<div className="flex h-[calc(100vh-64px)] relative">',
  '<div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] lg:h-[calc(100vh-64px)] relative">'
);

// Fix 2: Panel sizing - 50vh on mobile, 50% on desktop when open
content = content.replace(
  'className={`bg-gray-900 text-white p-6 overflow-y-auto transition-all duration-300 ${',
  'className={`bg-gray-900 text-white p-4 sm:p-6 overflow-y-auto transition-all duration-300 ${'
);

content = content.replace(
  'isPanelOpen ? "w-full lg:w-1/2" : "w-0 p-0 overflow-hidden"',
  'isPanelOpen ? "w-full h-[50vh] lg:h-full lg:w-1/2" : "w-full h-0 lg:w-0 p-0 overflow-hidden"'
);

// Fix 3: Tabs - smaller on mobile
content = content.replace(
  '<div className="flex gap-2 mb-6 overflow-x-auto pb-2">',
  '<div className="flex gap-1.5 sm:gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2 scrollbar-hide">'
);

// Fix 4: Tab button padding - smaller on mobile
content = content.replace(
  /className=\{`flex flex-col items-center gap-2 px-6 py-3 rounded-xl/g,
  'className={`flex flex-col items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl'
);

// Fix 5: Tab icons - smaller on mobile
content = content.replace(/<List size={22}/g, '<List size={18} className="sm:w-[22px] sm:h-[22px]"');
content = content.replace(/<Info size={22}/g, '<Info size={18} className="sm:w-[22px] sm:h-[22px]"');
content = content.replace(/<Bot size={22}/g, '<Bot size={18} className="sm:w-[22px] sm:h-[22px]"');
content = content.replace(/<Plus size={22}/g, '<Plus size={18} className="sm:w-[22px] sm:h-[22px]"');

// Fix 6: Tab text - smaller on mobile
content = content.replace(
  /<span className="text-sm font-semibold">/g,
  '<span className="text-xs sm:text-sm font-semibold">'
);

// Fix 7: Map container - adjust height for mobile
content = content.replace(
  'className={`relative bg-gray-200 dark:bg-gray-700 transition-all duration-300 ${',
  'className={`relative bg-gray-200 dark:bg-gray-700 transition-all duration-300 h-[50vh] lg:h-full ${'
);

content = content.replace(
  'isPanelOpen ? "w-full lg:w-1/2" : "w-full"',
  'isPanelOpen ? "w-full lg:w-1/2" : "w-full h-full"'
);

// Fix 8: Toggle button - better positioning on mobile
content = content.replace(
  'className="absolute top-4 left-4 z-10',
  'className="absolute top-2 left-2 lg:top-4 lg:left-4 z-10'
);

content = content.replace(
  'className="absolute top-4 left-4 z-10 bg-ocean-dark hover:bg-ocean text-white p-3 rounded-full',
  'className="absolute top-2 left-2 lg:top-4 lg:left-4 z-10 bg-ocean-dark hover:bg-ocean text-white p-2 lg:p-3 rounded-full'
);

// Fix 9: Search bar - smaller padding on mobile
content = content.replace(
  'className="w-full pl-12 pr-4 py-4 bg-gray-800',
  'className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-gray-800'
);

// Fix 10: Spots counter - smaller on mobile
content = content.replace(
  '<p className="text-3xl font-bold text-white">',
  '<p className="text-2xl sm:text-3xl font-bold text-white">'
);

//  Write changes
fs.writeFileSync('E:/Le Spot SUP/app/map/page.tsx', content);
console.log('✅ Mobile responsive fixes applied to MapPage');
