export {};

import { GoalAPI } from "../../controller/goalProcessor";
import GoalParser from "../../parser/goalParser";
import { STATUS_CODES } from "../../utils/statusCodes";
import { FAKE_ERRORS } from "./fakeErrors";
import { GoalType } from "../../types";
jest.mock("../../parser/goalParser");

const TEST_DATA = {
    firstName: "do Homework",
    firstDescription: "spend 3 hours a day on homework",
    secondName: "Do project",
    secondDescription: "Finish my project.",
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
    
    it('get goals (normal case)', async () => {
        parser.parseGoals.mockResolvedValueOnce([
            {
                goal_id: TEST_DATA.goalID, name: TEST_DATA.firstName, description: TEST_DATA.firstDescription, goal_type: TEST_DATA.goalType, 
                completion: TEST_DATA.isComplete, module_id: TEST_DATA.moduleID, parent_goal: null
            },
            {
                goal_id: 6, name: TEST_DATA.secondName, description: TEST_DATA.secondDescription, goal_type: TEST_DATA.goalType,
                completion: TEST_DATA.isComplete, module_id: TEST_DATA.moduleID, parent_goal: null
            },
            {
                goal_id: 10, name: "Goal 3", description: "This is the third goal.", goal_type: TEST_DATA.goalType,
                completion: TEST_DATA.isComplete, module_id: TEST_DATA.moduleID, parent_goal: null
            }
        ]);
        parser.parseSubGoals.mockImplementation((goalId : number) => {
            switch(goalId) {
                case TEST_DATA.goalID:
                    return Promise.resolve([
                        {
                            goal_id: 7, name: "sub goal 1", description: "This is the first sub goal.", goal_type: TEST_DATA.goalType, 
                            completion: false, module_id: TEST_DATA.moduleID,   parent_goal: TEST_DATA.goalID
                        },
                        {
                            goal_id: 8, name: "sub goal 2", description: "This is the second sub goal.", goal_type: TEST_DATA.goalType,
                            completion: false, module_id: TEST_DATA.moduleID,  parent_goal: TEST_DATA.goalID
                        }
                    ]);
                case 6:
                    return Promise.resolve([
                        {
                            goal_id: 9, name: "sub goal 3", description: "This is the third sub goal.", goal_type: TEST_DATA.goalType,
                            completion: false, module_id: TEST_DATA.moduleID, parent_goal: 6
                        }
                    ]);
                default:
                    return Promise.reject(FAKE_ERRORS.fatalServerError);
            }
        });
        expect(await goalAPI.getGoals(TEST_DATA.moduleID)).toEqual([
            {
                goal_id: TEST_DATA.goalID, 
                name: TEST_DATA.firstName, 
                description: TEST_DATA.firstDescription, 
                goal_type: TEST_DATA.goalType,
                completion: TEST_DATA.isComplete,
                module_id: TEST_DATA.moduleID,
                parent_goal: null, 
                sub_goals: [
                    {
                        goal_id: 7,
                        name: "sub goal 1",
                        description: "This is the first sub goal.",
                        completion: false,
                        goal_type: TEST_DATA.goalType,
                        module_id: TEST_DATA.moduleID,
                        parent_goal: TEST_DATA.goalID
                    },
                    {
                        goal_id: 8,
                        name: "sub goal 2",
                        description: "This is the second sub goal.",
                        completion: false,
                        goal_type: TEST_DATA.goalType,
                        module_id: TEST_DATA.moduleID,
                        parent_goal: TEST_DATA.goalID
                    }
                ]
            },
            {
                goal_id: 6,
                name: TEST_DATA.secondName,
                description: TEST_DATA.secondDescription,
                completion: false,
                goal_type: TEST_DATA.goalType,
                module_id: TEST_DATA.moduleID,
                parent_goal: null,
                sub_goals: [
                    {
                        goal_id: 9,
                        name: "sub goal 3",
                        description: "This is the third sub goal.",
                        completion: false,
                        goal_type: TEST_DATA.goalType,
                        module_id: TEST_DATA.moduleID,
                        parent_goal: 6
                    }
                ]
            },
            {
                goal_id: 10,
                name: "Goal 3",
                description: "This is the third goal.",
                completion: false,
                goal_type: TEST_DATA.goalType,
                module_id: TEST_DATA.moduleID,
                parent_goal: null,
                sub_goals: []
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
            name: TEST_DATA.firstName, 
            description: TEST_DATA.firstDescription, 
            goalType: TEST_DATA.goalType, 
            isComplete: TEST_DATA.isComplete, 
            moduleId: TEST_DATA.moduleID}
        );
        expect(actual).toEqual({goal_id: TEST_DATA.goalID});
    });

    it('create goal (primary key violation case)', async () => {
        parser.storeGoal.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        var actual = await goalAPI.createGoal({
            name: TEST_DATA.firstName, 
            description: TEST_DATA.firstDescription, 
            goalType: TEST_DATA.goalType, 
            isComplete: TEST_DATA.isComplete, 
            moduleId: TEST_DATA.moduleID
        });
        expect(actual).toEqual(STATUS_CODES.CONFLICT);
    });

    it('create goal (network error case)', async () => {
        parser.storeGoal.mockRejectedValue(FAKE_ERRORS.networkError);
        var actual = await goalAPI.createGoal({
            name: TEST_DATA.firstName, 
            description: TEST_DATA.firstDescription, 
            goalType: TEST_DATA.goalType, 
            isComplete: TEST_DATA.isComplete, 
            moduleId: TEST_DATA.moduleID
        });
        expect(actual).toEqual(STATUS_CODES.CONNECTION_ERROR);
    });

    it('create goal (server error case)', async () => {
        parser.storeGoal.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        var actual = await goalAPI.createGoal({
            name: TEST_DATA.firstName, 
            description: TEST_DATA.firstDescription, 
            isComplete: TEST_DATA.isComplete, 
            moduleId: TEST_DATA.moduleID,
            goalType: 'todo'
        });
        expect(actual).toEqual(STATUS_CODES.INTERNAL_SERVER_ERROR);
    });

    it('update goal (pass case)', async () => {
        parser.updateGoal.mockResolvedValueOnce();
        expect(await goalAPI.updateGoal(TEST_DATA.goalID, {
            name: TEST_DATA.firstName, 
            description: TEST_DATA.firstDescription, 
            goalType: TEST_DATA.goalType, 
            isComplete: TEST_DATA.isComplete
        })).toEqual(STATUS_CODES.OK);
    });

    it('update goal (duplicate case)', async () => {
        parser.updateGoal.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        expect(await goalAPI.updateGoal(TEST_DATA.goalID, {
            name: TEST_DATA.firstName, 
            description: TEST_DATA.firstDescription, 
            goalType: TEST_DATA.goalType, 
            isComplete: TEST_DATA.isComplete
        })).toEqual(STATUS_CODES.CONFLICT);
    });

    it('update goal (bad data case)', async () => {
        parser.updateGoal.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await goalAPI.updateGoal(TEST_DATA.goalID, {
            name: TEST_DATA.firstName, 
            description: TEST_DATA.firstDescription, 
            goalType: TEST_DATA.goalType, 
            isComplete: TEST_DATA.isComplete
        })).toEqual(STATUS_CODES.BAD_REQUEST);
    });

    it('update goal (connection lost case)', async () => {
        parser.updateGoal.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await goalAPI.updateGoal(TEST_DATA.goalID, {
            name: TEST_DATA.firstName, 
            description: TEST_DATA.firstDescription, 
            goalType: TEST_DATA.goalType, 
            isComplete: TEST_DATA.isComplete
        })).toEqual(STATUS_CODES.CONNECTION_ERROR);
    });

    it('update goal (fatal error case)', async () => {
        parser.updateGoal.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await goalAPI.updateGoal(TEST_DATA.goalID, {
            name: TEST_DATA.firstName, 
            description: TEST_DATA.firstDescription, 
            goalType: TEST_DATA.goalType, 
            isComplete: TEST_DATA.isComplete
        })).toEqual(STATUS_CODES.INTERNAL_SERVER_ERROR);
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
        parser.parseGoalVariable.mockResolvedValueOnce([{name: TEST_DATA.firstName}]);
        expect(await goalAPI.getGoalVariable(TEST_DATA.goalID, "name")).toEqual([{name: TEST_DATA.firstName}]);
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
