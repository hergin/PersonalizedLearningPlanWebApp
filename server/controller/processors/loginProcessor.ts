import LoginAPI from "../api/loginApi";
import { Request, Response } from "express";
import { getLoginError } from "../../utils/errorHandlers";
import { generateAccessToken, generateRefreshToken } from "../../middleware/tokenHandler";
import { User, STATUS_CODE } from "../../types";
import { isStatusCode } from "../../utils/typeGuards";

const loginAPI = new LoginAPI();

async function verifyLogin(req: Request, res: Response) {
    console.log(`Received in login: ${JSON.stringify(req.body)}`);
    const loginQuery = await loginAPI.verifyLogin(req.body.email, req.body.password);
    if(isStatusCode(loginQuery)) {
        console.log(`Login verification failed with status code: ${loginQuery}`);
        res.status(loginQuery).send(getLoginError(loginQuery));
        return;
    }
    const accessToken = generateAccessToken(loginQuery);
    const refreshToken = generateRefreshToken(loginQuery);
    const tokenQuery = await loginAPI.setToken(loginQuery.id, refreshToken);
    if(tokenQuery !== STATUS_CODE.OK) {
        console.log(`Storing token failed with status code: ${tokenQuery}`);
        res.status(tokenQuery).send(getLoginError(tokenQuery));
        return;
    }
    const loginProps : User = loginQuery as User;
    res.status(STATUS_CODE.OK).json({id: loginProps.id, role: loginProps.role, accessToken, refreshToken});
}

async function verifyToken(req : Request, res : Response) {
    console.log(`Received in verify token: ${JSON.stringify(req.body)}`);
    const tokenQuery = await loginAPI.verifyToken(req.body.id, req.body.refreshToken);
    if(tokenQuery !== STATUS_CODE.OK) {
        console.log(`Token verification failed with status code: ${tokenQuery}`);
        res.status(tokenQuery).send(getLoginError(tokenQuery));
        return;
    }
    const accessToken = generateAccessToken(req.body.id);
    res.status(STATUS_CODE.OK).json({accessToken});
}

async function registerAccount(req : Request, res : Response) {
    console.log(`Received in register: ${JSON.stringify(req.body)}`);
    const accountStatusCode = await loginAPI.createAccount(req.body.email, req.body.password);
    if(accountStatusCode !== STATUS_CODE.OK) {
        console.log(`Failed to register account with status code: ${accountStatusCode}`);
        res.status(accountStatusCode).send(getLoginError(accountStatusCode));
        return;
    }
    res.sendStatus(STATUS_CODE.OK);
}

async function logoutUser(req : Request, res : Response) {
    console.log(`Received in logout: ${JSON.stringify(req.body)}`);
    const logoutQuery = await loginAPI.logout(req.body.id);
    if(logoutQuery !== STATUS_CODE.OK) {
        console.log(`Failed to logout user with status code: ${logoutQuery}`);
        res.status(logoutQuery).send(getLoginError(logoutQuery));
        return;
    }
    res.sendStatus(STATUS_CODE.OK);
}

async function deleteAccount(req : Request, res : Response) {
    console.log(`Received in delete account: ${req.params.id}`);
    const deleteQuery = await loginAPI.delete(Number(req.params.id));
    if(deleteQuery !== STATUS_CODE.OK) {
        res.status(deleteQuery).send(getLoginError(deleteQuery));
        return;
    }
    res.sendStatus(STATUS_CODE.OK);
}

async function getUnderstudies(req : Request, res: Response) {
    console.log(`Received in get understudies: ${req.params.id}`);
    const understudyQuery = await loginAPI.getUnderstudies(Number(req.params.id));
    if(isStatusCode(understudyQuery)) {
        console.log(`Retrieving account ${req.params.id}'s understudies failed with status code ${understudyQuery}`);
        res.status(understudyQuery).send(getLoginError(understudyQuery));
        return;
    }
    res.status(STATUS_CODE.OK).json(understudyQuery);
}

export {verifyLogin, verifyToken, registerAccount, logoutUser, deleteAccount, getUnderstudies};
