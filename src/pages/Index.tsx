import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Zap, Fuel, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import Map from "@/components/Map";
import { cn } from "@/lib/utils";

const MapPage = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'gas' | 'ev'>('all');

  return (
    <AppLayout>
      <div className="relative h-full w-full">
        {/* Map area */}
        <Map filter={activeFilter} />

        {/* Floating filter chips */}
        <div className="absolute top-4 left-4 right-4 flex gap-2 z-[400]">
          <button 
            onClick={() => setActiveFilter(activeFilter === 'gas' ? 'all' : 'gas')}
            className={cn(
              "glass px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all",
              activeFilter === 'gas' ? "bg-warning text-warning-foreground border-warning" : "text-foreground hover:bg-surface-hover"
            )}
          >
            <Fuel className={cn("h-3.5 w-3.5", activeFilter === 'gas' ? "text-warning-foreground" : "text-warning")} />
            Gas
          </button>
          <button 
            onClick={() => setActiveFilter(activeFilter === 'ev' ? 'all' : 'ev')}
            className={cn(
              "glass px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all",
              activeFilter === 'ev' ? "bg-primary text-primary-foreground border-primary" : "text-foreground hover:bg-surface-hover"
            )}
          >
            <Zap className={cn("h-3.5 w-3.5", activeFilter === 'ev' ? "text-primary-foreground" : "text-primary")} />
            EV
          </button>
        </div>

        {/* Floating locate button */}
        <div className="absolute bottom-6 right-4 z-[400]">
          <Button 
            size="icon" 
            className="h-12 w-12 rounded-full shadow-lg glow-primary"
          >
            <Navigation className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default MapPage;
