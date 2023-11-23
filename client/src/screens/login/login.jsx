import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./login.css";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const buttonDisabled = email === "" || password === "";

  async function handleLogin(email, password) {
    try {
      const response = await axios.post("http://localhost:4000/api/login", {
        email,
        password,
      });
      console.log(response.data);
      setProfile(response.data);
      console.log(profile);
      // Redirects if user came from another page.
      if (location.state?.from) {
        navigate(location.state.from);
      }
    } catch (error) {
      alert(error.response.data);
    }
    console.log(JSON.stringify(profile));
  }

  return (
    <div className="parent-div">
      <div className="login-container">
        <div className="login-header">
          <h1>Login</h1>
        </div>
        <div className="login-form">
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(input) => setEmail(input.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(input) => setPassword(input.target.value)}
          />
          <button
            onClick={() => {
              handleLogin(email, password);
            }}
            disabled={buttonDisabled}
          >
            Login
          </button>
        </div>
      </div>
      <div className="register-footer">
        <p>Don't have an account?</p>
        <Link to="/register" className="register-link">
          <p>Register here</p>
        </Link>
      </div>
    </div>
  );
};

export default LoginScreen;
