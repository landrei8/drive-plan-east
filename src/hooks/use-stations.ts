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

const MOCK_STATIONS: Station[] = [
  {
    id: "ro-1",
    name: "Petrom Virtutii",
    brand: "Petrom",
    address: "Soseaua Virtutii 14, București",
    latitude: 44.4355,
    longitude: 26.0355,
    country: "Romania",
    type: 'gas',
    prices: [
      { id: "p1", fuel_type: "gasoline_95", price: 7.12, currency: "RON" },
      { id: "p2", fuel_type: "diesel", price: 7.25, currency: "RON" }
    ]
  },
  {
    id: "ro-2",
    name: "Tesla Supercharger",
    address: "Calea Floreasca 246, București",
    latitude: 44.4788,
    longitude: 26.1055,
    country: "Romania",
    type: 'ev',
    prices: [
      { id: "p3", charge_type: "dc_ultra", price_per_kwh: 2.85, currency: "RON" }
    ]
  },
  {
    id: "bg-1",
    name: "Shell Sofia Center",
    brand: "Shell",
    address: "bul. Knyaz Dondukov 2, Sofia",
    latitude: 42.6977,
    longitude: 23.3219,
    country: "Bulgaria",
    type: 'gas',
    prices: [
      { id: "p4", fuel_type: "gasoline_95", price: 2.65, currency: "BGN" },
      { id: "p5", fuel_type: "diesel", price: 2.72, currency: "BGN" }
    ]
  },
  {
    id: "md-1",
    name: "Lukoil Chisinau",
    brand: "Lukoil",
    address: "Strada Mihai Viteazul 1, Chișinău",
    latitude: 47.0311,
    longitude: 28.8211,
    country: "Moldova",
    type: 'gas',
    prices: [
      { id: "p6", fuel_type: "gasoline_95", price: 24.85, currency: "MDL" },
      { id: "p7", fuel_type: "diesel", price: 21.40, currency: "MDL" }
    ]
  }
];

export const useStations = () => {
  return useQuery({
    queryKey: ["stations"],
    queryFn: async () => {
      try {
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

        const allStations = [...formattedGas, ...formattedEv];
        
        // If DB is empty, return mock data for demo
        return allStations.length > 0 ? allStations as Station[] : MOCK_STATIONS;
      } catch (error) {
        console.error("Error fetching stations:", error);
        return MOCK_STATIONS; // Fallback to mock data on error too
      }
    },
  });
};
