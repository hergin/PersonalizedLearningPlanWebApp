import express from "express";
import { authenticateToken } from "../utils/token";
import { initializeErrorMap } from "../utils/errorMessages";
import { ModuleAPI } from "../controller/moduleProcessor";
import { STATUS_CODES } from "../utils/statusCodes";

const moduleRoutes = express.Router();
const ERROR_MESSAGES = initializeErrorMap();
const moduleAPI = new ModuleAPI();

moduleRoutes.get('/get/:id', authenticateToken, async(req : any, res : any) => {
    console.log(`Received: ${req.params.id}`);
    const moduleQuery = await moduleAPI.getModules(req.params.id);
    if(typeof moduleQuery !== "object") {
        res.status(moduleQuery).send(ERROR_MESSAGES.get(moduleQuery));
        return;
    }
    console.log(`Result: ${moduleQuery}`);
    res.status(STATUS_CODES.OK).json(moduleQuery);
});

moduleRoutes.post('/add', authenticateToken, async(req : any, res : any) => {
    console.log(`Received: ${req.body.email}`);
    const moduleQuery = await moduleAPI.createModule(req.body.name, req.body.description, req.body.completion_percent, req.body.email);
    if(typeof moduleQuery !== "object") {
        console.log("Something went wrong while creating module.");
        res.status(moduleQuery).send(ERROR_MESSAGES.get(moduleQuery));
        return;
    }
    res.status(STATUS_CODES.OK).json(moduleQuery);
});

moduleRoutes.delete('/delete/:id', authenticateToken, async (req : any, res : any) => {
    console.log(`Received: ${req.params.id}`);
    const moduleQuery = await moduleAPI.deleteModule(parseInt(req.params.id));
    if(moduleQuery !== STATUS_CODES.OK) {
        console.log("Something went wrong while deleting module.");
        res.status(moduleQuery).send(ERROR_MESSAGES.get(moduleQuery));
        return;
    }
    res.sendStatus(STATUS_CODES.OK);
});

moduleRoutes.put('/edit/:id', authenticateToken, async (req : any, res : any) => {
    console.log(`Received: ${req.params.id}`);
    const moduleQuery = await moduleAPI.updateModule(parseInt(req.params.id), req.body.name, req.body.description, req.body.completion, req.body.email);
    if(moduleQuery !== STATUS_CODES.OK) {
        console.log("Something went wrong while editing a module.");
        res.status(moduleQuery).send(ERROR_MESSAGES.get(moduleQuery));
        return;
    }
    res.sendStatus(STATUS_CODES.OK);
});

moduleRoutes.get('/get/:id/:variable', authenticateToken, async (req : any, res : any) => {
    console.log(`Received in get module variable: ${req.params.id} ${req.params.variable}`);
    const variableQuery = await moduleAPI.getModuleVariable(parseInt(req.params.id), req.params.variable);
    if(typeof variableQuery !== "object") {
        console.log("Something went wrong while receiving module variable.");
        res.status(variableQuery).send(ERROR_MESSAGES.get(variableQuery));
        return;
    }
    res.sendStatus(STATUS_CODES.OK).json(variableQuery);
});

export default moduleRoutes;
