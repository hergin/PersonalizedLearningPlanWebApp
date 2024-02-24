import LoginAPI from "../api/loginApi";
import { Request, Response } from "express";
import { initializeErrorMap } from "../../utils/errorMessages";
import { generateAccessToken, generateRefreshToken } from "../../utils/token";
import { StatusCode } from "../../types";

const loginAPI = new LoginAPI();
const ERROR_MESSAGES = initializeErrorMap();

async function verifyLogin(req: Request, res: Response) {
    console.log(`Received in login: ${JSON.stringify(req.body)}`);
    const loginQuery = await loginAPI.verifyLogin(req.body.email, req.body.password);
    if(loginQuery in StatusCode) {
        console.log(`Login verification failed with status code: ${loginQuery}`);
        res.status(loginQuery).send(ERROR_MESSAGES.get(loginQuery));
        return;
    }
    const accessToken = generateAccessToken(req.body.email);
    const refreshToken = generateRefreshToken(req.body.email);
    const tokenQuery = await loginAPI.setToken(loginQuery, refreshToken);
    if(tokenQuery !== StatusCode.OK) {
        console.log(`Storing token failed with status code: ${tokenQuery}`);
        res.status(tokenQuery).send(ERROR_MESSAGES.get(tokenQuery));
        return;
    }
    res.status(StatusCode.OK).json({id: loginQuery, accessToken, refreshToken});
}

async function verifyToken(req : Request, res : Response) {
    console.log(`Received in token: ${JSON.stringify(req.body)}`);
    const tokenQuery = await loginAPI.verifyToken(req.body.id, req.body.refreshToken);
    if(tokenQuery !== StatusCode.OK) {
        console.log("Token verification failed.");
        res.status(tokenQuery);
        res.send(ERROR_MESSAGES.get(tokenQuery));
        return;
    }
    const accessToken = generateAccessToken(req.body.id);
    res.status(StatusCode.OK);
    res.json({accessToken});
}

async function registerAccount(req : Request, res : Response) {
    console.log(`Received in register: ${JSON.stringify(req.body)}`);
    const accountStatusCode = await loginAPI.createAccount(req.body.email, req.body.password);
    if(accountStatusCode !== StatusCode.OK) {
        res.status(accountStatusCode);
        res.send(ERROR_MESSAGES.get(accountStatusCode));
        return;
    }
    res.sendStatus(StatusCode.OK);
}

async function logoutUser(req : Request, res : Response) {
    console.log(`Received in logout: ${JSON.stringify(req.body)}`);
    const logoutQuery = await loginAPI.logout(req.body.id);
    if(logoutQuery !== StatusCode.OK) {
        res.status(logoutQuery);
        res.send(ERROR_MESSAGES.get(logoutQuery));
        return;
    }
    res.sendStatus(StatusCode.OK);
}

async function deleteAccount(req : Request, res : Response) {
    console.log(`Received in delete account: ${req.params.id}`);
    const deleteQuery = await loginAPI.delete(Number(req.params.id));
    if(deleteQuery !== StatusCode.OK) {
        res.status(deleteQuery);
        res.send(ERROR_MESSAGES.get(deleteQuery));
        return;
    }
    res.sendStatus(StatusCode.OK);
}

export {verifyLogin, verifyToken, registerAccount, logoutUser, deleteAccount};
