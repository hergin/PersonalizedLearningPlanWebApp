import express from "express";
import { LoginAPI } from "../controller/loginProcessor";
import { initializeErrorMap } from "../utils/errorMessages";
import { STATUS_CODES } from "../utils/statusCodes";
import { generateAccessToken, generateRefreshToken} from "../utils/token";

const loginRoutes = express.Router();
const loginAPI = new LoginAPI();
const ERROR_MESSAGES = initializeErrorMap();

loginRoutes.post('/login', async (req : any, res : any) => {
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

loginRoutes.post('/token', async (req : any, res : any) => {
    console.log(`Received: ${req.body.refreshToken}`);
    const tokenQuery = await loginAPI.verifyToken(req.body.email, req.body.refreshToken);
    if(tokenQuery !== STATUS_CODES.OK) {
        console.log("Token verification failed.");
        res.status(tokenQuery).send(ERROR_MESSAGES.get(tokenQuery));
        return;
    }
    const accessToken = generateAccessToken(req.body.email);
    res.status(STATUS_CODES.OK).json({accessToken});
});

loginRoutes.post('/register', async(req : any, res : any) => {
    console.log(req.body);
    const accountStatusCode = await loginAPI.createAccount(req.body.email, req.body.password);
    if(accountStatusCode !== STATUS_CODES.OK) {
        res.status(accountStatusCode).send(ERROR_MESSAGES.get(accountStatusCode));
        return;
    }
    res.sendStatus(STATUS_CODES.OK);
});

loginRoutes.post('/logout', async(req : any, res : any) => {
    console.log(`Received in logout: ${req.body}`);
    const logoutQuery = await loginAPI.logout(req.body.email);
    if(logoutQuery !== STATUS_CODES.OK) {
        res.status(logoutQuery).send(ERROR_MESSAGES.get(logoutQuery));
        return;
    }
    res.sendStatus(STATUS_CODES.OK);
});

loginRoutes.delete('/delete/:id', async(req : any, res : any) => {
    console.log(`Received in delete account: ${req.params.id}`);
    const deleteQuery = await loginAPI.delete(req.params.id);
    if(deleteQuery !== STATUS_CODES.OK) {
        res.status(deleteQuery).send(ERROR_MESSAGES.get(deleteQuery));
        return;
    }
    res.sendStatus(STATUS_CODES.OK);
});

export default loginRoutes;
