import React from 'react';
import PropTypes from 'prop-types';
import { useDrag } from 'react-dnd';

const Shape = ({ shape }) => {
  const [, drag] = useDrag(() => ({
    type: 'shape',
    item: { shape },
  }));

  return (
    <div ref={drag} className="tool">
      {shape}
    </div>
  );
};

Shape.propTypes = {
  shape: PropTypes.string.isRequired,
};


export default Shape;
