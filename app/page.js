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
import Image from "next/image";
import Link from "next/link";

const URLImage = ({ image, isSelected, onSelect, onChange }) => {
  const [img] = useImage(image.src);
  const shapeRef = useRef("");
  const trRef = useRef();
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
const PropertiesPanel = ({ selected, onChange, ondelete }) => {
  if (!selected) {
    return "";
  }
  const ignoreKeys = ["src", "id"];
  const entries = Object.entries(selected).filter(
    ([key]) => !ignoreKeys.includes(key)
  );

  return (
    <div className="p-4 flex flex-col gap-3">
      <h2 className="font-bold text-lg">Properties</h2>
      {entries.map(([key, value]) => (
        <label key={key} className="flex justify-between items-center">
          <span className="capitalize">{key.replaceAll("_", " ")}:</span>
          <input
            type="number"
            className="border px-2 w-24"
            value={value ?? ""}
            onChange={(e) =>
              onChange({ attribute: key, value: e.target.value })
            }
          />
        </label>
      ))}
      <div className="flex justify-end h-full">
        <button
          className="justify-end flex bg-red-500 rounded p-2"
          onClick={ondelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const stageRef = useRef();
  const [Window, setWindow] = useState({ innerWidth: 0, innerHeight: 0 });
  const divideWidth = 100;
  const [currentImage, setCurrentImage] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  // Set window size once on mount
  useEffect(() => {
    setWindow({
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
    });
  }, []);

  // Add image on drop
  const handleDrop = (e) => {
    const customproperty = () => {
      if (currentImage == "b_bsp") {
        return { transparancy_x: 0.5, transparancy_negativex: 0.5 };
      } else if (currentImage == "b_bspcube") {
        return { reflectivity: 0.99 };
      } else if (currentImage == "b_lens2") {
        return { focal_lenght: 200 };
      } else if (currentImage == "b_lens3") {
        return { focal_lenght: 200 };
      } else if (currentImage == "e_pd1") {
        return {};
      } else if (currentImage == "c_laser2") {
        return { intensity: 0.9 };
      }
    };
    e.preventDefault();
    stageRef.current.setPointersPositions(e);
    const pos = stageRef.current.getPointerPosition();
    const extraproperty = customproperty();

    setImages((prev) =>
      prev.concat([
        {
          ...pos,
          src: `/needed_components/${currentImage}.png`,
          id: `${Date.now()}`,
          rotation: 0,
          ...extraproperty,
        },
      ])
    );
  };
  const changeimagesvalue = ({ attribute, value }) => {
    setImages((prevImages) =>
      prevImages.map((img) =>
        img.id === selectedId ? { ...img, [attribute]: Number(value) } : img
      )
    );
  };
  const deleteimageitem = () => {
    setImages(images.filter((e) => e.id != selectedId));
    setSelectedId(null);
  };

  const uploadJSON = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      setImages(JSON.parse(text));
    } catch {
      alert("Invalid JSON file!");
    }
  };
  if (!Window.innerWidth || !Window.innerHeight) return null;
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
          width={Window.innerWidth}
          height={Window.innerHeight}
          onMouseDown={(e) => {
            // Deselect when clicking empty area
            const clickedOnEmpty = e.target === e.target.getStage();
            if (clickedOnEmpty) setSelectedId(null);
          }}
        >
          <Layer>
            <Rect width={divideWidth} height={Window.innerHeight} fill="grey" />

            {images.map((image) => (
              <URLImage
                key={image.id}
                image={image}
                isSelected={image.id === selectedId}
                onSelect={() => {
                  setSelectedId(image.id);
                }}
                onChange={(newAttrs) => {
                  setImages((prev) =>
                    prev.map((img) => (img.id === image.id ? newAttrs : img))
                  );
                }}
              />
            ))}
            <Rect
              x={Window.innerWidth - 500}
              width={500}
              height={Window.innerHeight}
              fill="grey"
            />
          </Layer>
        </Stage>
      </div>

      {/* ---- Right Side Image Panel ---- */}
      <div className="h-full absolute ">
        {["b_bsp", "b_bspcube", "b_lens2", "b_lens3", "e_pd1", "c_laser2"].map(
          (name) => (
            <Image
              key={name}
              className="m-2.5"
              src={`/needed_components/${name}.png`}
              alt={name}
              width={divideWidth - 20}
              height={divideWidth - 20}
              draggable
              onDragStart={() => setCurrentImage(name)}
            />
          )
        )}
      </div>
      <div className=" absolute right-0 w-125 h-full">
        <PropertiesPanel
          selected={images.find((e) => e.id === selectedId)}
          onChange={changeimagesvalue}
          ondelete={deleteimageitem}
        />
      </div>
      <div className="flex m-2 absolute right-0 bottom-0 ">
        <a
          href={URL.createObjectURL(
            new Blob([JSON.stringify(images)], {
              type: "application/json",
            })
          )}
          download="images.json"
        >
          <button className=" bg-green-500 rounded p-2 m-2">
            Download json
          </button>
        </a>
        <div className="bg-yellow-500 rounded p-2 m-2" htmlFor="uploadinput">
          Upload json
        </div>
        <input
          id="uploadinput"
          type="file"
          accept="application/json"
          onChange={uploadJSON}
          className="hidden"
        ></input>
      </div>
    </div>
  );
};

export default App;
