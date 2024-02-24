import ModuleAPI from "../api/moduleApi";
import { StatusCode } from "../../types";
import { initializeErrorMap } from "../../utils/errorMessages";
import { Request, Response } from "express";

const moduleAPI = new ModuleAPI();
const ERROR_MESSAGES = initializeErrorMap();

async function getAccountModules(req : Request, res : Response) {
    console.log(`Received in get modules: ${req.params.id}`);
    const moduleQuery = await moduleAPI.getModules(Number(req.params.id));
    if(typeof moduleQuery !== "object") {
        res.status(moduleQuery).send(ERROR_MESSAGES.get(moduleQuery));
        return;
    }
    res.status(StatusCode.OK).json(moduleQuery);
}

async function postModule(req : Request, res : Response) {
    console.log(`Received in post module: ${req.body.account_id}`);
    const moduleQuery = await moduleAPI.createModule({
        name: req.body.name, 
        description: req.body.description, 
        completion: req.body.completion_percent, 
        accountId: req.body.account_id,
        coachId: req.body.coach_id
    });
    console.log(`Query Result: ${moduleQuery}`);
    if(moduleQuery as StatusCode in StatusCode) {
        console.log(`Something went wrong while creating module for account ${req.body.account_id}.`);
        res.status(moduleQuery as StatusCode).send(ERROR_MESSAGES.get(moduleQuery as StatusCode));
        return;
    }
    res.status(StatusCode.OK).json(moduleQuery);
}

async function putModule(req : Request, res : Response) {
    console.log(`Received in update module: ${req.params.id}`);
    const moduleQuery = await moduleAPI.updateModule({
        id: parseInt(req.params.id), 
        name: req.body.name, 
        description: req.body.description, 
        completion: req.body.completion,
        coachId: req.body.coach_id
    });
    if(moduleQuery !== StatusCode.OK) {
        console.log("Something went wrong while editing a module.");
        res.status(moduleQuery).send(ERROR_MESSAGES.get(moduleQuery));
        return;
    }
    res.sendStatus(StatusCode.OK);
}

async function deleteModule(req : Request, res : Response) {
    console.log(`Received in delete module: ${req.params.id}`);
    const moduleQuery = await moduleAPI.deleteModule(parseInt(req.params.id));
    if(moduleQuery !== StatusCode.OK) {
        console.log("Something went wrong while deleting module.");
        res.status(moduleQuery).send(ERROR_MESSAGES.get(moduleQuery));
        return;
    }
    res.sendStatus(StatusCode.OK);
}

async function getModuleVariable(req : Request, res : Response) {
    console.log(`Received in get module variable: ${req.params.id} ${req.params.variable}`);
    const variableQuery = await moduleAPI.getModuleVariable(parseInt(req.params.id), req.params.variable);
    if(variableQuery as StatusCode in StatusCode) {
        console.log("Something went wrong while receiving module variable.");
        res.status(variableQuery as StatusCode).send(ERROR_MESSAGES.get(variableQuery));
        return;
    }
    res.sendStatus(StatusCode.OK).json(variableQuery);
}

export {getAccountModules, postModule, putModule, deleteModule, getModuleVariable};
