import { useEffect, useRef, useState } from "react";
import ForceGraph3D from "react-force-graph-3d";
import { Button } from "@/components/ui/button";
import { Plus, Play, Pause } from "lucide-react";

type Node = {
  id: string;
  name: string;
  role: string;
  status: "idle" | "working" | "error";
  task?: string;
};

type Link = {
  source: string;
  target: string;
};

const initialNodes: Node[] = [
  { id: "1", name: "Marketing Agent", role: "Marketing", status: "working", task: "Content generation" },
  { id: "2", name: "Sales Agent", role: "Sales", status: "working", task: "Lead qualification" },
  { id: "3", name: "Support Agent", role: "Support", status: "idle" },
  { id: "4", name: "Finance Agent", role: "Finance", status: "working", task: "Revenue tracking" },
  { id: "5", name: "Core Orchestrator", role: "System", status: "working", task: "Managing agents" },
];

const initialLinks: Link[] = [
  { source: "5", target: "1" },
  { source: "5", target: "2" },
  { source: "5", target: "3" },
  { source: "5", target: "4" },
  { source: "1", target: "2" },
  { source: "2", target: "4" },
];

export default function AgentNetwork() {
  const [nodes, setNodes] = useState(initialNodes);
  const [links, setLinks] = useState(initialLinks);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const graphRef = useRef<any>();

  const getNodeColor = (status: string) => {
    switch (status) {
      case "working":
        return "#00d4ff";
      case "error":
        return "#ef4444";
      case "idle":
        return "#6b7280";
      default:
        return "#00d4ff";
    }
  };

  const addNewAgent = () => {
    const newId = (nodes.length + 1).toString();
    const newNode: Node = {
      id: newId,
      name: `Agent ${newId}`,
      role: "Custom",
      status: "idle",
    };
    setNodes([...nodes, newNode]);
    setLinks([...links, { source: "5", target: newId }]);
  };

  return (
    <div className="relative h-screen bg-background">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Agent Network</h1>
            <p className="text-sm text-muted-foreground">Interactive visualization of your AI workforce</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPaused(!isPaused)}
              className="border-border hover:border-atlas-glow/50"
            >
              {isPaused ? <Play className="h-4 w-4 mr-2" /> : <Pause className="h-4 w-4 mr-2" />}
              {isPaused ? "Resume" : "Pause"}
            </Button>
            <Button
              onClick={addNewAgent}
              className="bg-atlas-glow hover:bg-atlas-glow/80 text-primary-foreground"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Agent
            </Button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute top-24 right-6 z-10 bg-card border border-border rounded-xl p-4 space-y-3 w-64">
        <div className="text-sm font-semibold text-foreground">Legend</div>
        <div className="space-y-2 text-xs">
          <div className="space-y-1">
            <div className="text-muted-foreground font-medium">STATISTICS</div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Active agents</span>
              <span className="text-foreground font-medium">{nodes.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Connections</span>
              <span className="text-foreground font-medium">{links.length}</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-muted-foreground font-medium">STATUS</div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-atlas-glow" />
              <span className="text-foreground">Working</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-atlas-idle" />
              <span className="text-foreground">Idle</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-atlas-error" />
              <span className="text-foreground">Error</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Card */}
      {hoveredNode && (
        <div className="absolute top-24 left-6 z-10 bg-card border border-border rounded-xl p-4 space-y-2 w-72 animate-fade-in">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-semibold text-foreground">{hoveredNode.name}</div>
              <div className="text-xs text-muted-foreground">{hoveredNode.role}</div>
            </div>
            <div
              className={`px-2 py-1 rounded text-xs font-medium ${
                hoveredNode.status === "working"
                  ? "bg-atlas-glow/20 text-atlas-glow"
                  : hoveredNode.status === "error"
                  ? "bg-atlas-error/20 text-atlas-error"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {hoveredNode.status}
            </div>
          </div>
          {hoveredNode.task && (
            <div className="text-sm text-foreground">
              <span className="text-muted-foreground">Current task: </span>
              {hoveredNode.task}
            </div>
          )}
        </div>
      )}

      {/* 3D Graph */}
      <ForceGraph3D
        ref={graphRef}
        graphData={{ nodes, links }}
        nodeLabel="name"
        nodeColor={(node: any) => getNodeColor(node.status)}
        nodeRelSize={8}
        linkColor={() => "#00d4ff40"}
        linkWidth={2}
        linkOpacity={0.4}
        onNodeHover={(node: any) => setHoveredNode(node)}
        backgroundColor="#0a0a0a"
        enableNodeDrag={true}
        enableNavigationControls={true}
        showNavInfo={false}
      />
    </div>
  );
}
