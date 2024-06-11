/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, Slider } from '@mui/material';
import { SketchPicker } from 'react-color';

import RectangleIcon from '@mui/icons-material/Rectangle';
import CircleIcon from '@mui/icons-material/Circle';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import UndoIcon from '@mui/icons-material/Undo';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteIcon from '@mui/icons-material/Delete';
import DrawIcon from '@mui/icons-material/Draw';
import ColorLensIcon from '@mui/icons-material/ColorLens';

const Sidebar = ({ setTool, undo, color, setColor, size, setSize }) => {
  const handleSizeChange = (event, newSize) => {
    setSize(newSize);
  };

  return (
    <div className="sidebar">
      <IconButton className="tool" onClick={() => setTool('rect')}>
        <RectangleIcon />
      </IconButton>
      <IconButton className="tool" onClick={() => setTool('circle')}>
        <CircleIcon />
      </IconButton>
      <IconButton className="tool" onClick={() => setTool('line')}>
        <HorizontalRuleIcon />
      </IconButton>
      <IconButton className="tool" onClick={() => setTool('text')}>
        <TextFieldsIcon />
      </IconButton>
      <IconButton className="tool" onClick={() => setTool('pencil')}>
        <DrawIcon />
      </IconButton>
      <IconButton className="tool" onClick={() => setTool('arrow')}>
        <ArrowForwardIcon />
      </IconButton>
      <IconButton className="tool" onClick={undo}>
        <UndoIcon />
      </IconButton>
      <IconButton className="tool" onClick={() => setTool('colorlens')}>
        <ColorLensIcon />
      </IconButton>
      <IconButton className="tool" onClick={() => setTool('eraser')}>
        <DeleteIcon />
      </IconButton>
      <SketchPicker
        color={color}
        onChangeComplete={(newColor) => setColor(newColor.hex)}
      />
      <Slider
        value={size}
        onChange={handleSizeChange}
        aria-labelledby="size-slider"
        min={1}
        max={20}
        step={1}
      />
    </div>
  );
};

Sidebar.propTypes = {
  setTool: PropTypes.func.isRequired,
  undo: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  setColor: PropTypes.func.isRequired,
  size: PropTypes.number.isRequired,
  setSize: PropTypes.func.isRequired,
};

export default Sidebar;
