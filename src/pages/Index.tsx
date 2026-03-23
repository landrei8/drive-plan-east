import { AppLayout } from "@/components/AppLayout";
import { Zap, Fuel, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import Map from "@/components/Map";

const MapPage = () => {
  return (
    <AppLayout>
      <div className="relative flex-1 min-h-[calc(100vh-var(--bottom-nav-height)-env(safe-area-inset-bottom,0px))]">
        {/* Map area */}
        <div className="absolute inset-0">
          <Map />
        </div>

        {/* Floating filter chips */}
        <div className="absolute top-4 left-4 right-4 flex gap-2 z-10">
          <button className="glass px-4 py-2 rounded-full text-xs font-medium text-foreground flex items-center gap-1.5 hover:bg-surface-hover transition-colors">
            <Fuel className="h-3.5 w-3.5 text-warning" />
            Gas
          </button>
          <button className="glass px-4 py-2 rounded-full text-xs font-medium text-foreground flex items-center gap-1.5 hover:bg-surface-hover transition-colors">
            <Zap className="h-3.5 w-3.5 text-primary" />
            EV
          </button>
        </div>

        {/* Floating locate button */}
        <div className="absolute bottom-6 right-4 z-10">
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
