import { Handle, Position } from 'reactflow';
import { Bot } from 'lucide-react';
import { useAgentStore } from '@/store/agentStore';

interface AgentNodeProps {
  id: string;
  data: {
    name: string;
  };
  selected?: boolean;
}

export function AgentNode({ id, data, selected }: AgentNodeProps) {
  const selectAgent = useAgentStore((state) => state.selectAgent);

  return (
    <div
      onClick={() => selectAgent(id)}
      className={`px-6 py-3 rounded-full bg-card border flex items-center gap-2 cursor-pointer transition-all hover:shadow-lg hover:shadow-primary/20 min-w-[160px] ${
        selected
          ? 'border-primary shadow-lg shadow-primary/30'
          : 'border-border hover:border-primary/50'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-primary !border-2 !border-primary/20"
      />
      <Bot className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm font-medium text-foreground">{data.name}</span>
      <div className="text-xs text-muted-foreground ml-auto">Agent</div>
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-primary !border-2 !border-primary/20"
      />
    </div>
  );
}
