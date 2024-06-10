import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import CircleIcon from '@mui/icons-material/Circle';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { ColorLens } from '@mui/icons-material'; // Assuming ColorLens is the icon for the color picker
import UndoIcon from '@mui/icons-material/Undo';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteIcon from '@mui/icons-material/Delete';

const Sidebar = ({ setTool, undo }) => {
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
      <IconButton className="tool" onClick={() => setTool('arrow')}>
        <ArrowForwardIcon />
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
      <IconButton className="tool" onClick={() => setTool('eraser')}>
        <DeleteIcon />
      </IconButton>
      <IconButton className="tool" onClick={undo}>
        <UndoIcon />
      </IconButton>
    </div>
  );
};

Sidebar.propTypes = {
  setTool: PropTypes.func.isRequired,
  undo: PropTypes.func.isRequired,
};

export default Sidebar;
