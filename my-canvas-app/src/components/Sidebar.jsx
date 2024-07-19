/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Popover, Box } from '@mui/material';
import { Rectangle, PanTool, Circle, ArrowUpward, TextFields, Undo, GetApp, Create, ColorLens, FileDownload } from '@mui/icons-material'; // Import FileDownload icon
import { SketchPicker } from 'react-color';
import PngExp from './PngExp'; // Import PngExp component
import {handleSave} from '../api-handling/api';

const Sidebar = ({ setTool, undo, color, setColor, stageRef, setShapes }) => { // Include stageRef prop
  const [anchorEl, setAnchorEl] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleColorIconEnter = () => {
    setShowColorPicker(true);
  };

  const handleColorIconLeave = () => {
    setShowColorPicker(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleColorChange = (newColor) => {
    setColor(newColor.hex);
    handleClose();
  };

  const exportToImage = (format) => {
    const uri = stageRef.current.toDataURL({ mimeType: `image/${format}` });
    const link = document.createElement('a');
    link.href = uri;
    link.download = `canvas-drawing.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="sidebar">
      <IconButton className="tool" onClick={() => setTool('rect')}>
        <Rectangle />
      </IconButton>
      <IconButton className="tool" onClick={() => setTool('circle')}>
        <Circle />
      </IconButton>
      <IconButton className="tool" onClick={() => setTool('line')}>
        <ArrowUpward />
      </IconButton>
      <IconButton className="tool" onClick={() => setTool('text')}>
        <TextFields />
      </IconButton>
      <IconButton className="tool" onClick={() => setTool('move')}>
        <PanTool />
      </IconButton>
      <IconButton className="tool" onClick={() => setTool('pencil')}>
        <Create />
      </IconButton>
      <IconButton className="tool" onClick={undo}>
        <Undo />
      </IconButton>
      <button className='save-btn' onClick={handleSave}>Save</button>

      <div
        onMouseEnter={handleColorIconEnter}
        onMouseLeave={handleColorIconLeave}
        style={{ position: 'relative', display: 'inline-block' }}
      >
        <IconButton className="tool">
          <ColorLens />
        </IconButton>
        {showColorPicker && (
          <div style={{ position: 'absolute', top: '100%', left: '0', zIndex: 1 }}>
            <SketchPicker color={color} onChangeComplete={(newColor) => setColor(newColor.hex)} />
          </div>
        )}
      </div>

      <IconButton className="tool" onClick={() => exportToImage('png')}>
        <FileDownload /> {/* Export as PNG button */}
      </IconButton>
    </div>
  );
};

Sidebar.propTypes = {
  setTool: PropTypes.func.isRequired,
  undo: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  setColor: PropTypes.func.isRequired,
  stageRef: PropTypes.object.isRequired,
  setShapes: PropTypes.func.isRequired, // Add prop type for setShapes
};

export default Sidebar;
