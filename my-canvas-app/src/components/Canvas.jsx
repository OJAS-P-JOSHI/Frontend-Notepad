/* eslint-disable no-unused-vars */


import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Stage, Layer, Rect, Circle, Line, Text, Arrow } from 'react-konva';

const Canvas = ({ tool, shapes, setShapes, addToHistory, color }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [newShape, setNewShape] = useState(null);
  const [lastShapeAdded, setLastShapeAdded] = useState(null);
  const [editingText, setEditingText] = useState(null);
  const textAreaRef = useRef(null);

  const handleMouseDown = (e) => {
    if (tool === 'text' || tool === 'move') return;
    setIsDrawing(true);
    const { x, y } = e.target.getStage().getPointerPosition();
    let shape = {};
    switch (tool) {
      case 'rect':
        shape = { type: 'rect', x, y, width: 0, height: 0, color };
        break;
      case 'circle':
        shape = { type: 'circle', x, y, radius: 0, color };
        break;
      case 'line':
        shape = { type: 'line', points: [x, y, x, y], color };
        break;
      case 'pencil':
        shape = { type: 'pencil', points: [x, y], color };
        break;
      case 'arrow':
        shape = { type: 'arrow', points: [x, y, x, y], color };
        break;
    
    }
    setNewShape(shape);
    setLastShapeAdded(shape);
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
        shape.points = [shape.points[0], shape.points[1], x, y];
        break;
      case 'pencil':
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
    if (tool !== 'text') {
      addToHistory([...shapes, lastShapeAdded]);
    }
  };

  const handleDblClick = (e) => {
    if (tool === 'text') {
      const { x, y } = e.target.getStage().getPointerPosition();
      const shape = { type: 'text', x, y, text: 'Type your text', color };
      setShapes([...shapes, shape]);
      setEditingText(shapes.length);
      setLastShapeAdded(shape);
    }
  };

  useEffect(() => {
    if (editingText !== null && textAreaRef.current) {
      const { x, y } = shapes[editingText];
      textAreaRef.current.style.left = `${x}px`;
      textAreaRef.current.style.top = `${y}px`;
      textAreaRef.current.focus();
    }
  }, [editingText, shapes]);

  const handleTextEdit = (e) => {
    const newShapes = shapes.slice();
    newShapes[editingText].text = e.target.value;
    setShapes(newShapes);
    setLastShapeAdded(newShapes[editingText]);
  };

  const handleTextBlur = () => {
    setEditingText(null);
    addToHistory([...shapes, lastShapeAdded]);
  };

  const handleTextFocus = (e) => {
    if (e.target.value === 'Type your text') {
      e.target.value = '';
    }
  };

  const handleStageClick = (e) => {
    if (tool === 'text' && editingText !== null) {
      setEditingText(null);
    }
  };

  const handleDragEnd = (e, index) => {
    const newShapes = shapes.slice();
    newShapes[index].x = e.target.x();
    newShapes[index].y = e.target.y();
    setShapes(newShapes);
    addToHistory([...newShapes, lastShapeAdded]);
  };

  return (
    <div className="canvas-container">
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDblClick={handleDblClick}
        onClick={handleStageClick}
      >
        <Layer>
          {shapes.map((shape, index) => {
            switch (shape.type) {
              case 'rect':
                return (
                  <Rect
                    key={index}
                    x={shape.x}
                    y={shape.y}
                    width={shape.width}
                    height={shape.height}
                    stroke={shape.color}
                    draggable={tool === 'move'}
                    onDragEnd={(e) => handleDragEnd(e, index)}
                  />
                );
              case 'circle':
                return (
                  <Circle
                    key={index}
                    x={shape.x}
                    y={shape.y}
                    radius={shape.radius}
                    stroke={shape.color}
                    draggable={tool === 'move'}
                    onDragEnd={(e) => handleDragEnd(e, index)}
                  />
                );
              case 'line':
                return (
                  <Line
                    key={index}
                    points={shape.points}
                    stroke={shape.color}
                    tension={0.5}
                    lineCap="round"
                    lineJoin="round"
                  />
                );
              case 'pencil':
                return (
                  <Line
                    key={index}
                    points={shape.points}
                    stroke={shape.color}
                    tension={0.5}
                    lineCap="round"
                    lineJoin="round"
                  />
                );
              case 'arrow':
                return (
                  <Arrow
                    key={index}
                    points={shape.points}
                    stroke={shape.color}
                    tension={0.5}
                    lineCap="round"
                    lineJoin="round"
                  />
                );
              case 'eraser':
                return (
                  <Line
                    key={index}
                    points={shape.points}
                    stroke="#ffffff"
                    tension={0.5}
                    lineCap="round"
                    lineJoin="round"
                  />
                );
              case 'text':
                return (
                  <Text
                    key={index}
                    x={shape.x+3}
                    y={shape.y+10}
                    text={shape.text}
                    fill={shape.color}
                    fontSize={20}
                    draggable={tool === 'move'}
                    onDragEnd={(e) => handleDragEnd(e, index)}
                  />
                );
              default:
                return null;
            }
          })}
        </Layer>
      </Stage>
      {editingText !== null && editingText < shapes.length && (
        <textarea
          ref={textAreaRef}
          value={shapes[editingText].text}
          onChange={handleTextEdit}
          onBlur={handleTextBlur}
          onFocus={handleTextFocus}
          style={{
            position: 'absolute',
            top: shapes[editingText].y,
            left: shapes[editingText].x,
            fontSize: '20px',
            color: shapes[editingText].color,
            background: 'transparent',
            border: '1px dashed black',
            outline: 'none',
            resize: 'none',
            overflow: 'hidden',
            padding: '2px',
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