import { AppLayout } from "@/components/AppLayout";
import { ArrowLeft, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface DebugItem {
  label: string;
  status: "ok" | "error" | "loading" | "unknown";
  value: string;
}

const DebugPage = () => {
  const navigate = useNavigate();
  const [checks, setChecks] = useState<DebugItem[]>([]);

  useEffect(() => {
    const runChecks = async () => {
      const results: DebugItem[] = [];

      // Build number
      results.push({
        label: "Build Version",
        status: "ok",
        value: "1.0.0-beta",
      });

      // Notification permission
      if ('Notification' in window) {
        const perm = Notification.permission;
        results.push({
          label: "Notifications",
          status: perm === "granted" ? "ok" : perm === "denied" ? "error" : "unknown",
          value: perm,
        });
      } else {
        results.push({ label: "Notifications", status: "error", value: "Not supported" });
      }

      // Location
      try {
        const permStatus = await navigator.permissions.query({ name: "geolocation" });
        results.push({
          label: "Location",
          status: permStatus.state === "granted" ? "ok" : permStatus.state === "denied" ? "error" : "unknown",
          value: permStatus.state,
        });
      } catch {
        results.push({ label: "Location", status: "unknown", value: "Unknown" });
      }

      // Service Worker
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        results.push({
          label: "Service Worker",
          status: regs.length > 0 ? "ok" : "unknown",
          value: regs.length > 0 ? "Active" : "Not registered",
        });
      } else {
        results.push({ label: "Service Worker", status: "error", value: "Not supported" });
      }

      // PWA mode
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
      results.push({
        label: "PWA Mode",
        status: isStandalone ? "ok" : "unknown",
        value: isStandalone ? "Standalone" : "Browser",
      });

      // Online status
      results.push({
        label: "Network",
        status: navigator.onLine ? "ok" : "error",
        value: navigator.onLine ? "Online" : "Offline",
      });

      // User agent
      results.push({
        label: "Platform",
        status: "ok",
        value: /Android/i.test(navigator.userAgent) ? "Android" : /iPhone|iPad/i.test(navigator.userAgent) ? "iOS" : "Desktop",
      });

      setChecks(results);
    };

    runChecks();
  }, []);

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === "ok") return <CheckCircle2 className="h-5 w-5 text-primary" />;
    if (status === "error") return <XCircle className="h-5 w-5 text-destructive" />;
    if (status === "loading") return <Loader2 className="h-5 w-5 text-accent animate-spin" />;
    return <div className="h-5 w-5 rounded-full bg-warning/50" />;
  };

  return (
    <AppLayout>
      <div className="px-4 pt-6 pb-4 space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-xl font-display font-bold text-foreground">Debug Info</h1>
        </div>

        <div className="space-y-2">
          {checks.map((check) => (
            <div key={check.label} className="glass rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StatusIcon status={check.status} />
                <span className="text-sm font-medium text-foreground">{check.label}</span>
              </div>
              <span className="text-xs text-muted-foreground font-mono">{check.value}</span>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default DebugPage;
