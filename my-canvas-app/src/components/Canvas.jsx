import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Circle, Line, Arrow, Text, Transformer } from 'react-konva';
import PropTypes from 'prop-types';

const Canvas = ({ tool, addToHistory }) => {
  const [shapes, setShapes] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedShape, setSelectedShape] = useState(null);
  const transformerRef = useRef(null);
  const stageRef = useRef(null);
  const layerRef = useRef(null);
  const [textEditing, setTextEditing] = useState(null);
  const textAreaRef = useRef(null);

  const handleMouseDown = (e) => {
    if (tool === 'text') return; // Prevent drawing shape on text tool

    setIsDrawing(true);
    const { x, y } = e.target.getStage().getPointerPosition();
    let shape = {};

    switch (tool) {
      case 'rect':
        shape = { type: 'rect', x, y, width: 0, height: 0 };
        break;
      case 'circle':
        shape = { type: 'circle', x, y, radius: 0 };
        break;
      case 'line':
        shape = { type: 'line', points: [x, y, x, y] };
        break;
      case 'arrow':
        shape = { type: 'arrow', points: [x, y, x, y] };
        break;
      case 'pencil':
        shape = { type: 'pencil', points: [x, y] };
        break;
      case 'eraser':
        shape = { type: 'eraser', points: [x, y] };
        break;
      default:
        return;
    }
    setShapes([...shapes, shape]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const { x, y } = e.target.getStage().getPointerPosition();
    const newShapes = shapes.slice();
    const shape = newShapes[newShapes.length - 1];

    switch (shape.type) {
      case 'rect':
        shape.width = x - shape.x;
        shape.height = y - shape.y;
        break;
      case 'circle':
        shape.radius = Math.sqrt((x - shape.x) ** 2 + (y - shape.y) ** 2);
        break;
      case 'line':
      case 'arrow':
        shape.points[2] = x;
        shape.points[3] = y;
        break;
      case 'pencil':
      case 'eraser':
        shape.points = [...shape.points, x, y];
        break;
      default:
        break;
    }

    newShapes[newShapes.length - 1] = shape;
    setShapes(newShapes);
    layerRef.current.batchDraw(); // Optimize by only redrawing the layer
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    addToHistory({ type: 'shape', shapes });
  };

  const handleCanvasClick = (e) => {
    if (tool !== 'text') return;
    const { x, y } = e.target.getStage().getPointerPosition();
    const shape = { type: 'text', x, y, text: 'Double-click to edit' };
    setShapes([...shapes, shape]);
    setTextEditing(shapes.length); // Focus on new text shape
    setTimeout(() => {
      textAreaRef.current.focus();
    }, 100);
  };

  const handleTextEdit = (e) => {
    const newShapes = shapes.slice();
    newShapes[textEditing].text = e.target.value;
    setShapes(newShapes);
  };

  const handleTextBlur = () => {
    setTextEditing(null);
    addToHistory({ type: 'shape', shapes });
  };

  const renderShape = (shape, index) => {
    switch (shape.type) {
      case 'rect':
        return (
          <Rect
            key={index}
            x={shape.x}
            y={shape.y}
            width={shape.width}
            height={shape.height}
            stroke="black"
            draggable
            onClick={() => setSelectedShape(index)}
            onTransformEnd={(e) => handleTransform(index, e.target.attrs)}
          />
        );
      case 'circle':
        return (
          <Circle
            key={index}
            x={shape.x}
            y={shape.y}
            radius={shape.radius}
            stroke="black"
            draggable
            onClick={() => setSelectedShape(index)}
            onTransformEnd={(e) => handleTransform(index, e.target.attrs)}
          />
        );
      case 'line':
        return (
          <Line
            key={index}
            points={shape.points}
            stroke="black"
            tension={0.5}
            lineCap="round"
            lineJoin="round"
            draggable
            onClick={() => setSelectedShape(index)}
            onTransformEnd={(e) => handleTransform(index, e.target.attrs)}
          />
        );
      case 'arrow':
        return (
          <Arrow
            key={index}
            points={shape.points}
            stroke="black"
            fill="black"
            pointerLength={10}
            pointerWidth={10}
            lineCap="round"
            lineJoin="round"
            draggable
            onClick={() => setSelectedShape(index)}
            onTransformEnd={(e) => handleTransform(index, e.target.attrs)}
          />
        );
      case 'text':
        return (
          <Text
            key={index}
            x={shape.x}
            y={shape.y}
            text={shape.text}
            fontSize={20}
            draggable
            onDblClick={() => setTextEditing(index)}
            onClick={() => setSelectedShape(index)}
            onTransformEnd={(e) => handleTransform(index, e.target.attrs)}
          />
        );
      case 'pencil':
      case 'eraser':
        return (
          <Line
            key={index}
            points={shape.points}
            stroke={shape.type === 'eraser' ? 'white' : 'black'}
            strokeWidth={shape.type === 'eraser' ? 10 : 2}
            tension={0.5}
            lineCap="round"
            lineJoin="round"
            globalCompositeOperation={shape.type === 'eraser' ? 'destination-out' : 'source-over'}
            draggable
            onClick={() => setSelectedShape(index)}
            onTransformEnd={(e) => handleTransform(index, e.target.attrs)}
          />
        );
      default:
        return null;
    }
  };

  const handleTransform = (index, newAttrs) => {
    const newShapes = shapes.slice();
    newShapes[index] = { ...newShapes[index], ...newAttrs };
    setShapes(newShapes);
    addToHistory({ type: 'shape', shapes: newShapes });
  };

  useEffect(() => {
    if (textEditing !== null) {
      textAreaRef.current.value = shapes[textEditing].text;
      textAreaRef.current.style.top = `${shapes[textEditing].y}px`;
      textAreaRef.current.style.left = `${shapes[textEditing].x}px`;
    }
  }, [textEditing, shapes]);

  return (
    <div className="canvas-container">
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        ref={stageRef}
        onClick={handleCanvasClick} // Add this to handle text tool click
      >
        <Layer ref={layerRef}>
          {shapes.map((shape, index) => renderShape(shape, index))}
          {selectedShape !== null && selectedShape < shapes.length && (
            <Transformer
              ref={transformerRef}
              keepRatio={false}
              nodes={[stageRef.current.findOne(`#${selectedShape}`)]}
            />
          )}
        </Layer>
      </Stage>
      {textEditing !== null && textEditing < shapes.length && (
        <textarea
          ref={textAreaRef}
          onChange={handleTextEdit}
          onBlur={handleTextBlur}
          style={{
            position: 'absolute',
            resize: 'none',
            fontSize: '20px',
            border: 'none',
            outline: 'none',
            padding: '5px',
            background: 'transparent',
            zIndex: 10,
            top: shapes[textEditing].y,
            left: shapes[textEditing].x,
          }}
        />
      )}
    </div>
  );
};

Canvas.propTypes = {
  tool: PropTypes.string.isRequired,
  addToHistory: PropTypes.func.isRequired,
};

export default Canvas;
