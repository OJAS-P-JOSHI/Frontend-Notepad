/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './index.css';

const App = () => {
  const [tool, setTool] = useState('');
  const [history, setHistory] = useState([]);

  const undo = () => {
    setHistory((prevHistory) => {
      if (prevHistory.length === 0) return prevHistory;
      return prevHistory.slice(0, -1);
    });
  };

  const addToHistory = (action) => {
    setHistory((prevHistory) => [...prevHistory, action]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app-container">
      <Sidebar setTool={setTool} undo={undo} />
      <Canvas tool={tool} addToHistory={addToHistory} />
      </div>
    </DndProvider>
  );
};

export default App;
