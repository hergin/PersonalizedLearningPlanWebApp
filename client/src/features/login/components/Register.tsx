import React, { useState, useMemo, ReactElement, useEffect } from "react";
import { TextField, Alert, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useHotKeys } from "../../../hooks/useHotKeys";
import { useRegistrationService } from "../hooks/useAccountServices";
import { RegisterProps } from "../../../types";

const passwordExpressionMap = initializeExpressionMap();
function initializeExpressionMap(): Map<RegExp, string> {
  const map = new Map<RegExp, string>();
  map.set(/^(?=.*\d).+$/, "Must have at least 1 number.");
  map.set(/^(?=.*[a-z]).+$/, "Must have at least 1 lowercase letter.");
  map.set(/^(?=.*[A-Z]).+$/, "Must have at least 1 uppercase letter.");
  map.set(/^.{8,}$/, "Must be at least 8 characters long.");
  return map;
}

export default function Register() {
  const [registerValues, setRegisterValues] = useState<RegisterProps>({
    email: "", password: "", firstName: "", lastName: "", username: ""
  });
  const navigate = useNavigate();
  const { handleEnterPress } = useHotKeys();
  const { mutateAsync: register, error } = useRegistrationService();

  const isEmailValid = useMemo(() => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerValues.email) || registerValues.email === "";
  }, [registerValues.email]);

  const passwordErrors: ReactElement[] = useMemo<ReactElement[]>(() => {
    const password = registerValues.password;
    const result: ReactElement[] = [];
    for (const [expression, message] of passwordExpressionMap) {
        if (!password.match(expression)) {
            result.push(<p className="text-sm">{message}</p>);
        }
    }
    return result;
  }, [registerValues.password]);

  const submitDisabled = useMemo<boolean>(() => {
    const result = false;
    for(const value of Object.values(registerValues)) {
      result || value === "";
    }
    return result || !isEmailValid || passwordErrors.length > 0;
  }, [registerValues, isEmailValid, passwordErrors.length]);

  async function handleRegistration() {
    await register(registerValues);
    if(!error) {
      navigate("/");
    }
  }

  return (
    <div className="flex flex-nowrap flex-col py-3 my-2.5 mx-20 h-full">
      <div className="flex flex-col items-center py-3 my-2.5">
        <h1 className="text-5xl">Registration</h1>
      </div>
      <div className="flex flex-col h-full mx-10 gap-6 items-center">
        <TextField
          label="First Name"
          value={registerValues.firstName}
          onChange={(input) => {
            setRegisterValues({
              ...registerValues,
              firstName: input.target.value
            });
          }}
          onKeyUp={(event) => {
            handleEnterPress(event, handleRegistration, submitDisabled);
          }}
          helperText={registerValues.firstName ? "" : "First name is required!"}
          error={!registerValues.firstName}
          required
          className={"w-1/2"}
        />
        <TextField
          label="Last Name"
          value={registerValues.lastName}
          onChange={(input) => {
            setRegisterValues({
              ...registerValues,
              lastName: input.target.value
            });
          }}
          onKeyUp={(event) => {
            handleEnterPress(event, handleRegistration, submitDisabled);
          }}
          helperText={registerValues.lastName ? "" : "Last Name is required!"}
          error={!registerValues.lastName}
          required
          className={"w-1/2"}
        />
        <TextField
          label="Email"
          value={registerValues.email}
          onChange={(input) => {
            setRegisterValues({
              ...registerValues,
              email: input.target.value
            });
          }}
          onKeyUp={(event) => {
            handleEnterPress(event, handleRegistration, submitDisabled);
          }}
          helperText={registerValues.email ? "" : "Email is required!"}
          error={!registerValues.email || !isEmailValid}
          required
          className={"w-1/2"}
        />
        {
          !isEmailValid && <Alert severity="error" className="w-1/2">Your email must be valid!</Alert>
        }
        <TextField
          label="Username"
          value={registerValues.username}
          onChange={(input) => {
            setRegisterValues({
              ...registerValues,
              username: input.target.value
            });
          }}
          onKeyUp={(event) => {
            handleEnterPress(event, handleRegistration, submitDisabled);
          }}
          helperText={registerValues.username ? "" : "Username is required!"}
          error={!registerValues.username}
          required
          className={"w-1/2"}
        />
        <TextField
          label="Password"
          type="password"
          value={registerValues.password}
          onChange={(input) => {
            setRegisterValues({
              ...registerValues,
              password: input.target.value
            });
          }}
          onKeyUp={(event) => {
            handleEnterPress(event, handleRegistration, submitDisabled);
          }}
          helperText={registerValues.password ? "" : "Password is required!"}
          error={passwordErrors.length > 0 || !registerValues.password}
          required
          className={"w-1/2"}
        />
        {
          passwordErrors.length > 0 && registerValues.password && (
            <Alert severity="error" className="w-1/2">
              <p className="text-sm font-bold">Missing requirements:</p>
              {passwordErrors}
            </Alert>
          )
        }
        <Button
          variant="contained"
          disabled={submitDisabled}
          onClick={handleRegistration}
          size="large"
          className={"w-1/4"}
        >
          Register
        </Button>
      </div>
      <div className="flex flex-col items-center py-3">
        <p className="text-base">Already have an account?</p>
        <Link to="/login" className="no-underline mb-2">
          <p className="text-sm text-blue-700">Sign in here</p>
        </Link>
      </div>
    </div>
  );
}
