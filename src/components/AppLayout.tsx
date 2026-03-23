import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  showNav?: boolean;
}

export function AppLayout({ children, showNav = true }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className={showNav ? "flex-1 safe-bottom" : "flex-1"}>
        {children}
      </main>
      {showNav && <BottomNav />}
    </div>
  );
}
