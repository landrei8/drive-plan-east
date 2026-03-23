import { usePWAInstall } from "@/hooks/use-pwa-install";
import { Download, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function PWAInstallBanner() {
  const { isInstallable, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  if (!isInstallable || dismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] glass border-b border-primary/30 animate-slide-up">
      <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Download className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Install FuelFlow</p>
            <p className="text-xs text-muted-foreground">Get the full app experience</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={install} className="h-8 text-xs">
            Install
          </Button>
          <button onClick={() => setDismissed(true)} className="text-muted-foreground hover:text-foreground p-1">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
