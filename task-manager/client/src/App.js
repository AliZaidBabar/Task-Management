import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Routes
import Signup from './components/Signup';
import Login from './components/Login';
import TaskManager from './components/TaskManager';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<TaskManager />} />
        </Routes>
      </div>
    </Router>

  );
};

export default App;
