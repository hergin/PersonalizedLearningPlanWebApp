import React, { useState, ReactElement } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useHotKeys } from "../../../hooks/useHotKeys";
import { useRegistrationService } from "../hooks/useAuth";
import { RegisterProps } from "../../../types";

const TEXT_INPUT_STYLE_NORMAL =
  "h-10 rounded text-base w-full border border-solid border-gray-300 px-2 ";
const TEXT_INPUT_STYLE_ERROR =
  "h-10 rounded text-base w-full border border-solid border-red-700 px-2";

const Register = () => {
  const [registerValues, setRegisterValues] = useState<RegisterProps>({
    email: "", password: "", firstName: "", lastName: "", username: ""
  });
  const navigate = useNavigate();
  const { handleEnterPress } = useHotKeys();
  const [passwordErrors, setPasswordErrors] = useState<ReactElement[]>([]);
  const { mutateAsync: register, error } = useRegistrationService();
  const submitDisabled =
    registerValues.firstName === "" ||
    registerValues.lastName === "" ||
    registerValues.email === "" ||
    registerValues.username === "" ||
    registerValues.password === "" ||
    passwordErrors.length !== 0;

  async function handleRegistration() {
    if (!registerValues.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      alert("Your email must be valid.");
      return;
    }
    await register(registerValues);
    if(!error) {
      navigate("/");
    }
  }

  function validatePassword(input: string) {
    const errorsFound: ReactElement[] = [];
    const expressionMap = initializeExpressionMap();
    for (const [expression, message] of expressionMap) {
      if (!input.match(expression)) {
        errorsFound.push(
          <p>
            <span className="font-bold">!</span> {message}
          </p>
        );
      }
    }
    setPasswordErrors(errorsFound);
  }

  function initializeExpressionMap(): Map<RegExp, string> {
    const map = new Map<RegExp, string>();
    map.set(/^(?=.*\d).+$/, "1 number.");
    map.set(/^(?=.*[a-z]).+$/, "1 lowercase letter.");
    map.set(/^(?=.*[A-Z]).+$/, "1 uppercase letter.");
    map.set(/^.{8,}$/, "Must be 8 characters long.");
    return map;
  }

  return (
    <div className="flex flex-col flex-1 justify-center items-center h-[80vh]">
      <div className="flex flex-nowrap flex-col justify-center h-[65vh] w-[20vw] py-2.5 border border-solid border-[#DBDBDB]">
        <div className="flex flex-col justify-center items-center h-24">
          <h1 className="text-5xl">Registration</h1>
        </div>
        <div className="flex flex-col h-full justify-center mx-10 gap-6">
          <div>
            <input
              id="firstName"
              className={TEXT_INPUT_STYLE_NORMAL}
              placeholder="First Name"
              type="text"
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
            />
          </div>
          <div>
            <input
              id="lastName"
              className={TEXT_INPUT_STYLE_NORMAL}
              placeholder="Last Name"
              type="text"
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
            />
          </div>
          <div className="emailContainer">
            <input
              id="emailInput"
              className={TEXT_INPUT_STYLE_NORMAL}
              placeholder="Email"
              type="text"
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
            />
          </div>
          <div>
            <input
              id="usernameInput"
              className={TEXT_INPUT_STYLE_NORMAL}
              placeholder="Username"
              type="text"
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
            />
          </div>
          <div className="passwordContainer">
            <input
              id="passwordInput"
              className={
                passwordErrors.length !== 0
                  ? TEXT_INPUT_STYLE_ERROR
                  : TEXT_INPUT_STYLE_NORMAL
              }
              placeholder="Password"
              type="password"
              value={registerValues.password}
              onChange={(input) => {
                setRegisterValues({
                  ...registerValues,
                  password: input.target.value
                });
                validatePassword(input.target.value);
              }}
              onKeyUp={(event) => {
                handleEnterPress(event, handleRegistration, submitDisabled);
              }}
            />
            {passwordErrors.length !== 0 && (
              <div className="border-2 border-solid border-red-700 opacity-75 mt-2 flex flex-col items-center">
                <div className="text-red-400 text-xs ">
                  <p>Missing requirements:</p>
                  {passwordErrors}
                </div>
              </div>
            )}
          </div>
          <button
            id="registerButton"
            disabled={submitDisabled}
            onClick={handleRegistration}
            className="h-10 border-1 border-solid border-gray-300 rounded px-2 text-base bg-element-base text-text-color hover:bg-[#820000] hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-element-base"
          >
            Register
          </button>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center mt-2 h-24 w-[20vw] border border-solid border-[#DBDBDB]">
        <p>Already have an account?</p>
        <Link to="/login" className="no-underline text-blue-700 text-base mb-2">
          <p>Sign in here</p>
        </Link>
      </div>
    </div>
  );
};

export default Register;
