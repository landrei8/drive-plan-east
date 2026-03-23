import { AppLayout } from "@/components/AppLayout";
import { useNavigate } from "react-router-dom";
import {
  Settings,
  LogIn,
  PlusCircle,
  Shield,
  Bell,
  Info,
  ChevronRight,
  User,
} from "lucide-react";

const menuItems = [
  { title: "Sign In / Register", icon: LogIn, path: "/auth", description: "Create account or sign in" },
  { title: "Submit EV Station", icon: PlusCircle, path: "/submit-station", description: "Add a new charging station" },
  { title: "Notifications", icon: Bell, path: "/notifications", description: "Price alerts & station updates" },
  { title: "Settings", icon: Settings, path: "/settings", description: "App preferences & cache" },
  { title: "Admin Panel", icon: Shield, path: "/admin", description: "Manage station approvals" },
  { title: "About", icon: Info, path: "/about", description: "App info & credits" },
];

const MorePage = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="px-4 pt-6 pb-4 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center glow-primary">
            <User className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-foreground">Guest User</h1>
            <p className="text-sm text-muted-foreground">Sign in to unlock all features</p>
          </div>
        </div>

        <div className="space-y-1.5">
          {menuItems.map((item) => (
            <button
              key={item.title}
              onClick={() => navigate(item.path)}
              className="w-full glass rounded-xl p-4 flex items-center gap-4 text-left hover:bg-surface-hover transition-colors"
            >
              <div className="p-2 rounded-lg bg-secondary">
                <item.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default MorePage;
