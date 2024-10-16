// frontend/src/pages/ToDoList.jsx

import React, { useState, useEffect } from 'react';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';

function ToDoList() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodos();
    // eslint-disable-next-line
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await api.get('/todos');
      setTodos(response.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // Token might be invalid or expired
        alert('Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Failed to fetch ToDos');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ToDo?')) return;
    try {
      await api.delete(`/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
      alert('ToDo deleted successfully');
    } catch (err) {
      setError('Failed to delete ToDo');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>My ToDos</h2>
        <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
      </div>
      <Link to="/create" className="btn btn-success mb-3">Create New ToDo</Link>
      {error && <div className="alert alert-danger">{error}</div>}
      {todos.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Completed</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos.map(todo => (
              <tr key={todo._id}>
                <td>{todo.title}</td>
                <td>{todo.description}</td>
                <td>
                  <input type="checkbox" checked={todo.completed} readOnly />
                </td>
                <td>
                  <Link to={`/edit/${todo._id}`} className="btn btn-primary btn-sm me-2">Edit</Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(todo._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>You have no ToDos. Click "Create New ToDo" to add one.</p>
      )}
    </div>
  );
}

export default ToDoList;
