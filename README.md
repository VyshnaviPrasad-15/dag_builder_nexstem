# DAG Builder – React Flow Editor

A modern, interactive Directed Acyclic Graph (DAG) editor built with React and React Flow. This tool allows users to create, connect, validate, and auto-layout nodes visually with full drag-and-drop support.

---

Demo:
![Editor View]([React App.mp4](https://github.com/VyshnaviPrasad-15/dag_builder_nexstem/blob/main/React%20App.mp4))

---

## Setup Instructions

1. Clone the repository

   ```bash
   git clone https://github.com/VyshnaviPrasad-15/dag_builder_nexstem.git
   cd dag_builder_nexstem
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start development server

   ```bash
   npm start
   ```

4. Open in your browser: [http://localhost:3000](http://localhost:3000)

---

## Libraries Used

| Library       | Purpose                                        |
| ------------- | ---------------------------------------------- |
| `react-flow`  | Visual editor for node graphs                  |
| `dagre`       | Auto-layout algorithm for directed graphs      |
| `uuid`        | Unique IDs for node creation                   |
| `react-icons` | Clean icon rendering (e.g., status indicators) |

---

## Design Decisions

CustomNode Component: Built to support ports (source/target) and easily styled.
Position Handling: Nodes are placed in random visible coordinates within bounds to avoid overlap.
Auto Layout: Implemented with `dagre` to create clean top-down layouts when the graph becomes messy.
Validation: Enforces valid DAG rules — no cycles, minimum 2 nodes, all connected.
Reusability: Modular buttons (`AddNode`, `DeleteNode`, `AutoLayout`) are reusable and styled consistently.

---

## Features

✅ Add/drag nodes
✅ Connect nodes (edges)
✅ Delete selected nodes/edges
✅ DAG validation
✅ Auto-layout using Dagre
✅ Zoom In/Out & Fit View
✅ MiniMap overview
✅ Keyboard support (e.g., `Delete` key)

---

## Challenges Faced

### 1. Node Positioning

Ensuring randomly added nodes don’t overlap or appear off-screen required using `getBoundingClientRect()` and `useReactFlow().project()` to position nodes within visible canvas.

### 2. Auto Layout

`dagre` requires transforming React Flow nodes and edges into its internal graph representation and back. Managing layout logic with dynamic updates while avoiding node flickers or broken connections was challenging.

### 3. State Management

Maintaining the correctness of nodes and edges using React Flow’s hooks (`useNodesState`, `useEdgesState`) was critical to avoid visual or logic bugs.

### 4. Validation

DAG validation had to handle:

* Cycles
* Unconnected nodes
* Self-loop prevention

Debugging the `validateDag` DFS cycle detection logic was a key task.

### 5. Blank Screen Bugs

Initially using `useReactFlow` without placing the component inside a `ReactFlowProvider` led to runtime errors. Fixing provider hierarchy resolved rendering issues.

---

## References

* 📘 [React Flow Documentation](https://reactflow.dev)
* 📘 [Dagre Graph Layout Docs](https://github.com/dagrejs/dagre)
* 📘 [React Icons](https://react-icons.github.io/react-icons/)
* ⚙️ [GitHub Personal Access Tokens](https://github.com/settings/tokens)

---

## Contributions

Made with  by [Vyshnavi Prasad Chowdary Sandireddy](https://github.com/VyshnaviPrasad-15)

