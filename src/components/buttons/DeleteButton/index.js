// components/buttons/DeleteButton/index.js
import React from "react";
import { MdDelete } from "react-icons/md";
import "./index.css";

export default function DeleteButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="btn delete-node"
      title="Delete selected nodes or edges"
    >
      <MdDelete size={20} style={{ marginRight: "6px" }} /> Delete Selected
    </button>
  );
}
