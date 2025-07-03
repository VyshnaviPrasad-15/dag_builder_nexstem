export default function validateDag(nodes, edges) {
  if (nodes.length < 2) {
    return { valid: false, reason: "At least 2 nodes required" };
  }

  const nodeIds = new Set(nodes.map((n) => n.id));
  const adjList = {};
  const visited = {};
  const stack = {};

  nodeIds.forEach((id) => {
    adjList[id] = [];
    visited[id] = false;
    stack[id] = false;
  });

  for (const edge of edges) {
    if (edge.source === edge.target) {
      return { valid: false, reason: "Self-loop detected" };
    }
    if (adjList[edge.source] && nodeIds.has(edge.target)) {
      adjList[edge.source].push(edge.target);
    }
  }

  const dfs = (nodeId) => {
    visited[nodeId] = true;
    stack[nodeId] = true;

    for (const neighbor of adjList[nodeId] || []) {
      if (!visited[neighbor] && dfs(neighbor)) return true;
      else if (stack[neighbor]) return true;
    }

    stack[nodeId] = false;
    return false;
  };

  for (const nodeId of nodeIds) {
    if (!visited[nodeId] && dfs(nodeId)) {
      return { valid: false, reason: "Cycle detected" };
    }
  }

  const connectedNodeIds = new Set();
  for (const edge of edges) {
    connectedNodeIds.add(edge.source);
    connectedNodeIds.add(edge.target);
  }

  for (const nodeId of nodeIds) {
    if (!connectedNodeIds.has(nodeId)) {
      return { valid: false, reason: "All nodes must be connected" };
    }
  }

  return { valid: true };
}
