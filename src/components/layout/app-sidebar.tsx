'use client';

import * as React from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ChevronLeft, PanelLeft, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';

type SidebarContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(true);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  React.useEffect(() => {
    setOpen(isDesktop);
  }, [isDesktop]);

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function Sidebar({ children }: { children: React.ReactNode }) {
  const { open, setOpen } = useSidebar();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <aside
        className={cn(
          'relative flex h-screen flex-col border-r bg-card transition-all duration-300 ease-in-out',
          open ? 'w-full max-w-sm' : 'w-0 border-transparent'
        )}
      >
        <Button
          variant="outline"
          size="sm"
          className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 rounded-full h-8 w-8 p-0 bg-background/80"
          onClick={() => setOpen(!open)}
        >
          <ChevronLeft
            className={cn('h-4 w-4 transition-transform', {
              'rotate-180': !open,
            })}
          />
        </Button>
        <div className={cn('flex h-full flex-col overflow-hidden', !open && 'invisible')}>
            {children}
        </div>
      </aside>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="flex w-full max-w-sm flex-col p-0">
        <SheetHeader className="border-b p-4">
            <div className="flex items-center justify-between">
              <SheetTitle>Menu</SheetTitle>
              <SheetClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </SheetClose>
            </div>
        </SheetHeader>
        <SheetDescription className="sr-only">Contient les principaux contrôles de navigation et d'interaction de la carte.</SheetDescription>
        <div className="flex-1 overflow-hidden">
            {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function SidebarInset({ children }: { children: React.ReactNode }) {
  const { open, setOpen } = useSidebar();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <main className="relative flex-1">
      <div className="absolute left-4 top-4 z-10">
        {!isDesktop && !open && (
          <Button
            variant="outline"
            size="sm"
            className="bg-background/80"
            onClick={() => setOpen(true)}
          >
            <PanelLeft className="mr-2 h-4 w-4" />
            Menu
          </Button>
        )}
      </div>

      {children}
    </main>
  );
}


export function SidebarHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('shrink-0 border-b p-4', className)} {...props} />;
}

export function SidebarTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn('text-lg font-semibold tracking-tight', className)}
      {...props}
    />
  );
}

export function SidebarContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('h-full overflow-y-auto', className)}
      {...props}
    />
  );
}
