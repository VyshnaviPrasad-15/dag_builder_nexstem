export default function validateDag(nodes, edges) {
  const nodeIds = new Set(nodes.map((n) => n.id));
  const adjList = {};
  const visited = new Set();
  const recStack = new Set();
  const invalidEdges = new Set();

  if (nodes.length < 2) {
    return {
      valid: false,
      reason: "At least 2 nodes required",
      invalidEdgeIds: [],
    };
  }

  // Initialize adjacency list
  nodes.forEach((node) => {
    adjList[node.id] = [];
  });

  const validEdges = edges.filter(
    (edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target)
  );

  validEdges.forEach((edge) => {
    adjList[edge.source].push(edge.target);
  });

  function dfs(nodeId) {
    visited.add(nodeId);
    recStack.add(nodeId);

    const neighbors = adjList[nodeId] || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) {
          const culprit = validEdges.find(
            (e) => e.source === nodeId && e.target === neighbor
          );
          if (culprit) invalidEdges.add(culprit.id);
          return true;
        }
      } else if (recStack.has(neighbor)) {
        const culprit = validEdges.find(
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

  const undirectedAdj = {};
  nodes.forEach((node) => {
    undirectedAdj[node.id] = new Set();
  });

  validEdges.forEach((edge) => {
    undirectedAdj[edge.source].add(edge.target);
    undirectedAdj[edge.target].add(edge.source);
  });

  const visitedConn = new Set();
  const queue = [nodes[0].id];

  while (queue.length) {
    const current = queue.pop();
    visitedConn.add(current);
    for (const neighbor of undirectedAdj[current]) {
      if (!visitedConn.has(neighbor)) queue.push(neighbor);
    }
  }

  if (visitedConn.size !== nodes.length) {
    return {
      valid: false,
      reason: "All nodes must be connected",
      invalidEdgeIds: [],
    };
  }

  return { valid: true, invalidEdgeIds: [] };
}
