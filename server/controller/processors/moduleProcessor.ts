import ModuleAPI from "../api/moduleApi";
import { STATUS_CODE } from "../../types";
import { getLoginError } from "../../utils/errorHandlers";
import { Request, Response } from "express";
import { isStatusCode } from "../../utils/typePredicates";

const moduleAPI = new ModuleAPI();

async function getAccountModules(req : Request, res : Response) {
    console.log(`Received in get modules: ${req.params.id}`);
    const moduleQuery = await moduleAPI.getModules(Number(req.params.id));
    if(isStatusCode(moduleQuery)) {
        res.status(moduleQuery).send(getLoginError(moduleQuery));
        return;
    }
    res.status(STATUS_CODE.OK).json(moduleQuery);
}

async function postModule(req : Request, res : Response) {
    console.log(`Received in post module: ${req.body.accountId}`);
    const status = await moduleAPI.createModule({
        name: req.body.name, 
        description: req.body.description, 
        completion: req.body.completionPercent, 
        accountId: req.body.accountId
    });
    if(status !== STATUS_CODE.OK) {
        console.log(`Something went wrong while creating module for account ${req.body.accountId}.`);
        res.status(status).send(getLoginError(status));
        return;
    }
    res.sendStatus(STATUS_CODE.OK);
}

async function putModule(req : Request, res : Response) {
    console.log(`Received in update module: ${req.params.id}`);
    const moduleQuery = await moduleAPI.updateModule({
        id: parseInt(req.params.id), 
        name: req.body.name, 
        description: req.body.description, 
        completion: req.body.completion,
    });
    if(moduleQuery !== STATUS_CODE.OK) {
        console.log("Something went wrong while editing a module.");
        res.status(moduleQuery).send(getLoginError(moduleQuery));
        return;
    }
    res.sendStatus(STATUS_CODE.OK);
}

async function deleteModule(req : Request, res : Response) {
    console.log(`Received in delete module: ${req.params.id}`);
    const moduleQuery = await moduleAPI.deleteModule(parseInt(req.params.id));
    if(moduleQuery !== STATUS_CODE.OK) {
        console.log("Something went wrong while deleting module.");
        res.status(moduleQuery).send(getLoginError(moduleQuery));
        return;
    }
    res.sendStatus(STATUS_CODE.OK);
}

async function getModuleVariable(req : Request, res : Response) {
    console.log(`Received in get module variable: ${req.params.id} ${req.params.variable}`);
    const variableQuery = await moduleAPI.getModuleVariable(parseInt(req.params.id), req.params.variable);
    if(isStatusCode(variableQuery)) {
        console.log("Something went wrong while receiving module variable.");
        res.status(variableQuery).send(getLoginError(variableQuery));
        return;
    }
    res.status(STATUS_CODE.OK).json(variableQuery);
}

export {getAccountModules, postModule, putModule, deleteModule, getModuleVariable};
