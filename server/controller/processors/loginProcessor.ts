import LoginAPI from "../api/loginApi";
import { Request, Response } from "express";
import { initializeErrorMap } from "../../utils/errorMessages";
import { generateAccessToken, generateRefreshToken } from "../../middleware/tokenHandler";
import { User, StatusCode } from "../../types";

const loginAPI = new LoginAPI();
const ERROR_MESSAGES = initializeErrorMap();

async function verifyLogin(req: Request, res: Response) {
    console.log(`Received in login: ${JSON.stringify(req.body)}`);
    const loginQuery = await loginAPI.verifyLogin(req.body.email, req.body.password);
    if(isStatusCode(loginQuery)) {
        console.log(`Login verification failed with status code: ${loginQuery}`);
        res.status(loginQuery).send(ERROR_MESSAGES.get(loginQuery));
        return;
    }
    const accessToken = generateAccessToken(loginQuery);
    const refreshToken = generateRefreshToken(loginQuery);
    const tokenQuery = await loginAPI.setToken(loginQuery.id, refreshToken);
    if(tokenQuery !== StatusCode.OK) {
        console.log(`Storing token failed with status code: ${tokenQuery}`);
        res.status(tokenQuery).send(ERROR_MESSAGES.get(tokenQuery));
        return;
    }
    const loginProps : User = loginQuery as User;
    res.status(StatusCode.OK).json({id: loginProps.id, role: loginProps.role, accessToken, refreshToken});
}

function isStatusCode<T>(queryResult: T | StatusCode): queryResult is StatusCode {
    return queryResult as StatusCode in StatusCode;
}

async function verifyToken(req : Request, res : Response) {
    console.log(`Received in verify token: ${JSON.stringify(req.body)}`);
    const tokenQuery = await loginAPI.verifyToken(req.body.id, req.body.refreshToken);
    if(tokenQuery !== StatusCode.OK) {
        console.log(`Token verification failed with status code: ${tokenQuery}`);
        res.status(tokenQuery).send(ERROR_MESSAGES.get(tokenQuery));
        return;
    }
    const accessToken = generateAccessToken(req.body.id);
    res.status(StatusCode.OK).json({accessToken});
}

async function registerAccount(req : Request, res : Response) {
    console.log(`Received in register: ${JSON.stringify(req.body)}`);
    const accountStatusCode = await loginAPI.createAccount(req.body.email, req.body.password);
    if(accountStatusCode !== StatusCode.OK) {
        console.log(`Failed to register account with status code: ${accountStatusCode}`);
        res.status(accountStatusCode).send(ERROR_MESSAGES.get(accountStatusCode));
        return;
    }
    res.sendStatus(StatusCode.OK);
}

async function logoutUser(req : Request, res : Response) {
    console.log(`Received in logout: ${JSON.stringify(req.body)}`);
    const logoutQuery = await loginAPI.logout(req.body.id);
    if(logoutQuery !== StatusCode.OK) {
        console.log(`Failed to logout user with status code: ${logoutQuery}`);
        res.status(logoutQuery).send(ERROR_MESSAGES.get(logoutQuery));
        return;
    }
    res.sendStatus(StatusCode.OK);
}

async function deleteAccount(req : Request, res : Response) {
    console.log(`Received in delete account: ${req.params.id}`);
    const deleteQuery = await loginAPI.delete(Number(req.params.id));
    if(deleteQuery !== StatusCode.OK) {
        res.status(deleteQuery).send(ERROR_MESSAGES.get(deleteQuery));
        return;
    }
    res.sendStatus(StatusCode.OK);
}

async function getUnderstudies(req : Request, res: Response) {
    console.log(`Received in get understudies: ${req.params.id}`);
    const understudyQuery = await loginAPI.getUnderstudies(Number(req.params.id));
    if(isStatusCode(understudyQuery)) {
        console.log(`Retrieving account ${req.params.id}'s understudies failed with status code ${understudyQuery}`);
        res.status(understudyQuery).send(ERROR_MESSAGES.get(understudyQuery));
        return;
    }
    res.status(StatusCode.OK).json(understudyQuery);
}

export {verifyLogin, verifyToken, registerAccount, logoutUser, deleteAccount, getUnderstudies};
