//src\App.jsx
/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import ProjectDashboard from './components/ProjectDashboard/ProjectDashboard.jsx'; // Import Dashboard component
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './index.css';

const App = () => {
  const [tool, setTool] = useState('');
  const [history, setHistory] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [color, setColor] = useState('#000000'); // Default color black
  const stageRef = useRef(null); // Create a ref for the Stage

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
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <div className="app-container">
                <Sidebar
                  setTool={setTool}
                  undo={undo}
                  color={color}
                  setColor={setColor}
                  stageRef={stageRef} // Pass stageRef to Sidebar
                  shapes={shapes}
                  setShapes={setShapes} // Pass setShapes to Sidebar
                />
                <Canvas
                  tool={tool}
                  shapes={shapes}
                  setShapes={setShapes}
                  addToHistory={addToHistory}
                  color={color}
                  stageRef={stageRef} // Pass stageRef to Canvas
                  setTool={setTool}
                />
              </div>
            }
          />
          <Route path="/dashboard" element={<ProjectDashboard />} />
        </Routes>
      </Router>
    </DndProvider>
  );
};

export default App;
