import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Station = {
  id: string;
  name: string;
  brand?: string | null;
  address: string;
  latitude: number;
  longitude: number;
  country: string;
  type: 'gas' | 'ev';
  prices: any[];
};

export const useStations = () => {
  return useQuery({
    queryKey: ["stations"],
    queryFn: async () => {
      // Fetch Gas Stations
      const { data: gasStations, error: gasError } = await supabase
        .from("gas_stations")
        .select(`
          *,
          fuel_prices (*)
        `);

      if (gasError) throw gasError;

      // Fetch EV Stations
      const { data: evStations, error: evError } = await supabase
        .from("ev_stations")
        .select(`
          *,
          ev_prices (*)
        `)
        .eq('status', 'approved');

      if (evError) throw evError;

      const formattedGas = (gasStations || []).map(s => ({
        ...s,
        type: 'gas' as const,
        prices: s.fuel_prices || []
      }));

      const formattedEv = (evStations || []).map(s => ({
        ...s,
        type: 'ev' as const,
        prices: s.ev_prices || []
      }));

      return [...formattedGas, ...formattedEv] as Station[];
    },
  });
};
