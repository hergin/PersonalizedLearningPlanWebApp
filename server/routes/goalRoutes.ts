import express from "express";
import { authenticateToken } from "../utils/token";
import { initializeErrorMap } from "../utils/errorMessages";
import { GoalAPI } from "../controller/goalProcessor";
import { STATUS_CODES } from "../utils/statusCodes";

const goalRoutes = express.Router();
const ERROR_MESSAGES = initializeErrorMap();
const goalAPI = new GoalAPI();

goalRoutes.get('/get/module/:id', authenticateToken, async (req: any, res: any) => {
    console.log(`Received in get goals: ${req.params.id}`);
    const goalQuery = await goalAPI.getGoals(parseInt(req.params.id));
    if (typeof goalQuery !== "object") {
        res.status(goalQuery).send(ERROR_MESSAGES.get(goalQuery));
        return;
    }
    res.json(goalQuery);
});

goalRoutes.post('/add', authenticateToken, async (req: any, res: any) => {
    console.log(req.body);
    const goalQuery = await goalAPI.createGoal({
        name: req.body.name,
        description: req.body.description,
        goalType: req.body.goal_type,
        isComplete: req.body.is_complete,
        moduleId: req.body.module_id,
        dueDate: req.body.due_date
    });
    if (typeof goalQuery !== "object") {
        console.log("Something went wrong while creating module.");
        res.status(goalQuery).send(ERROR_MESSAGES.get(goalQuery));
        return;
    }
    res.status(STATUS_CODES.OK).json(goalQuery);
});

goalRoutes.put('/update/:id', authenticateToken, async (req: any, res: any) => {
    console.log(`Received in update goal: ${req.params.id}`);
    const goalQuery = await goalAPI.updateGoal(parseInt(req.params.id), req.body.name, req.body.description, req.body.is_complete, req.body.due_due, req.body.completion_time, req.body.expiration);
    if (typeof goalQuery !== "object") {
        res.status(goalQuery).send(ERROR_MESSAGES.get(goalQuery));
        return;
    }
    res.json(goalQuery);
});

goalRoutes.delete('/delete/:id', authenticateToken, async (req: any, res: any) => {
    console.log(`Received in delete goal: ${req.params.id}`);
    const goalQuery = await goalAPI.deleteGoal(parseInt(req.params.id));
    if (goalQuery !== STATUS_CODES.OK) {
        res.status(goalQuery).send(ERROR_MESSAGES.get(goalQuery));
        return;
    }
    res.sendStatus(STATUS_CODES.OK);
});

goalRoutes.get('/get/:id/:variable', authenticateToken, async (req: any, res: any) => {
    console.log(`Received in get goal variable: ${req.params.id} ${req.params.variable}`);
    const variableQuery = await goalAPI.getGoalVariable(parseInt(req.params.id), req.params.variable);
    if (typeof variableQuery !== "object") {
        res.status(variableQuery).send(ERROR_MESSAGES.get(variableQuery));
        return;
    }
    res.sendStatus(STATUS_CODES.OK).json(variableQuery);
});

goalRoutes.post('/add/:id', authenticateToken, async (req: any, res: any) => {
    console.log(`Received in add sub goal: ${req.params.id}`);
    const goalQuery = await goalAPI.addSubGoal(req.body.parent_goal_id, {
        name: req.body.name,
        description: req.body.description,
        goalType: req.body.goal_type,
        isComplete: req.body.is_complete,
        moduleId: req.body.module_id,
        dueDate: req.body.due_date
    });
    if(typeof goalQuery !== "object") {
        res.status(goalQuery).send(ERROR_MESSAGES.get(goalQuery));
        return;
    }
    res.sendStatus(STATUS_CODES.OK).json(goalQuery);
});

export default goalRoutes;
