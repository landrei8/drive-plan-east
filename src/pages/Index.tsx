import { AppLayout } from "@/components/AppLayout";
import { MapPin, Zap, Fuel, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

const MapPage = () => {
  return (
    <AppLayout>
      <div className="relative h-[calc(100vh-var(--bottom-nav-height))]">
        {/* Map placeholder */}
        <div className="absolute inset-0 bg-surface flex items-center justify-center">
          <div className="text-center space-y-4 p-6">
            <div className="mx-auto w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center glow-primary">
              <MapPin className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-xl font-display font-semibold text-foreground">Interactive Map</h2>
            <p className="text-sm text-muted-foreground max-w-xs">
              Gas stations & EV chargers across Romania, Moldova, and Bulgaria
            </p>
          </div>
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
          <Button size="icon" className="h-12 w-12 rounded-full shadow-lg glow-primary">
            <Navigation className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default MapPage;
