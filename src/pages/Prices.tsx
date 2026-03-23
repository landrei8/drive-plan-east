import { AppLayout } from "@/components/AppLayout";
import { TrendingUp, TrendingDown, Fuel, Zap } from "lucide-react";

const fuelTypes = [
  { name: "Gasoline 95", price: "6.85", unit: "RON/L", trend: "up", change: "+0.12" },
  { name: "Gasoline 98", price: "7.42", unit: "RON/L", trend: "down", change: "-0.05" },
  { name: "Diesel", price: "7.15", unit: "RON/L", trend: "up", change: "+0.08" },
  { name: "LPG", price: "3.45", unit: "RON/L", trend: "down", change: "-0.03" },
];

const evPrices = [
  { name: "AC Charging", price: "1.20", unit: "RON/kWh", trend: "down", change: "-0.10" },
  { name: "DC Fast", price: "2.85", unit: "RON/kWh", trend: "up", change: "+0.15" },
];

const countries = ["Romania", "Moldova", "Bulgaria"];

const PricesPage = () => {
  return (
    <AppLayout>
      <div className="px-4 pt-6 pb-4 space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Average Prices</h1>
          <p className="text-sm text-muted-foreground mt-1">Updated daily across all stations</p>
        </div>

        {/* Country selector */}
        <div className="flex gap-2">
          {countries.map((country, i) => (
            <button
              key={country}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                i === 0
                  ? "bg-primary text-primary-foreground"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              {country}
            </button>
          ))}
        </div>

        {/* Fuel prices */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Fuel className="h-4 w-4 text-warning" />
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Fuel Prices</h2>
          </div>
          <div className="grid gap-3">
            {fuelTypes.map((fuel) => (
              <div key={fuel.name} className="glass rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{fuel.name}</p>
                  <p className="text-xs text-muted-foreground">{fuel.unit}</p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <span className={`text-xs flex items-center gap-0.5 ${
                    fuel.trend === "up" ? "text-destructive" : "text-primary"
                  }`}>
                    {fuel.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {fuel.change}
                  </span>
                  <span className="text-lg font-display font-bold text-foreground">{fuel.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* EV prices */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">EV Charging</h2>
          </div>
          <div className="grid gap-3">
            {evPrices.map((ev) => (
              <div key={ev.name} className="glass rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{ev.name}</p>
                  <p className="text-xs text-muted-foreground">{ev.unit}</p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <span className={`text-xs flex items-center gap-0.5 ${
                    ev.trend === "up" ? "text-destructive" : "text-primary"
                  }`}>
                    {ev.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {ev.change}
                  </span>
                  <span className="text-lg font-display font-bold text-foreground">{ev.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default PricesPage;
