const express = require("express");
const router = express.Router();
const authenticateToken = require("../utils/authenticateToken");
const initializeErrorMessages = require("../utils/errorMessages");
const GoalAPI = require("../controller/goalProcessor");
const STATUS_CODES = require("../utils/statusCodes");

const ERROR_MESSAGES = initializeErrorMessages();
const goalAPI = new GoalAPI();

router.get('/get/module/:id', authenticateToken, async(req, res) => {
    console.log(`Received in get goals: ${req.params.id}`);
    const goalQuery = await goalAPI.getGoals(req.params.id);
    if(typeof goalQuery !== "object") {
        res.status(goalQuery).send(ERROR_MESSAGES.get(goalQuery));
        return;
    }
    res.json(goalQuery);
});

router.post('/add', authenticateToken, async(req, res) => {
    console.log(req.body);
    const goalQuery = await goalAPI.createGoal(req.body.name, req.body.description, req.body.completion_perc, req.body.module_id);
    if(goalQuery !== STATUS_CODES.OK) {
        console.log("Something went wrong while creating module.");
        res.status(goalQuery).send(ERROR_MESSAGES.get(goalQuery));
        return;
    }
    res.sendStatus(STATUS_CODES.OK);
});

router.put('/update/:id', authenticateToken, async(req, res) => {
    console.log(`Received in update goal: ${req.params.id}`);
    const goalQuery = await goalAPI.updateGoal(req.params.id, req.body.name, req.body.description, req.body.isComplete);
    if(typeof goalQuery !== "object") {
        res.status(goalQuery).send(ERROR_MESSAGES.get(goalQuery));
        return;
    }
    res.json(goalQuery);
});

router.delete('/delete/:id', authenticateToken, async(req, res) => {
    console.log(`Received in delete goal: ${req.params.id}`);
    const goalQuery = await goalAPI.deleteGoal(req.params.id);
    if(goalQuery !== STATUS_CODES.OK) {
        res.status(goalQuery).send(ERROR_MESSAGES.get(goalQuery));
        return;
    }
    res.sendStatus(STATUS_CODES.OK);
});

module.exports = router;
