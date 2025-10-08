import { GraphData, NodeType, NodeStatus, RelationType } from "@/types/graph";

// Generate a large, intricate neural network-like graph
const generateIntricateGraph = (): GraphData => {
  const nodes = [];
  const links = [];

  // Define clusters (like brain regions)
  const clusters = [
    { name: "Business Intelligence", center: { x: 0, y: 0 }, count: 25, type: "document" as NodeType },
    { name: "Analytics", center: { x: 2, y: 1 }, count: 30, type: "memory" as NodeType },
    { name: "Data Mining", center: { x: 1, y: -2 }, count: 20, type: "agent" as NodeType },
    { name: "Learning Analytics", center: { x: 3, y: -1 }, count: 22, type: "memory" as NodeType },
    { name: "Data Integration", center: { x: -3, y: 0 }, count: 18, type: "document" as NodeType },
    { name: "Semantic Web", center: { x: -2, y: -3 }, count: 25, type: "memory" as NodeType },
    { name: "Semantic Network", center: { x: -1, y: -4 }, count: 20, type: "memory" as NodeType },
    { name: "Taxonomy", center: { x: 2, y: -4 }, count: 15, type: "document" as NodeType },
  ];

  let nodeIdCounter = 0;

  // Generate nodes for each cluster
  clusters.forEach((cluster) => {
    for (let i = 0; i < cluster.count; i++) {
      const rand = Math.random();
      const status: NodeStatus = 
        rand < 0.1 ? "new" :
        rand < 0.25 ? "older" :
        rand < 0.3 ? "expiring" :
        rand < 0.33 ? "forgotten" : "active";

      nodes.push({
        id: `node_${nodeIdCounter}`,
        type: cluster.type,
        label: i === 0 ? cluster.name : `${cluster.name.split(' ')[0]} ${i}`,
        status,
        metadata: {
          createdAt: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
          tokens: Math.floor(Math.random() * 1000),
          similarity: Math.random(),
        },
      });

      nodeIdCounter++;
    }
  });

  // Generate intra-cluster connections
  let currentNodeIndex = 0;
  clusters.forEach((cluster) => {
    const clusterNodes = nodes.slice(currentNodeIndex, currentNodeIndex + cluster.count);
    
    // Connect each node to 2-5 random nodes within the cluster
    clusterNodes.forEach((node, i) => {
      const connectionCount = Math.floor(Math.random() * 4) + 2;
      for (let j = 0; j < connectionCount; j++) {
        const targetIndex = Math.floor(Math.random() * clusterNodes.length);
        if (targetIndex !== i) {
          const target = clusterNodes[targetIndex];
          const relation: RelationType = Math.random() < 0.5 ? "derived" : "referenced";
          links.push({
            source: node.id,
            target: target.id,
            relation,
            strength: Math.random() * 0.5 + 0.3,
          });
        }
      }
    });

    currentNodeIndex += cluster.count;
  });

  // Generate inter-cluster connections
  for (let i = 0; i < clusters.length; i++) {
    for (let j = i + 1; j < clusters.length; j++) {
      // Connect some nodes between clusters
      const connectionCount = Math.floor(Math.random() * 8) + 3;
      for (let k = 0; k < connectionCount; k++) {
        const sourceClusterStart = clusters.slice(0, i).reduce((acc, c) => acc + c.count, 0);
        const targetClusterStart = clusters.slice(0, j).reduce((acc, c) => acc + c.count, 0);
        
        const sourceNode = nodes[sourceClusterStart + Math.floor(Math.random() * clusters[i].count)];
        const targetNode = nodes[targetClusterStart + Math.floor(Math.random() * clusters[j].count)];
        
        if (sourceNode && targetNode) {
          const rand = Math.random();
          const relation: RelationType = rand < 0.3 ? "extends" : rand < 0.5 ? "updated" : "similar";
          links.push({
            source: sourceNode.id,
            target: targetNode.id,
            relation,
            strength: Math.random() * 0.4 + 0.1,
          });
        }
      }
    }
  }

  return { nodes, links };
};

export const mockGraphData = generateIntricateGraph();
