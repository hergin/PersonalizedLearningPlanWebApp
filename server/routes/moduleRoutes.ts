import { Router, Request, Response } from "express";
import { authenticateToken } from "../utils/token";
import { initializeErrorMap } from "../utils/errorMessages";
import { ModuleAPI } from "../controller/moduleProcessor";
import { StatusCode } from "../types";

const moduleRoutes = Router();
const ERROR_MESSAGES = initializeErrorMap();
const moduleAPI = new ModuleAPI();

moduleRoutes.get('/get/:id', authenticateToken, async(req : Request, res : Response) => {
    console.log(`Received: ${req.params.id}`);
    const moduleQuery = await moduleAPI.getModules(Number(req.params.id));
    if(typeof moduleQuery !== "object") {
        res.status(moduleQuery).send(ERROR_MESSAGES.get(moduleQuery));
        return;
    }
    res.status(StatusCode.OK).json(moduleQuery);
});

moduleRoutes.post('/add', authenticateToken, async(req : Request, res : Response) => {
    console.log(`Received: ${req.body.account_id}`);
    const moduleQuery = await moduleAPI.createModule(req.body.name, req.body.description, req.body.completion_percent, req.body.account_id);
    if(typeof moduleQuery !== "object") {
        console.log("Something went wrong while creating module.");
        res.status(moduleQuery).send(ERROR_MESSAGES.get(moduleQuery));
        return;
    }
    res.status(StatusCode.OK).json(moduleQuery);
});

moduleRoutes.delete('/delete/:id', authenticateToken, async (req : Request, res : Response) => {
    console.log(`Received: ${req.params.id}`);
    const moduleQuery = await moduleAPI.deleteModule(parseInt(req.params.id));
    if(moduleQuery !== StatusCode.OK) {
        console.log("Something went wrong while deleting module.");
        res.status(moduleQuery).send(ERROR_MESSAGES.get(moduleQuery));
        return;
    }
    res.sendStatus(StatusCode.OK);
});

moduleRoutes.put('/edit/:id', authenticateToken, async (req : Request, res : Response) => {
    console.log(`Received: ${req.params.id}`);
    const moduleQuery = await moduleAPI.updateModule(parseInt(req.params.id), req.body.name, req.body.description, req.body.completion, req.body.account_id);
    if(moduleQuery !== StatusCode.OK) {
        console.log("Something went wrong while editing a module.");
        res.status(moduleQuery).send(ERROR_MESSAGES.get(moduleQuery));
        return;
    }
    res.sendStatus(StatusCode.OK);
});

moduleRoutes.get('/get/:id/:variable', authenticateToken, async (req : Request, res : Response) => {
    console.log(`Received in get module variable: ${req.params.id} ${req.params.variable}`);
    const variableQuery = await moduleAPI.getModuleVariable(parseInt(req.params.id), req.params.variable);
    if(typeof variableQuery !== "object") {
        console.log("Something went wrong while receiving module variable.");
        res.status(variableQuery).send(ERROR_MESSAGES.get(variableQuery));
        return;
    }
    res.sendStatus(StatusCode.OK).json(variableQuery);
});

export default moduleRoutes;
