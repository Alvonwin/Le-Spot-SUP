"use client";

import { useState, useMemo } from "react";
import { List, Info, Bot, Plus, Search, Filter, MapPin, User, ChevronLeft, Scan, Crosshair, Navigation } from "lucide-react";
import InteractiveMap from "@/components/InteractiveMap";
import WeatherDisplay from "@/components/WeatherDisplay";
import SpotRecommendations from "@/components/SpotRecommendations";
import { useSpotRecommendation } from "@/hooks/useSpotRecommendation";
import { spots as spotsData } from "@/lib/spots-data";
import { useLocation } from "@/components/LocationProvider";

type Spot = {
  id: number;
  name: string;
  location: string;
  distance: number;
  latitude: number;
  longitude: number;
  description?: string;
  amenities?: string[];
  notes?: string;
  rating?: string;
  photoURL?: string;
};

type Tab = "list" | "details" | "ai" | "add";

// Function to calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export default function MapPage() {
  const [activeTab, setActiveTab] = useState<Tab>("list");
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const { userLocation } = useLocation();

  // Convert imported spots to component format with calculated distances
  // Use useMemo to recalculate distances when userLocation changes
  const spots: Spot[] = useMemo(() => {
    const mappedSpots = spotsData.map((spot, index) => ({
      id: index + 1,
      name: spot.nom,
      location: spot.adresse,
      distance: userLocation
        ? calculateDistance(userLocation.latitude, userLocation.longitude, spot.latitude, spot.longitude)
        : 0,
      latitude: spot.latitude,
      longitude: spot.longitude,
      description: spot.type,
      amenities: [],
      notes: spot.notes,
      rating: spot.note,
      photoURL: spot.photoURL,
    }));

    // Sort spots by distance (nearest first)
    return mappedSpots.sort((a, b) => a.distance - b.distance);
  }, [userLocation]);

  const [experienceLevel, setExperienceLevel] = useState<'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert'>('Intermédiaire');
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Get AI recommendations
  const recommendations = useSpotRecommendation(spots, userLocation, experienceLevel);

  const [addSpotForm, setAddSpotForm] = useState({
    name: "",
    latitude: "",
    longitude: "",
    parking: false,
    toilets: false,
    rentals: false,
    dogs: false,
  });

  return (
    <div className="min-h-screen bg-white dark:bg-ocean-dark">
      {/* Page Title */}
      {selectedSpot && (
        <div className="bg-ocean-dark/50 text-white py-3 px-4 border-b border-ocean">
          <div className="max-w-6xl mx-auto">
            <button
              onClick={() => setSelectedSpot(null)}
              className="text-ocean-light hover:text-white flex items-center gap-1"
            >
              <ChevronLeft size={16} />
              Retour à la liste
            </button>
            <h2 className="text-xl font-bold mt-1">PlanètePaddle</h2>
          </div>
        </div>
      )}

      <div className="flex h-[calc(100vh-64px)] relative">
        {/* Left Side - Controls */}
        <div
          className={`bg-gray-900 text-white p-6 overflow-y-auto transition-all duration-300 ${
            isPanelOpen ? "w-full lg:w-1/2" : "w-0 p-0 overflow-hidden"
          }`}
        >
          {/* Tabs - Colorful & Modern */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <button
              onClick={() => {
                setActiveTab("list");
                setSelectedSpot(null);
              }}
              className={`flex flex-col items-center gap-2 px-6 py-3 rounded-xl transition-all hover:scale-105 flex-shrink-0 ${
                activeTab === "list"
                  ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-300"
              }`}
            >
              <List size={22} className={activeTab === "list" ? "drop-shadow-glow" : ""} />
              <span className="text-sm font-semibold">Liste</span>
              {activeTab === "list" && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-blue-400 rounded-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("details")}
              className={`flex flex-col items-center gap-2 px-6 py-3 rounded-xl transition-all hover:scale-105 flex-shrink-0 ${
                activeTab === "details"
                  ? "bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/50"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-300"
              }`}
            >
              <Info size={22} className={activeTab === "details" ? "drop-shadow-glow" : ""} />
              <span className="text-sm font-semibold">Détails</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("ai");
                setSelectedSpot(null);
              }}
              className={`flex flex-col items-center gap-2 px-6 py-3 rounded-xl transition-all hover:scale-105 flex-shrink-0 ${
                activeTab === "ai"
                  ? "bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/50"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-300"
              }`}
            >
              <Bot size={22} className={activeTab === "ai" ? "drop-shadow-glow" : ""} />
              <span className="text-sm font-semibold">IA</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("add");
                setSelectedSpot(null);
              }}
              className={`flex flex-col items-center gap-2 px-6 py-3 rounded-xl transition-all hover:scale-105 flex-shrink-0 ${
                activeTab === "add"
                  ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/50"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-300"
              }`}
            >
              <Plus size={22} className={activeTab === "add" ? "drop-shadow-glow" : ""} />
              <span className="text-sm font-semibold">Ajouter</span>
            </button>
          </div>

          {/* List View */}
          {activeTab === "list" && !selectedSpot && (
            <div>
              {/* Spots Counter */}
              <div className="mb-4 flex items-center justify-between bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-4 rounded-xl border border-blue-500/30">
                <div>
                  <p className="text-sm text-gray-400">Spots disponibles</p>
                  <p className="text-3xl font-bold text-white">{spots.length}</p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-full">
                  <MapPin size={32} className="text-blue-400" />
                </div>
              </div>

              {/* Search Bar */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={20} />
                  <input
                    type="text"
                    placeholder="Rechercher un spot..."
                    className="w-full pl-12 pr-4 py-4 bg-gray-800 text-white rounded-xl border-2 border-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Filter Button */}
              <button className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 rounded-xl mb-6 transition-all shadow-lg hover:shadow-xl">
                <Filter size={20} className="text-blue-400" />
                <span className="font-semibold">Filtrer & Trier</span>
              </button>

              {/* Spots List */}
              <div className="space-y-3">
                {spots.map((spot, index) => (
                  <button
                    key={spot.id}
                    onClick={() => {
                      setSelectedSpot(spot);
                      setActiveTab("details");
                    }}
                    className="w-full text-left p-4 bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 rounded-xl transition-all hover:scale-[1.02] shadow-lg hover:shadow-2xl border border-gray-700/50 hover:border-blue-500/50 group animate-slideIn"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                        <MapPin className="text-blue-400 flex-shrink-0" size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg mb-1 text-white group-hover:text-blue-300 transition-colors truncate">
                          {spot.name}
                        </h3>
                        <p className="text-gray-400 text-sm mb-2 truncate">{spot.location}</p>
                        {spot.rating && (
                          <div className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 rounded-lg mb-2">
                            <span className="text-yellow-400 text-sm">⭐</span>
                            <span className="text-yellow-400 text-xs font-semibold">{spot.rating}</span>
                          </div>
                        )}
                        {spot.notes && spot.notes.trim() !== "" && spot.notes !== "Ce lieu n'existe plus" && (
                          <p className="text-xs text-gray-500 mb-2 line-clamp-2">{spot.notes}</p>
                        )}
                        <p className="text-sm text-gray-300">à {spot.distance} km</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Details View */}
          {activeTab === "details" && selectedSpot && (
            <div>
              <button
                onClick={() => setSelectedSpot(null)}
                className="flex items-center gap-2 text-ocean-light hover:text-white mb-4"
              >
                <ChevronLeft size={20} />
                Retour à la liste
              </button>

              <div className="space-y-6">
                {/* Photo du spot */}
                {selectedSpot.photoURL ? (
                  <div className="h-48 rounded-lg overflow-hidden">
                    <img
                      src={selectedSpot.photoURL}
                      alt={selectedSpot.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          e.currentTarget.style.display = 'none';
                          parent.className = 'h-48 rounded-lg bg-gradient-to-br from-ocean-light to-ocean flex items-center justify-center';
                          parent.innerHTML = '<p class="text-white text-sm">Image non disponible</p>';
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-48 rounded-lg bg-gradient-to-br from-ocean-light to-ocean flex items-center justify-center">
                    <p className="text-white text-sm">Image non disponible</p>
                  </div>
                )}

                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="text-2xl font-bold">{selectedSpot.name}</h2>
                    {selectedSpot.rating && (
                      <div className="flex items-center gap-1 bg-ocean-light/20 px-3 py-1 rounded-full">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-white font-semibold">{selectedSpot.rating}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-ocean-light mb-2">{selectedSpot.description}</p>

                  {/* Adresse */}
                  {selectedSpot.location && (
                    <div className="flex items-start gap-2 text-gray-400 text-sm mb-2">
                      <MapPin size={16} className="mt-1 flex-shrink-0" />
                      <p>{selectedSpot.location}</p>
                    </div>
                  )}

                  {/* Coordonnées GPS */}
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                    <span className="font-mono">📍 GPS:</span>
                    <span className="font-mono">{selectedSpot.latitude.toFixed(4)}, {selectedSpot.longitude.toFixed(4)}</span>
                  </div>

                  {selectedSpot.notes && selectedSpot.notes.trim() !== "" && selectedSpot.notes !== "Ce lieu n'existe plus" && (
                    <div className="mt-4 p-4 bg-ocean-light/10 rounded-lg">
                      <h3 className="font-bold mb-2 text-ocean-light">Informations</h3>
                      <p className="text-gray-300 whitespace-pre-line">{selectedSpot.notes}</p>
                    </div>
                  )}
                </div>

                {selectedSpot.amenities && selectedSpot.amenities.length > 0 && (
                  <div>
                    <h3 className="font-bold mb-3">Commodités</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSpot.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <WeatherDisplay
                  latitude={selectedSpot.latitude}
                  longitude={selectedSpot.longitude}
                />
              </div>
            </div>
          )}

          {/* AI View */}
          {activeTab === "ai" && (
            <div>
              <div className="flex items-start gap-3 mb-6 p-4 bg-gray-800 rounded-lg">
                <Bot className="text-ocean-light flex-shrink-0 mt-1" size={24} />
                <div>
                  <h2 className="font-bold text-lg mb-2">Recommandation Intelligente</h2>
                  <p className="text-gray-300 text-sm">
                    Trouvez le meilleur spot en fonction des conditions météo actuelles et de votre niveau d'expérience.
                  </p>
                </div>
              </div>

              {!showRecommendations ? (
                <div className="space-y-6">
                  <div>
                    <label className="block mb-2 font-semibold">Votre Niveau d'Expérience</label>
                    <div className="grid grid-cols-2 gap-3">
                      {(['Débutant', 'Intermédiaire', 'Avancé', 'Expert'] as const).map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setExperienceLevel(level)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            experienceLevel === level
                              ? 'border-ocean-light bg-ocean-light/20 text-white'
                              : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                          }`}
                        >
                          <div className="font-bold mb-1">{level}</div>
                          <div className="text-xs text-gray-400">
                            {level === 'Débutant' && '0-10h de pratique'}
                            {level === 'Intermédiaire' && '10-50h de pratique'}
                            {level === 'Avancé' && '50-200h de pratique'}
                            {level === 'Expert' && '200h+ de pratique'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (!userLocation) {
                        alert("Activez votre localisation pour obtenir des recommandations personnalisées");
                        return;
                      }
                      setShowRecommendations(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-ocean-light hover:bg-ocean text-white font-semibold py-4 rounded-lg transition-colors"
                  >
                    <Bot size={20} />
                    Trouver les Meilleurs Spots
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => setShowRecommendations(false)}
                    className="flex items-center gap-2 text-ocean-light hover:text-white mb-4"
                  >
                    <ChevronLeft size={20} />
                    Modifier mes préférences
                  </button>

                  <SpotRecommendations
                    recommendations={recommendations}
                    onSelectSpot={(spot) => {
                      setSelectedSpot(spot);
                      setActiveTab("details");
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Add View */}
          {activeTab === "add" && (
            <div>
              <div className="flex items-start gap-3 mb-6 p-4 bg-gray-800 rounded-lg">
                <Plus className="text-ocean-light flex-shrink-0 mt-1" size={24} />
                <div>
                  <h2 className="font-bold text-lg mb-2">
                    Ajouter un Nouveau Spot
                  </h2>
                  <p className="text-gray-300 text-sm">
                    Cliquez sur la carte pour une suggestion assistée par IA, ou lancez un scan pour explorer les environs.
                  </p>
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 py-3 bg-ocean-light hover:bg-ocean rounded mb-6 transition-colors">
                <Scan size={20} />
                Lancer un scan des environs
              </button>

              <form className="space-y-6">
                <div>
                  <label className="block mb-2">Nom du Spot</label>
                  <input
                    type="text"
                    placeholder="ex: Crique Secrète"
                    value={addSpotForm.name}
                    onChange={(e) =>
                      setAddSpotForm({ ...addSpotForm, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-800 text-white rounded border border-gray-700 focus:border-ocean-light focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">Latitude</label>
                    <input
                      type="text"
                      placeholder="ex: 38.9531"
                      value={addSpotForm.latitude}
                      onChange={(e) =>
                        setAddSpotForm({ ...addSpotForm, latitude: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-gray-800 text-white rounded border border-gray-700 focus:border-ocean-light focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Longitude</label>
                    <input
                      type="text"
                      placeholder="ex: -120.1098"
                      value={addSpotForm.longitude}
                      onChange={(e) =>
                        setAddSpotForm({ ...addSpotForm, longitude: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-gray-800 text-white rounded border border-gray-700 focus:border-ocean-light focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-3">Commodités</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center gap-3 p-3 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={addSpotForm.parking}
                        onChange={(e) =>
                          setAddSpotForm({
                            ...addSpotForm,
                            parking: e.target.checked,
                          })
                        }
                        className="w-5 h-5"
                      />
                      <span>Parking disponible</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={addSpotForm.toilets}
                        onChange={(e) =>
                          setAddSpotForm({
                            ...addSpotForm,
                            toilets: e.target.checked,
                          })
                        }
                        className="w-5 h-5"
                      />
                      <span>Toilettes à proximité</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={addSpotForm.rentals}
                        onChange={(e) =>
                          setAddSpotForm({
                            ...addSpotForm,
                            rentals: e.target.checked,
                          })
                        }
                        className="w-5 h-5"
                      />
                      <span>Location d'équipement</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={addSpotForm.dogs}
                        onChange={(e) =>
                          setAddSpotForm({ ...addSpotForm, dogs: e.target.checked })
                        }
                        className="w-5 h-5"
                      />
                      <span>Chiens autorisés</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-ocean-light hover:bg-ocean text-white font-semibold py-3 rounded transition-colors"
                >
                  <Plus size={20} />
                  Soumettre le Spot
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Side - Map */}
        <div className={`relative bg-gray-200 dark:bg-gray-700 transition-all duration-300 ${
          isPanelOpen ? "w-full lg:w-1/2" : "w-full"
        }`}>
          {/* Toggle Button */}
          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="absolute top-4 left-4 z-10 bg-ocean-dark hover:bg-ocean text-white p-3 rounded-full shadow-lg transition-colors"
          >
            <ChevronLeft
              size={24}
              className={`transition-transform duration-300 ${
                isPanelOpen ? "" : "rotate-180"
              }`}
            />
          </button>

          <InteractiveMap
            onSpotSelect={(spot) => {
              setSelectedSpot(spot);
              setActiveTab("details");
              setIsPanelOpen(true);
            }}
            userLocation={userLocation}
            selectedSpotFromParent={selectedSpot ? {
              latitude: selectedSpot.latitude,
              longitude: selectedSpot.longitude
            } : null}
          />
        </div>
      </div>
    </div>
  );
}
