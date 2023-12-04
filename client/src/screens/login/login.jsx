import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ApiClient } from "../../hooks/ApiClient";
import { useUser } from "../../hooks/useUser";
import "./login.css";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { addUser } = useUser();
  const { post } = ApiClient();
  const buttonDisabled = email === "" || password === "";
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  async function handleLogin(email, password) {
    try {
      const response = await post("/auth/login", { email, password });
      addUser({
        email,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
      // Redirects if user came from another page.
      location.state?.from
        ? navigate(location.state.from)
        : navigate("/LearningPlan");
    } catch (error) {
      console.error(error);
      alert(error.response ? error.response.data : error);
    }
  }

  return (
    <div className="parent-div">
      <div className="login-container">
        <div className="login-header">
          <h1>Login</h1>
        </div>
        <div className="login-form">
          <TextField
            className="login-input"
            label="Email"
            variant="outlined"
            type={"text"}
            value={email}
            onChange={(input) => setEmail(input.target.value)}
          />
          <TextField
            className="login-input"
            value={password}
            variant="outlined"
            type={showPassword ? "text" : "password"}
            onChange={(input) => setPassword(input.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            label="Password"
          />

          <button
            onClick={() => {
              handleLogin(email, password);
            }}
            className="login-button"
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
