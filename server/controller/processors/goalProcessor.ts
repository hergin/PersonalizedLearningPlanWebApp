import GoalAPI from "../api/goalApi";
import EmailService from "../../service/emailService";
import { STATUS_CODE } from "../../types";
import { getLoginError } from "../../utils/errorHandlers";
import { Request, Response } from "express";
import LoginAPI from "../api/loginApi";
import { isStatusCode } from "../../utils/typeGuards";

const goalAPI = new GoalAPI();
const loginAPI = new LoginAPI();
const emailService = new EmailService();

async function getModuleGoals(req: Request, res: Response) {
    console.log(`Received in get goals: ${req.params.id}`);
    const goalQuery = await goalAPI.getGoals(parseInt(req.params.id));
    if (isStatusCode(goalQuery)) {
        res.status(goalQuery).send(getLoginError(goalQuery));
        return;
    }
    res.status(STATUS_CODE.OK).json(goalQuery);
}

async function postGoal(req: Request, res: Response) {
    if(req.params.id) console.log(`Parent goal id: ${req.params.id}`);
    console.log(`Received Goal: ${JSON.stringify(req.body)}`);
    const status = await goalAPI.createGoal({
        name: req.body.name,
        description: req.body.description,
        goal_type: req.body.goalType,
        is_complete: req.body.isComplete,
        module_id: req.body.moduleId,
        tag_id: req.body.tagId ?? undefined,
        due_date: req.body.dueDate ?? undefined,
        parent_goal: req.params.id ? Number(req.params.id) : undefined
    });
    if (status !== STATUS_CODE.OK) {
        console.log("Something went wrong while creating goal.");
        res.status(status).send(getLoginError(status));
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
        module_id: req.body.module_id,
        due_date: req.body.due_date,
        tag_id: req.body.tag_id,
        completion_time: req.body.completion_time,
        expiration: req.body.expiration
    });
    if (resultingStatusCode !== STATUS_CODE.OK) {
        console.log(`Updating goal failed for goal ${req.params.id} with status code ${resultingStatusCode}`);
        res.status(resultingStatusCode).send(getLoginError(resultingStatusCode));
        return;
    }
    res.sendStatus(STATUS_CODE.OK);
}

async function putGoalFeedback(req: Request, res: Response) {
    console.log(`Received in update goal feedback: ${req.params.id} ${req.body.feedback}`);
    const goalQuery = await goalAPI.updateGoalFeedback(Number(req.params.id), req.body.feedback);
    if (goalQuery !==STATUS_CODE.OK) {
        res.status(goalQuery).send(getLoginError(goalQuery));
        return;
    }
    const accountQuery = await loginAPI.getEmailById(req.body.userId);
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
    if (goalQuery !== STATUS_CODE.OK) {
        res.status(goalQuery).send(getLoginError(goalQuery));
        return;
    }
    res.sendStatus(STATUS_CODE.OK);
}

async function getGoalVariable(req: Request, res: Response) {
    console.log(`Received in get goal variable: ${req.params.id} ${req.params.variable}`);
    const variableQuery = await goalAPI.getGoalVariable(parseInt(req.params.id), req.params.variable);
    if (isStatusCode(variableQuery)) {
        res.status(variableQuery).send(getLoginError(variableQuery));
        return;
    }
    res.status(STATUS_CODE.OK).json(variableQuery);
}

export { getModuleGoals, postGoal, putGoal, putGoalFeedback, deleteGoal, getGoalVariable };
