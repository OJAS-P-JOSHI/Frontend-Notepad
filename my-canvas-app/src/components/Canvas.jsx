/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Stage, Layer, Rect, Circle, Line, Arrow, Text, Transformer } from 'react-konva';

const Canvas = ({ tool, shapes, setShapes, addToHistory, color, size}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [newShape, setNewShape] = useState(null);
  const [selectedShape, setSelectedShape] = useState(null);
  const transformerRef = useRef(null);
  const [editingText, setEditingText] = useState(null);
  const textAreaRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const { x, y } = e.target.getStage().getPointerPosition();
    let shape = {};
    switch (tool) {
      case 'rect':
        shape = { type: 'rect', x, y, width: 0, height: 0, color, size };
        break;
      case 'circle':
        shape = { type: 'circle', x, y, radius: 0, color, size };
        break;
      case 'line':
        shape = { type: 'line', points: [x, y, x, y], color, size };
        break;
      case 'text':
        shape = { type: 'text', x, y, text: 'Text', color, size };
        setEditingText(shapes.length);
        break;
      case 'pencil':
        shape = { type: 'pencil', points: [x, y], color, size };
        break;
        case 'arrow':
          shape = { type: 'arrow', points: [x, y, x, y], color, size };
          break;
      case 'eraser':
        shape = { type: 'eraser', points: [x, y], color: '#ffffff', size };
        break;
      default:
        return;
    }
    setNewShape(shape);
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
        shape.points[2] = x;
        shape.points[3] = y;
        break;
      case 'pencil':
        shape.points = [...shape.points, x, y];
        break;
        case 'eraser':
          shape.points = [...shape.points, x, y];
          break;
      default:
        break;
    }
    setShapes(newShapes);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setNewShape(null);
    addToHistory([...shapes]);
  };

  useEffect(() => {
    setSelectedShape(tool);
  }, [tool]);

  const handleTextEdit = (e) => {
    const newShapes = shapes.slice();
    newShapes[editingText].text = e.target.value;
    setShapes(newShapes);
  };

  const handleTextBlur = () => {
    setEditingText(null);
  };

  const renderRect = (shape, index) => {
    return (
      <Rect
        key={index}
        x={shape.x}
        y={shape.y}
        width={shape.width}
        height={shape.height}
        stroke={shape.color}
        strokeWidth={shape.size}
      />
    );
  };

  const renderCircle = (shape, index) => {
    return (
      <Circle
        key={index}
        x={shape.x}
        y={shape.y}
        radius={shape.radius}
        stroke={shape.color}
        strokeWidth={shape.size}
      />
    );
  };

  const renderLine = (shape, index) => {
    return (
      <Line
        key={index}
        points={shape.points}
        stroke={shape.color}
        strokeWidth={shape.size}
        tension={0.5}
        lineCap="round"
        lineJoin="round"
        globalCompositeOperation={
          tool === 'eraser' ? 'destination-out' : 'source-over'
        }
      />
    );
  };

  const renderArrow = (shape, index) => {
    return (
      <Arrow
        key={index}
        points={shape.points}
        stroke={shape.color}
        fill={shape.color}
        strokeWidth={shape.size}
        pointerLength={10}
        pointerWidth={10}
        lineCap="round"
        lineJoin="round"
        draggable
        onClick={() => setSelectedShape(index)}
        onTransformEnd={(e) => handleTransform(index, e.target.attrs)}
      />
    );
  };

  const renderText = (shape, index) => {
    return (
      <Text
        key={index}
        x={shape.x}
        y={shape.y}
        text={shape.text}
        fill={shape.color}
        fontSize={20}
        onDblClick={() => {
          setEditingText(index);
          textAreaRef.current.focus();
        }}
      />
    );
  };



  const renderPencil = (shape, index) => {
    return (
      <Line
        key={index}
        points={shape.points}
        stroke={shape.color}
        strokeWidth={shape.size}
        tension={0.5}
        lineCap="round"
        lineJoin="round"
      />
    );
  };

  const handleTransform = (index, newAttrs) => {
    const newShapes = shapes.slice();
    newShapes[index] = { ...newShapes[index], ...newAttrs };
    setShapes(newShapes);
    addToHistory(newShapes);
  };

  return (
    <div className="canvas-container">
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {shapes.map((shape, index) => {
            switch (shape.type) {
              case 'rect':
                return renderRect(shape, index);
              case 'circle':
                return renderCircle(shape, index);
              case 'line':
                return renderLine(shape, index);
              case 'text':
                return renderText(shape, index);
              case 'pencil':
                return renderPencil(shape, index);
              case 'arrow':
                return renderLine(shape, index);
              case 'eraser':
                return renderLine(shape, index);
              default:
                return null;
            }
          })}
          <Transformer
            ref={transformerRef}
            keepRatio={false}
            enabledAnchors={[
              'top-left',
              'top-right',
              'bottom-left',
              'bottom-right',
              'middle-left',
              'middle-right',
              'top-center',
              'bottom-center',
            ]}
          />
        </Layer>
      </Stage>
      {editingText !== null && editingText < shapes.length && (
        <textarea
          ref={textAreaRef}
          value={shapes[editingText].text}
          onChange={handleTextEdit}
          onBlur={handleTextBlur}
          style={{
            position: 'absolute',
            top: shapes[editingText].y,
            left: shapes[editingText].x,
          }}
        />
      )}
    </div>
  );
};

Canvas.propTypes = {
  tool: PropTypes.string.isRequired,
  shapes: PropTypes.array.isRequired,
  setShapes: PropTypes.func.isRequired,
  addToHistory: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
};

export default Canvas;
