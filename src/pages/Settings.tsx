import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { ArrowLeft, Trash2, Bug, ChevronRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const SettingsPage = () => {
  const navigate = useNavigate();
  const [clearing, setClearing] = useState(false);

  const clearCache = async () => {
    try {
      setClearing(true);
      toast.loading("Clearing data...", { id: "clear-cache" });
      
      // Clear caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      
      // Give it a tiny bit of time for effect and reliability
      await new Promise(resolve => setTimeout(resolve, 800));

      // Clear localStorage
      localStorage.clear();
      // Clear sessionStorage
      sessionStorage.clear();
      
      // Unregister service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(r => r.unregister()));
      }
      
      toast.success("Cache & data cleared successfully", { id: "clear-cache" });
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setClearing(false);
      toast.error("Failed to clear cache", { id: "clear-cache" });
    }
  };

  return (
    <AppLayout>
      <div className="px-4 pt-6 pb-4 space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-xl font-display font-bold text-foreground">Settings</h1>
        </div>

        <div className="space-y-3">
          {/* Clear cache */}
          <button
            disabled={clearing}
            onClick={clearCache}
            className="w-full glass rounded-xl p-4 flex items-center gap-4 text-left hover:bg-surface-hover transition-colors disabled:opacity-70"
          >
            <div className="p-2 rounded-lg bg-destructive/10">
              {clearing ? (
                <Loader2 className="h-5 w-5 text-destructive animate-spin" />
              ) : (
                <Trash2 className="h-5 w-5 text-destructive" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                {clearing ? "Clearing..." : "Clear Cache & Data"}
              </p>
              <p className="text-xs text-muted-foreground">Force refresh all app data</p>
            </div>
          </button>

          {/* Debug */}
          <button
            onClick={() => navigate("/debug")}
            className="w-full glass rounded-xl p-4 flex items-center gap-4 text-left hover:bg-surface-hover transition-colors"
          >
            <div className="p-2 rounded-lg bg-accent/10">
              <Bug className="h-5 w-5 text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Debug Info</p>
              <p className="text-xs text-muted-foreground">Check permissions & app status</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
