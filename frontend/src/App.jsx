// frontend/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import ToDoList from './pages/ToDoList';
import CreateToDo from './pages/CreateToDo';
import EditToDo from './pages/EditToDo';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <ToDoList /> : <Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/todos" element={isAuthenticated ? <ToDoList /> : <Navigate to="/login" />} />
        <Route path="/create" element={isAuthenticated ? <CreateToDo /> : <Navigate to="/login" />} />
        <Route path="/edit/:id" element={isAuthenticated ? <EditToDo /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
