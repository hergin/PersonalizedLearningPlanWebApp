import React, { useState } from "react";
import axios from "axios";
import "./login.css";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState(null);
   
  async function handleLogin(username, password) {
    try {
      //TODO: Post request to the server.
      const response = await axios.post('http://localhost:4000/api/login', {username, password});
      console.log(response.data);
      setProfile(response.data);
      console.log(profile);
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
        {JSON.stringify(profile)}
      </div>
      <button onClick={() => {handleLogin(username, password)}}>Login</button>
    </div>
  );
};

export default LoginScreen;
