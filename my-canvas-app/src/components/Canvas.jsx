import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDrop } from 'react-dnd';
import { Stage, Layer, Rect, Circle, RegularPolygon, Line, Text, Transformer } from 'react-konva';
import Sidebar from './Sidebar';

const Canvas = ({ tool, setTool,   history, addToHistory }) => {
  const [shapes, setShapes] = useState([]);
  //const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [newShape, setNewShape] = useState(null);
  const [selectedShape, setSelectedShape] = useState(null);
  const transformerRef = useRef(null);
  const [editingText, setEditingText] = useState(null);
  const textAreaRef = useRef(null);

  // useEffect(() => {
  //   if (history.length > 0) {
  //     const lastAction = history[history.length - 1];
  //     if (lastAction.type === 'shape') {
  //       setShapes(lastAction.shapes);
  //     } else if (lastAction.type === 'line') {
  //       setLines(lastAction.lines);
  //     }
  //   } else {
  //     setShapes([]);
  //     setLines([]);
  //   }
  // }, [history]);

  // const [, drop] = useDrop(() => ({
  //   accept: 'shape',
  //   drop: (item, monitor) => {
  //     const offset = monitor.getClientOffset();
  //     const newShapes = [
  //       ...shapes,
  //       { shape: item.shape, x: offset.x, y: offset.y, width: 100, height: 100 }
  //     ];
  //     setShapes(newShapes);
  //     addToHistory({ type: 'shape', shapes: newShapes });
  //   }
  // }));

  const handleMouseDown = (e) => {
    if(!selectedShape) return;
    setIsDrawing(true);
    const {x, y} = e.target.getStage().getPointerPosition();
    let shape = {};
    switch (selectedShape) {
      case 'rect':
        shape = {type: 'rect', x, y, width: 0, height: 0};
        break;
      case 'circle':
        shape = {type: 'circle', x, y, radius: 0};
        break;
      case 'line':
        shape = {type: 'line', points: [x, y, x, y]};
        break;
      case 'text':
        shape = {type: 'text', x, y, text: 'Text'};
        setEditingText(shape.length);
        break;
    
      default:
        return;
    }
    setNewShape(shape);
    setShapes([...shapes, shape]);
  };

  const handleMouseMove = (e) => {
    if(!isDrawing) return;
    const {x, y} = e.target.getStage().getPointerPosition();
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
      default:
        break;
    }
    setShapes(newShapes);
    setTool('');
  }

  const handleMouseUp = () => {
    setIsDrawing(false);
    setNewShape(null);
  };

  useEffect(() => {
    setSelectedShape(tool);
  }, [tool]);

  const handleTextEdit = (e) => {
    const newShapes = shapes.slice();
    newShapes[editingText].text = e.target.value;
    setShapes(newShapes);
  } 

  const handleTextBlur = () => {
    setEditingText(null);
  }

  const renderRect = (shape, index) => {
    return (
      <Rect
        key={index}
        x={shape.x}
        y={shape.y}
        width={shape.width}
        height={shape.height}
        stroke='black'
        />
    )
  }

  const renderCircle = (shape, index) => {
    return (
      <Circle
        key={index}
        x={shape.x}
        y={shape.y}
        radius={shape.radius}
        stroke='black'
        />
    )
  }

  const renderLine = (shape, index) => {
    return (
      <Line
        key={index}
        points={shape.points}
        stroke='black'
        tension={0.5}
        lineCap="round"
        lineJoin="round"
        globalCompositeOperation={
          tool === 'eraser' ? 'destination-out' : 'source-over'
        }
        />
    )
  }

  const renderText = (shape, index) => {
    return (
      <Text
        key={index}
        x={shape.x}
        y={shape.y}
        text={shape.text}
        fontSize={20}
        //draggable
        onDblClick={
          () => {
            setEditingText(index);
            textAreaRef.current.focus();
          }
        }
        // onClick={() => {
        //   transformerRef.current.nodes([shape]);
        // }}
        />
    )
  }


  const handleTransform = (index, newAttrs) => {
    const newShapes = shapes.slice();
    newShapes[index] = { ...newShapes[index], ...newAttrs };
    setShapes(newShapes);
    addToHistory({ type: 'shape', shapes: newShapes });
  };

  return (
    <div className="canvas-container">
      {/* <Sidebar setSelectedShape={setSelectedShape}/> */}
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
                default:
                  return null;
          }})}
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
  // tool: PropTypes.string.isRequired,
  // history: PropTypes.array.isRequired,
  // addToHistory: PropTypes.func.isRequired,
};

export default Canvas;
