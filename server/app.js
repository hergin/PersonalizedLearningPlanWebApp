const express = require("express");
const app = express();
const cors = require('cors');
const path = require("path");
require('dotenv').config({
    path: path.join(__dirname, ".env")
});
const jwt = require("jsonwebtoken");
app.use(cors());
app.use(express.json());

const LoginAPI = require("./controller/loginProcessor");
const ModuleAPI = require("./controller/moduleProcessor");

const STATUS_CODES = require("./statusCodes");
const ERROR_MESSAGES = initializeErrorMap();
const loginAPI = new LoginAPI();
const moduleAPI = new ModuleAPI();

function initializeErrorMap() {
    const errorMessageMap = new Map();
    errorMessageMap.set(STATUS_CODES.BAD_REQUEST, "Data received is invalid. Please try again.");
    errorMessageMap.set(STATUS_CODES.UNAUTHORIZED, "Invalid Login.");
    errorMessageMap.set(STATUS_CODES.FORBIDDEN, "Forbidden request.");
    errorMessageMap.set(STATUS_CODES.CONNECTION_ERROR, "Failed to connect to database.");
    errorMessageMap.set(STATUS_CODES.CONFLICT, "An account with that email already exists.");
    errorMessageMap.set(STATUS_CODES.GONE, "An account with that email doesn't exist.");
    errorMessageMap.set(STATUS_CODES.INTERNAL_SERVER_ERROR, "A fatal error has occurred.");
    return errorMessageMap;
}

app.get('/api', (req, res) => {
    res.send('Okay');
});

app.post('/api/login', async (req, res) => {
    console.log(`Received: ${req.body}`);
    const loginQuery = await loginAPI.verifyLogin(req.body.email, req.body.password);
    if(loginQuery !== STATUS_CODES.OK) {
        console.log("Login verification failed.");
        res.status(loginQuery).send(ERROR_MESSAGES.get(loginQuery));
        return;
    }
    const accessToken = generateAccessToken(req.body.email);
    const refreshToken = generateRefreshToken(req.body.email);
    const tokenQuery = await loginAPI.setToken(req.body.email, refreshToken);
    if(tokenQuery !== STATUS_CODES.OK) {
        console.log("Storing token failed.");
        res.status(tokenQuery).send(ERROR_MESSAGES.get(tokenQuery));
        return;
    }
    res.status(STATUS_CODES.OK).json({accessToken, refreshToken});
});

app.post('/api/token', async (req, res) => {
    console.log(`Received: ${req.body.refreshToken}`);
    const tokenQuery = await loginAPI.verifyToken(req.body.refreshToken);
    if(tokenQuery !== STATUS_CODES.OK) {
        console.log("Token verification failed.");
        res.status(tokenQuery).send(ERROR_MESSAGES.get(tokenQuery));
        return;
    }
    const accessToken = generateAccessToken(req.body.email);
    res.status(STATUS_CODES.OK).json({accessToken});
});

app.get('/api/profile', async(req, res) => {
    const profileQuery = await loginAPI.getProfile(req.body.email);
    if(typeof profileQuery !== "object") {
        console.error("There was a problem retrieving profile.");
        res.status(profileQuery).send(ERROR_MESSAGES.get(profileQuery));
        return;
    }
    res.status(STATUS_CODES.OK).json(profileQuery);
});

app.post('/api/profile', async(req, res) => {
    const profileStatusCode = await loginAPI.createProfile(req.body.firstName, req.body.lastName, req.body.email);
    if(profileStatusCode !== STATUS_CODES.OK) {
        res.status(profileStatusCode).send(ERROR_MESSAGES.get(profileStatusCode));
        return;
    }
    res.sendStatus(STATUS_CODES.OK);
});

app.post('/api/register', async(req, res) => {
    console.log(`Received: ${req.body}`);
    const accountStatusCode = await loginAPI.createAccount(req.body.username, req.body.password, req.body.email);
    if(accountStatusCode !== STATUS_CODES.OK) {
        res.status(accountStatusCode).send(ERROR_MESSAGES.get(accountStatusCode));
        return;
    }
    res.sendStatus(STATUS_CODES.OK);
});

app.post('/api/module/get', authenticateToken, async(req, res) => {
    console.log(`Received: ${req.body.email}`);
    const moduleQuery = await moduleAPI.getModules(req.body.email);
    if(typeof moduleQuery !== "object") {
        res.status(moduleQuery).send(ERROR_MESSAGES.get(moduleQuery));
        return;
    }
    console.log(`Result: ${moduleQuery}`);
    res.status(STATUS_CODES.OK).json(moduleQuery);
});

app.post('/api/module', authenticateToken, async(req, res) => {
    console.log(`Received: ${req.body.email}`);
    const moduleQuery = await moduleAPI.createModule(req.body.name, req.body.description, req.body.completion_percent, req.body.email);
    if(moduleQuery !== STATUS_CODES.OK) {
        console.log("Something went wrong while creating module.");
        res.status(moduleQuery).send(ERROR_MESSAGES.get(moduleQuery));
        return;
    }
    const moduleQuery2 = await moduleAPI.getModules(req.body.email);
    if(typeof moduleQuery2 !== "object") {
        res.status(moduleQuery2).send(ERROR_MESSAGES.get(moduleQuery2));
        return;
    }
    res.status(STATUS_CODES.OK).json(moduleQuery2);
});

app.listen(4000, () => {
    console.log("Server running!");
});

function generateAccessToken(email) {
    return jwt.sign(email, process.env.ACCESS_TOKEN_SECRET, {}, {expiresIn: "30m"});
}

function generateRefreshToken(email) {
    return jwt.sign(email, process.env.REFRESH_TOKEN_SECRET);
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(STATUS_CODES.UNAUTHORIZED);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(STATUS_CODES.FORBIDDEN);
        req.user = user;
        next();
    });
}
