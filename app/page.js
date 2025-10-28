"use client";
import React, { useEffect, useState } from "react";
import { Stage, Layer, Rect, Circle, Text } from "react-konva";

const App = () => {
  const [Window, setWindow] = useState("");
  useEffect(() => {
    setWindow(window);
  }, []);
  return (
    <div className="flex">
      <div className="w-1/4">a</div>
      <div className="flex-1">b</div>
    </div>
  );
};

export default App;

// <Stage
//       className="bg-white"
//       width={Window.innerWidth}
//       height={Window.innerHeight}
//     >
//       <Layer>
//         <Text text="Try to drag shapes" fontSize={15} />
//         <Rect
//           x={20}
//           y={50}
//           width={100}
//           height={100}
//           fill="red"
//           shadowBlur={10}
//           draggable
//         />
//         <Circle x={200} y={100} radius={50} fill="green" draggable />
//       </Layer>
//     </Stage>
