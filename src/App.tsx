import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PWAInstallBanner } from "@/components/PWAInstallBanner";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PricesPage from "./pages/Prices";
import UtilitiesPage from "./pages/Utilities";
import MorePage from "./pages/More";
import SettingsPage from "./pages/Settings";
import DebugPage from "./pages/Debug";
import AuthPage from "./pages/Auth";
import AdminPage from "./pages/Admin";
import SubmitStationPage from "./pages/SubmitStation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <PWAInstallBanner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/prices" element={<PricesPage />} />
          <Route path="/utilities" element={<UtilitiesPage />} />
          <Route path="/more" element={<MorePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/debug" element={<DebugPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/submit-station" element={<SubmitStationPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
