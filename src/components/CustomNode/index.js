import React from "react";
import { Handle, Position } from "reactflow";
import "./index.css";

export default function CustomNode({ data }) {
  return (
    <div className="custom-node">
      <Handle
        type="target"
        position={Position.Left}
        className="handle handle-left"
      />
      <div className="node-content">{data.label}</div>
      <Handle
        type="source"
        position={Position.Right}
        className="handle handle-right"
      />
    </div>
  );
}
