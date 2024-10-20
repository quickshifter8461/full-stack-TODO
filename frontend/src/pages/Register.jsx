import React, { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";

import Spinner from "./spinner";

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading]= useState(false)
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const response = await api.post("/auth/register", {
        username: form.username,
        email: form.email,
        password: form.password,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/todos");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } 
    }finally{
      setLoading(false)
    }
  };

  return loading? <Spinner/> : (
    <div className="center d-flex align-items-center justify-content-center">
      <div className="box position-relative p-4 text-center bg-body border rounded-5">
      <h2 className=" mb-3 fw-normal" >Register</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <label className="form-label">Username</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <label className="form-label">Email</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <label className="form-label">Password</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
          <label className="form-label">Confirm Password</label>
        </div>
        <button type="submit" className="btn btn-primary w-100 fs-4">
          Register
        </button>
      </form>
      <p className="mt-3">
        Already have an account? <Link className="ms-3 link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" to="/login">Login here</Link>.
      </p>
    </div>
    </div>
  );
}

export default Register;
