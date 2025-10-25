'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getDistance } from '@/lib/utils';
import { Dog, Loader2, MapPin, ParkingCircle, Search, Waves, ArrowUpDown, Filter, BetweenHorizontalStart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/context/language-context';
import type { PaddleSpot } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface SpotListPanelProps {
  spots: PaddleSpot[];
  onSpotSelect: (spot: PaddleSpot) => void;
  selectedSpot: PaddleSpot | null;
  userLocation: { latitude: number; longitude: number } | null;
  locationStatus: 'idle' | 'loading' | 'success' | 'error';
  onGetLocation: () => void;
}

type SortedSpot = PaddleSpot & { distance: number | null };
type SortByType = 'distance' | 'name';

const amenityIcons: Record<string, React.ElementType> = {
  parking: ParkingCircle,
  restrooms: BetweenHorizontalStart,
  rentals: Waves,
  dog_friendly: Dog,
};

const amenityOptions = [
  { id: 'parking', label: 'Parking', icon: 'parking' },
  { id: 'restrooms', label: 'Toilettes', icon: 'restrooms' },
  { id: 'rentals', label: 'Location', icon: 'rentals' },
  { id: 'dog_friendly', label: 'Chiens admis', icon: 'dog_friendly' },
] as const;


export default function SpotListPanel({ spots, onSpotSelect, selectedSpot, userLocation, locationStatus, onGetLocation }: SpotListPanelProps) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('');
  const [amenityFilters, setAmenityFilters] = useState<string[]>([]);
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [provinceFilter, setProvinceFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortByType>('distance');

  // Country filter removed - not in PaddleSpot type
  const countries = useMemo(() => {
    return ['all'];
  }, [spots]);

  // Province filter removed - not in PaddleSpot type
  const provinces = useMemo(() => {
    return ['all'];
  }, [spots, countryFilter]);

  useMemo(() => {
    // Reset province filter when country changes
    setProvinceFilter('all');
  }, [countryFilter]);

  const sortedSpots = useMemo(() => {
    const spotsWithDistance: SortedSpot[] = spots.map(spot => ({
      ...spot,
      distance: userLocation
        ? getDistance(userLocation.latitude, userLocation.longitude, spot.latitude, spot.longitude)
        : null,
    }));

    spotsWithDistance.sort((a, b) => {
      if (sortBy === 'distance' && a.distance !== null && b.distance !== null) {
        return a.distance - b.distance;
      }
      return a.name.localeCompare(b.name);
    });

    return spotsWithDistance;
  }, [spots, userLocation, sortBy]);


  const activeFilterCount = useMemo(() => {
    let count = amenityFilters.length;
    if (countryFilter !== 'all') count++;
    if (provinceFilter !== 'all') count++;
    return count;
  }, [amenityFilters, countryFilter, provinceFilter]);


  const filteredSpots = useMemo(() => {
    return sortedSpots.filter(spot => {
      const nameMatch = spot.name.toLowerCase().includes(filter.toLowerCase());
      // Amenities, country, and province filters removed - not in PaddleSpot type
      return nameMatch;
    });
  }, [sortedSpots, filter, amenityFilters, countryFilter, provinceFilter]);

  const handleAmenityChange = (amenityId: string) => {
    setAmenityFilters(prev =>
      prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-4 p-4 pt-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t('spotListPanel.filterPlaceholder')}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-9"
          />
        </div>

         <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex-1 relative">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtrer &amp; Trier
                  {activeFilterCount > 0 && (
                    <Badge variant="secondary" className="absolute -top-2 -right-2 h-5 w-5 justify-center rounded-full p-0">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="start">
                <DropdownMenuLabel>Trier par</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={sortBy} onValueChange={(value) => setSortBy(value as SortByType)}>
                    <DropdownMenuRadioItem value="distance" disabled={locationStatus !== 'success'}>
                      Distance
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="name">
                      Nom (A-Z)
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>

                <DropdownMenuSeparator />

                <DropdownMenuLabel>Filtrer par</DropdownMenuLabel>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Pays</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuRadioGroup value={countryFilter} onValueChange={setCountryFilter}>
                        {countries.map(country => (
                          <DropdownMenuRadioItem key={country} value={country}>
                            {country === 'all' ? 'Tous les pays' : country}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger disabled={provinces.length <= 2}>Province/Région</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuRadioGroup value={provinceFilter} onValueChange={setProvinceFilter}>
                        {provinces.map(province => (
                          <DropdownMenuRadioItem key={province} value={province}>
                            {province === 'all' ? 'Toutes' : province}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuSeparator />
                 <DropdownMenuLabel>Commodités</DropdownMenuLabel>
                {amenityOptions.map(amenity => {
                  const Icon = amenityIcons[amenity.icon];
                  return (
                    <DropdownMenuItem key={amenity.id} onSelect={(e) => e.preventDefault()}>
                        <Checkbox
                          id={`amenity-${amenity.id}`}
                          className="mr-2"
                          onCheckedChange={() => handleAmenityChange(amenity.id)}
                          checked={amenityFilters.includes(amenity.id)}
                        />
                        <Label htmlFor={`amenity-${amenity.id}`} className="flex items-center gap-1.5 text-sm font-normal cursor-pointer">
                          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                          {amenity.label}
                        </Label>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
        </div>


        {locationStatus !== 'success' && (
          <div className='mt-2'>
            <Button onClick={onGetLocation} disabled={locationStatus === 'loading'} className='w-full'>
              {locationStatus === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('spotListPanel.sortByDistance')}
            </Button>
             {locationStatus === 'error' && (
                <p className="mt-2 text-xs text-destructive">{t('spotListPanel.locationError')}</p>
             )}
          </div>
        )}
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-2 px-4 pb-4">
          {filteredSpots.map(spot => (
            <button
              key={spot.id}
              onClick={() => onSpotSelect(spot)}
              className={cn(
                "flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors",
                selectedSpot?.id === spot.id
                  ? "border-primary bg-secondary"
                  : "hover:bg-secondary/50"
              )}
            >
              <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
              <div className="flex-1">
                <p className="font-semibold">{spot.name}</p>
                <p className='text-xs text-muted-foreground'>{spot.description || 'Spot de paddle'}</p>
                {spot.distance !== null && (
                  <p className="text-sm text-muted-foreground">
                    {t('spotListPanel.distanceAway')} {spot.distance.toFixed(1)} km
                  </p>
                )}
              </div>
            </button>
          ))}
           {filteredSpots.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              <p>Aucun spot ne correspond à vos critères.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
