import { useRef, useState, useCallback } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { GraphData, GraphNode as GraphNodeType } from "@/types/graph";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

interface ForceGraph2DProps {
  data: GraphData;
}

export function ForceGraph2DComponent({ data }: ForceGraph2DProps) {
  const fgRef = useRef<any>();
  const [hoveredNode, setHoveredNode] = useState<GraphNodeType | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNodeType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const getNodeColor = (node: GraphNodeType) => {
    if (node.status === "forgotten") return "#ef4444";
    if (node.status === "expiring") return "#f59e0b";
    if (node.status === "new") return "#a78bfa";
    if (node.status === "older") return "#34d399";
    
    switch (node.type) {
      case "document": return "#a78bfa";
      case "agent": return "#34d399";
      case "memory": return "#60a5fa";
      default: return "#9ca3af";
    }
  };

  const getNodeSize = (node: GraphNodeType) => {
    return node.type === "agent" ? 6 : node.type === "document" ? 4 : 3;
  };

  const getLinkColor = (link: any) => {
    switch (link.relation) {
      case "updated": return "#cbd5e1";
      case "extends": return "#e2e8f0";
      case "derived": return "#cbd5e1";
      default: return "#e2e8f0";
    }
  };

  const handleNodeClick = useCallback((node: any) => {
    setSelectedNode(node as GraphNodeType);
  }, []);

  const handleBackgroundClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleZoomIn = () => {
    if (fgRef.current) {
      fgRef.current.zoom(fgRef.current.zoom() * 1.2, 400);
    }
  };

  const handleZoomOut = () => {
    if (fgRef.current) {
      fgRef.current.zoom(fgRef.current.zoom() / 1.2, 400);
    }
  };

  const handleFitView = () => {
    if (fgRef.current) {
      fgRef.current.zoomToFit(400, 50);
    }
  };

  return (
    <div className="relative h-full w-full">
      {/* Search Bar */}
      <div className="absolute top-4 right-4 z-10">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background/95 backdrop-blur-sm border-border"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-[340px] z-10 flex flex-col gap-2">
        <Button
          size="icon"
          variant="outline"
          className="bg-background/95 backdrop-blur-sm border-border"
          onClick={handleZoomIn}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="bg-background/95 backdrop-blur-sm border-border"
          onClick={handleZoomOut}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="bg-background/95 backdrop-blur-sm border-border"
          onClick={handleFitView}
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Hover tooltip */}
      {hoveredNode && (
        <Card className="absolute top-24 left-6 z-10 bg-background/95 backdrop-blur-sm border-border p-4 space-y-2 w-72 animate-fade-in">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-semibold text-foreground">{hoveredNode.label}</div>
              <div className="text-xs text-muted-foreground capitalize">{hoveredNode.type}</div>
            </div>
            <div
              className={`px-2 py-1 rounded text-xs font-medium ${
                hoveredNode.status === "new"
                  ? "bg-purple-500/20 text-purple-400"
                  : hoveredNode.status === "forgotten"
                  ? "bg-red-500/20 text-red-400"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {hoveredNode.status}
            </div>
          </div>
        </Card>
      )}

      {/* Selected node details */}
      {selectedNode && (
        <Card className="absolute bottom-6 left-6 z-10 bg-background/95 backdrop-blur-sm border-border p-4 w-96 animate-fade-in">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-lg font-semibold text-foreground">{selectedNode.label}</div>
              <div className="text-sm text-muted-foreground capitalize">{selectedNode.type}</div>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="text-foreground capitalize">{selectedNode.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Connections:</span>
              <span className="text-foreground">
                {data.links.filter(
                  (l) => {
                    const source = typeof l.source === "string" ? l.source : l.source.id;
                    const target = typeof l.target === "string" ? l.target : l.target.id;
                    return source === selectedNode.id || target === selectedNode.id;
                  }
                ).length}
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Force Graph */}
      <ForceGraph2D
        ref={fgRef}
        graphData={data}
        nodeLabel="label"
        nodeColor={(node) => getNodeColor(node as GraphNodeType)}
        nodeVal={(node) => getNodeSize(node as GraphNodeType)}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = (node as any).label;
          const fontSize = 12 / globalScale;
          const nodeSize = getNodeSize(node as GraphNodeType);
          
          // Draw node
          ctx.beginPath();
          ctx.arc(node.x!, node.y!, nodeSize, 0, 2 * Math.PI);
          ctx.fillStyle = getNodeColor(node as GraphNodeType);
          ctx.fill();
          
          // Draw label for larger nodes or when zoomed in
          if (nodeSize > 4 || globalScale > 2) {
            ctx.font = `${fontSize}px Inter, sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#ffffff";
            ctx.fillText(label, node.x!, node.y! + nodeSize + fontSize);
          }
        }}
        linkColor={getLinkColor}
        linkWidth={(link: any) => link.strength * 1.5}
        linkCurvature={0.2}
        linkDirectionalParticles={0}
        onNodeClick={handleNodeClick}
        onBackgroundClick={handleBackgroundClick}
        onNodeHover={(node) => setHoveredNode(node as GraphNodeType | null)}
        cooldownTicks={100}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
        backgroundColor="#0a0a0a"
        nodeCanvasObjectMode={() => "replace"}
        onRenderFramePre={(ctx) => {
          // Draw dot grid background
          const dotSpacing = 30;
          const dotRadius = 0.8;
          const dotColor = "#1a1a1a";
          
          const width = ctx.canvas.width;
          const height = ctx.canvas.height;
          
          ctx.fillStyle = dotColor;
          for (let x = 0; x < width; x += dotSpacing) {
            for (let y = 0; y < height; y += dotSpacing) {
              ctx.beginPath();
              ctx.arc(x, y, dotRadius, 0, 2 * Math.PI);
              ctx.fill();
            }
          }
        }}
        enableNodeDrag={true}
        enableZoomInteraction={true}
        enablePanInteraction={true}
      />
    </div>
  );
}
