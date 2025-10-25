'use client';

import Map, { Marker, ViewState, MapEvent } from 'react-map-gl/maplibre';
import { MapPin, User as UserIcon, Pin } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as React from 'react';
import type { PaddleSpot } from '@/lib/types';

export type MapClickEvent = MapEvent<MouseEvent> & {
  lngLat: {
    lng: number;
    lat: number;
  };
};
interface InteractiveMapProps {
  spots: PaddleSpot[];
  selectedSpot: PaddleSpot | null;
  onSpotSelect: (spot: PaddleSpot | null) => void;
  userLocation: { latitude: number; longitude: number } | null;
  viewState: Partial<ViewState>;
  onMove: (evt: { viewState: ViewState }) => void;
  onMapClick?: (e: MapClickEvent) => void;
  isAddingSpot?: boolean;
  newSpotCoords: { latitude: number; longitude: number } | null;
}

export default function InteractiveMap({
  spots,
  selectedSpot,
  onSpotSelect,
  userLocation,
  viewState,
  onMove,
  onMapClick,
  isAddingSpot = false,
  newSpotCoords
}: InteractiveMapProps) {

  return (
    <Map
      {...viewState}
      onMove={onMove}
      onClick={onMapClick}
      style={{ width: '100%', height: '100%' }}
      mapStyle="https://demotiles.maplibre.org/style.json"
      attributionControl={false}
      cursor={isAddingSpot ? 'crosshair' : 'grab'}
    >
      {spots.map((spot) => (
        <Marker
          key={spot.id}
          longitude={spot.longitude}
          latitude={spot.latitude}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            onSpotSelect(spot);
          }}
        >
          <MapPin
            className={cn(
              'h-8 w-8 cursor-pointer transition-colors duration-200',
              selectedSpot?.id === spot.id
                ? 'text-accent fill-accent/30'
                : 'text-primary fill-primary/20 hover:text-accent'
            )}
          />
        </Marker>
      ))}

      {userLocation && (
        <Marker
          longitude={userLocation.longitude}
          latitude={userLocation.latitude}
          anchor="bottom"
        >
          <div className="flex flex-col items-center">
            <UserIcon className="h-6 w-6 rounded-full bg-blue-500 p-1 text-white shadow" />
            <div className="h-2 w-2 animate-ping rounded-full bg-blue-500" />
          </div>
        </Marker>
      )}

      {newSpotCoords && (
        <Marker
          longitude={newSpotCoords.longitude}
          latitude={newSpotCoords.latitude}
          anchor="bottom"
        >
          <Pin className="h-8 w-8 text-green-500 fill-green-500/30" />
        </Marker>
      )}
    </Map>
  );
}
