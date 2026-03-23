import { useLocation, Link } from "react-router-dom";
import { Map, TrendingUp, Wrench, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Map", icon: Map },
  { path: "/prices", label: "Prices", icon: TrendingUp },
  { path: "/utilities", label: "Utilities", icon: Wrench },
  { path: "/more", label: "Other", icon: MoreHorizontal },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50">
      <div className="flex items-center justify-around h-[var(--bottom-nav-height)] max-w-lg mx-auto px-2"
           style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[4rem]",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-lg transition-all duration-200",
                isActive && "bg-primary/15 glow-primary"
              )}>
                <item.icon className="h-5 w-5" />
              </div>
              <span className="text-[0.65rem] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
