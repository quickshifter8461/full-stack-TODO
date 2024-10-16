// frontend/src/pages/EditToDo.jsx

import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate, useParams, Link } from 'react-router-dom';

function EditToDo() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    completed: false,
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchToDo();
    // eslint-disable-next-line
  }, []);

  const fetchToDo = async () => {
    try {
      const response = await api.get('/todos');
      const todo = response.data.find(item => item._id === id);
      if (todo) {
        setForm({
          title: todo.title,
          description: todo.description,
          completed: todo.completed,
        });
      } else {
        setError('ToDo not found');
      }
    } catch (err) {
      setError('Failed to fetch ToDo');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/todos/${id}`, {
        title: form.title,
        description: form.description,
        completed: form.completed,
      });
      alert('ToDo updated successfully');
      navigate('/todos');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setError(err.response.data.errors.map(e => e.msg).join(', '));
      } else {
        setError('Failed to update ToDo');
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2>Edit ToDo</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={form.description}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            name="completed"
            checked={form.completed}
            onChange={handleChange}
          />
          <label className="form-check-label">Completed</label>
        </div>
        <button type="submit" className="btn btn-primary">Update</button>
        <Link to="/todos" className="btn btn-secondary ms-2">Cancel</Link>
      </form>
    </div>
  );
}

export default EditToDo;
