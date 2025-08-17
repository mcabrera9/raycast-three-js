import * as THREE from "three";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Stack, Button } from "@mui/material";

function App() {
  // Set up hooks
  const [color, setColor] = useState(null);
  const [uuid, setUuid] = useState(null);
  const [changeColor, setChangeColor] = useState("#ff0000");
  const [direction, setDirection] = useState(true);
  const [selected, setSelected] = useState(false);

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
    <Stack>
      <h1>React Layer</h1>
      <Stack style={{ gap: 0 }}>
        {color ? (
          <div>
            <p style={{ color }}>Color: {color}</p>
            <p style={{ color }}>UUID: {uuid}</p>
          </div>
        ) : (
          <p>
            Click to select a cube to reveal its color and uuid. It will also
            change to a random color, and enable color and direction change
            functionality.
          </p>
        )}
      </Stack>

      {color ? (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Stack style={{ gap: 10 }}>
            <h3>Setting cube color</h3>
            <input
              type="color"
              value={changeColor}
              onChange={(e) => setChangeColor(e.target.value)}
            />
            <div>Click below to apply the input color to the selected cube</div>
            <div>
              <Button variant="contained" onClick={handleChangeCubeColor}>
                Change color
              </Button>
            </div>
          </Stack>

          <Stack style={{ gap: 10 }}>
            <h3>Moving cubes</h3>
            Click one of the buttons below to move the selected cube.
            <div>
              <Stack>
                <div>Toggle checkbox to change direction of cube movement</div>
                <div>
                  <input
                    type="checkbox"
                    checked={direction}
                    onChange={(e) => setDirection(!direction)}
                  />
                </div>
              </Stack>
            </div>
            <div>
              <Button variant="contained" onClick={handleChangeCubePositionX}>
                Change X
              </Button>
            </div>
            <div>
              <Button variant="contained" onClick={handleChangeCubePositionY}>
                Change Y
              </Button>
            </div>
            <div>
              <Button variant="contained" onClick={handleChangeCubePositionZ}>
                Change Z
              </Button>
            </div>
          </Stack>
        </div>
      ) : (
        "Select a cube to get started!"
      )}
    </Stack>
  );
}

const reactRoot = document.getElementById("react-root");
createRoot(reactRoot).render(<App />);
