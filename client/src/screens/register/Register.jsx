import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./register.css";

const Register = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function handleRegistration() {
        const response = await axios.post('http://localhost:4000/api/register', {firstName, lastName, email, username, password});
        console.log(response.data);
    }

    return(
        <div id="page">
            <h1>Registration:</h1>
            <div class="textInput">
                <label for="firstName">First name:</label>
                <input
                    id="firstName"
                    placeholder="Bob"
                    type="text"
                    value={firstName}
                    onChange={(input) => {setFirstName(input.target.value)}}
                />
            </div>    
            <div class="textInput">
                <label for="lastName">Last name:</label>
                <input
                    id="lastName"
                    placeholder="Jones"
                    type="text"
                    value={lastName}
                    onChange={(input) => {setLastName(input.target.value)}}
                />
            </div>
            <div class="textInput">
                <label for="emailInput">Email:</label>
                <input
                    id="emailInput"
                    placeholder="example@gmail.com"
                    type="text"
                    value={email}
                    onChange={(input) => {setEmail(input.target.value)}}
                />
            </div>
            <div class="textInput">
                <label for="usernameInput">Username:</label>
                <input
                    id="usernameInput"
                    placeholder="username"
                    type="text"
                    value={username}
                    onChange={(input) => {setUsername(input.target.value)}}
                />
            </div>
            <div class="textInput">
                <label for="passwordInput">Password:</label>
                <input
                    id="passwordInput"
                    placeholder="password"
                    type="password"
                    value={password}
                    onChange={(input) => {setPassword(input.target.value)}}
                />
            </div>
            <button id="registerButton" onClick={handleRegistration}>Register</button>
            <div id="signInLink">
                <p>Already have an account?</p>
                <Link to="/login">
                    <p>Sign in here</p>
                </Link>
            </div>
        </div>
    );
};

export default Register;
