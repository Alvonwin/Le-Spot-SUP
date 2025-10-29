export type SpotData = {
  nom: string;
  type: string;
  note: string;
  latitude: number;
  longitude: number;
  adresse: string;
  photoURL: string;
  notes: string;
};

const rawSpots = [
  {
    "nom": "Camping Pontmain",
    "type": "Terrain de camping",
    "note": "4.6 (23)",
    "gps": "46.7167,-75.4833",
    "adresse": "Pontmain, QC",
    "photoURL": "https://www.quebecvacances.com/images/attrait/large/100/100_2951.jpg",
    "notes": ""
  },
  {
    "nom": "Parc Jack Layton",
    "type": "Parc",
    "note": "4.6 (506)",
    "gps": "45.3173,-74.0648",
    "adresse": "Hudson, QC",
    "photoURL": "https://www.hudson.quebec/wp-content/uploads/2021/06/JackLaytonPark.jpg",
    "notes": ""
  },
  {
    "nom": "Lac Provost - Plage",
    "type": "Terrain de camping",
    "note": "4.7 (195)",
    "gps": "46.3150,-74.4990",
    "adresse": "695 Chem. de la Gabelle, QC",
    "photoURL": "https://www.sepaq.com/resources/images/parks/parc-national-du-mont-tremblant/plage-provost.jpg",
    "notes": "Ce lieu n'existe plus"
  },
  {
    "nom": "Débarcadère municipal du Lac Maskinongé",
    "type": "Rampe de mise à l'eau",
    "note": "3.5 (8)",
    "gps": "46.2167,-73.0500",
    "adresse": "Maskinongé, QC",
    "photoURL": "https://www.maskinonge.ca/wp-content/uploads/2020/06/debarcadere.jpg",
    "notes": ""
  },
  {
    "nom": "AGIR Maskinongé",
    "type": "Expert-conseil en environnement",
    "note": "4.0 (1)",
    "gps": "46.2167,-73.0500",
    "adresse": "Maskinongé, QC",
    "photoURL": "https://agir-maskinonge.org/wp-content/uploads/2021/03/logo-agir-maskinonge.jpg",
    "notes": ""
  },
  {
    "nom": "Lac McGregor",
    "type": "Lac",
    "note": "4.7 (35)",
    "gps": "45.6333,-75.7167",
    "adresse": "Val-des-Monts, QC",
    "photoURL": "https://www.val-des-monts.net/wp-content/uploads/2020/07/lac-mcgregor.jpg",
    "notes": ""
  },
  {
    "nom": "Parc le Trou de la Fée",
    "type": "Attraction touristique",
    "note": "4.4 (1332)",
    "gps": "48.5833,-71.2500",
    "adresse": "103 Chem. de la Vallée, Stoneham-et-Tewkesbury, QC G3C 2H8",
    "photoURL": "https://www.troudelafee.com/images/parc-trou-de-la-fee.jpg",
    "notes": "Km 25"
  },
  {
    "nom": "Parc Antoine-Gauthier",
    "type": "Parc",
    "note": "4.6 (448)",
    "gps": "46.8167,-71.2167",
    "adresse": "Québec, QC",
    "photoURL": "https://www.ville.quebec.qc.ca/images/lieux/parc-antoine-gauthier.jpg",
    "notes": ""
  },
  {
    "nom": "Sepaq. Lac au Sorcier",
    "type": "Terrain de camping",
    "note": "4.4 (14)",
    "gps": "47.0000,-72.0000",
    "adresse": "Réserve faunique Mastigouche, QC",
    "photoURL": "https://www.sepaq.com/resources/images/parks/mastigouche/lac-au-sorcier.jpg",
    "notes": ""
  },
  {
    "nom": "Lac Normand",
    "type": "Lac",
    "note": "5.0 (3)",
    "gps": "47.0000,-72.0000",
    "adresse": "Réserve faunique Mastigouche, QC",
    "photoURL": "https://www.sepaq.com/resources/images/parks/mastigouche/lac-normand.jpg",
    "notes": ""
  },
  // Ajoutez d'autres spots ici si nécessaire - pour l'instant j'en mets 10 pour tester
];

export const spots: SpotData[] = rawSpots
  .filter(spot => spot.notes !== "Ce lieu n'existe plus")
  .map((spot, index) => {
    const [lat, lon] = spot.gps.split(',').map(Number);
    return {
      nom: spot.nom,
      type: spot.type,
      note: spot.note,
      latitude: lat,
      longitude: lon,
      adresse: spot.adresse,
      photoURL: spot.photoURL,
      notes: spot.notes
    };
  });
