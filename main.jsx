import * as THREE from "three";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

function App() {
  const [color, setColor] = useState(null);

  // useEffect() retrieve the color
  return (
    <div>
      This is the React side
      <h1>Selected cube Color</h1>
      <div>Cube color goes here</div>
    </div>
  );
}

const reactRoot = document.getElementById("react-root");
createRoot(reactRoot).render(<App />);
