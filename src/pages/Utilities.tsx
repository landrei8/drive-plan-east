import { AppLayout } from "@/components/AppLayout";
import { Calculator, Route, Clock, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const utilities = [
  {
    title: "Trip Cost Calculator",
    description: "Estimate fuel cost for your trip",
    icon: Calculator,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Route Planner",
    description: "Find cheapest stations on your route",
    icon: Route,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    title: "Price History",
    description: "Track price changes over time",
    icon: Clock,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    title: "Favorite Stations",
    description: "Quick access to your saved stations",
    icon: Star,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

const UtilitiesPage = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="px-4 pt-6 pb-4 space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Utilities</h1>
          <p className="text-sm text-muted-foreground mt-1">Tools to help you save on fuel</p>
        </div>

        <div className="grid gap-3">
          {utilities.map((util) => (
            <button
              key={util.title}
              className="glass rounded-xl p-4 flex items-center gap-4 text-left hover:bg-surface-hover transition-colors"
            >
              <div className={`p-3 rounded-xl ${util.bgColor}`}>
                <util.icon className={`h-6 w-6 ${util.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{util.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{util.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default UtilitiesPage;
