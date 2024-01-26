export {};

const express = require("express");
const tokenMethods = require("../utils/token");
const initializeErrorMap = require("../utils/errorMessages");
const GoalAPI = require("../controller/goalProcessor");
const STATUS_CODES = require("../utils/statusCodes");

const router = express.Router();
const ERROR_MESSAGES = initializeErrorMap();
const goalAPI = new GoalAPI();

router.get('/get/module/:id', tokenMethods.authenticateToken, async(req : any, res : any) => {
    console.log(`Received in get goals: ${req.params.id}`);
    const goalQuery = await goalAPI.getGoals(parseInt(req.params.id));
    if(typeof goalQuery !== "object") {
        res.status(goalQuery).send(ERROR_MESSAGES.get(goalQuery));
        return;
    }
    res.json(goalQuery);
});

router.post('/add', tokenMethods.authenticateToken, async(req : any, res : any) => {
    console.log(req.body);
    const goalQuery = await goalAPI.createGoal(req.body.name, req.body.description, req.body.goal_type, req.body.completion_perc, req.body.module_id, req.body.due_date);
    if(typeof goalQuery !== "object") {
        console.log("Something went wrong while creating module.");
        res.status(goalQuery).send(ERROR_MESSAGES.get(goalQuery));
        return;
    }
    res.status(STATUS_CODES.OK).json(goalQuery);
});

router.put('/update/:id', tokenMethods.authenticateToken, async(req : any, res : any) => {
    console.log(`Received in update goal: ${req.params.id}`);
    const goalQuery = await goalAPI.updateGoal(parseInt(req.params.id), req.body.name, req.body.description, req.body.is_complete, req.body.due_due, req.body.completion_time, req.body.expiration);
    if(typeof goalQuery !== "object") {
        res.status(goalQuery).send(ERROR_MESSAGES.get(goalQuery));
        return;
    }
    res.json(goalQuery);
});

router.delete('/delete/:id', tokenMethods.authenticateToken, async(req : any, res : any) => {
    console.log(`Received in delete goal: ${req.params.id}`);
    const goalQuery = await goalAPI.deleteGoal(parseInt(req.params.id));
    if(goalQuery !== STATUS_CODES.OK) {
        res.status(goalQuery).send(ERROR_MESSAGES.get(goalQuery));
        return;
    }
    res.sendStatus(STATUS_CODES.OK);
});

router.post('/add/:id', tokenMethods.authenticateToken, async(req : any, res : any) => {
    console.log(`Received in add sub goal: ${req.params.id}`);
    const subGoalQuery = await goalAPI.addSubGoal(parseInt(req.params.id), req.body.name, req.body.description, req.body.completion_perc);
})

module.exports = router;
