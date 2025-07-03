// components/buttons/AddNodeButton/index.js
import React from "react";
import { MdAddCircle } from "react-icons/md";
import "./index.css";

export default function AddNodeButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="btn add-node"
      title="Add a new node to the DAG"
    >
      <MdAddCircle size={20} style={{ marginRight: "6px" }} /> Add Node
    </button>
  );
}
