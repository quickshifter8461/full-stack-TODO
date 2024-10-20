import React, { useState, useEffect } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";

function ToDoList() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await api.get("/todos");
      setTodos(response.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError("Failed to fetch ToDos");
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ToDo?")) return;
    try {
      await api.delete(`/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
      alert("ToDo deleted successfully");
    } catch (err) {
      setError("Failed to delete ToDo");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="m-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>My Todos</h2>
        <button className="btn btn-danger fs-4" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <Link to="/create" className="btn btn-success fs-4 mb-3">
        Create New Todo
      </Link>
      {error && <div className="alert alert-danger">{error}</div>}
      {todos.length > 0 ? (
        <table className="table text-center">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo) => (
              <tr key={todo._id}>
                <td className="fs-4" >{todo.title.charAt(0).toUpperCase()+todo.title.slice(1)}</td>
                <td className="fs-4" >{todo.description.charAt(0).toUpperCase()+todo.description.slice(1)}</td>
                <td className="fs-4" >
                  {todo.completed?"Completed":"Pending"}
                </td>
                <td>
                  <Link
                    to={`/edit/${todo._id}`}
                    className="btn btn-primary btn-sm w-75 mb-2 fs-4"
                  >
                    Edit
                  </Link>
                  </td>
                  <td>
                  <button
                    className="btn btn-danger btn-sm w-75 fs-4"
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
