import React from 'react';
import PropTypes from 'prop-types';
import Shape from './Shape';

const Sidebar = ({ setTool, undo }) => {
  return (
    <div className="sidebar">
      <Shape shape="Rectangle" />
      <Shape shape="Circle" />
      <Shape shape="Triangle" />
      <Shape shape="TextBox" />
      <div className="tool" onClick={() => setTool('pencil')}>Pencil</div>
      <div className="tool" onClick={undo}>Undo</div>
    </div>
  );
};

Sidebar.propTypes = {
  setTool: PropTypes.func.isRequired,
  undo: PropTypes.func.isRequired,
};

export default Sidebar;
