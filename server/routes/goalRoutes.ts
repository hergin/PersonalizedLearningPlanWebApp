export {};

const express = require("express");
const authenticateToken = require("../utils/authenticateToken");
const initializeErrorMap = require("../utils/errorMessages");
const GoalAPI = require("../controller/goalProcessor");
const STATUS_CODES = require("../utils/statusCodes");

const router = express.Router();
const ERROR_MESSAGES = initializeErrorMap();
const goalAPI = new GoalAPI();

router.get('/get/module/:id', authenticateToken, async(req : any, res : any) => {
    console.log(`Received in get goals: ${req.params.id}`);
    const goalQuery = await goalAPI.getGoals(parseInt(req.params.id));
    if(typeof goalQuery !== "object") {
        res.status(goalQuery).send(ERROR_MESSAGES.get(goalQuery));
        return;
    }
    res.json(goalQuery);
});

router.post('/add', authenticateToken, async(req : any, res : any) => {
    console.log(req.body);
    const goalQuery = await goalAPI.createGoal(req.body.name, req.body.description, req.body.completion_perc, req.body.module_id);
    if(typeof goalQuery !== "object") {
        console.log("Something went wrong while creating module.");
        res.status(goalQuery).send(ERROR_MESSAGES.get(goalQuery));
        return;
    }
    res.status(STATUS_CODES.OK).json(goalQuery);
});

router.put('/update/:id', authenticateToken, async(req : any, res : any) => {
    console.log(`Received in update goal: ${req.params.id}`);
    const goalQuery = await goalAPI.updateGoal(parseInt(req.params.id), req.body.name, req.body.description, req.body.isComplete);
    if(typeof goalQuery !== "object") {
        res.status(goalQuery).send(ERROR_MESSAGES.get(goalQuery));
        return;
    }
    res.json(goalQuery);
});

router.delete('/delete/:id', authenticateToken, async(req : any, res : any) => {
    console.log(`Received in delete goal: ${req.params.id}`);
    const goalQuery = await goalAPI.deleteGoal(parseInt(req.params.id));
    if(goalQuery !== STATUS_CODES.OK) {
        res.status(goalQuery).send(ERROR_MESSAGES.get(goalQuery));
        return;
    }
    res.sendStatus(STATUS_CODES.OK);
});

router.post('/add/:id', authenticateToken, async(req : any, res : any) => {
    console.log(`Received in add sub goal: ${req.params.id}`);
    const subGoalQuery = await goalAPI.addSubGoal(parseInt(req.params.id), req.body.name, req.body.description, req.body.completion_perc);
})

module.exports = router;
