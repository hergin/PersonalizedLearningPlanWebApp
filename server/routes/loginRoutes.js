const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const LoginAPI = require("../controller/loginProcessor");
const initializeErrorMessages = require("../utils/errorMessages");
const STATUS_CODES = require("../utils/statusCodes");

const loginAPI = new LoginAPI();
const ERROR_MESSAGES = initializeErrorMessages()

router.post('/login', async (req, res) => {
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

router.post('/token', async (req, res) => {
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

router.post('/register', async(req, res) => {
    console.log(req.body);
    const accountStatusCode = await loginAPI.createAccount(req.body.email, req.body.password);
    if(accountStatusCode !== STATUS_CODES.OK) {
        res.status(accountStatusCode).send(ERROR_MESSAGES.get(accountStatusCode));
        return;
    }
    res.sendStatus(STATUS_CODES.OK);
});

router.post('/logout', async(req, res) => {
    console.log(`Received in logout: ${req.body}`);
    const logoutQuery = await loginAPI.logout(req.body.email);
    if(logoutQuery !== STATUS_CODES.OK) {
        res.status(logoutQuery).send(ERROR_MESSAGES.get(logoutQuery));
        return;
    }
    res.sendStatus(STATUS_CODES.OK);
});

function generateAccessToken(email) {
    return jwt.sign(email, process.env.ACCESS_TOKEN_SECRET, {}, {expiresIn: "30m"});
}

function generateRefreshToken(email) {
    return jwt.sign(email, process.env.REFRESH_TOKEN_SECRET);
}

module.exports = router;
