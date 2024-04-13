import GoalAPI from "../api/goalApi";
import EmailService from "../../service/emailService";
import { STATUS_CODE } from "../../types";
import { initializeErrorMap } from "../../utils/errorMessages";
import { Request, Response } from "express";
import LoginAPI from "../api/loginApi";
import isStatusCode from "../../utils/isStatusCode";

const goalAPI = new GoalAPI();
const loginAPI = new LoginAPI();
const ERROR_MESSAGES = initializeErrorMap();
const emailService = new EmailService();

async function getModuleGoals(req: Request, res: Response) {
    console.log(`Received in get goals: ${req.params.id}`);
    const goalQuery = await goalAPI.getGoals(parseInt(req.params.id));
    if (isStatusCode(goalQuery)) {
        res.status(goalQuery).send(ERROR_MESSAGES.get(goalQuery));
        return;
    }
    res.status(STATUS_CODE.OK).json(goalQuery);
}

async function postGoal(req: Request, res: Response) {
    console.log(req.body);
    const status = await goalAPI.createGoal({
        name: req.body.name,
        description: req.body.description,
        goal_type: req.body.goalType,
        is_complete: req.body.isComplete,
        module_id: req.body.moduleId,
        tag_id: req.body.tagId,
        due_date: req.body.dueDate
    });
    if (status !== STATUS_CODE.OK) {
        console.log("Something went wrong while creating module.");
        res.status(status).send(ERROR_MESSAGES.get(status));
        return;
    }
    res.sendStatus(STATUS_CODE.OK);
}

async function putGoal(req: Request, res: Response) {
    console.log(`Received in update goal: ${req.params.id}`);
    const resultingStatusCode = await goalAPI.updateGoal({
        goal_id: Number(req.params.id),
        name: req.body.name,
        description: req.body.description,
        goal_type: req.body.goal_type,
        is_complete: req.body.is_complete,
        due_date: req.body.due_date,
        tag_id: req.body.tag_id,
        completion_time: req.body.completion_time,
        expiration: req.body.expiration
    });
    if (resultingStatusCode !==STATUS_CODE.OK) {
        console.log(`Updating goal failed for goal ${req.params.id} with status code ${resultingStatusCode}`);
        res.status(resultingStatusCode).send(ERROR_MESSAGES.get(resultingStatusCode));
        return;
    }
    res.sendStatus(STATUS_CODE.OK);
}

async function putGoalFeedback(req: Request, res: Response) {
    console.log(`Received in update goal feedback: ${req.params.id} ${req.body.feedback}`);
    const goalQuery = await goalAPI.updateGoalFeedback(Number(req.params.id), req.body.feedback);
    if (goalQuery !==STATUS_CODE.OK) {
        res.status(goalQuery).send(ERROR_MESSAGES.get(goalQuery));
        return;
    }
    const accountQuery = await loginAPI.getAccountById(req.body.userId);
    if(isStatusCode(accountQuery)) {
        console.error(`Failed to retrieve account id for coach ${req.body.userId}'s feedback.`);
        res.status(accountQuery).send("Failed to retrieve understudy's account to email them the feedback.");
        return;
    }
    emailService.sendEmail(accountQuery[0].email, "Feedback", req.body.feedback);
    res.sendStatus(STATUS_CODE.OK);
}

async function deleteGoal(req: Request, res: Response) {
    console.log(`Received in delete goal: ${req.params.id}`);
    const goalQuery = await goalAPI.deleteGoal(parseInt(req.params.id));
    if (goalQuery !==STATUS_CODE.OK) {
        res.status(goalQuery).send(ERROR_MESSAGES.get(goalQuery));
        return;
    }
    res.sendStatus(STATUS_CODE.OK);
}

async function getGoalVariable(req: Request, res: Response) {
    console.log(`Received in get goal variable: ${req.params.id} ${req.params.variable}`);
    const variableQuery = await goalAPI.getGoalVariable(parseInt(req.params.id), req.params.variable);
    if (typeof variableQuery !== "object") {
        res.status(variableQuery).send(ERROR_MESSAGES.get(variableQuery));
        return;
    }
    res.status(STATUS_CODE.OK).json(variableQuery);
}

async function postSubGoal(req: Request, res: Response) {
    console.log(`Received in add sub goal: ${req.params.id}`);
    const goalQuery = await goalAPI.addSubGoal(Number(req.params.id), {
        name: req.body.name,
        description: req.body.description,
        goal_type: req.body.goalType,
        is_complete: req.body.isComplete,
        module_id: req.body.moduleId,
        tag_id: req.body.tagId,
        due_date: req.body.dueDate
    });
    if (typeof goalQuery !== "object") {
        res.status(goalQuery).send(ERROR_MESSAGES.get(goalQuery));
        return;
    }
    res.status(STATUS_CODE.OK).json(goalQuery);
}

export { getModuleGoals, postGoal, putGoal, putGoalFeedback, deleteGoal, getGoalVariable, postSubGoal };
