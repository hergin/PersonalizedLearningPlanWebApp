import React, { useState } from "react";
import { LoginAPI } from "../../controller/loginProcessor";
import "./login.css";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginAPI] = useState(new LoginAPI());

  const handleLogin = (username, password) => {
    try {
      let id = loginAPI.getAccountID(username, password);
      console.log(id);
    } catch(error) {
      alert(error);
    }
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
      </div>
      <button onClick={() => {handleLogin(username, password)}}>Login</button>
    </div>
  );
};

export default LoginScreen;
