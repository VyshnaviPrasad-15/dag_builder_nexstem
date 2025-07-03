import React, { useCallback } from "react";
import { useReactFlow } from "reactflow";
import dagre from "dagre";
import "./index.css";

export default function AutoLayoutButton({ nodes, edges, setNodes }) {
  const { fitView } = useReactFlow();

  const applyAutoLayout = useCallback(() => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setGraph({ rankdir: "TB" });
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    const nodeWidth = 172;
    const nodeHeight = 36;

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });
    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const updatedNodes = nodes.map((node) => {
      const { x, y } = dagreGraph.node(node.id);
      return {
        ...node,
        position: { x, y },
        positionAbsolute: { x, y },
      };
    });

    setNodes(updatedNodes);
    setTimeout(() => fitView({ padding: 0.2 }), 0);
  }, [nodes, edges, setNodes, fitView]);

  return (
    <button className="Auto-btn" onClick={applyAutoLayout}>
      Auto Layout
    </button>
  );
}
