import * as THREE from "three";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

function App() {
  // Set up hooks
  const [color, setColor] = useState(null);
  const [uuid, setUuid] = useState(null);
  const [changeColor, setChangeColor] = useState("#ff0000");
  const [direction, setDirection] = useState(true);

  // LISTENER
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === "cubeColor") {
        setColor(event.data.color);
      }
      if (event.data.type === "uuid") {
        setUuid(event.data.uuid);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  // SENDS TO THREE JS LAYER
  const handleChangeCubeColor = () => {
    window.postMessage({ type: "changeCubeColor", changeColor, uuid });
  };
  const handleChangeCubePositionX = () => {
    window.postMessage({ type: "changeCubePositionX", uuid, direction });
  };
  const handleChangeCubePositionY = () => {
    window.postMessage({ type: "changeCubePositionY", uuid, direction });
  };
  const handleChangeCubePositionZ = () => {
    window.postMessage({ type: "changeCubePositionZ", uuid, direction });
  };

  return (
    <div style={{ gap: 5 }}>
      <h1>React Layer</h1>
      {color ? (
        <div>
          <p style={{ color }}>Color: {color}</p>
          <p style={{ color }}>UUID: {uuid}</p>
        </div>
      ) : (
        <p>Select a cube to reveal its color and uuid.</p>
      )}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <input
          type="color"
          value={changeColor}
          onChange={(e) => setChangeColor(e.target.value)}
        />
        <div>
          <div>Click below to apply the input color to the selected cube</div>
          <button onClick={handleChangeCubeColor}>Change color</button>
        </div>
        <div>
          Toggle checkbox to change direction of cube movement
          <input
            type="checkbox"
            checked={direction}
            onChange={(e) => setDirection(!direction)}
          />
          <div>
            <button onClick={handleChangeCubePositionX}>Change X</button>
            <button onClick={handleChangeCubePositionY}>Change Y</button>
            <button onClick={handleChangeCubePositionZ}>Change Z</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const reactRoot = document.getElementById("react-root");
createRoot(reactRoot).render(<App />);
