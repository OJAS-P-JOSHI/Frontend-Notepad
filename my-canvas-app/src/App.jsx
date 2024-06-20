import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './index.css';

const App = () => {
  const [tool, setTool] = useState('');
  const [shapes, setShapes] = useState([]);
  const [color, setColor] = useState('#000000'); // Default color black
  const [history, setHistory] = useState([]);

  const undo = () => {
    setHistory((prevHistory) => {
      if (prevHistory.length === 0) return prevHistory;
      const previousHistory = prevHistory.slice(0, -1);
      setShapes(previousHistory.length ? previousHistory[previousHistory.length - 1] : []);
      return previousHistory;
    });
  };

  const addToHistory = (newShapes) => {
    setHistory((prevHistory) => [...prevHistory, newShapes]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app-container">
        <Sidebar
          setTool={setTool}
          undo={undo}
          color={color}
          setColor={setColor}
          stageRef={{ current: { handleExportPNG: () => {} } }} // Placeholder for ref
        />
        <Canvas
          tool={tool}
          shapes={shapes}
          setShapes={setShapes}
          addToHistory={addToHistory}
          color={color}
          stageRef={{ current: { handleExportPNG: () => {}, handleExportPDF: () => {} } }} // Placeholder for ref
        />
      </div>
    </DndProvider>
  );
};

export default App;
