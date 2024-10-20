import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate, useParams, Link } from "react-router-dom";

function EditToDo() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    completed: false,
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchToDo();
  }, []);

  const fetchToDo = async () => {
    try {
      const response = await api.get("/todos");
      const todo = response.data.find((item) => item._id === id);
      if (todo) {
        setForm({
          title: todo.title,
          description: todo.description,
          completed: todo.completed,
        });
      } else {
        setError("ToDo not found");
      }
    } catch (err) {
      setError("Failed to fetch ToDo");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const toggleCompleted = () => {
    setForm((prevForm) => ({
      ...prevForm,
      completed: !prevForm.completed,  // Toggle between true and false
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/todos/${id}`, {
        title: form.title,
        description: form.description,
        completed: form.completed,
      });
      alert("ToDo updated successfully");
      navigate("/todos");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setError(err.response.data.errors.map((e) => e.msg).join(", "));
      } else {
        setError("Failed to update ToDo");
      }
    }
  };

  return (
    <div className="center d-flex align-items-center justify-content-center">
      <div className="box position-relative p-4 text-center bg-body border rounded-5">
        <h2>Edit ToDo</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
            <label className="form-label">Title</label>
          </div>
          <div className="form-floating mb-3">
            <textarea
              className="form-control"
              name="description"
              value={form.description}
              onChange={handleChange}
            ></textarea>
            <label className="form-label">Description</label>
          </div>
          <div className="mb-3">
            <button
              type="button"
              className={`w-100 fs-4 btn ${form.completed ? 'btn-warning' : 'btn-success'}` }
              onClick={toggleCompleted}
            >
              {form.completed ? "Mark as Pending" : "Mark as Completed"}
            </button>
          </div>
          <button type="submit" className="btn btn-primary">
            Update
          </button>
          <Link to="/todos" className="btn btn-secondary ms-2">
            Cancel
          </Link>
        </form>
      </div>
    </div>
  );
}

export default EditToDo;
