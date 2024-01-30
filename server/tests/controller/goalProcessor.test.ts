export {};

import { GoalAPI } from "../../controller/goalProcessor";
import { GoalParser } from "../../parser/goalParser";
import { STATUS_CODES } from "../../utils/statusCodes";
import { FAKE_ERRORS } from "./fakeErrors";
import { GoalType } from "../../types";

jest.mock("../../parser/goalParser", () => {
    const testParser = {
        storeGoal: jest.fn(),
        parseGoals: jest.fn(),
        updateGoal: jest.fn(),
        deleteGoal: jest.fn(),
        parseGoalVariable: jest.fn(),
    };
    return jest.fn(() => testParser);
});

const TEST_DATA = {
    name: "do Homework",
    description: "spend 3 hours a day on homework",
    isComplete: false,
    goalID: 5,
    moduleID: 9,
    goalType: "todo" as GoalType
}

describe('goal processor unit tests', () => {
    let goalAPI : GoalAPI;
    let parser : any;

    beforeEach(() => {
        parser = new GoalParser();
        goalAPI = new GoalAPI();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('get goals (correct case)', async () => {
        parser.parseGoals.mockResolvedValueOnce([
            {
                name: TEST_DATA.name, description: TEST_DATA.description, completion: TEST_DATA.isComplete,
                module_id: TEST_DATA.moduleID, goal_id: TEST_DATA.goalID, goal_type: TEST_DATA.goalType
            }
        ]);
        expect(await goalAPI.getGoals(TEST_DATA.moduleID)).toEqual([
            {
                name: TEST_DATA.name, description: TEST_DATA.description, completion: TEST_DATA.isComplete,
                module_id: TEST_DATA.moduleID, goal_id: TEST_DATA.goalID, goal_type: TEST_DATA.goalType
            }
        ]);
    });

    it('get goals (network error case)', async () => {
        parser.parseGoals.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await goalAPI.getGoals(TEST_DATA.moduleID)).toEqual(STATUS_CODES.CONNECTION_ERROR);
    });

    it('get goals (fatal server error case)', async () => {
        parser.parseGoals.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await goalAPI.getGoals(TEST_DATA.moduleID)).toEqual(STATUS_CODES.INTERNAL_SERVER_ERROR);
    });

    it('create goal (correct case)', async () => {
        parser.storeGoal.mockResolvedValueOnce({goal_id: TEST_DATA.goalID});
        var actual = await goalAPI.createGoal({
            name: TEST_DATA.name, 
            description: TEST_DATA.description, 
            goalType: TEST_DATA.goalType, 
            isComplete: TEST_DATA.isComplete, 
            moduleId: TEST_DATA.moduleID}
        );
        expect(actual).toEqual({goal_id: TEST_DATA.goalID});
    });

    it('create goal (primary key violation case)', async () => {
        parser.storeGoal.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        var actual = await goalAPI.createGoal({
            name: TEST_DATA.name, 
            description: TEST_DATA.description, 
            goalType: TEST_DATA.goalType, 
            isComplete: TEST_DATA.isComplete, 
            moduleId: TEST_DATA.moduleID
        });
        expect(actual).toEqual(STATUS_CODES.CONFLICT);
    });

    it('create goal (network error case)', async () => {
        parser.storeGoal.mockRejectedValue(FAKE_ERRORS.networkError);
        var actual = await goalAPI.createGoal({
            name: TEST_DATA.name, 
            description: TEST_DATA.description, 
            goalType: TEST_DATA.goalType, 
            isComplete: TEST_DATA.isComplete, 
            moduleId: TEST_DATA.moduleID
        });
        expect(actual).toEqual(STATUS_CODES.CONNECTION_ERROR);
    });

    it('create goal (server error case)', async () => {
        parser.storeGoal.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        var actual = await goalAPI.createGoal({
            name: TEST_DATA.name, 
            description: TEST_DATA.description, 
            isComplete: TEST_DATA.isComplete, 
            moduleId: TEST_DATA.moduleID,
            goalType: 'todo'
        });
        expect(actual).toEqual(STATUS_CODES.INTERNAL_SERVER_ERROR);
    });

    it('update goal (pass case)', async () => {
        parser.updateGoal.mockResolvedValueOnce();
        expect(await goalAPI.updateGoal(TEST_DATA.goalID, TEST_DATA.name, TEST_DATA.description, TEST_DATA.isComplete)).toEqual(STATUS_CODES.OK);
    });

    it('update goal (duplicate case)', async () => {
        parser.updateGoal.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        expect(await goalAPI.updateGoal(TEST_DATA.goalID, TEST_DATA.name, TEST_DATA.description, TEST_DATA.isComplete)).toEqual(STATUS_CODES.CONFLICT);
    });

    it('update goal (bad data case)', async () => {
        parser.updateGoal.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await goalAPI.updateGoal(TEST_DATA.goalID, TEST_DATA.name, TEST_DATA.description, TEST_DATA.isComplete)).toEqual(STATUS_CODES.BAD_REQUEST);
    });

    it('update goal (connection lost case)', async () => {
        parser.updateGoal.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await goalAPI.updateGoal(TEST_DATA.goalID, TEST_DATA.name, TEST_DATA.description, TEST_DATA.isComplete)).toEqual(STATUS_CODES.CONNECTION_ERROR);
    });

    it('update goal (fatal error case)', async () => {
        parser.updateGoal.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await goalAPI.updateGoal(TEST_DATA.goalID, TEST_DATA.name, TEST_DATA.description, TEST_DATA.isComplete)).toEqual(STATUS_CODES.INTERNAL_SERVER_ERROR);
    });

    it('delete goal (pass case)', async () => {
        parser.deleteGoal.mockResolvedValueOnce();
        expect(await goalAPI.deleteGoal(TEST_DATA.goalID)).toEqual(STATUS_CODES.OK);
    });

    it('delete goal (duplicate case)', async () => {
        parser.deleteGoal.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        expect(await goalAPI.deleteGoal(TEST_DATA.goalID)).toEqual(STATUS_CODES.CONFLICT);
    });

    it('delete goal (bad data case)', async () => {
        parser.deleteGoal.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await goalAPI.deleteGoal(TEST_DATA.goalID)).toEqual(STATUS_CODES.BAD_REQUEST);
    });

    it('delete goal (connection lost case)', async () => {
        parser.deleteGoal.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await goalAPI.deleteGoal(TEST_DATA.goalID)).toEqual(STATUS_CODES.CONNECTION_ERROR);
    });

    it('delete goal (fatal error case)', async () => {
        parser.deleteGoal.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await goalAPI.deleteGoal(TEST_DATA.goalID)).toEqual(STATUS_CODES.INTERNAL_SERVER_ERROR);
    });

    it('parse goal attribute (name case)', async () => {
        parser.parseGoalVariable.mockResolvedValueOnce([{name: TEST_DATA.name}]);
        expect(await goalAPI.getGoalVariable(TEST_DATA.goalID, "name")).toEqual([{name: TEST_DATA.name}]);
    });

    it('parse goal attribute (module id case)', async () => {
        parser.parseGoalVariable.mockResolvedValueOnce([{module_id: TEST_DATA.moduleID}]);
        expect(await goalAPI.getGoalVariable(TEST_DATA.goalID, "module_id")).toEqual([{module_id: TEST_DATA.moduleID}]);
    });

    it('parse goal attribute (bad request)', async () => {
        parser.parseGoalVariable.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await goalAPI.getGoalVariable(TEST_DATA.goalID, "name")).toEqual(STATUS_CODES.BAD_REQUEST);
    });

    it('parse goal attribute (network error case)', async () => {
        parser.parseGoalVariable.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await goalAPI.getGoalVariable(TEST_DATA.goalID, "name")).toEqual(STATUS_CODES.CONNECTION_ERROR);
    });

    it('parse goal attribute (fatal server error case)', async () => {
        parser.parseGoalVariable.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await goalAPI.getGoalVariable(TEST_DATA.goalID, "name")).toEqual(STATUS_CODES.INTERNAL_SERVER_ERROR);
    });
});
