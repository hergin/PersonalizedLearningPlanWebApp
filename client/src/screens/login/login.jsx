import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./login.css";

const STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  CONNECTION_ERROR: 404,
  INTERNAL_SERVER_ERROR: 500
};

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState(null);

  async function handleLogin(username, password) {
    const response = await axios.post('http://localhost:4000/api/login', {username, password});
    console.log(response.data);
    switch(response.status) {
      case STATUS_CODES.OK:
        setProfile(response.data);
        break;
      case STATUS_CODES.BAD_REQUEST:
        alert("This account doesn't exist.");
        break;
      case STATUS_CODES.CONNECTION_ERROR:
        alert("A connection error has occurred.");
        break;
      case STATUS_CODES.INTERNAL_SERVER_ERROR:
        alert("An error has occurred.");
        break;
      default:
        alert("Something went wrong!");
        break;
    }
    console.log(profile);
  };

  return (
    <div className="parent-div">
      <h1>Login</h1>
      <div className="login">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          className="test"
          onChange={(e) => setPassword(e.target.value)}
        />
        {JSON.stringify(profile)}
      </div>
      <button onClick={() => {handleLogin(username, password)}}>Login</button>
      <div>
        <p>Don't have an account?</p>
        <Link to="/register">
          <p>Register here</p>
        </Link>
      </div>
    </div>
  );
};

export default LoginScreen;
