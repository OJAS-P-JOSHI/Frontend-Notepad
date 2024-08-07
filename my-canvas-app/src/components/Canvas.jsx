//src\components\Canvas.jsx
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Stage, Layer, Rect, Circle, Line, Text, Arrow, Image } from 'react-konva';
import { getCanvas } from '../api-handling/api'; // Import getCanvas function from api.js

const Canvas = ({ tool, shapes, setShapes, addToHistory, color, stageRef, setTool }) => { // Include stageRef prop
  const [isDrawing, setIsDrawing] = useState(false);
  const [newShape, setNewShape] = useState(null);
  const [lastShapeAdded, setLastShapeAdded] = useState(null);
  const [editingText, setEditingText] = useState(null);
  const textAreaRef = useRef(null);
  // const canvasRef = useRef(null); // Remove this line as stageRef is used instead

  useEffect(() => {
    ;(async () => {
      await getCanvas(setShapes);
    })()
  }, [setShapes]);

  const handleMouseDown = (e) => {
    if (tool === 'text' || tool === 'move') return;
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
    setIsDrawing(true);
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
        shape.points = [shape.points[0], shape.points[1], x, y];
        break;
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
    if (isDrawing) {
      setIsDrawing(false);
      if (tool !== 'text') {
        const updatedShapes = shapes.slice(0, -1);
        if (newShape.type === 'arrow' || newShape.type === 'line') {
          if (newShape.points[0] !== newShape.points[2] || newShape.points[1] !== newShape.points[3]) {
            updatedShapes.push(newShape);
          }
        } else {
          updatedShapes.push(newShape);
        }
        setShapes(updatedShapes);
        addToHistory(updatedShapes);
      }
      setTool('move');
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
      const textarea = textAreaRef.current;
      textarea.style.left = `${x}px`;
      textarea.style.top = `${y}px`;
      textarea.style.display = 'block';
      textarea.value = shapes[editingText].text;
      textarea.focus();
    }
  }, [editingText, shapes]);

  const handleTextEdit = (e) => {
    const newShapes = shapes.slice();
    newShapes[editingText].text = e.target.value;
    setShapes(newShapes);
    setLastShapeAdded(newShapes[editingText]);
  };

  const handleTextBlur = () => {
    if (editingText !== null) {
      const newShapes = shapes.slice();
      if (newShapes[editingText].text === '' || newShapes[editingText].text === 'Type your text') {
        newShapes.splice(editingText, 1); // Remove the text shape if it's empty or default text
        setShapes(newShapes);
      }
      setEditingText(null);
      textAreaRef.current.style.display = 'none'; // Hide textarea on blur
      addToHistory([...newShapes]);
      setTool('move');
    }
  };

  const handleTextFocus = (e) => {
    if (e.target.value === 'Type your text') {
      e.target.value = '';
    }
  };

  const handleCanvasClick = (e) => {
    if (tool === 'text') {
      setEditingText(null); // This will blur the textarea and add the text to the canvas
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
        onClick={handleCanvasClick}
        ref={stageRef} // Use stageRef here
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
                  <>
                    <Line
                      key={`${index}-line`}
                      points={shape.points}
                      stroke={shape.color}
                      tension={0.5}
                      lineCap="round"
                      lineJoin="round"
                    />
                    {shape.points.length > 2 && (
                      <Arrow
                        key={`${index}-arrow`}
                        points={shape.points}
                        stroke={shape.color}
                        fill={shape.color}
                        pointerLength={10}
                        pointerWidth={10}
                      />
                    )}
                  </>
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
                  editingText !== index && (
                    <Text
                      key={index}
                      x={shape.x}
                      y={shape.y}
                      text={shape.text}
                      fill={shape.color}
                      fontSize={20}
                      draggable={tool === 'move'}
                      onDragEnd={(e) => handleDragEnd(e, index)}
                      onDblClick={() => setEditingText(index)}
                    />
                  )
                );
              case 'image':
                return (
                  <Image
                    key={index}
                    image={new window.Image(shape.src)}
                    x={shape.x}
                    y={shape.y}
                    width={shape.width}
                    height={shape.height}
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
      <textarea
        ref={textAreaRef}
        onChange={handleTextEdit}
        onBlur={handleTextBlur}
        onFocus={handleTextFocus}
        style={{
          position: 'absolute',
          fontSize: '20px',
          color: shapes[editingText]?.color || 'black',
          border: '1px solid black',
          resize: 'both',
          overflow: 'auto',
          padding: '2px',
          minWidth: '500px',
          display: editingText !== null ? 'block' : 'none',
          top: shapes[editingText]?.y || 0,
          left: shapes[editingText]?.x || 0,
        }}
      />
    </div>
  );
};

Canvas.propTypes = {
  tool: PropTypes.string.isRequired,
  shapes: PropTypes.array.isRequired,
  setShapes: PropTypes.func.isRequired,
  addToHistory: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  stageRef: PropTypes.object.isRequired, // Add prop type for stageRef
};

export default Canvas;
