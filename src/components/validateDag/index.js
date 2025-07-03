export default function validateDag(nodes, edges) {
  const adjList = {};
  const visited = new Set();
  const recStack = new Set();
  const invalidEdges = new Set();

  // Create a set of existing node IDs for validation
  const nodeIds = new Set(nodes.map((n) => n.id));

  // Initialize adjacency list
  nodes.forEach((node) => {
    adjList[node.id] = [];
  });

  // Add edges to the adjacency list only if both source and target exist
  edges.forEach((edge) => {
    if (adjList[edge.source] && nodeIds.has(edge.target)) {
      adjList[edge.source].push(edge.target);
    }
  });

  function dfs(nodeId) {
    visited.add(nodeId);
    recStack.add(nodeId);

    const neighbors = adjList[nodeId] || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) {
          const culprit = edges.find(
            (e) => e.source === nodeId && e.target === neighbor
          );
          if (culprit) invalidEdges.add(culprit.id);
          return true;
        }
      } else if (recStack.has(neighbor)) {
        const culprit = edges.find(
          (e) => e.source === nodeId && e.target === neighbor
        );
        if (culprit) invalidEdges.add(culprit.id);
        return true;
      }
    }

    recStack.delete(nodeId);
    return false;
  }

  for (const node of nodes) {
    if (!visited.has(node.id) && dfs(node.id)) {
      return {
        valid: false,
        reason: "Cycle detected",
        invalidEdgeIds: [...invalidEdges],
      };
    }
  }

  return { valid: true, invalidEdgeIds: [] };
}
