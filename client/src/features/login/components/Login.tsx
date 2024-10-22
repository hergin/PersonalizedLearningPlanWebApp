import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useHotKeys } from "../../../hooks/useHotKeys";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useLoginService } from "../hooks/useAccountServices";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { handleEnterPress } = useHotKeys();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const { mutateAsync: login, error } = useLoginService();

  const buttonDisabled = useMemo<boolean>(() => {
    return email === "" || password === "";
  }, [email, password]);

  async function handleLogin() {
    await login({email: email, password: password});
    if(!error) {
      location.state?.from ? navigate(location.state.from) : navigate("/LearningPlan");
    }
  }

  useEffect(() => {
    document.title = 'Personalized Learning Plan | Login';
  }, []);

  return (
    <div className="flex flex-col flex-1 justify-center items-center h-screen bg-[#F1F1F1]">
      <div className="flex flex-nowrap flex-col justify-center w-[300px] py-5 border border-solid border-[#DBDBDB]">
        <div className="flex flex-col justify-center items-center h-24 w-full">
          <h1 className="text-5xl mb-2">Login</h1>
        </div>
        <div className="flex flex-col h-full justify-center gap-6 mx-10">
          <TextField
            label="Email"
            variant="outlined"
            type={"text"}
            value={email}
            onKeyUp={(event) => {
              handleEnterPress(event, handleLogin, buttonDisabled);
            }}
            onChange={(input) => setEmail(input.target.value)}
          />
          <TextField
            value={password}
            variant="outlined"
            type={showPassword ? "text" : "password"}
            onKeyUp={(event) => {
              handleEnterPress(event, handleLogin, buttonDisabled);
            }}
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

          <Button
            variant="contained"
            onClick={handleLogin}
            className="h-10"
            disabled={buttonDisabled}
          >
            Sign In
          </Button>
        </div>
      </div>
      <div className="flex mt-2 flex-col justify-center items-center h-24 w-[300px] border border-solid border-[#DBDBDB]">
        <p>Don&apos;t have an account?</p>
        <Link
          to="/register"
          className="no-underline text-blue-700 text-base mb-2"
        >
          <p>Register here</p>
        </Link>
      </div>
    </div>
  );
};

export default LoginScreen;
