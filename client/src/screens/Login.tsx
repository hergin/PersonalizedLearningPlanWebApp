import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ApiClient } from "../hooks/ApiClient";
import { useUser } from "../hooks/useUser";
import { useEnterKey } from "../hooks/useEnterKey";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { addUser } = useUser();
  const { post } = ApiClient();
  const { handleKeyPress } = useEnterKey();
  const buttonDisabled = email === "" || password === "";
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  async function handleLogin() {
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
    } catch (error : any) {
      console.error(error);
      alert(error.response ? error.response.data : error);
    }
  }

  return (
    <div className="flex flex-col flex-1 justify-center items-center h-[80vh] ">
      <div className="flex flex-nowrap flex-col justify-center h-[350px] w-[300px] py-2.5 border border-solid border-[#DBDBDB]">
        <div className="flex flex-col justify-center items-center h-24 w-full">
          <h1 className="text-5xl mb-2">Login</h1>
        </div>
        <div className="flex flex-col h-full justify-center gap-6 mx-10">
          <TextField
            label="Email"
            variant="outlined"
            type={"text"}
            value={email}
            onKeyUp={(event) => {handleKeyPress(event, handleLogin)}}
            onChange={(input) => setEmail(input.target.value)}
          />
          <TextField
            value={password}
            variant="outlined"
            type={showPassword ? "text" : "password"}
            onKeyUp={(event) => {handleKeyPress(event, handleLogin)}}
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
            onClick={handleLogin}
            className="h-10 border-1 border-solid border-gray-300 rounded px-2 text-base bg-element-base text-text-color hover:bg-[#820000] hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-element-base"
            disabled={buttonDisabled}
          >
            Login
          </button>
        </div>
      </div>
      <div className="flex mt-2 flex-col justify-center items-center h-24 w-[300px] border border-solid border-[#DBDBDB]">
        <p>Don't have an account?</p>
        <Link to="/register" className="no-underline text-blue-700 text-base mb-2">
          <p>Register here</p>
        </Link>
      </div>
    </div>
  );
};

export default LoginScreen;
