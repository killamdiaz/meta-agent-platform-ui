import { Network, LayoutDashboard, MessageSquare, Settings, HelpCircle } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Agent Network", href: "/network", icon: Network },
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Command Console", href: "/console", icon: MessageSquare },
];

const bottomNav = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Help", href: "/help", icon: HelpCircle },
];

export function AppSidebar() {
  return (
    <div className="flex h-screen w-64 flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-atlas-glow/20 flex items-center justify-center">
            <div className="w-4 h-4 rounded bg-atlas-glow animate-pulse-glow" />
          </div>
          <span className="text-lg font-semibold text-foreground">Atlas Forge</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-sidebar-accent text-atlas-glow shadow-[0_0_10px_hsl(var(--atlas-glow)/0.3)]"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn("h-5 w-5", isActive && "text-atlas-glow")} />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-border p-3 space-y-1">
        {bottomNav.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-sidebar-accent text-atlas-glow"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </div>

      {/* Usage Stats */}
      <div className="border-t border-border p-4 space-y-2">
        <div className="text-xs text-muted-foreground">Usage</div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Agents</span>
            <span className="text-foreground font-medium">5 / 10</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Tasks</span>
            <span className="text-foreground font-medium">142 / ∞</span>
          </div>
        </div>
      </div>
    </div>
  );
}
