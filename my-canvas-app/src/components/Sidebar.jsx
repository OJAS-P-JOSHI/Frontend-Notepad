/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@mui/material';
import { ColorLens, Undo } from '@mui/icons-material';
import { SketchPicker } from 'react-color';

const Sidebar = ({ setTool, undo, color, setColor }) => {
  return (
    <div className="sidebar">
      <IconButton className="tool" onClick={() => setTool('rect')}>
        <span>Rectangle</span>
      </IconButton>
      <IconButton className="tool" onClick={() => setTool('circle')}>
        <span>Circle</span>
      </IconButton>
      <IconButton className="tool" onClick={() => setTool('line')}>
        <span>Line</span>
      </IconButton>
      <IconButton className="tool" onClick={() => setTool('text')}>
        <span>Text</span>
      </IconButton>
      <IconButton className="tool" onClick={() => setTool('pencil')}>
        <span>Pencil</span>
      </IconButton>
      <IconButton className="tool" onClick={undo}>
        <Undo />
      </IconButton>
      <SketchPicker
        color={color}
        onChangeComplete={(newColor) => setColor(newColor.hex)}
      />
    </div>
  );
};

Sidebar.propTypes = {
  setTool: PropTypes.func.isRequired,
  undo: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  setColor: PropTypes.func.isRequired,
};

export default Sidebar;
