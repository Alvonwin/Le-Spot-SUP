const fs = require('fs');
const path = require('path');

// Read the spots file
const filePath = path.join(__dirname, '..', 'IMPORTANT LISTE COMPLÈTE DES SPOTS (1).txt');
const content = fs.readFileSync(filePath, 'utf-8');

// Extract all JSON arrays from the file
// The file contains multiple JSON arrays separated by newlines
const jsonArrays = [];
let currentArray = '';
let bracketCount = 0;

for (const char of content) {
  if (char === '[') {
    if (bracketCount === 0) currentArray = '';
    currentArray += char;
    bracketCount++;
  } else if (char === ']') {
    currentArray += char;
    bracketCount--;
    if (bracketCount === 0 && currentArray.trim()) {
      try {
        const arr = JSON.parse(currentArray);
        jsonArrays.push(...arr);
      } catch (e) {
        console.error('Failed to parse array:', e.message);
      }
      currentArray = '';
    }
  } else if (bracketCount > 0) {
    currentArray += char;
  }
}

console.log(`Found ${jsonArrays.length} spots`);

// Convert to PaddleSpot format
const paddleSpots = jsonArrays.map((spot, index) => {
  const [lat, lon] = spot.gps.split(',').map(s => parseFloat(s.trim()));

  // Extract rating from note field (e.g., "4.6 (23)" -> 4.6)
  const ratingMatch = spot.note.match(/^([\d.]+)/);
  const rating = ratingMatch ? parseFloat(ratingMatch[1]) : undefined;

  // Build description
  const descParts = [];
  if (spot.type) descParts.push(`Type: ${spot.type}`);
  if (rating) descParts.push(`Note: ${spot.note}`);
  if (spot.notes && spot.notes.trim()) descParts.push(`Notes: ${spot.notes}`);

  return {
    id: `spot-${(index + 1).toString().padStart(4, '0')}`,
    name: spot.nom,
    latitude: lat,
    longitude: lon,
    description: descParts.join(' | '),
    address: spot.adresse,
    photoURL: spot.photoURL,
    type: spot.type,
    rating: rating
  };
});

// Generate TypeScript file
const tsContent = `// Auto-generated from IMPORTANT LISTE COMPLÈTE DES SPOTS (1).txt
// Generated on ${new Date().toISOString()}
// Total spots: ${paddleSpots.length}

import { PaddleSpot } from './types';

export const quebecSpots: PaddleSpot[] = ${JSON.stringify(paddleSpots, null, 2)};

export default quebecSpots;
`;

// Write to TypeScript file
const outputPath = path.join(__dirname, '..', 'src', 'lib', 'quebec-spots-data.ts');
fs.writeFileSync(outputPath, tsContent, 'utf-8');

console.log(`✅ Successfully created ${outputPath} with ${paddleSpots.length} spots`);

// Print sample spots
console.log('\nSample spots:');
paddleSpots.slice(0, 3).forEach(spot => {
  console.log(`  - ${spot.name} (${spot.latitude}, ${spot.longitude})`);
});
