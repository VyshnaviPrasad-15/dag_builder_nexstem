import React from "react";
import { Handle, Position } from "reactflow";
import "./index.css";

const CustomNode = ({ data }) => {
  return (
    <div className="custom-node">
      <Handle type="target" position={Position.Left} />
      <div className="label">{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default CustomNode;
