import * as GoalProcessor from "../../../controller/processors/goalProcessor";
import GoalAPI from "../../../controller/api/goalApi";
import { StatusCode } from "../../../types";
import { initializeErrorMap } from "../../../utils/errorMessages";
import { createMockRequest, MOCK_RESPONSE, TEST_GOAL, TEST_SUB_GOAL, TEST_TAG } from "./universal/mockValues";

jest.mock("../../../controller/api/goalApi");

const ERROR_MESSAGES = initializeErrorMap();

describe("Goal Processor Unit Tests", () => {
    const goalApi: any = new GoalAPI();

    afterEach(() => {
        jest.clearAllMocks();
    });
    
    it("get module goals (normal case)", async () => {
        goalApi.getGoals.mockResolvedValueOnce([{
            ...TEST_GOAL,
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
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.OK);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith([{
            ...TEST_GOAL,
            tag_name: TEST_TAG.name,
            color: TEST_TAG.color,
            sub_goals: [
                TEST_SUB_GOAL
            ]
        }]);
    });

    it("get module goals (error case)", async () => {
        goalApi.getGoals.mockResolvedValueOnce(StatusCode.BAD_REQUEST);
        const mRequest = createMockRequest({}, {id: TEST_GOAL.moduleId});
        await GoalProcessor.getModuleGoals(mRequest, MOCK_RESPONSE);
        expect(goalApi.getGoals).toHaveBeenCalledTimes(1);
        expect(goalApi.getGoals).toHaveBeenCalledWith(TEST_GOAL.moduleId);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.BAD_REQUEST);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(StatusCode.BAD_REQUEST));
    });

    it("post goal (normal case)", async () => {
        goalApi.createGoal.mockResolvedValueOnce([{goal_id: TEST_GOAL.id}]);
        const mRequest = createMockRequest({
            name: TEST_GOAL.name,
            description: TEST_GOAL.description,
            goalType: TEST_GOAL.goalType,
            isComplete: TEST_GOAL.isComplete,
            moduleId: TEST_GOAL.moduleId,
            tagId: TEST_GOAL.tagId,
            dueDate: TEST_GOAL.dueDate
        });
        await GoalProcessor.postGoal(mRequest, MOCK_RESPONSE);
        expect(goalApi.createGoal).toHaveBeenCalledTimes(1);
        expect(goalApi.createGoal).toHaveBeenCalledWith({
            name: TEST_GOAL.name,
            description: TEST_GOAL.description,
            goalType: TEST_GOAL.goalType,
            isComplete: TEST_GOAL.isComplete,
            moduleId: TEST_GOAL.moduleId,
            tagId: TEST_GOAL.tagId,
            dueDate: TEST_GOAL.dueDate
        });
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.OK);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith([{goal_id: TEST_GOAL.id}]);
    });

    it("post goal (error case)", async () => {
        goalApi.createGoal.mockResolvedValueOnce(StatusCode.BAD_REQUEST);
        const mRequest = createMockRequest({
            name: TEST_GOAL.name,
            description: TEST_GOAL.description,
            goalType: TEST_GOAL.goalType,
            isComplete: TEST_GOAL.isComplete,
            moduleId: TEST_GOAL.moduleId,
            tagId: TEST_GOAL.tagId,
            dueDate: TEST_GOAL.dueDate
        });
        await GoalProcessor.postGoal(mRequest, MOCK_RESPONSE);
        expect(goalApi.createGoal).toHaveBeenCalledTimes(1);
        expect(goalApi.createGoal).toHaveBeenCalledWith({
            name: TEST_GOAL.name,
            description: TEST_GOAL.description,
            goalType: TEST_GOAL.goalType,
            isComplete: TEST_GOAL.isComplete,
            moduleId: TEST_GOAL.moduleId,
            tagId: TEST_GOAL.tagId,
            dueDate: TEST_GOAL.dueDate
        });
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.BAD_REQUEST);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(StatusCode.BAD_REQUEST));
    });

    it("put goal (normal case)", async () => {
        goalApi.updateGoal.mockResolvedValueOnce(StatusCode.OK);
        const mRequest = createMockRequest({
            name: TEST_GOAL.name,
            description: TEST_GOAL.description,
            goalType: TEST_GOAL.goalType,
            isComplete: TEST_GOAL.isComplete,
            tagId: TEST_GOAL.tagId,
            dueDate: TEST_GOAL.dueDate
        }, {id: TEST_GOAL.id});
        await GoalProcessor.putGoal(mRequest, MOCK_RESPONSE);
        expect(goalApi.updateGoal).toHaveBeenCalledTimes(1);
        expect(goalApi.updateGoal).toHaveBeenCalledWith({
            id: TEST_GOAL.id,
            name: TEST_GOAL.name,
            description: TEST_GOAL.description,
            goalType: TEST_GOAL.goalType,
            isComplete: TEST_GOAL.isComplete,
            tagId: TEST_GOAL.tagId,
            dueDate: TEST_GOAL.dueDate,
            completionTime: undefined,
            expiration: undefined
        });
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(StatusCode.OK);
    });

    it("put goal (error case)", async () => {
        goalApi.updateGoal.mockResolvedValueOnce(StatusCode.CONNECTION_ERROR);
        const mRequest = createMockRequest({
            name: TEST_GOAL.name,
            description: TEST_GOAL.description,
            goalType: TEST_GOAL.goalType,
            isComplete: TEST_GOAL.isComplete,
            tagId: TEST_GOAL.tagId,
            dueDate: TEST_GOAL.dueDate
        }, {id: TEST_GOAL.id});
        await GoalProcessor.putGoal(mRequest, MOCK_RESPONSE);
        expect(goalApi.updateGoal).toHaveBeenCalledTimes(1);
        expect(goalApi.updateGoal).toHaveBeenCalledWith({
            id: TEST_GOAL.id,
            name: TEST_GOAL.name,
            description: TEST_GOAL.description,
            goalType: TEST_GOAL.goalType,
            isComplete: TEST_GOAL.isComplete,
            tagId: TEST_GOAL.tagId,
            dueDate: TEST_GOAL.dueDate,
            completionTime: undefined,
            expiration: undefined
        });
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.CONNECTION_ERROR);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(StatusCode.CONNECTION_ERROR));
    });

    it("put goal feedback (normal case)", async () => {
        goalApi.updateGoalFeedback.mockResolvedValueOnce(StatusCode.OK);
        const mRequest = createMockRequest({feedback: TEST_GOAL.feedback}, {id: TEST_GOAL.id});
        await GoalProcessor.putGoalFeedback(mRequest, MOCK_RESPONSE);
        expect(goalApi.updateGoalFeedback).toHaveBeenCalledTimes(1);
        expect(goalApi.updateGoalFeedback).toHaveBeenCalledWith(TEST_GOAL.id, TEST_GOAL.feedback);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(StatusCode.OK);
    });

    it("put goal feedback (error case)", async () => {
        goalApi.updateGoalFeedback.mockResolvedValueOnce(StatusCode.INTERNAL_SERVER_ERROR);
        const mRequest = createMockRequest({feedback: TEST_GOAL.feedback}, {id: TEST_GOAL.id});
        await GoalProcessor.putGoalFeedback(mRequest, MOCK_RESPONSE);
        expect(goalApi.updateGoalFeedback).toHaveBeenCalledTimes(1);
        expect(goalApi.updateGoalFeedback).toHaveBeenCalledWith(TEST_GOAL.id, TEST_GOAL.feedback);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.INTERNAL_SERVER_ERROR);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(StatusCode.INTERNAL_SERVER_ERROR));
    });

    it("delete goal (normal case)", async () => {
        goalApi.deleteGoal.mockResolvedValueOnce(StatusCode.OK);
        const mRequest = createMockRequest({}, {id: TEST_GOAL.id});
        await GoalProcessor.deleteGoal(mRequest, MOCK_RESPONSE);
        expect(goalApi.deleteGoal).toHaveBeenCalledTimes(1);
        expect(goalApi.deleteGoal).toHaveBeenCalledWith(TEST_GOAL.id);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(StatusCode.OK);
    });

    it("delete goal (error case)", async () => {
        goalApi.deleteGoal.mockResolvedValueOnce(StatusCode.FORBIDDEN);
        const mRequest = createMockRequest({}, {id: TEST_GOAL.id});
        await GoalProcessor.deleteGoal(mRequest, MOCK_RESPONSE);
        expect(goalApi.deleteGoal).toHaveBeenCalledTimes(1);
        expect(goalApi.deleteGoal).toHaveBeenCalledWith(TEST_GOAL.id);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.FORBIDDEN);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(StatusCode.FORBIDDEN));
    });

    it("post sub goal (normal case)", async () => {
        goalApi.addSubGoal.mockResolvedValueOnce([{id: TEST_SUB_GOAL.id}]);
        const mRequest = createMockRequest({
            name: TEST_SUB_GOAL.name,
            description: TEST_SUB_GOAL.description,
            isComplete: TEST_SUB_GOAL.isComplete,
            goalType: TEST_SUB_GOAL.goalType,
            moduleId: TEST_SUB_GOAL.moduleId,
            tagId: TEST_SUB_GOAL.tagId,
            dueDate: TEST_SUB_GOAL.dueDate
        }, {id: TEST_SUB_GOAL.parentGoal});
        await GoalProcessor.postSubGoal(mRequest, MOCK_RESPONSE);
        expect(goalApi.addSubGoal).toHaveBeenCalledTimes(1);
        expect(goalApi.addSubGoal).toHaveBeenCalledWith(TEST_SUB_GOAL.parentGoal, {
            name: TEST_SUB_GOAL.name,
            description: TEST_SUB_GOAL.description,
            isComplete: TEST_SUB_GOAL.isComplete,
            goalType: TEST_SUB_GOAL.goalType,
            moduleId: TEST_SUB_GOAL.moduleId,
            tagId: TEST_SUB_GOAL.tagId,
            dueDate: TEST_SUB_GOAL.dueDate
        });
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.OK);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith([{id: TEST_SUB_GOAL.id}]);
    });

    it("post sub goal (error case)", async () => {
        goalApi.addSubGoal.mockResolvedValueOnce(StatusCode.GONE);
        const mRequest = createMockRequest({
            name: TEST_SUB_GOAL.name,
            description: TEST_SUB_GOAL.description,
            isComplete: TEST_SUB_GOAL.isComplete,
            goalType: TEST_SUB_GOAL.goalType,
            moduleId: TEST_SUB_GOAL.moduleId,
            tagId: TEST_SUB_GOAL.tagId,
            dueDate: TEST_SUB_GOAL.dueDate
        }, {id: TEST_SUB_GOAL.parentGoal});
        await GoalProcessor.postSubGoal(mRequest, MOCK_RESPONSE);
        expect(goalApi.addSubGoal).toHaveBeenCalledTimes(1);
        expect(goalApi.addSubGoal).toHaveBeenCalledWith(TEST_SUB_GOAL.parentGoal, {
            name: TEST_SUB_GOAL.name,
            description: TEST_SUB_GOAL.description,
            isComplete: TEST_SUB_GOAL.isComplete,
            goalType: TEST_SUB_GOAL.goalType,
            moduleId: TEST_SUB_GOAL.moduleId,
            tagId: TEST_SUB_GOAL.tagId,
            dueDate: TEST_SUB_GOAL.dueDate
        });
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.GONE);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(StatusCode.GONE));
    });

    it("get goal variable (normal case)", async () => {
        goalApi.getGoalVariable.mockResolvedValueOnce([{name: TEST_GOAL.name}]);
        const mRequest = createMockRequest({}, {id: TEST_GOAL.id, variable: "name"});
        await GoalProcessor.getGoalVariable(mRequest, MOCK_RESPONSE);
        expect(goalApi.getGoalVariable).toHaveBeenCalledTimes(1);
        expect(goalApi.getGoalVariable).toHaveBeenCalledWith(TEST_GOAL.id, "name");
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.OK);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith([{name: TEST_GOAL.name}]);
    });

    it("get goal variable (error case)", async () => {
        goalApi.getGoalVariable.mockResolvedValueOnce(StatusCode.BAD_REQUEST);
        const mRequest = createMockRequest({}, {id: TEST_GOAL.id, variable: "name"});
        await GoalProcessor.getGoalVariable(mRequest, MOCK_RESPONSE);
        expect(goalApi.getGoalVariable).toHaveBeenCalledTimes(1);
        expect(goalApi.getGoalVariable).toHaveBeenCalledWith(TEST_GOAL.id, "name");
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.BAD_REQUEST);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(StatusCode.BAD_REQUEST));
    });
});
