import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDrop } from 'react-dnd';
import { Stage, Layer, Rect, Circle, RegularPolygon, Line, Text, Transformer } from 'react-konva';

const Canvas = ({ tool, history, addToHistory }) => {
  const [shapes, setShapes] = useState([]);
  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [selectedShape, setSelectedShape] = useState(null);
  const transformerRef = useRef(null);

  useEffect(() => {
    if (history.length > 0) {
      const lastAction = history[history.length - 1];
      if (lastAction.type === 'shape') {
        setShapes(lastAction.shapes);
      } else if (lastAction.type === 'line') {
        setLines(lastAction.lines);
      }
    } else {
      setShapes([]);
      setLines([]);
    }
  }, [history]);

  const [, drop] = useDrop(() => ({
    accept: 'shape',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const newShapes = [
        ...shapes,
        { shape: item.shape, x: offset.x, y: offset.y, width: 100, height: 100 }
      ];
      setShapes(newShapes);
      addToHistory({ type: 'shape', shapes: newShapes });
    }
  }));

  const handleMouseDown = (e) => {
    if (tool !== 'pencil') return;
    setIsDrawing(true);
    const pos = e.target.getStage().getPointerPosition();
    const newLines = [...lines, { points: [pos.x, pos.y] }];
    setLines(newLines);
    addToHistory({ type: 'line', lines: newLines });
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    const newLines = [...lines];
    newLines.splice(newLines.length - 1, 1, lastLine);
    setLines(newLines);
    addToHistory({ type: 'line', lines: newLines });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleSelect = (e) => {
    setSelectedShape(e.target);
    transformerRef.current.nodes([e.target]);
    transformerRef.current.getLayer().batchDraw();
  };

  const handleTransform = (index, newAttrs) => {
    const newShapes = shapes.slice();
    newShapes[index] = { ...newShapes[index], ...newAttrs };
    setShapes(newShapes);
    addToHistory({ type: 'shape', shapes: newShapes });
  };

  return (
    <div ref={drop} className="canvas-container">
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {shapes.map((shape, index) => {
            let shapeElement;
            if (shape.shape === 'Rectangle') {
              shapeElement = (
                <Rect
                  key={index}
                  x={shape.x}
                  y={shape.y}
                  width={shape.width}
                  height={shape.height}
                  stroke="blue"
                  draggable
                  onClick={handleSelect}
                  onTransformEnd={(e) => {
                    handleTransform(index, {
                      x: e.target.x(),
                      y: e.target.y(),
                      width: e.target.width(),
                      height: e.target.height(),
                    });
                  }}
                />
              );
            } else if (shape.shape === 'Circle') {
              shapeElement = (
                <Circle
                  key={index}
                  x={shape.x}
                  y={shape.y}
                  radius={shape.width / 2}
                  stroke="green"
                  draggable
                  onClick={handleSelect}
                  onTransformEnd={(e) => {
                    handleTransform(index, {
                      x: e.target.x(),
                      y: e.target.y(),
                      width: e.target.width(),
                      height: e.target.height(),
                    });
                  }}
                />
              );
            } else if (shape.shape === 'Triangle') {
              shapeElement = (
                <RegularPolygon
                  key={index}
                  x={shape.x}
                  y={shape.y}
                  sides={3}
                  radius={shape.width / 2}
                  stroke="red"
                  draggable
                  onClick={handleSelect}
                  onTransformEnd={(e) => {
                    handleTransform(index, {
                      x: e.target.x(),
                      y: e.target.y(),
                      width: e.target.width(),
                      height: e.target.height(),
                    });
                  }}
                />
              );
            } else if (shape.shape === 'TextBox') {
              shapeElement = (
                <Text
                  key={index}
                  x={shape.x}
                  y={shape.y}
                  text="Text"
                  fontSize={20}
                  draggable
                  onClick={handleSelect}
                  onTransformEnd={(e) => {
                    handleTransform(index, {
                      x: e.target.x(),
                      y: e.target.y(),
                      width: e.target.width(),
                      height: e.target.height(),
                    });
                  }}
                />
              );
            }
            return shapeElement;
          })}
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="black"
              strokeWidth={2}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={
                tool === 'eraser' ? 'destination-out' : 'source-over'
              }
            />
          ))}
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
    </div>
  );
};

Canvas.propTypes = {
  tool: PropTypes.string.isRequired,
  history: PropTypes.array.isRequired,
  addToHistory: PropTypes.func.isRequired,
};

export default Canvas;
