"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Stage,
  Layer,
  Rect,
  Image as KonvaImage,
  Transformer,
} from "react-konva";
import useImage from "use-image";
import NextImage from "next/image";

// Component that renders each image on the canvas
const URLImage = ({ image, isSelected, onSelect, onChange }) => {
  const [img] = useImage(image.src);
  const shapeRef = useRef();
  const trRef = useRef();

  // Attach transformer when selected
  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <KonvaImage
        image={img}
        width={img ? img.width / 2 : 0}
        height={img ? img.height / 2 : 0}
        x={image.x}
        y={image.y}
        offsetX={img ? img.width / 4 : 0}
        offsetY={img ? img.height / 4 : 0}
        rotation={image.rotation || 0}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        onDragEnd={(e) => {
          onChange({
            ...image,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...image,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.height() * scaleY),
          });
        }}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  );
};

const App = () => {
  const stageRef = useRef();
  const [Window, setWindow] = useState({ width: 0, height: 0 });
  const divideWidth = 100;
  const [currentImage, setCurrentImage] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [rotationvalue, setrotationvalue] = useState();

  // Set window size once on mount
  useEffect(() => {
    setWindow({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  // Add image on drop
  const handleDrop = (e) => {
    e.preventDefault();
    stageRef.current.setPointersPositions(e);
    const pos = stageRef.current.getPointerPosition();
    setImages((prev) =>
      prev.concat([
        {
          ...pos,
          src: currentImage,
          id: `${Date.now()}`,
          rotation: 0,
        },
      ])
    );
  };

  return (
    <div className="flex h-screen relative">
      {/* ---- Left Konva Stage ---- */}
      <div
        className="h-full w-full"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <Stage
          ref={stageRef}
          width={Window.width}
          height={Window.height}
          onMouseDown={(e) => {
            // Deselect when clicking empty area
            const clickedOnEmpty = e.target === e.target.getStage();
            if (clickedOnEmpty) setSelectedId(null);
          }}
        >
          <Layer>
            <Rect width={divideWidth} height={Window.height} fill="grey" />

            {images.map((image) => (
              <URLImage
                key={image.id}
                image={image}
                isSelected={image.id === selectedId}
                onSelect={() => setSelectedId(image.id)}
                onChange={(newAttrs) => {
                  setImages((prev) =>
                    prev.map((img) => (img.id === image.id ? newAttrs : img))
                  );
                }}
              />
            ))}
            <Rect
              x={Window.width - 500}
              width={500}
              height={Window.height}
              fill="grey"
            />
          </Layer>
        </Stage>
      </div>

      {/* ---- Right Side Image Panel ---- */}
      <div className="h-full absolute ">
        {["b_bsp", "b_bspcube", "b_lens2", "b_lens3", "e_pd1", "c_laser2"].map(
          (name) => (
            <NextImage
              key={name}
              className="m-2.5"
              src={`/needed_components/${name}.png`}
              alt={name}
              width={divideWidth - 20}
              height={divideWidth - 20}
              draggable
              onDragStart={() =>
                setCurrentImage(`/needed_components/${name}.png`)
              }
            />
          )
        )}
      </div>
    </div>
  );
};

export default App;
