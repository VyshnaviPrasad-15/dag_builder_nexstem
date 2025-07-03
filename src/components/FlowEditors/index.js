import React, { useCallback, useRef, useState, useEffect } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";

import dagre from "dagre";

import "./index.css";
import CustomNode from "../CustomNode";
import validateDag from "../validateDag";
import AddNodeButton from "../buttons/AddNodeButton";
import DeleteButton from "../buttons/DeleteButton";

import { v4 as uuidv4 } from "uuid";
import { MdCheckCircle, MdCancel } from "react-icons/md";
import { MdAutoFixHigh } from "react-icons/md";

const nodeTypes = { custom: CustomNode };
const nodeWidth = 172;
const nodeHeight = 36;

function FlowEditorInner() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isValidDag, setIsValidDag] = useState({ valid: true });

  const reactFlowWrapper = useRef(null);
  const { project, fitView } = useReactFlow();

  const addNode = useCallback(() => {
    const label = prompt("Enter node label:");
    if (!label || !reactFlowWrapper.current) return;

    const bounds = reactFlowWrapper.current.getBoundingClientRect();
    const randomX = Math.random() * bounds.width;
    const randomY = Math.random() * bounds.height;
    const position = project({ x: randomX, y: randomY });

    const newNode = {
      id: uuidv4(),
      type: "custom",
      position,
      data: { label },
    };

    setNodes((nds) => [...nds, newNode]);
  }, [project, setNodes]);

  const deleteSelected = useCallback(() => {
    setNodes((nds) => nds.filter((n) => !n.selected));
    setEdges((eds) => eds.filter((e) => !e.selected));
  }, [setNodes, setEdges]);

  const onConnect = useCallback(
    (params) => {
      if (params.source === params.target) return;
      setEdges((eds) =>
        addEdge({ ...params, markerEnd: { type: "arrow" } }, eds)
      );
    },
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const label = event.dataTransfer.getData("application/reactflow");
      if (!label || !reactFlowWrapper.current) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const randomX = Math.random() * bounds.width;
      const randomY = Math.random() * bounds.height;
      const position = project({ x: randomX, y: randomY });

      const newNode = {
        id: uuidv4(),
        type: "custom",
        position,
        data: { label },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [project, setNodes]
  );

  const applyAutoLayout = useCallback(() => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setGraph({ rankdir: "TB" });
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });
    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
      const { x, y } = dagreGraph.node(node.id);
      return {
        ...node,
        position: { x, y },
        positionAbsolute: { x, y },
      };
    });

    setNodes([...layoutedNodes]);
    setTimeout(() => fitView({ padding: 0.2 }), 0);
  }, [nodes, edges, setNodes, fitView]);

  useEffect(() => {
    setIsValidDag(validateDag(nodes, edges));
  }, [nodes, edges]);

  useEffect(() => {
    const handleDelete = (e) => {
      if (e.key === "Delete") {
        deleteSelected();
      }
    };
    window.addEventListener("keydown", handleDelete);
    return () => window.removeEventListener("keydown", handleDelete);
  }, [deleteSelected]);

  return (
    <div className="flow-wrapper" ref={reactFlowWrapper}>
      <div className="toolbar">
        <AddNodeButton onClick={addNode} />
        <DeleteButton onClick={deleteSelected} />
        <button className="btn " onClick={applyAutoLayout}>
          <MdAutoFixHigh style={{ marginRight: "4px" }} />
          Auto Layout
        </button>

        <span className="status">
          {isValidDag.valid ? (
            <>
              <MdCheckCircle className="icon success" /> Valid DAG
            </>
          ) : (
            <>
              <MdCancel className="icon error" /> Invalid DAG -{" "}
              {isValidDag.reason}
            </>
          )}
        </span>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}

export default function FlowEditor() {
  return (
    <ReactFlowProvider>
      <FlowEditorInner />
    </ReactFlowProvider>
  );
}
