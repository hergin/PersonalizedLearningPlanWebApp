const express = require("express");
const router = express.Router();
const authenticateToken = require("../utils/authenticateToken");
const initializeErrorMessages = require("../utils/errorMessages");
const ModuleAPI = require("../controller/moduleProcessor");
const STATUS_CODES = require("../utils/statusCodes");

const ERROR_MESSAGES = initializeErrorMessages();
const moduleAPI = new ModuleAPI();

router.get('/get/:id', authenticateToken, async(req, res) => {
    console.log(`Received: ${req.params.id}`);
    const moduleQuery = await moduleAPI.getModules(req.params.id);
    if(typeof moduleQuery !== "object") {
        res.status(moduleQuery).send(ERROR_MESSAGES.get(moduleQuery));
        return;
    }
    console.log(`Result: ${moduleQuery}`);
    res.status(STATUS_CODES.OK).json(moduleQuery);
});

router.post('/add', authenticateToken, async(req, res) => {
    console.log(`Received: ${req.body.email}`);
    const moduleQuery = await moduleAPI.createModule(req.body.name, req.body.description, req.body.completion_percent, req.body.email);
    if(moduleQuery !== STATUS_CODES.OK) {
        console.log("Something went wrong while creating module.");
        res.status(moduleQuery).send(ERROR_MESSAGES.get(moduleQuery));
        return;
    }
    const moduleQuery2 = await moduleAPI.getModules(req.body.email);
    if(typeof moduleQuery2 !== "object") {
        res.status(moduleQuery2).send(ERROR_MESSAGES.get(moduleQuery2));
        return;
    }
    res.status(STATUS_CODES.OK).json(moduleQuery2);
});

router.delete('/delete/:id', authenticateToken, async (req, res) => {
    console.log(`Received: ${req.params.id}`);
    const moduleQuery = await moduleAPI.deleteModule(req.params.id);
    if(moduleQuery !== STATUS_CODES.OK) {
        console.log("Something went wrong while deleting module.");
        res.status(moduleQuery).send(ERROR_MESSAGES.get(moduleQuery));
        return;
    }
    res.sendStatus(STATUS_CODES.OK);
});

router.put('/edit/:id', authenticateToken, async (req, res) => {
    console.log(`Received: ${req.params.id}`);
    const moduleQuery = await moduleAPI.updateModule(req.params.id, req.body.name, req.body.description, req.body.completion, req.body.email);
    if(moduleQuery !== STATUS_CODES.OK) {
        console.log("Something went wrong while deleting module.");
        res.status(moduleQuery).send(ERROR_MESSAGES.get(moduleQuery));
        return;
    }
    res.sendStatus(STATUS_CODES.OK);
});

module.exports = router;
