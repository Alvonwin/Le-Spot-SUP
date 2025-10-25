'use client';

import * as React from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTitle,
} from '@/components/layout/app-sidebar';
import type { MapClickEvent } from '@/components/map/interactive-map';
import { Button } from '@/components/ui/button';
import { Bot, Info, List, Plus, X, Crosshair } from 'lucide-react';
import { useTranslation } from '@/context/language-context';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import type { PaddleSpot } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Logo } from '@/components/layout/logo';
import { UserNav } from '@/components/layout/user-nav';
import { useAuth } from '@/lib/auth-provider';
import { getSpots, addSpot } from '@/services/spot-service';
import MapLoader from '@/app/map/_components/map-loader';
import { uploadImageFromDataUri } from '@/services/image-service';
import { useLoading } from '@/context/loading-context';

// Dynamic imports for panels
const AiPanel = React.lazy(() => import('@/components/panels/ai-panel'));
const SpotDetailsPanel = React.lazy(() => import('@/components/panels/spot-details-panel'));
const AddSpotPanel = React.lazy(() => import('@/components/panels/add-spot-panel'));
const SpotListPanel = React.lazy(() => import('@/components/panels/spot-list-panel'));

type Panel = 'list' | 'details' | 'ai' | 'add';
type UserLocation = { latitude: number; longitude: number };
export type NewSpotInfo = {
  latitude: number;
  longitude: number;
  name?: string;
  description?: string;
  suggestedAmenities?: string[];
  imageHint?: string;
  imageDataUri?: string;
}

function HeaderContent() {
  return (
    <div className="flex w-full items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <Logo />
        <SidebarTitle>Le Spot SUP</SidebarTitle>
      </Link>
      <div className="flex items-center gap-2">
        <UserNav />
      </div>
    </div>
  );
}


function MapPageContent() {
  const [activePanel, setActivePanel] = React.useState<Panel>('list');
  const [selectedSpot, setSelectedSpot] = React.useState<PaddleSpot | null>(null);
  const [userLocation, setUserLocation] = React.useState<UserLocation | null>(null);
  const [locationStatus, setLocationStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const { t } = useTranslation();
  const [newSpotInfo, setNewSpotInfo] = React.useState<NewSpotInfo | null>(null);
  const { toast } = useToast();
  const [isGeneratingSpotInfo, setIsGeneratingSpotInfo] = React.useState(false);
  const { user } = useAuth();
  const { setIsLoading: setAppIsLoading } = useLoading();

  const [spots, setSpots] = React.useState<PaddleSpot[]>([]);
  const [isLoadingSpots, setIsLoadingSpots] = React.useState(true);

  const [viewState, setViewState] = React.useState({
    longitude: -73.5, // Default center on Quebec
    latitude: 46.8,
    zoom: 5,
  });

  React.useEffect(() => {
    const isLoading = isLoadingSpots || isGeneratingSpotInfo || locationStatus === 'loading';
    setAppIsLoading(isLoading);
  }, [isLoadingSpots, isGeneratingSpotInfo, locationStatus, setAppIsLoading]);

  const getLocation = React.useCallback(() => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      return;
    }
    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setUserLocation(newLocation);
        setLocationStatus('success');

        if (viewState.zoom < 6) { // Only recenter if map is zoomed out
          setViewState({
              longitude: newLocation.longitude,
              latitude: newLocation.latitude,
              zoom: 11,
          });
        }
      },
      () => {
        setLocationStatus('error');
      }
    );
  }, [viewState.zoom]);

  React.useEffect(() => {
    getLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    async function loadInitialSpots() {
      setIsLoadingSpots(true);
      // Load all spots (localStorage doesn't need distance filtering)
      const allSpots = await getSpots();
      setSpots(allSpots);
      setIsLoadingSpots(false);
    }
    if (locationStatus === 'success' || locationStatus === 'error') {
      loadInitialSpots();
    }
  }, [locationStatus]);


  React.useEffect(() => {
    if (selectedSpot) {
      setViewState(currentViewState => ({
        ...currentViewState,
        longitude: selectedSpot.longitude,
        latitude: selectedSpot.latitude,
        zoom: Math.max(currentViewState.zoom, 12),
      }));
    }
  }, [selectedSpot]);

  const handleRecenter = () => {
    if (userLocation) {
        setViewState({
            longitude: userLocation.longitude,
            latitude: userLocation.latitude,
            zoom: 12,
        });
    } else {
        getLocation();
    }
  }

  const handleSpotSelect = (spot: PaddleSpot | null) => {
    setSelectedSpot(spot);
    if (spot) {
      setActivePanel('details');
    }
  };

  const handlePanelChange = (panel: Panel) => {
    if (panel === 'details' && !selectedSpot) {
      return;
    }
    if (activePanel === 'add' && panel !== 'add') {
      setNewSpotInfo(null);
    }
    setActivePanel(panel);
  }

  const handleMapClick = async (e: MapClickEvent) => {
    if (activePanel === 'add') {
      const { lng, lat } = e.lngLat;
      const coords = { longitude: lng, latitude: lat };

      setNewSpotInfo({ ...coords, name: 'Génération...', description: '' });

      setIsGeneratingSpotInfo(true);
      try {
        const { spotInfoGeneration } = await import('@/ai/flows/spot-info-generation');
        const generatedInfo = await spotInfoGeneration(coords);
        setNewSpotInfo({ ...coords, ...generatedInfo });
      } catch (error) {
        console.error("Erreur de l'IA:", error);
        toast({
          variant: 'destructive',
          title: "Erreur de l'IA",
          description: "Impossible de générer les informations du spot. Veuillez réessayer.",
        });
         setNewSpotInfo(coords);
      } finally {
        setIsGeneratingSpotInfo(false);
      }
    }
  };

  const handleSpotAdded = async (newSpotData: Omit<PaddleSpot, 'id' | 'country' | 'province' | 'image'> & { imageDataUri: string }) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: "Non authentifié",
        description: "Vous devez être connecté pour ajouter un spot.",
      });
      return;
    }
    setIsGeneratingSpotInfo(true);
    try {
      // 1. Upload image to local storage (base64)
      const imageUrl = await uploadImageFromDataUri(newSpotData.imageDataUri, `spots/${Date.now()}.png`);

      // 2. Prepare spot data for local storage
      const spotToSave: PaddleSpot = {
        id: Date.now().toString(),
        name: newSpotData.name,
        description: newSpotData.description,
        latitude: newSpotData.latitude,
        longitude: newSpotData.longitude,
      };

      // 3. Add spot to local storage
      const addedSpot = await addSpot(spotToSave);

      // 4. Update local state and UI
      setSpots(prevSpots => [...prevSpots, addedSpot]);

      toast({
        title: 'Spot Ajouté!',
        description: `${newSpotData.name} a été soumis avec succès.`,
      });

      setSelectedSpot(addedSpot);
      setActivePanel('details');
      setNewSpotInfo(null);
    } catch (error) {
      console.error("Error adding spot:", error);
      toast({
        variant: "destructive",
        title: "Erreur de sauvegarde",
        description: "Le nouveau spot n'a pas pu être sauvegardé.",
      });
    } finally {
      setIsGeneratingSpotInfo(false);
    }
  }


  const renderPanelContent = () => {
    if (isLoadingSpots) {
      return (
        <div className="space-y-4 p-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      );
    }

    const panelComponent = {
      list: <SpotListPanel
              spots={spots}
              onSpotSelect={handleSpotSelect}
              selectedSpot={selectedSpot}
              userLocation={userLocation}
              locationStatus={locationStatus}
              onGetLocation={getLocation}
            />,
      details: selectedSpot ? (
          <ScrollArea className="h-full">
            <SpotDetailsPanel spot={selectedSpot} />
          </ScrollArea>
        ) : (
          <div className="p-4 text-center text-muted-foreground">{t('mapPage.noSpotSelected')}</div>
        ),
      ai: <ScrollArea className="h-full p-4"><AiPanel /></ScrollArea>,
      add: (
          <div className='p-4'>
            <AddSpotPanel
              newSpotInfo={newSpotInfo}
              isGenerating={isGeneratingSpotInfo}
              onSpotAdded={handleSpotAdded}
              centerCoordinates={{ latitude: viewState.latitude ?? 46.8, longitude: viewState.longitude ?? -73.5 }}
            />
          </div>
        ),
    }[activePanel]

    return <React.Suspense fallback={<PanelSkeleton />}>{panelComponent}</React.Suspense>;
  };

  const PanelSkeleton = () => (
     <div className="space-y-4 p-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
    </div>
  )

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <HeaderContent />
          <div className="mt-4 grid grid-cols-4 gap-1">
            <Button
              variant={activePanel === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-auto flex-col gap-1 px-2 py-1"
              onClick={() => handlePanelChange('list')}
            >
              <List /> <span className='text-xs'>{t('mapPage.listPanel')}</span>
            </Button>
            <Button
              variant={activePanel === 'details' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-auto flex-col gap-1 px-2 py-1"
              onClick={() => handlePanelChange('details')}
              disabled={!selectedSpot}
            >
              <Info /> <span className='text-xs'>{t('mapPage.detailsPanel')}</span>
            </Button>
            <Button
              variant={activePanel === 'ai' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-auto flex-col gap-1 px-2 py-1"
              onClick={() => handlePanelChange('ai')}
            >
              <Bot /> <span className='text-xs'>{t('mapPage.aiPanel')}</span>
            </Button>
            <Button
              variant={activePanel === 'add' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-auto flex-col gap-1 px-2 py-1"
              onClick={() => handlePanelChange('add')}
            >
              <Plus /> <span className='text-xs'>{t('mapPage.addPanel')}</span>
            </Button>
          </div>
        </SidebarHeader>
        <SidebarContent>
            {renderPanelContent()}
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="relative h-full w-full">
          <div className='absolute inset-0 bg-secondary'>
             <MapLoader
                spots={spots}
                onSpotSelect={handleSpotSelect}
                selectedSpot={selectedSpot}
                userLocation={userLocation}
                viewState={viewState}
                onMove={evt => setViewState(evt.viewState)}
                onMapClick={handleMapClick}
                isAddingSpot={activePanel === 'add'}
                newSpotCoords={newSpotInfo}
            />
          </div>
          <div className="absolute bottom-4 right-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handleRecenter}
              className="bg-background/80"
              aria-label="Recentrer sur ma position"
            >
              <Crosshair className="h-5 w-5" />
            </Button>
          </div>
          {selectedSpot && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-2 rounded-full bg-background p-2 pr-4 shadow-lg">
                <X
                  className="h-5 w-5 cursor-pointer text-muted-foreground hover:text-foreground"
                  onClick={() => handleSpotSelect(null)}
                />
                <span className="font-medium">{selectedSpot.name}</span>
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
    </>
  );
}


export default function MapContainerWrapper() {
    return (
        <SidebarProvider>
            <MapPageContent />
        </SidebarProvider>
    )
}
