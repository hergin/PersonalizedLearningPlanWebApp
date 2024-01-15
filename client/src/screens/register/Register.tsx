import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiClient } from "../../hooks/ApiClient";

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
      await post("/auth/register", { email, password });
      await post("/profile/create", { username, firstName, lastName, email });
      // Redirects back to login page after creating an account
      navigate("/login");
    } catch (error : any) {
      console.error(error);
      alert(error.response ? error.response.data : error);
    }
  }

  return (
    <div className="flex flex-col m-8 items-center ">
      <div className="flex flex-nowrap flex-col justify-center h-[500px] w-[300px] py-2.5 border border-solid border-[#DBDBDB]">
        <div className="flex flex-col justify-center items-center h-24">
          <h1 className="text-5xl">Registration</h1>
        </div>
        <div className="flex flex-col h-full justify-center mx-10 gap-6">
          <div>
            <input
              id="firstName"
              className="h-10 rounded text-base w-full border border-solid border-gray-300 px-2 "
              placeholder="First Name"
              type="text"
              value={firstName}
              onChange={(input) => {
                setFirstName(input.target.value);
              }}
            />
          </div>
          <div>
            <input
              id="lastName"
              className="h-10 rounded text-base w-full border border-solid border-gray-300 px-2 "
              placeholder="Last Name"
              type="text"
              value={lastName}
              onChange={(input) => {
                setLastName(input.target.value);
              }}
            />
          </div>
          <div>
            <input
              id="emailInput"
              className="h-10 rounded text-base w-full border border-solid border-gray-300 px-2 "
              placeholder="Email"
              type="text"
              value={email}
              onChange={(input) => {
                setEmail(input.target.value);
              }}
            />
          </div>
          <div>
            <input
              id="usernameInput"
              className="h-10 rounded text-base w-full border border-solid border-gray-300 px-2 "
              placeholder="Username"
              type="text"
              value={username}
              onChange={(input) => {
                setUsername(input.target.value);
              }}
            />
          </div>
          <div>
            <input
              id="passwordInput"
              className="h-10 rounded text-base w-full border border-solid border-gray-300 px-2"
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
            className="h-10 border-1 border-solid border-gray-300 rounded px-2 text-base bg-element-base text-text-color hover:bg-[#820000] hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-element-base"
          >
            Register
          </button>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center mt-2 h-24 w-[300px] border border-solid border-[#DBDBDB]">
        <p>Already have an account?</p>
        <Link to="/login" className="no-underline text-blue-700 text-base mb-2">
          <p>Sign in here</p>
        </Link>
      </div>
    </div>
  );
};

export default Register;
