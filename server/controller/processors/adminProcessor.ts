import AdminApi from "../api/adminApi";
import { StatusCode } from "../../types";
import { initializeErrorMap } from "../../utils/errorMessages";
import { Request, Response } from "express";
import isStatusCode from "../../utils/isStatusCode";

const adminApi = new AdminApi();
const ERROR_MESSAGES = initializeErrorMap();

export async function getAllAccounts(req: Request, res: Response) {
    console.log("Getting all accounts has been called.");
    const result = await adminApi.getAllUserData();
    if(isStatusCode(result)) {
        console.error("Something went wrong while parsing all accounts.");
        res.status(result).send(ERROR_MESSAGES.get(result));
        return;
    }
    res.status(StatusCode.OK).json(result);
};

export async function getAccount(req: Request, res: Response) {
    console.log(`Getting account with id ${req.params.id}`);
    const result = await adminApi.getUserData(Number(req.params.id));
    if(isStatusCode(result)) {
        console.error(`Something went wrong while parsing account with id ${req.params.id}`);
        res.status(result).send(ERROR_MESSAGES.get(result));
        return;
    }
    res.status(StatusCode.OK).json(result);
}

export async function postAccountRole(req: Request, res: Response) {
    console.log(`Giving account with id ${req.params.id} the ${req.body.newRole} role.`);
    const result = await adminApi.setAccountToRole(Number(req.params.id), req.body.newRole);
    if(result !== StatusCode.OK) {
        console.error(`Something went wrong while giving account ${req.body.id} the ${req.body.newRole} role.`);
        res.status(result).send(ERROR_MESSAGES.get(result));
        return;
    }
    res.sendStatus(StatusCode.OK);
}
