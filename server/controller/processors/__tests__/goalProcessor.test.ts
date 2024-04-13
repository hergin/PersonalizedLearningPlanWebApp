import * as GoalProcessor from "../goalProcessor";
import GoalAPI from "../../api/goalApi";
import LoginAPI from "../../api/loginApi";
import EmailService from "../../../service/emailService";
import { STATUS_CODE } from "../../../types";
import { initializeErrorMap } from "../../../utils/errorMessages";
import { createMockRequest, MOCK_RESPONSE, TEST_ACCOUNT, TEST_GOAL, TEST_SUB_GOAL, TEST_TAG } from "../../global/mockValues";

jest.mock("../../api/goalApi");
jest.mock("../../api/loginApi");
jest.mock("../../../service/emailService");

const ERROR_MESSAGES = initializeErrorMap();

describe("Goal Processor Unit Tests", () => {
    const emailService: any = new EmailService();
    const loginApi: any = new LoginAPI();
    const goalApi: any = new GoalAPI();

    afterEach(() => {
        jest.clearAllMocks();
    });
    
    it("get module goals (normal case)", async () => {
        goalApi.getGoals.mockResolvedValueOnce([{
            ...TEST_GOAL,
            id: TEST_GOAL.id[0],
            name: TEST_GOAL.name[0],
            description: TEST_GOAL.description[0],
            tag_name: TEST_TAG.name,
            color: TEST_TAG.color,
            sub_goals: [
                TEST_SUB_GOAL
            ]
        }]);
        const mRequest = createMockRequest({}, {id: TEST_GOAL.moduleId});
        await GoalProcessor.getModuleGoals(mRequest, MOCK_RESPONSE);
        expect(goalApi.getGoals).toHaveBeenCalledTimes(1);
        expect(goalApi.getGoals).toHaveBeenCalledWith(TEST_GOAL.moduleId);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.OK);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith([{
            ...TEST_GOAL,
            id: TEST_GOAL.id[0],
            name: TEST_GOAL.name[0],
            description: TEST_GOAL.description[0],
            tag_name: TEST_TAG.name,
            color: TEST_TAG.color,
            sub_goals: [
                TEST_SUB_GOAL
            ]
        }]);
    });

    it("get module goals (error case)", async () => {
        goalApi.getGoals.mockResolvedValueOnce(STATUS_CODE.BAD_REQUEST);
        const mRequest = createMockRequest({}, {id: TEST_GOAL.moduleId});
        await GoalProcessor.getModuleGoals(mRequest, MOCK_RESPONSE);
        expect(goalApi.getGoals).toHaveBeenCalledTimes(1);
        expect(goalApi.getGoals).toHaveBeenCalledWith(TEST_GOAL.moduleId);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(STATUS_CODE.BAD_REQUEST));
    });

    it("post goal (normal case)", async () => {
        goalApi.createGoal.mockResolvedValueOnce(STATUS_CODE.OK);
        const mRequest = createMockRequest({
            name: TEST_GOAL.name[0],
            description: TEST_GOAL.description[0],
            goalType: TEST_GOAL.goalType,
            isComplete: TEST_GOAL.isComplete,
            moduleId: TEST_GOAL.moduleId,
            tagId: TEST_GOAL.tagId,
            dueDate: TEST_GOAL.dueDate
        });
        await GoalProcessor.postGoal(mRequest, MOCK_RESPONSE);
        expect(goalApi.createGoal).toHaveBeenCalledTimes(1);
        expect(goalApi.createGoal).toHaveBeenCalledWith({
            name: TEST_GOAL.name[0],
            description: TEST_GOAL.description[0],
            goal_type: TEST_GOAL.goalType,
            is_complete: TEST_GOAL.isComplete,
            module_id: TEST_GOAL.moduleId,
            tag_id: TEST_GOAL.tagId,
            due_date: TEST_GOAL.dueDate
        });
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(STATUS_CODE.OK);
    });

    it("post goal (error case)", async () => {
        goalApi.createGoal.mockResolvedValueOnce(STATUS_CODE.BAD_REQUEST);
        const mRequest = createMockRequest({
            name: TEST_GOAL.name[0],
            description: TEST_GOAL.description[0],
            goalType: TEST_GOAL.goalType,
            isComplete: TEST_GOAL.isComplete,
            moduleId: TEST_GOAL.moduleId,
            tagId: TEST_GOAL.tagId,
            dueDate: TEST_GOAL.dueDate
        });
        await GoalProcessor.postGoal(mRequest, MOCK_RESPONSE);
        expect(goalApi.createGoal).toHaveBeenCalledTimes(1);
        expect(goalApi.createGoal).toHaveBeenCalledWith({
            name: TEST_GOAL.name[0],
            description: TEST_GOAL.description[0],
            goal_type: TEST_GOAL.goalType,
            is_complete: TEST_GOAL.isComplete,
            module_id: TEST_GOAL.moduleId,
            tag_id: TEST_GOAL.tagId,
            due_date: TEST_GOAL.dueDate
        });
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(STATUS_CODE.BAD_REQUEST));
    });

    it("put goal (normal case)", async () => {
        goalApi.updateGoal.mockResolvedValueOnce(STATUS_CODE.OK);
        const mRequest = createMockRequest({
            name: TEST_GOAL.name[0],
            description: TEST_GOAL.description[0],
            goal_type: TEST_GOAL.goalType,
            is_complete: TEST_GOAL.isComplete,
            tag_id: TEST_GOAL.tagId,
            due_date: TEST_GOAL.dueDate
        }, {id: TEST_GOAL.id[0]});
        await GoalProcessor.putGoal(mRequest, MOCK_RESPONSE);
        expect(goalApi.updateGoal).toHaveBeenCalledTimes(1);
        expect(goalApi.updateGoal).toHaveBeenCalledWith({
            goal_id: TEST_GOAL.id[0],
            name: TEST_GOAL.name[0],
            description: TEST_GOAL.description[0],
            goal_type: TEST_GOAL.goalType,
            is_complete: TEST_GOAL.isComplete,
            tag_id: TEST_GOAL.tagId,
            due_date: TEST_GOAL.dueDate,
            completion_time: undefined,
            expiration: undefined
        });
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(STATUS_CODE.OK);
    });

    it("put goal (error case)", async () => {
        goalApi.updateGoal.mockResolvedValueOnce(STATUS_CODE.CONNECTION_ERROR);
        const mRequest = createMockRequest({
            name: TEST_GOAL.name[0],
            description: TEST_GOAL.description[0],
            goal_type: TEST_GOAL.goalType,
            is_complete: TEST_GOAL.isComplete,
            tag_id: TEST_GOAL.tagId,
            due_date: TEST_GOAL.dueDate
        }, {id: TEST_GOAL.id[0]});
        await GoalProcessor.putGoal(mRequest, MOCK_RESPONSE);
        expect(goalApi.updateGoal).toHaveBeenCalledTimes(1);
        expect(goalApi.updateGoal).toHaveBeenCalledWith({
            goal_id: TEST_GOAL.id[0],
            name: TEST_GOAL.name[0],
            description: TEST_GOAL.description[0],
            goal_type: TEST_GOAL.goalType,
            is_complete: TEST_GOAL.isComplete,
            tag_id: TEST_GOAL.tagId,
            due_date: TEST_GOAL.dueDate,
            completion_time: undefined,
            expiration: undefined
        });
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.CONNECTION_ERROR);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(STATUS_CODE.CONNECTION_ERROR));
    });

    it("put goal feedback (normal case)", async () => {
        goalApi.updateGoalFeedback.mockResolvedValueOnce(STATUS_CODE.OK);
        loginApi.getAccountById.mockResolvedValueOnce([TEST_ACCOUNT]);
        emailService.sendEmail.mockResolvedValueOnce({});
        const mRequest = createMockRequest({feedback: TEST_GOAL.feedback, userId: TEST_ACCOUNT.id}, {id: TEST_GOAL.id[0]});
        await GoalProcessor.putGoalFeedback(mRequest, MOCK_RESPONSE);
        expect(goalApi.updateGoalFeedback).toHaveBeenCalledTimes(1);
        expect(goalApi.updateGoalFeedback).toHaveBeenCalledWith(TEST_GOAL.id[0], TEST_GOAL.feedback);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(loginApi.getAccountById).toHaveBeenCalledTimes(1);
        expect(loginApi.getAccountById).toHaveBeenCalledWith(TEST_ACCOUNT.id);
        expect(emailService.sendEmail).toHaveBeenCalledTimes(1);
        expect(emailService.sendEmail).toHaveBeenCalledWith(TEST_ACCOUNT.email, "Feedback", TEST_GOAL.feedback);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(STATUS_CODE.OK);
    });

    it("put goal feedback (goal api error case)", async () => {
        goalApi.updateGoalFeedback.mockResolvedValueOnce(STATUS_CODE.INTERNAL_SERVER_ERROR);
        const mRequest = createMockRequest({feedback: TEST_GOAL.feedback, userId: TEST_ACCOUNT.id}, {id: TEST_GOAL.id[0]});
        await GoalProcessor.putGoalFeedback(mRequest, MOCK_RESPONSE);
        expect(goalApi.updateGoalFeedback).toHaveBeenCalledTimes(1);
        expect(goalApi.updateGoalFeedback).toHaveBeenCalledWith(TEST_GOAL.id[0], TEST_GOAL.feedback);
        expect(loginApi.getAccountById).toHaveBeenCalledTimes(0);
        expect(emailService.sendEmail).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.INTERNAL_SERVER_ERROR);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(STATUS_CODE.INTERNAL_SERVER_ERROR));
    });

    it("put goal feedback (login api error case)", async () => {
        goalApi.updateGoalFeedback.mockResolvedValueOnce(STATUS_CODE.OK);
        loginApi.getAccountById.mockResolvedValueOnce(STATUS_CODE.FORBIDDEN);
        const mRequest = createMockRequest({feedback: TEST_GOAL.feedback, userId: TEST_ACCOUNT.id}, {id: TEST_GOAL.id[0]});
        await GoalProcessor.putGoalFeedback(mRequest, MOCK_RESPONSE);
        expect(goalApi.updateGoalFeedback).toHaveBeenCalledTimes(1);
        expect(goalApi.updateGoalFeedback).toHaveBeenCalledWith(TEST_GOAL.id[0], TEST_GOAL.feedback);
        expect(emailService.sendEmail).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(loginApi.getAccountById).toHaveBeenCalledTimes(1);
        expect(loginApi.getAccountById).toHaveBeenCalledWith(TEST_ACCOUNT.id);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.FORBIDDEN);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith("Failed to retrieve understudy's account to email them the feedback.");
    });

    it("delete goal (normal case)", async () => {
        goalApi.deleteGoal.mockResolvedValueOnce(STATUS_CODE.OK);
        const mRequest = createMockRequest({}, {id: TEST_GOAL.id[0]});
        await GoalProcessor.deleteGoal(mRequest, MOCK_RESPONSE);
        expect(goalApi.deleteGoal).toHaveBeenCalledTimes(1);
        expect(goalApi.deleteGoal).toHaveBeenCalledWith(TEST_GOAL.id[0]);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(STATUS_CODE.OK);
    });

    it("delete goal (error case)", async () => {
        goalApi.deleteGoal.mockResolvedValueOnce(STATUS_CODE.FORBIDDEN);
        const mRequest = createMockRequest({}, {id: TEST_GOAL.id[0]});
        await GoalProcessor.deleteGoal(mRequest, MOCK_RESPONSE);
        expect(goalApi.deleteGoal).toHaveBeenCalledTimes(1);
        expect(goalApi.deleteGoal).toHaveBeenCalledWith(TEST_GOAL.id[0]);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.FORBIDDEN);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(STATUS_CODE.FORBIDDEN));
    });

    it("post sub goal (normal case)", async () => {
        goalApi.addSubGoal.mockResolvedValueOnce([{id: TEST_SUB_GOAL.id[0]}]);
        const mRequest = createMockRequest({
            name: TEST_SUB_GOAL.name[0],
            description: TEST_SUB_GOAL.description[0],
            isComplete: TEST_SUB_GOAL.isComplete,
            goalType: TEST_SUB_GOAL.goalType,
            moduleId: TEST_SUB_GOAL.moduleId,
            tagId: TEST_SUB_GOAL.tagId,
            dueDate: TEST_SUB_GOAL.dueDate
        }, {id: TEST_SUB_GOAL.parentGoal[0]});
        await GoalProcessor.postSubGoal(mRequest, MOCK_RESPONSE);
        expect(goalApi.addSubGoal).toHaveBeenCalledTimes(1);
        expect(goalApi.addSubGoal).toHaveBeenCalledWith(TEST_SUB_GOAL.parentGoal[0], {
            name: TEST_SUB_GOAL.name[0],
            description: TEST_SUB_GOAL.description[0],
            is_complete: TEST_SUB_GOAL.isComplete,
            goal_type: TEST_SUB_GOAL.goalType,
            module_id: TEST_SUB_GOAL.moduleId,
            tag_id: TEST_SUB_GOAL.tagId,
            due_date: TEST_SUB_GOAL.dueDate
        });
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.OK);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith([{id: TEST_SUB_GOAL.id[0]}]);
    });

    it("post sub goal (error case)", async () => {
        goalApi.addSubGoal.mockResolvedValueOnce(STATUS_CODE.GONE);
        const mRequest = createMockRequest({
            name: TEST_SUB_GOAL.name[0],
            description: TEST_SUB_GOAL.description[0],
            isComplete: TEST_SUB_GOAL.isComplete,
            goalType: TEST_SUB_GOAL.goalType,
            moduleId: TEST_SUB_GOAL.moduleId,
            tagId: TEST_SUB_GOAL.tagId,
            dueDate: TEST_SUB_GOAL.dueDate
        }, {id: TEST_SUB_GOAL.parentGoal[0]});
        await GoalProcessor.postSubGoal(mRequest, MOCK_RESPONSE);
        expect(goalApi.addSubGoal).toHaveBeenCalledTimes(1);
        expect(goalApi.addSubGoal).toHaveBeenCalledWith(TEST_SUB_GOAL.parentGoal[0], {
            name: TEST_SUB_GOAL.name[0],
            description: TEST_SUB_GOAL.description[0],
            is_complete: TEST_SUB_GOAL.isComplete,
            goal_type: TEST_SUB_GOAL.goalType,
            module_id: TEST_SUB_GOAL.moduleId,
            tag_id: TEST_SUB_GOAL.tagId,
            due_date: TEST_SUB_GOAL.dueDate
        });
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.GONE);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(STATUS_CODE.GONE));
    });

    it("get goal variable (normal case)", async () => {
        goalApi.getGoalVariable.mockResolvedValueOnce([{name: TEST_GOAL.name[0]}]);
        const mRequest = createMockRequest({}, {id: TEST_GOAL.id[0], variable: "name"});
        await GoalProcessor.getGoalVariable(mRequest, MOCK_RESPONSE);
        expect(goalApi.getGoalVariable).toHaveBeenCalledTimes(1);
        expect(goalApi.getGoalVariable).toHaveBeenCalledWith(TEST_GOAL.id[0], "name");
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.OK);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith([{name: TEST_GOAL.name[0]}]);
    });

    it("get goal variable (error case)", async () => {
        goalApi.getGoalVariable.mockResolvedValueOnce(STATUS_CODE.BAD_REQUEST);
        const mRequest = createMockRequest({}, {id: TEST_GOAL.id[0], variable: "name"});
        await GoalProcessor.getGoalVariable(mRequest, MOCK_RESPONSE);
        expect(goalApi.getGoalVariable).toHaveBeenCalledTimes(1);
        expect(goalApi.getGoalVariable).toHaveBeenCalledWith(TEST_GOAL.id[0], "name");
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(STATUS_CODE.BAD_REQUEST));
    });
});
