import React, { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import Spinner from "./spinner";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
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
    try {
      const response = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/todos");
    } catch (err) {
        setError("Login failed");
    }finally{
      setLoading(false)
    }
  };

  return loading? <Spinner/> : (
    <div className="center d-flex align-items-center justify-content-center">
    <div className="box position-relative p-4 text-center bg-body border rounded-5">
      <h2 className=" mb-3 fw-normal">Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
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
          <label className="form-label" >Password</label>
        </div>
        <button type="submit" className="btn btn-primary w-100 fs-4">
          Login
        </button>
      </form>
      <p className="mt-3">
        Don't have an account? <Link className="ms-3 link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" to="/register">Register here</Link>
      </p>
    </div>
    </div>
  );
}

export default Login;
