import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css'; // Import the CSS file

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/register", { name, email, password });
      const { Status, user, message } = response.data;
      if (Status === "Success") {
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/home');
      } else {
        alert(message); // Show error message from the backend
      }
    } catch (error) {
      console.error(error);
      alert('Registration failed. Please try again.');
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <div className="position-absolute top-0 start-0 p-3">
        <button className="btn btn-light" onClick={() => navigate('/')}>
          <i className="bi bi-arrow-left"></i> Go Back
        </button>
      </div>
      <div className="auth-box">
        <h2 className="auth-title">Register</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="mb-3">
            <label htmlFor="name" className="form-label auth-form-label">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter name"
              autoComplete="off"
              name="name"
              className="form-control auth-form-control"
              onChange={(e) => { setName(e.target.value) }}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label auth-form-label">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              autoComplete="off"
              name="email"
              className="form-control auth-form-control"
              onChange={(e) => { setEmail(e.target.value) }}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label auth-form-label">
              Password
            </label>
            <input
              type="password"
              placeholder="Set password"
              autoComplete="off"
              name="password"
              className="form-control auth-form-control"
              onChange={(e) => { setPassword(e.target.value) }}
            />
          </div>
          <button type="submit" className="btn auth-button-primary w-100">Register</button>
        </form>
        <p className="text-center mt-3 mb-0">Already have an Account?</p>
        <button className="btn btn-outline-primary auth-button-outline w-100" onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}
