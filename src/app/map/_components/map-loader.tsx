'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

function MapSkeleton() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted">
       <Skeleton className="h-full w-full" />
    </div>
  );
}

const InteractiveMap = dynamic(() => import('@/components/map/interactive-map'), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

export default InteractiveMap;
