import { create } from 'zustand';

export interface Agent {
  id: string;
  name: string;
  instructions: string;
  model: 'gpt-4o' | 'gpt-5';
  reasoning: 'low' | 'medium' | 'high';
  tools: string[];
  outputFormat: 'text' | 'json';
  position: { x: number; y: number };
}

interface AgentStore {
  agents: Agent[];
  selectedAgentId: string | null;
  addAgent: (position?: { x: number; y: number }) => void;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  deleteAgent: (id: string) => void;
  selectAgent: (id: string | null) => void;
  getSelectedAgent: () => Agent | null;
}

export const useAgentStore = create<AgentStore>((set, get) => ({
  agents: [],
  selectedAgentId: null,

  addAgent: (position = { x: 0, y: 0 }) => {
    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      name: 'My agent',
      instructions: 'You are a helpful assistant.',
      model: 'gpt-5',
      reasoning: 'low',
      tools: [],
      outputFormat: 'text',
      position,
    };
    set((state) => ({ agents: [...state.agents, newAgent] }));
  },

  updateAgent: (id, updates) => {
    set((state) => ({
      agents: state.agents.map((agent) =>
        agent.id === id ? { ...agent, ...updates } : agent
      ),
    }));
  },

  deleteAgent: (id) => {
    set((state) => ({
      agents: state.agents.filter((agent) => agent.id !== id),
      selectedAgentId: state.selectedAgentId === id ? null : state.selectedAgentId,
    }));
  },

  selectAgent: (id) => {
    set({ selectedAgentId: id });
  },

  getSelectedAgent: () => {
    const { agents, selectedAgentId } = get();
    return agents.find((agent) => agent.id === selectedAgentId) || null;
  },
}));
