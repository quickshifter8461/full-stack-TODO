import React, { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";

function CreateToDo() {
  const [form, setForm] = useState({
    title: "",
    description: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/todos", {
        title: form.title,
        description: form.description,
      });
      setForm({ title: "", description: "" });
      alert("ToDo created successfully");
      navigate("/todos");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setError(err.response.data.errors.map((e) => e.msg).join(", "));
      } else {
        setError("Failed to create ToDo");
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create New ToDo</h2>
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
        <button type="submit" className="btn btn-success">
          Create
        </button>
        <Link to="/todos" className="btn btn-secondary ms-2">
          Cancel
        </Link>
      </form>
    </div>
  );
}

export default CreateToDo;
