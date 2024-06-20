import React from 'react';
import PropTypes from 'prop-types';
import { Rect, Circle, Line, Text } from 'react-konva';

const Shape = ({ type, shape, tool, handleDragEnd, handleDblClick }) => {
  switch (type) {
    case 'rect':
      return (
        <Rect
          x={shape.x}
          y={shape.y}
          width={shape.width}
          height={shape.height}
          stroke={shape.color}
          draggable={tool === 'move'}
          onDragEnd={handleDragEnd}
        />
      );
    case 'circle':
      return (
        <Circle
          x={shape.x}
          y={shape.y}
          radius={shape.radius}
          stroke={shape.color}
          draggable={tool === 'move'}
          onDragEnd={handleDragEnd}
        />
      );
    case 'line':
      return (
        <Line
          points={shape.points}
          stroke={shape.color}
          tension={0.5}
          lineCap="round"
          lineJoin="round"
        />
      );
    case 'text':
      return (
        <Text
          x={shape.x}
          y={shape.y}
          text={shape.text}
          fill={shape.color}
          fontSize={20}
          draggable={tool === 'move'}
          onDragEnd={handleDragEnd}
          onDblClick={handleDblClick}
        />
      );
    default:
      return null;
  }
};

Shape.propTypes = {
  type: PropTypes.string.isRequired,
  shape: PropTypes.object.isRequired,
  tool: PropTypes.string.isRequired,
  handleDragEnd: PropTypes.func.isRequired,
  handleDblClick: PropTypes.func,
};

export default Shape;
