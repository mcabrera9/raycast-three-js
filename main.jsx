import * as THREE from "three";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

function App() {
  const [color, setColor] = useState(null);
  const [uuid, setUuid] = useState(null);

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
  return (
    <div>
      <h1>React Layer</h1>
      {color ? (
        <div>
          <p style={{ color }}>Color: {color}</p>
          <p style={{ color }}>UUID: {uuid}</p>
        </div>
      ) : (
        <p>Click on a cube to reveal its color and uuid.</p>
      )}
    </div>
  );
}

const reactRoot = document.getElementById("react-root");
createRoot(reactRoot).render(<App />);
