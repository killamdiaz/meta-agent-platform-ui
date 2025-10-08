import { useAgentStore } from '@/store/agentStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Copy, Trash2, Plus } from 'lucide-react';

export function ConfigPanel() {
  const selectedAgent = useAgentStore((state) => state.getSelectedAgent());
  const updateAgent = useAgentStore((state) => state.updateAgent);
  const deleteAgent = useAgentStore((state) => state.deleteAgent);
  const selectAgent = useAgentStore((state) => state.selectAgent);

  if (!selectedAgent) {
    return (
      <div className="w-[380px] bg-card border-l border-border p-6 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Select an agent to configure</p>
      </div>
    );
  }

  const handleDelete = () => {
    deleteAgent(selectedAgent.id);
    selectAgent(null);
  };

  return (
    <div className="w-[380px] bg-card border-l border-border p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{selectedAgent.name}</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Call the model with your instructions and tools.
          </p>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium text-foreground">
          Name
        </Label>
        <Input
          id="name"
          value={selectedAgent.name}
          onChange={(e) => updateAgent(selectedAgent.id, { name: e.target.value })}
          className="bg-background border-border"
        />
      </div>

      {/* Instructions */}
      <div className="space-y-2">
        <Label htmlFor="instructions" className="text-sm font-medium text-foreground">
          Instructions
        </Label>
        <Textarea
          id="instructions"
          value={selectedAgent.instructions}
          onChange={(e) => updateAgent(selectedAgent.id, { instructions: e.target.value })}
          className="bg-background border-border min-h-[100px] resize-none"
        />
      </div>

      {/* Context - placeholder */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-foreground">Context</Label>
          <span className="text-xs text-muted-foreground">Full conversation</span>
        </div>
      </div>

      {/* Model */}
      <div className="space-y-2">
        <Label htmlFor="model" className="text-sm font-medium text-foreground">
          Model
        </Label>
        <Select
          value={selectedAgent.model}
          onValueChange={(value: 'gpt-4o' | 'gpt-5') =>
            updateAgent(selectedAgent.id, { model: value })
          }
        >
          <SelectTrigger className="bg-background border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="gpt-4o">gpt-4o</SelectItem>
            <SelectItem value="gpt-5">gpt-5</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reasoning Effort */}
      <div className="space-y-2">
        <Label htmlFor="reasoning" className="text-sm font-medium text-foreground">
          Reasoning effort
        </Label>
        <Select
          value={selectedAgent.reasoning}
          onValueChange={(value: 'low' | 'medium' | 'high') =>
            updateAgent(selectedAgent.id, { reasoning: value })
          }
        >
          <SelectTrigger className="bg-background border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="low">low</SelectItem>
            <SelectItem value="medium">medium</SelectItem>
            <SelectItem value="high">high</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tools */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-foreground">Tools</Label>
          <Button variant="ghost" size="sm" className="h-7 text-xs">
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>
        {selectedAgent.tools.length === 0 && (
          <p className="text-xs text-muted-foreground">No tools added</p>
        )}
      </div>

      {/* Output Format */}
      <div className="space-y-2">
        <Label htmlFor="output" className="text-sm font-medium text-foreground">
          Output format
        </Label>
        <Select
          value={selectedAgent.outputFormat}
          onValueChange={(value: 'text' | 'json') =>
            updateAgent(selectedAgent.id, { outputFormat: value })
          }
        >
          <SelectTrigger className="bg-background border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="json">JSON</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
