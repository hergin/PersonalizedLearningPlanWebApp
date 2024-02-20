import { Router, Request, Response } from "express";
import { authenticateToken } from "../utils/token";
import { initializeErrorMap } from "../utils/errorMessages";
import { GoalAPI } from "../controller/goalProcessor";
import { StatusCode } from "../types";

const goalRoutes = Router();
const ERROR_MESSAGES = initializeErrorMap();
const goalAPI = new GoalAPI();

goalRoutes.get('/get/module/:id', authenticateToken, async (req: Request, res: Response) => {
    console.log(`Received in get goals: ${req.params.id}`);
    const goalQuery = await goalAPI.getGoals(parseInt(req.params.id));
    if (typeof goalQuery !== "object") {
        res.status(goalQuery).send(ERROR_MESSAGES.get(goalQuery));
        return;
    }
    res.status(StatusCode.OK).json(goalQuery);
});

goalRoutes.post('/add', authenticateToken, async (req: Request, res: Response) => {
    console.log(req.body);
    const goalQuery = await goalAPI.createGoal({
        name: req.body.name,
        description: req.body.description,
        goalType: req.body.goalType,
        isComplete: req.body.isComplete,
        moduleId: req.body.moduleId,
        dueDate: req.body.dueDate
    });
    if (typeof goalQuery !== "object") {
        console.log("Something went wrong while creating module.");
        res.status(goalQuery).send(ERROR_MESSAGES.get(goalQuery));
        return;
    }
    res.status(StatusCode.OK).json(goalQuery);
});

goalRoutes.put('/update/:id', authenticateToken, async (req: Request, res: Response) => {
    console.log(`Received in update goal: ${req.params.id}`);
    const goalQuery = await goalAPI.updateGoal(
        parseInt(req.params.id), {
            name: req.body.name, 
            description: req.body.description,
            goalType: req.body.goalType, 
            isComplete: req.body.isComplete,
            dueDate: req.body.dueDate, 
            completionTime: req.body.completionTime, 
            expiration: req.body.expiration
    });
    if (typeof goalQuery !== "object") {
        res.status(goalQuery).send(ERROR_MESSAGES.get(goalQuery));
        return;
    }
    res.status(StatusCode.OK).json(goalQuery);
});

goalRoutes.put('/update/feedback/:id', authenticateToken, async (req: Request, res: Response) => {
    console.log(`Received in update goal feedback: ${req.params.id} ${req.body.feedback}`);
    const goalQuery = await goalAPI.updateGoalFeedback(Number(req.params.id), req.body.feedback);
    if (goalQuery !== StatusCode.OK) {
        res.status(goalQuery).send(ERROR_MESSAGES.get(goalQuery));
        return;
    }
    res.sendStatus(StatusCode.OK);
});

goalRoutes.delete('/delete/:id', authenticateToken, async (req: Request, res: Response) => {
    console.log(`Received in delete goal: ${req.params.id}`);
    const goalQuery = await goalAPI.deleteGoal(parseInt(req.params.id));
    if (goalQuery !== StatusCode.OK) {
        res.status(goalQuery).send(ERROR_MESSAGES.get(goalQuery));
        return;
    }
    res.sendStatus(StatusCode.OK);
});

goalRoutes.get('/get/:id/:variable', authenticateToken, async (req: Request, res: Response) => {
    console.log(`Received in get goal variable: ${req.params.id} ${req.params.variable}`);
    const variableQuery = await goalAPI.getGoalVariable(parseInt(req.params.id), req.params.variable);
    if (typeof variableQuery !== "object") {
        res.status(variableQuery).send(ERROR_MESSAGES.get(variableQuery));
        return;
    }
    res.status(StatusCode.OK).json(variableQuery);
});

goalRoutes.post('/add/:id', authenticateToken, async (req: Request, res: Response) => {
    console.log(`Received in add sub goal: ${req.params.id}`);
    const goalQuery = await goalAPI.addSubGoal(Number(req.params.id), {
        name: req.body.name,
        description: req.body.description,
        goalType: req.body.goalType,
        isComplete: req.body.isComplete,
        moduleId: req.body.moduleId,
        dueDate: req.body.dueDate
    });
    if(typeof goalQuery !== "object") {
        res.status(goalQuery).send(ERROR_MESSAGES.get(goalQuery));
        return;
    }
    res.status(StatusCode.OK).json(goalQuery);
});

export default goalRoutes;
