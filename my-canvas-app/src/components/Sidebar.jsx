import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@mui/material';
import { Rectangle, PanTool, Circle, ArrowUpward, TextFields, Undo, GetApp, Create, ColorLens } from '@mui/icons-material';
import { SketchPicker } from 'react-color';

const Sidebar = ({ setTool, undo, color, setColor, stageRef }) => {
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

      <IconButton className="tool" onClick={() => stageRef.current.handleExportPNG()}>
        <GetApp />
      </IconButton>
      <IconButton className="tool" onClick={() => stageRef.current.handleExportPDF()}>
        <GetApp />
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
};

export default Sidebar;

