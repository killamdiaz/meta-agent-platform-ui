import { ArrowUp, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

const stats = [
  { label: "Active Agents", value: "5", change: "+100%", limit: "10" },
  { label: "Tasks Completed", value: "142", change: "+100%", limit: "∞" },
  { label: "Revenue Tracked", value: "$12.4K", change: "+100%", limit: "$50K/mo" },
  { label: "Uptime", value: "99.9%", change: "+0.1%", limit: "99.99%" },
];

export default function Overview() {
  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Overview</h1>
        <p className="text-muted-foreground">Monitor your AI workforce performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="bg-card border-border p-6 hover:border-atlas-glow/50 transition-all duration-300"
          >
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">{stat.label}</div>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="flex items-center text-xs text-atlas-success">
                  <ArrowUp className="h-3 w-3" />
                  {stat.change}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {stat.limit}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Token Usage Chart */}
        <Card className="bg-card border-border p-6 lg:col-span-2">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Agent Activity</h3>
              <p className="text-sm text-muted-foreground">Tasks processed over the last 7 days</p>
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {[12, 19, 25, 29, 20, 24, 32].map((value, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-atlas-glow rounded-t transition-all hover:bg-atlas-glow/80"
                    style={{ height: `${(value / 35) * 100}%` }}
                  />
                  <div className="text-xs text-muted-foreground">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Agent Distribution */}
        <Card className="bg-card border-border p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Agent Types</h3>
              <p className="text-sm text-muted-foreground">Distribution by role</p>
            </div>
            <div className="space-y-3">
              {[
                { name: "Marketing", count: 2, color: "bg-blue-500" },
                { name: "Sales", count: 1, color: "bg-green-500" },
                { name: "Support", count: 1, color: "bg-purple-500" },
                { name: "Finance", count: 1, color: "bg-yellow-500" },
              ].map((type) => (
                <div key={type.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">{type.name}</span>
                    <span className="text-muted-foreground">{type.count}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${type.color} rounded-full transition-all`}
                      style={{ width: `${(type.count / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-card border-border p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Recent Tasks</h3>
              <p className="text-sm text-muted-foreground">Latest agent activities</p>
            </div>
            <button className="text-sm text-atlas-glow hover:underline">View all</button>
          </div>
          <div className="space-y-3">
            {[
              { agent: "Marketing Agent", task: "Generated social media content", time: "2m ago", status: "success" },
              { agent: "Sales Agent", task: "Qualified 3 new leads", time: "15m ago", status: "success" },
              { agent: "Support Agent", task: "Resolved customer inquiry", time: "1h ago", status: "success" },
              { agent: "Finance Agent", task: "Updated revenue dashboard", time: "2h ago", status: "success" },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="w-2 h-2 rounded-full bg-atlas-success animate-pulse-glow" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">{activity.task}</div>
                  <div className="text-xs text-muted-foreground">{activity.agent}</div>
                </div>
                <div className="text-xs text-muted-foreground">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
