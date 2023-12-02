import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiClient } from "../../hooks/ApiClient";
import "./register.css";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const submitDisabled =
    firstName === "" ||
    lastName === "" ||
    email === "" ||
    username === "" ||
    password === "";
  const navigate = useNavigate();
  const { post } = ApiClient();

  async function handleRegistration() {
    try {
      const response = await post("/register", {
        firstName,
        lastName,
        email,
        username,
        password,
      });
      console.log(response);
      // Redirects back to login page after creating an account
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1>Registration</h1>
        </div>
        <div className="register-form">
          <div className="textInput">
            <input
              id="firstName"
              placeholder="First Name"
              type="text"
              value={firstName}
              onChange={(input) => {
                setFirstName(input.target.value);
              }}
            />
          </div>
          <div className="textInput">
            <input
              id="lastName"
              placeholder="Last Name"
              type="text"
              value={lastName}
              onChange={(input) => {
                setLastName(input.target.value);
              }}
            />
          </div>
          <div className="textInput">
            <input
              id="emailInput"
              placeholder="Email"
              type="text"
              value={email}
              onChange={(input) => {
                setEmail(input.target.value);
              }}
            />
          </div>
          <div className="textInput">
            <input
              id="usernameInput"
              placeholder="Username"
              type="text"
              value={username}
              onChange={(input) => {
                setUsername(input.target.value);
              }}
            />
          </div>
          <div className="textInput">
            <input
              id="passwordInput"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(input) => {
                setPassword(input.target.value);
              }}
            />
          </div>
          <button
            id="registerButton"
            disabled={submitDisabled}
            onClick={handleRegistration}
            className="register-button"
          >
            Register
          </button>
        </div>
      </div>
      <div className="login-footer">
        <p>Already have an account?</p>
        <Link to="/login" className="login-link">
          <p>Sign in here</p>
        </Link>
      </div>
    </div>
  );
};

export default Register;
