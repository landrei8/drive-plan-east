import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  showNav?: boolean;
}

export function AppLayout({ children, showNav = true }: AppLayoutProps) {
  return (
    <div className="h-svh bg-background flex flex-col overflow-hidden">
      <main className={cn("flex-1 relative overflow-hidden", showNav && "pb-[calc(var(--bottom-nav-height)+env(safe-area-inset-bottom,0px))]")}>
        {children}
      </main>
      {showNav && <BottomNav />}
    </div>
  );
}
