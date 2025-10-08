import { useState } from "react";
import { ForceGraph2DComponent } from "@/components/MemoryGraph/ForceGraph2D";
import { Legend } from "@/components/MemoryGraph/Legend";
import { mockGraphData } from "@/data/mockGraphData";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function MemoryGraph() {
  const [filter, setFilter] = useState("latest");

  return (
    <div className="relative h-screen flex">
      {/* Main Graph Area */}
      <div className="flex-1 relative">
        {/* Top Navigation */}
        <div className="absolute top-0 left-0 right-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
              >
                Overview
              </Button>
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
              >
                Requests
              </Button>
              <Button
                variant="ghost"
                className="bg-muted text-foreground"
              >
                Memory Graph
              </Button>
            </div>
            <Button
              variant="outline"
              className="border-border hover:border-atlas-glow/50 gap-2"
            >
              <span className="text-sm">Latest</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Force Graph 2D */}
        <div className="h-full pt-16">
          <ForceGraph2DComponent data={mockGraphData} />
        </div>

      </div>

      {/* Right Legend Panel */}
      <div className="w-80 border-l border-border">
        <Legend data={mockGraphData} />
      </div>
    </div>
  );
}
