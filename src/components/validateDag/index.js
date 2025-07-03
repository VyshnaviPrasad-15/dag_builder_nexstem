export default function validateDag(nodes, edges) {
  const adjList = {};
  const visited = new Set();
  const recStack = new Set();
  const invalidEdges = new Set();

  nodes.forEach((node) => {
    adjList[node.id] = [];
  });

  edges.forEach((edge) => {
    adjList[edge.source].push(edge.target);
  });

  function dfs(nodeId) {
    visited.add(nodeId);
    recStack.add(nodeId);

    for (const neighbor of adjList[nodeId]) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) {
          // Add edge that causes cycle
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
