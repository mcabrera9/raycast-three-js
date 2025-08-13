import * as THREE from "three";
import React from "react";
import { createRoot } from "react-dom/client";

function App() {
  return <div>This is the React side</div>;
}

const reactRoot = document.getElementById("react-root");
createRoot(reactRoot).render(<App />);
