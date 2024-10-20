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
    <div className="center d-flex align-items-center justify-content-center">
    <div className="box position-relative p-4 text-center bg-body border rounded-5">
      <h2 className="mb-3 fw-normal">Create New Todo</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control fs-4"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <label className="form-label">Title</label>
        </div>
        <div className="form-floating mb-3">
          <textarea
            className="form-control fs-4"
            name="description"
            value={form.description}
            onChange={handleChange}
          ></textarea>
          <label className="form-label">Description</label>
        </div>
        <button type="submit" className="btn btn-success fs-4 w-50">
          Create
        </button>
        <Link to="/todos" className="ms-5 btn btn-danger fs-4 w-25">
          Cancel
        </Link>
      </form>
    </div>
    </div>
  );
}

export default CreateToDo;
