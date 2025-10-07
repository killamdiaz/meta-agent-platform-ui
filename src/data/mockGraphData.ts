import { GraphData } from "@/types/graph";

export const mockGraphData: GraphData = {
  nodes: [
    // Documents
    { id: "doc_1", type: "document", label: "Client Proposal", status: "active" },
    { id: "doc_2", type: "document", label: "Product Spec", status: "active" },
    { id: "doc_3", type: "document", label: "Meeting Notes", status: "active" },
    { id: "doc_4", type: "document", label: "Research Paper", status: "older" },
    
    // Agents
    { id: "agent_1", type: "agent", label: "Marketing Agent", status: "active" },
    { id: "agent_2", type: "agent", label: "Sales Agent", status: "active" },
    { id: "agent_3", type: "agent", label: "Support Agent", status: "active" },
    
    // Memories (latest)
    { id: "mem_1", type: "memory", label: "Discussion Summary", status: "new" },
    { id: "mem_2", type: "memory", label: "Action Items", status: "new" },
    { id: "mem_3", type: "memory", label: "Key Insights", status: "new" },
    { id: "mem_4", type: "memory", label: "Customer Feedback", status: "new" },
    
    // Memories (older)
    { id: "mem_5", type: "memory", label: "Previous Discussion", status: "older" },
    { id: "mem_6", type: "memory", label: "Historical Data", status: "older" },
    { id: "mem_7", type: "memory", label: "Past Decisions", status: "older" },
    { id: "mem_8", type: "memory", label: "Archived Notes", status: "expiring" },
    { id: "mem_9", type: "memory", label: "Old Context", status: "forgotten" },
  ],
  links: [
    // Document to Memory relationships
    { source: "doc_1", target: "mem_1", relation: "derived", strength: 0.95 },
    { source: "doc_2", target: "mem_2", relation: "derived", strength: 0.88 },
    { source: "doc_3", target: "mem_3", relation: "referenced", strength: 0.76 },
    { source: "doc_4", target: "mem_5", relation: "derived", strength: 0.82 },
    
    // Agent relationships
    { source: "agent_1", target: "mem_1", relation: "updated", strength: 0.92 },
    { source: "agent_2", target: "mem_2", relation: "updated", strength: 0.85 },
    { source: "agent_3", target: "mem_4", relation: "updated", strength: 0.78 },
    
    // Memory to Memory relationships
    { source: "mem_1", target: "mem_5", relation: "extends", strength: 0.68 },
    { source: "mem_2", target: "mem_6", relation: "extends", strength: 0.72 },
    { source: "mem_3", target: "mem_7", relation: "similar", strength: 0.65 },
    
    // Document similarities
    { source: "doc_1", target: "doc_2", relation: "similar", strength: 0.58 },
    { source: "doc_2", target: "doc_3", relation: "similar", strength: 0.62 },
    
    // Cross connections
    { source: "agent_1", target: "doc_1", relation: "referenced", strength: 0.88 },
    { source: "agent_2", target: "doc_2", relation: "referenced", strength: 0.91 },
    { source: "mem_8", target: "mem_9", relation: "similar", strength: 0.45 },
  ],
};
