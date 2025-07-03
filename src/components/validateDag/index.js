// utils/validateDag.js
const validateDag = (nodes, edges) => {
  if (nodes.length < 2) {
    return { valid: false, reason: "At least 2 nodes required" };
  }

  const adjList = {};
  const visited = {};
  const stack = {};

  nodes.forEach((n) => {
    adjList[n.id] = [];
    visited[n.id] = false;
    stack[n.id] = false;
  });

  edges.forEach((e) => {
    if (e.source === e.target) return; // self-loop
    adjList[e.source].push(e.target);
  });

  const dfs = (nodeId) => {
    visited[nodeId] = true;
    stack[nodeId] = true;

    for (const neighbor of adjList[nodeId]) {
      if (!visited[neighbor] && dfs(neighbor)) return true;
      else if (stack[neighbor]) return true; // cycle detected
    }

    stack[nodeId] = false;
    return false;
  };

  for (const node of nodes) {
    if (!visited[node.id] && dfs(node.id)) {
      return { valid: false, reason: "Cycle detected" };
    }
  }

  for (const node of nodes) {
    const connected = edges.some(
      (e) => e.source === node.id || e.target === node.id
    );
    if (!connected) {
      return { valid: false, reason: "All nodes must be connected" };
    }
  }

  return { valid: true };
};

export default validateDag;
