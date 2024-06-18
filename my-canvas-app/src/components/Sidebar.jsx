/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Popover, Box } from '@mui/material';
import { Rectangle, PanTool, Circle, ArrowUpward, TextFields, Undo, GetApp, Create } from '@mui/icons-material';
import { SketchPicker } from 'react-color';


const Sidebar = ({ setTool, undo, color, setColor, stageRef }) => {
  const [anchorEl, setAnchorEl] = useState(null);

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

  const exportToPDF = () => {
    const uri = stageRef.current.toDataURL({ mimeType: 'image/jpeg' });
    const pdf = new jsPDF();
    pdf.addImage(uri, 'JPEG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
    pdf.save('canvas-drawing.pdf');
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
      <IconButton className="tool" onClick={handleClick}>
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