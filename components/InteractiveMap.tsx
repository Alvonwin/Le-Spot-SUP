"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import Map, { Marker, Popup } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapPin, Navigation } from "lucide-react";
import { spots as spotsData, SpotData } from "@/lib/spots-data";

type Spot = SpotData & {
  id: number;
  name: string;
  location: string;
  distance: number;
  description?: string;
  amenities?: string[];
  rating?: string;
};

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

export default function InteractiveMap({
  onSpotSelect,
  userLocation,
  selectedSpotFromParent
}: {
  onSpotSelect?: (spot: Spot) => void;
  userLocation?: { latitude: number; longitude: number } | null;
  selectedSpotFromParent?: { latitude: number; longitude: number } | null;
}) {
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [viewState, setViewState] = useState({
    latitude: 46.8,
    longitude: -71.2,
    zoom: 6,
  });

  // Convert imported spots to component format with calculated distances
  const spots: Spot[] = useMemo(() => {
    return spotsData.map((spot, index) => ({
      ...spot,
      id: index + 1,
      name: spot.nom,
      location: spot.adresse,
      distance: userLocation
        ? calculateDistance(userLocation.latitude, userLocation.longitude, spot.latitude, spot.longitude)
        : 0,
      description: spot.type,
      amenities: [],
      rating: spot.note,
    }));
  }, [userLocation]);

  // Zoom to user location when it changes
  useEffect(() => {
    if (userLocation) {
      setViewState({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        zoom: 14,
      });
    }
  }, [userLocation]);

  // Zoom to selected spot when it changes
  useEffect(() => {
    if (selectedSpotFromParent) {
      setViewState({
        latitude: selectedSpotFromParent.latitude,
        longitude: selectedSpotFromParent.longitude,
        zoom: 13,
      });
    }
  }, [selectedSpotFromParent]);

  const handleMarkerClick = useCallback((spot: Spot) => {
    setSelectedSpot(spot);
    if (onSpotSelect) {
      onSpotSelect(spot);
    }
  }, [onSpotSelect]);

  return (
    <div className="w-full h-full">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`}
        style={{ width: "100%", height: "100%" }}
      >
        {spots.map((spot) => (
          <Marker
            key={spot.id}
            latitude={spot.latitude}
            longitude={spot.longitude}
            anchor="bottom"
          >
            <button
              onClick={() => handleMarkerClick(spot)}
              className="transform hover:scale-110 transition-transform"
            >
              <div className="relative">
                <MapPin
                  size={40}
                  className="text-ocean fill-ocean-light drop-shadow-lg"
                />
              </div>
            </button>
          </Marker>
        ))}

        {/* User Location Marker */}
        {userLocation && (
          <Marker
            latitude={userLocation.latitude}
            longitude={userLocation.longitude}
            anchor="center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75" style={{ width: '40px', height: '40px', marginLeft: '-20px', marginTop: '-20px' }} />
              <Navigation
                size={40}
                className="text-blue-600 fill-blue-400 drop-shadow-lg relative z-10"
              />
            </div>
          </Marker>
        )}

        {selectedSpot && (
          <Popup
            latitude={selectedSpot.latitude}
            longitude={selectedSpot.longitude}
            anchor="top"
            onClose={() => setSelectedSpot(null)}
            closeButton={true}
            closeOnClick={false}
            className="min-w-[250px] max-w-[350px]"
          >
            <div className="p-2">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-lg">{selectedSpot.name}</h3>
                {selectedSpot.rating && (
                  <div className="flex items-center gap-1 bg-yellow-100 px-2 py-0.5 rounded">
                    <span className="text-yellow-600">⭐</span>
                    <span className="text-xs font-semibold text-gray-800">{selectedSpot.rating}</span>
                  </div>
                )}
              </div>

              {selectedSpot.description && (
                <p className="text-sm mb-1 text-ocean">
                  <span className="font-semibold">Type:</span> {selectedSpot.description}
                </p>
              )}

              <p className="text-xs text-gray-600 mb-2">{selectedSpot.location}</p>

              <p className="text-xs text-gray-500 mb-2">
                📍 GPS: {selectedSpot.latitude.toFixed(4)}, {selectedSpot.longitude.toFixed(4)}
              </p>

              {selectedSpot.photoURL && (
                <div className="mb-2 rounded overflow-hidden">
                  <img
                    src={selectedSpot.photoURL}
                    alt={selectedSpot.name}
                    className="w-full h-24 object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {selectedSpot.notes && selectedSpot.notes.trim() !== "" && selectedSpot.notes !== "Ce lieu n'existe plus" && (
                <div className="text-sm mb-2 p-2 bg-ocean-light/10 rounded">
                  <p className="text-gray-800 whitespace-pre-line line-clamp-3">{selectedSpot.notes}</p>
                </div>
              )}

              {selectedSpot.amenities && selectedSpot.amenities.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {selectedSpot.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="text-xs bg-ocean-light text-white px-2 py-1 rounded"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-500 mt-2">
                à {selectedSpot.distance} km
              </p>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
