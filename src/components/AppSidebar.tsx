import { Network, LayoutDashboard, MessageSquare, Settings, HelpCircle, Brain, Radio, Plug, Package } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Agent Network", href: "/network", icon: Network },
  { name: "Memory Graph", href: "/memory", icon: Brain },
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Command Console", href: "/console", icon: MessageSquare },
  { name: "Exhausts", href: "/exhausts", icon: Radio },
  { name: "Marketplace", href: "/marketplace", icon: Plug },
  { name: "My Connectors", href: "/my-connectors", icon: Package },
];

const bottomNav = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Help", href: "/help", icon: HelpCircle },
];

export function AppSidebar() {
  return (
    <div className="flex h-screen w-64 flex-col bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded flex items-center justify-center">
            <div className="w-6 h-6 rounded bg-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground">Atlas Forge</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded px-3 py-2 text-sm font-normal transition-colors",
                isActive
                  ? "bg-sidebar-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-3 space-y-0.5">
        {bottomNav.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded px-3 py-2 text-sm font-normal transition-colors",
                isActive
                  ? "bg-sidebar-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </NavLink>
        ))}
      </div>

      {/* Usage Stats */}
      <div className="border-t border-sidebar-border p-4 space-y-3">
        <div className="text-xs font-semibold text-muted-foreground">Usage</div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Agents</span>
            <span className="text-foreground">5 / 10</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Tasks</span>
            <span className="text-foreground">142 / ∞</span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">Usage will reset Thu Oct 02 2025</div>
      </div>
    </div>
  );
}
