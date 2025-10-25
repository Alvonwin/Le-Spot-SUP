
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import MapLoader from './_components/map-loader';
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset } from '@/components/layout/app-sidebar';
import { Logo } from '@/components/layout/logo';
import { SidebarTitle } from '@/components/layout/app-sidebar';
import MapContainer from '@/components/map-container';

export default function MapPage() {
  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <MapContainer />
    </div>
  );
}
