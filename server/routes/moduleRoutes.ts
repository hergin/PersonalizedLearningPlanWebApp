export {};

const express = require("express");
const tokenMethods = require("../utils/authenticateToken");
const initializeErrorMap = require("../utils/errorMessages");
const ModuleAPI = require("../controller/moduleProcessor");
const STATUS_CODES = require("../utils/statusCodes");


const router = express.Router();
const ERROR_MESSAGES = initializeErrorMap();
const moduleAPI = new ModuleAPI();

router.get('/get/:id', tokenMethods.authenticateToken, async(req : any, res : any) => {
    console.log(`Received: ${req.params.id}`);
    const moduleQuery = await moduleAPI.getModules(req.params.id);
    if(typeof moduleQuery !== "object") {
        res.status(moduleQuery).send(ERROR_MESSAGES.get(moduleQuery));
        return;
    }
    console.log(`Result: ${moduleQuery}`);
    res.status(STATUS_CODES.OK).json(moduleQuery);
});

router.post('/add', tokenMethods.authenticateToken, async(req : any, res : any) => {
    console.log(`Received: ${req.body.email}`);
    const moduleQuery = await moduleAPI.createModule(req.body.name, req.body.description, req.body.completion_percent, req.body.email);
    if(typeof moduleQuery !== "object") {
        console.log("Something went wrong while creating module.");
        res.status(moduleQuery).send(ERROR_MESSAGES.get(moduleQuery));
        return;
    }
    res.status(STATUS_CODES.OK).json(moduleQuery);
});

router.delete('/delete/:id', tokenMethods.authenticateToken, async (req : any, res : any) => {
    console.log(`Received: ${req.params.id}`);
    const moduleQuery = await moduleAPI.deleteModule(parseInt(req.params.id));
    if(moduleQuery !== STATUS_CODES.OK) {
        console.log("Something went wrong while deleting module.");
        res.status(moduleQuery).send(ERROR_MESSAGES.get(moduleQuery));
        return;
    }
    res.sendStatus(STATUS_CODES.OK);
});

router.put('/edit/:id', tokenMethods.authenticateToken, async (req : any, res : any) => {
    console.log(`Received: ${req.params.id}`);
    const moduleQuery = await moduleAPI.updateModule(parseInt(req.params.id), req.body.name, req.body.description, req.body.completion, req.body.email);
    if(moduleQuery !== STATUS_CODES.OK) {
        console.log("Something went wrong while editing a module.");
        res.status(moduleQuery).send(ERROR_MESSAGES.get(moduleQuery));
        return;
    }
    res.sendStatus(STATUS_CODES.OK);
});

module.exports = router;
