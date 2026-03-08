"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CheckSquare, Calendar, Settings } from "lucide-react";
import { cn } from "@/utils/cn";
import { paths } from "@/config/paths";
import type { ReactNode } from "react";

const navItems = [
  { href: paths.app.dashboard.getHref(), label: "Dashboard", icon: Home },
  { href: paths.app.tasks.getHref(), label: "Tasks", icon: CheckSquare },
  { href: paths.app.calendar.getHref(), label: "Calendar", icon: Calendar },
  { href: paths.app.settings.getHref(), label: "Settings", icon: Settings },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden w-60 border-r border-border bg-background md:block">
        <div className="p-6">
          <h1 className="font-display text-xl text-foreground">HomeBase</h1>
        </div>
        <nav className="px-3">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1">
        {/* Mobile header */}
        <header className="flex items-center justify-between border-b border-border px-4 py-3 md:hidden">
          <h1 className="font-display text-lg text-foreground">HomeBase</h1>
        </header>

        <div className="p-6">{children}</div>

        {/* Mobile bottom nav */}
        <nav className="fixed bottom-0 left-0 right-0 flex border-t border-border bg-background md:hidden">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 py-2 text-xs",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </main>
    </div>
  );
}
