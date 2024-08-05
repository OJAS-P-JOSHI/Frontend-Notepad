//src\components\PngExp.jsx
/* eslint-disable no-unused-vars */
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@mui/material';
import { ImageSearch } from '@mui/icons-material';

const PngExp = ({ setShapes }) => {
  const inputFileRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.src = reader.result;
      img.onload = () => {
        const shape = {
          type: 'image',
          x: 50,
          y: 50,
          width: img.width,
          height: img.height,
          src: reader.result,
        };
        setShapes((prevShapes) => [...prevShapes, shape]);
      };
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <IconButton className="tool" onClick={() => inputFileRef.current.click()}>
        <ImageSearch />
      </IconButton>
      <input
        type="file"
        accept="image/png"
        style={{ display: 'none' }}
        ref={inputFileRef}
        onChange={handleFileChange}
      />
    </>
  );
};

PngExp.propTypes = {
  setShapes: PropTypes.func.isRequired,
};

export default PngExp;
