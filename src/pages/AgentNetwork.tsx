import { useCallback, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Node,
  Edge,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAgentStore } from '@/store/agentStore';
import { StartNode } from '@/components/AgentNetwork/StartNode';
import { AgentNode } from '@/components/AgentNetwork/AgentNode';
import { ConfigPanel } from '@/components/AgentNetwork/ConfigPanel';

const nodeTypes = {
  start: StartNode,
  agent: AgentNode,
};

const initialNodes: Node[] = [
  {
    id: 'start',
    type: 'start',
    position: { x: 250, y: 250 },
    data: { label: 'Start' },
  },
];

const initialEdges: Edge[] = [];

export default function AgentNetwork() {
  const [showMinimap, setShowMinimap] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const agents = useAgentStore((state) => state.agents);
  const addAgent = useAgentStore((state) => state.addAgent);
  const updateAgent = useAgentStore((state) => state.updateAgent);
  const selectAgent = useAgentStore((state) => state.selectAgent);
  const selectedAgentId = useAgentStore((state) => state.selectedAgentId);

  // Sync Zustand agents to React Flow nodes
  const syncedNodes = [
    ...initialNodes,
    ...agents.map((agent) => ({
      id: agent.id,
      type: 'agent',
      position: agent.position,
      data: { name: agent.name },
      selected: agent.id === selectedAgentId,
    })),
  ];

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeDragStop = useCallback(
    (_event: any, node: Node) => {
      if (node.id !== 'start' && node.id.startsWith('agent-')) {
        updateAgent(node.id, { position: node.position });
      }
    },
    [updateAgent]
  );

  const handleAddAgent = () => {
    // Random position near center
    const x = Math.random() * 400 + 400;
    const y = Math.random() * 300 + 150;
    addAgent({ x, y });
  };

  const onPaneClick = () => {
    selectAgent(null);
  };

  const onMove = () => {
    setShowMinimap(true);
  };

  return (
    <div className="h-screen w-full flex bg-[#0b0b0f]">
      {/* Main Canvas */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={syncedNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDragStop={onNodeDragStop}
          onPaneClick={onPaneClick}
          onMove={onMove}
          nodeTypes={nodeTypes}
          fitView
          className="bg-[#0b0b0f] dot-grid-background"
          defaultEdgeOptions={{
            style: { stroke: '#3b82f6', strokeWidth: 2 },
            animated: true,
          }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="#222"
            className="opacity-50"
          />
          <Controls className="bg-card/80 backdrop-blur-sm border border-border rounded-lg" />
          {showMinimap && (
            <MiniMap
              className="!bg-card/60 !backdrop-blur-sm border border-border/50 rounded-lg"
              maskColor="rgba(11, 11, 15, 0.6)"
              nodeColor={(node) => {
                if (node.type === 'start') return '#10b981';
                return '#3b82f6';
              }}
            />
          )}
        </ReactFlow>

        {/* Floating Add Button */}
        <Button
          onClick={handleAddAgent}
          className="absolute bottom-6 right-6 rounded-full h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Agent
        </Button>
      </div>

      {/* Config Panel */}
      <ConfigPanel />
    </div>
  );
}
