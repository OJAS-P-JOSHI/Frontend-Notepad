// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import CircleIcon from '@mui/icons-material/Circle';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TextFieldsIcon from '@mui/icons-material/TextFields';

import { ColorLens } from '@mui/icons-material';
import { SketchPicker } from 'react-color';

const Sidebar = ({ setTool, color, handleColorChange }) => {
  return (
    <div className="sidebar">
      <IconButton className="tool" onClick={() => setTool('rect')}>
        <CropSquareIcon />
      </IconButton>
      <IconButton className="tool" onClick={() => setTool('circle')}>
        <CircleIcon />
      </IconButton>
      <IconButton className="tool" onClick={() => setTool('line')}>
        <ShowChartIcon />
      </IconButton>
      <IconButton className="tool" onClick={() => setTool('text')}>
        <TextFieldsIcon />
      </IconButton>
      <IconButton className="tool" onClick={() => setTool('pencil')}>
        <CreateIcon />
      </IconButton>
      <IconButton className="tool" onClick={() => setTool('color')}>
        <ColorLens />
      </IconButton>
      <SketchPicker color={color} onChange={handleColorChange} />
    </div>
  );
};

Sidebar.propTypes = {
  setTool: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  handleColorChange: PropTypes.func.isRequired,
};

export default Sidebar;
