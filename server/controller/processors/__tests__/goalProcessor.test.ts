import * as GoalProcessor from "../goalProcessor";
import GoalAPI from "../../api/goalApi";
import LoginAPI from "../../api/loginApi";
import EmailService from "../../../service/emailService";
import { STATUS_CODE } from "../../../types";
import { getLoginError } from "../../../utils/errorHandlers";
import { createMockRequest, MOCK_RESPONSE, TEST_ACCOUNT, TEST_CREATED_GOAL, TEST_GOAL } from "../../global/mockValues";

jest.mock("../../api/goalApi");
jest.mock("../../api/loginApi");
jest.mock("../../../service/emailService");

describe("Goal Processor Unit Tests", () => {
    const emailService: any = new EmailService();
    const loginApi: any = new LoginAPI();
    const goalApi: any = new GoalAPI();

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("get module goals (normal case)", async () => {
        goalApi.getGoals.mockResolvedValueOnce({...TEST_GOAL[0], sub_goals: [TEST_GOAL[2]]});
        const mRequest = createMockRequest({}, {id: TEST_GOAL[0].module_id});
        await GoalProcessor.getModuleGoals(mRequest, MOCK_RESPONSE);
        expect(goalApi.getGoals).toHaveBeenCalledTimes(1);
        expect(goalApi.getGoals).toHaveBeenCalledWith(TEST_GOAL[0].module_id);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.OK);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith({...TEST_GOAL[0], sub_goals: [TEST_GOAL[2]]});
    });

    it("get module goals (error case)", async () => {
        goalApi.getGoals.mockResolvedValueOnce(STATUS_CODE.BAD_REQUEST);
        const mRequest = createMockRequest({}, {id: TEST_GOAL[0].module_id});
        await GoalProcessor.getModuleGoals(mRequest, MOCK_RESPONSE);
        expect(goalApi.getGoals).toHaveBeenCalledTimes(1);
        expect(goalApi.getGoals).toHaveBeenCalledWith(TEST_GOAL[0].module_id);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.BAD_REQUEST));
    });

    it("post goal (normal case)", async () => {
        const createdGoal = {
            ...TEST_CREATED_GOAL[0],
            isComplete: TEST_CREATED_GOAL[0].is_complete,
            goalType: TEST_CREATED_GOAL[0].goal_type,
            moduleId: TEST_CREATED_GOAL[0].module_id
        };
        goalApi.createGoal.mockResolvedValueOnce(STATUS_CODE.OK);
        const mRequest = createMockRequest({...createdGoal}, {id: undefined});
        await GoalProcessor.postGoal(mRequest, MOCK_RESPONSE);
        expect(goalApi.createGoal).toHaveBeenCalledTimes(1);
        expect(goalApi.createGoal).toHaveBeenCalledWith(TEST_CREATED_GOAL[0]);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(STATUS_CODE.OK);
    });

    it("post goal (sub goal case)", async () => {
        const createdGoal = {
            ...TEST_CREATED_GOAL[1],
            isComplete: TEST_CREATED_GOAL[1].is_complete,
            goalType: TEST_CREATED_GOAL[1].goal_type,
            moduleId: TEST_CREATED_GOAL[1].module_id,
            dueDate: TEST_CREATED_GOAL[1].due_date,
            tagId: TEST_CREATED_GOAL[1].tag_id,
            parent_goal: TEST_CREATED_GOAL[1].parent_goal
        };
        goalApi.createGoal.mockResolvedValueOnce(STATUS_CODE.OK);
        const mRequest = createMockRequest({...createdGoal, parent_goal: undefined}, {id: createdGoal.parent_goal});
        await GoalProcessor.postGoal(mRequest, MOCK_RESPONSE);
        expect(goalApi.createGoal).toHaveBeenCalledTimes(1);
        expect(goalApi.createGoal).toHaveBeenCalledWith({...TEST_CREATED_GOAL[1]});
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(STATUS_CODE.OK);
    });

    it("post goal (error case)", async () => {
        const createdGoal = {
            ...TEST_CREATED_GOAL[0],
            isComplete: TEST_CREATED_GOAL[0].is_complete,
            goalType: TEST_CREATED_GOAL[0].goal_type,
            moduleId: TEST_CREATED_GOAL[0].module_id
        };
        goalApi.createGoal.mockResolvedValueOnce(STATUS_CODE.BAD_REQUEST);
        const mRequest = createMockRequest({...createdGoal}, {id: undefined});
        await GoalProcessor.postGoal(mRequest, MOCK_RESPONSE);
        expect(goalApi.createGoal).toHaveBeenCalledTimes(1);
        expect(goalApi.createGoal).toHaveBeenCalledWith(TEST_CREATED_GOAL[0]);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.BAD_REQUEST));
    });

    it("put goal (normal case)", async () => {
        goalApi.updateGoal.mockResolvedValueOnce(STATUS_CODE.OK);
        const mRequest = createMockRequest({...TEST_GOAL[0], goal_id: undefined}, {id: TEST_GOAL[0].goal_id});
        await GoalProcessor.putGoal(mRequest, MOCK_RESPONSE);
        expect(goalApi.updateGoal).toHaveBeenCalledTimes(1);
        expect(goalApi.updateGoal).toHaveBeenCalledWith({...TEST_GOAL[0]});
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(STATUS_CODE.OK);
    });

    it("put goal (error case)", async () => {
        goalApi.updateGoal.mockResolvedValueOnce(STATUS_CODE.CONNECTION_ERROR);
        const mRequest = createMockRequest({...TEST_GOAL[0], goal_id: undefined}, {id: TEST_GOAL[0].goal_id});
        await GoalProcessor.putGoal(mRequest, MOCK_RESPONSE);
        expect(goalApi.updateGoal).toHaveBeenCalledTimes(1);
        expect(goalApi.updateGoal).toHaveBeenCalledWith({...TEST_GOAL[0]});
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.CONNECTION_ERROR);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.CONNECTION_ERROR));
    });

    it("put goal feedback (normal case)", async () => {
        goalApi.updateGoalFeedback.mockResolvedValueOnce(STATUS_CODE.OK);
        loginApi.getEmailById.mockResolvedValueOnce([TEST_ACCOUNT]);
        emailService.sendEmail.mockResolvedValueOnce({});
        const mRequest = createMockRequest({feedback: TEST_GOAL[0].feedback, userId: TEST_ACCOUNT.id}, {id: TEST_GOAL[0].goal_id});
        await GoalProcessor.putGoalFeedback(mRequest, MOCK_RESPONSE);
        expect(goalApi.updateGoalFeedback).toHaveBeenCalledTimes(1);
        expect(goalApi.updateGoalFeedback).toHaveBeenCalledWith(TEST_GOAL[0].goal_id, TEST_GOAL[0].feedback);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(loginApi.getEmailById).toHaveBeenCalledTimes(1);
        expect(loginApi.getEmailById).toHaveBeenCalledWith(TEST_ACCOUNT.id);
        expect(emailService.sendEmail).toHaveBeenCalledTimes(1);
        expect(emailService.sendEmail).toHaveBeenCalledWith(TEST_ACCOUNT.email, "Feedback", TEST_GOAL[0].feedback);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(STATUS_CODE.OK);
    });

    it("put goal feedback (goal api error case)", async () => {
        goalApi.updateGoalFeedback.mockResolvedValueOnce(STATUS_CODE.INTERNAL_SERVER_ERROR);
        const mRequest = createMockRequest({feedback: TEST_GOAL[0].feedback, userId: TEST_ACCOUNT.id}, {id: TEST_GOAL[0].goal_id});
        await GoalProcessor.putGoalFeedback(mRequest, MOCK_RESPONSE);
        expect(goalApi.updateGoalFeedback).toHaveBeenCalledTimes(1);
        expect(goalApi.updateGoalFeedback).toHaveBeenCalledWith(TEST_GOAL[0].goal_id, TEST_GOAL[0].feedback);
        expect(loginApi.getEmailById).toHaveBeenCalledTimes(0);
        expect(emailService.sendEmail).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.INTERNAL_SERVER_ERROR);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.INTERNAL_SERVER_ERROR));
    });

    it("put goal feedback (login api error case)", async () => {
        goalApi.updateGoalFeedback.mockResolvedValueOnce(STATUS_CODE.OK);
        loginApi.getEmailById.mockResolvedValueOnce(STATUS_CODE.FORBIDDEN);
        const mRequest = createMockRequest({feedback: TEST_GOAL[0].feedback, userId: TEST_ACCOUNT.id}, {id: TEST_GOAL[0].goal_id});
        await GoalProcessor.putGoalFeedback(mRequest, MOCK_RESPONSE);
        expect(goalApi.updateGoalFeedback).toHaveBeenCalledTimes(1);
        expect(goalApi.updateGoalFeedback).toHaveBeenCalledWith(TEST_GOAL[0].goal_id, TEST_GOAL[0].feedback);
        expect(emailService.sendEmail).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(loginApi.getEmailById).toHaveBeenCalledTimes(1);
        expect(loginApi.getEmailById).toHaveBeenCalledWith(TEST_ACCOUNT.id);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.FORBIDDEN);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith("Failed to retrieve understudy's account to email them the feedback.");
    });

    it("delete goal (normal case)", async () => {
        goalApi.deleteGoal.mockResolvedValueOnce(STATUS_CODE.OK);
        const mRequest = createMockRequest({}, {id: TEST_GOAL[0].goal_id});
        await GoalProcessor.deleteGoal(mRequest, MOCK_RESPONSE);
        expect(goalApi.deleteGoal).toHaveBeenCalledTimes(1);
        expect(goalApi.deleteGoal).toHaveBeenCalledWith(TEST_GOAL[0].goal_id);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(STATUS_CODE.OK);
    });

    it("delete goal (error case)", async () => {
        goalApi.deleteGoal.mockResolvedValueOnce(STATUS_CODE.FORBIDDEN);
        const mRequest = createMockRequest({}, {id: TEST_GOAL[0].goal_id});
        await GoalProcessor.deleteGoal(mRequest, MOCK_RESPONSE);
        expect(goalApi.deleteGoal).toHaveBeenCalledTimes(1);
        expect(goalApi.deleteGoal).toHaveBeenCalledWith(TEST_GOAL[0].goal_id);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.FORBIDDEN);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.FORBIDDEN));
    });

    it("get goal variable (normal case)", async () => {
        goalApi.getGoalVariable.mockResolvedValueOnce([{name: TEST_GOAL[0].name[0]}]);
        const mRequest = createMockRequest({}, {id: TEST_GOAL[0].goal_id, variable: "name"});
        await GoalProcessor.getGoalVariable(mRequest, MOCK_RESPONSE);
        expect(goalApi.getGoalVariable).toHaveBeenCalledTimes(1);
        expect(goalApi.getGoalVariable).toHaveBeenCalledWith(TEST_GOAL[0].goal_id, "name");
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.OK);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith([{name: TEST_GOAL[0].name[0]}]);
    });

    it("get goal variable (error case)", async () => {
        goalApi.getGoalVariable.mockResolvedValueOnce(STATUS_CODE.BAD_REQUEST);
        const mRequest = createMockRequest({}, {id: TEST_GOAL[0].goal_id, variable: "name"});
        await GoalProcessor.getGoalVariable(mRequest, MOCK_RESPONSE);
        expect(goalApi.getGoalVariable).toHaveBeenCalledTimes(1);
        expect(goalApi.getGoalVariable).toHaveBeenCalledWith(TEST_GOAL[0].goal_id, "name");
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.BAD_REQUEST));
    });
});
