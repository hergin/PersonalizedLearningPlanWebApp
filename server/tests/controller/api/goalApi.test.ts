export {};

import GoalAPI from "../../../controller/api/goalApi";
import GoalParser from "../../../parser/goalParser";
import { StatusCode } from "../../../types";
import { FAKE_ERRORS } from "./universal/fakeErrors";
import { GoalType } from "../../../types";
jest.mock("../../../parser/goalParser");

const TEST_DATA = {
    firstName: "do Homework",
    firstDescription: "spend 3 hours a day on homework",
    secondName: "Do project",
    secondDescription: "Finish my project.",
    isComplete: false,
    goalIDs: [5, 6, 10],
    moduleID: 9,
    goalType: GoalType.TASK,
    dueDate: "2025-01-01T23:59:59.000Z"
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
        parser.parseParentGoals.mockResolvedValueOnce([
            {
                goal_id: TEST_DATA.goalIDs[0], name: TEST_DATA.firstName, description: TEST_DATA.firstDescription, goal_type: TEST_DATA.goalType, 
                completion: TEST_DATA.isComplete, module_id: TEST_DATA.moduleID, parent_goal: null
            },
            {
                goal_id: TEST_DATA.goalIDs[1], name: TEST_DATA.secondName, description: TEST_DATA.secondDescription, goal_type: TEST_DATA.goalType,
                completion: TEST_DATA.isComplete, module_id: TEST_DATA.moduleID, parent_goal: null
            },
            {
                goal_id: TEST_DATA.goalIDs[2], name: "Goal 3", description: "This is the third goal.", goal_type: TEST_DATA.goalType,
                completion: TEST_DATA.isComplete, module_id: TEST_DATA.moduleID, parent_goal: null
            }
        ]);
        parser.parseSubGoals.mockImplementation((goalId : number) => {
            switch(goalId) {
                case TEST_DATA.goalIDs[0]:
                    return Promise.resolve([
                        {
                            goal_id: 7, name: "sub goal 1", description: "This is the first sub goal.", goal_type: TEST_DATA.goalType, 
                            completion: false, module_id: TEST_DATA.moduleID,   parent_goal: TEST_DATA.goalIDs
                        },
                        {
                            goal_id: 8, name: "sub goal 2", description: "This is the second sub goal.", goal_type: TEST_DATA.goalType,
                            completion: false, module_id: TEST_DATA.moduleID,  parent_goal: TEST_DATA.goalIDs
                        }
                    ]);
                case TEST_DATA.goalIDs[1]:
                    return Promise.resolve([
                        {
                            goal_id: 9, name: "sub goal 3", description: "This is the third sub goal.", goal_type: TEST_DATA.goalType,
                            completion: false, module_id: TEST_DATA.moduleID, parent_goal: 6
                        }
                    ]);
                case TEST_DATA.goalIDs[2]:
                    return Promise.resolve([]);
                default:
                    console.error("Something went wrong while executing get goals test.");
                    return Promise.reject(FAKE_ERRORS.fatalServerError);
            }
        });
        expect(await goalAPI.getGoals(TEST_DATA.moduleID)).toEqual([
            {
                goal_id: TEST_DATA.goalIDs[0], 
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
                        parent_goal: TEST_DATA.goalIDs
                    },
                    {
                        goal_id: 8,
                        name: "sub goal 2",
                        description: "This is the second sub goal.",
                        completion: false,
                        goal_type: TEST_DATA.goalType,
                        module_id: TEST_DATA.moduleID,
                        parent_goal: TEST_DATA.goalIDs
                    }
                ]
            },
            {
                goal_id: TEST_DATA.goalIDs[1],
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
                goal_id: TEST_DATA.goalIDs[2],
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
        parser.parseParentGoals.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await goalAPI.getGoals(TEST_DATA.moduleID)).toEqual(StatusCode.CONNECTION_ERROR);
    });

    it('get goals (fatal server error case)', async () => {
        parser.parseParentGoals.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await goalAPI.getGoals(TEST_DATA.moduleID)).toEqual(StatusCode.INTERNAL_SERVER_ERROR);
    });

    it('create goal (correct case without due date)', async () => {
        parser.storeGoal.mockResolvedValueOnce({goal_id: TEST_DATA.goalIDs});
        var actual = await goalAPI.createGoal({
            name: TEST_DATA.firstName, 
            description: TEST_DATA.firstDescription, 
            goalType: TEST_DATA.goalType, 
            isComplete: TEST_DATA.isComplete, 
            moduleId: TEST_DATA.moduleID}
        );
        expect(actual).toEqual({goal_id: TEST_DATA.goalIDs});
    });

    it('create goal (correct case with due date)', async () => {
        const testObject = {
            name: TEST_DATA.firstName,
            description: TEST_DATA.firstDescription,
            goalType: TEST_DATA.goalType,
            isComplete: TEST_DATA.isComplete,
            moduleId: TEST_DATA.moduleID,
            dueDate: TEST_DATA.dueDate
        }
        parser.storeGoal.mockResolvedValueOnce({goal_id: TEST_DATA.goalIDs});
        var actual = await goalAPI.createGoal(testObject);
        expect(parser.storeGoal).toHaveBeenCalledTimes(1);
        expect(parser.storeGoal).toHaveBeenCalledWith({
            ...testObject,
            dueDate: "2025-01-01 23:59:59.000 "
        });
        expect(actual).toEqual({goal_id: TEST_DATA.goalIDs});
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
        expect(actual).toEqual(StatusCode.CONFLICT);
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
        expect(actual).toEqual(StatusCode.CONNECTION_ERROR);
    });

    it('create goal (server error case)', async () => {
        parser.storeGoal.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        var actual = await goalAPI.createGoal({
            name: TEST_DATA.firstName, 
            description: TEST_DATA.firstDescription, 
            isComplete: TEST_DATA.isComplete, 
            moduleId: TEST_DATA.moduleID,
            goalType: GoalType.REPEATABLE
        });
        expect(actual).toEqual(StatusCode.INTERNAL_SERVER_ERROR);
    });

    it('update goal (pass case)', async () => {
        parser.updateGoal.mockResolvedValueOnce();
        expect(await goalAPI.updateGoal({
            id: TEST_DATA.goalIDs[0],
            name: TEST_DATA.firstName, 
            description: TEST_DATA.firstDescription, 
            goalType: TEST_DATA.goalType, 
            isComplete: TEST_DATA.isComplete
        })).toEqual(StatusCode.OK);
    });

    it('update goal (duplicate case)', async () => {
        parser.updateGoal.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        expect(await goalAPI.updateGoal({
            id: TEST_DATA.goalIDs[0],
            name: TEST_DATA.firstName, 
            description: TEST_DATA.firstDescription, 
            goalType: TEST_DATA.goalType, 
            isComplete: TEST_DATA.isComplete
        })).toEqual(StatusCode.CONFLICT);
    });

    it('update goal (bad data case)', async () => {
        parser.updateGoal.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await goalAPI.updateGoal({
            id: TEST_DATA.goalIDs[0],
            name: TEST_DATA.firstName, 
            description: TEST_DATA.firstDescription, 
            goalType: TEST_DATA.goalType, 
            isComplete: TEST_DATA.isComplete
        })).toEqual(StatusCode.BAD_REQUEST);
    });

    it('update goal (connection lost case)', async () => {
        parser.updateGoal.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await goalAPI.updateGoal({
            id: TEST_DATA.goalIDs[0],
            name: TEST_DATA.firstName, 
            description: TEST_DATA.firstDescription, 
            goalType: TEST_DATA.goalType, 
            isComplete: TEST_DATA.isComplete
        })).toEqual(StatusCode.CONNECTION_ERROR);
    });

    it('update goal (fatal error case)', async () => {
        parser.updateGoal.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await goalAPI.updateGoal({
            id: TEST_DATA.goalIDs[0],
            name: TEST_DATA.firstName, 
            description: TEST_DATA.firstDescription, 
            goalType: TEST_DATA.goalType, 
            isComplete: TEST_DATA.isComplete
        })).toEqual(StatusCode.INTERNAL_SERVER_ERROR);
    });

    it('update goal feedback (correct case)', async () => {
        parser.updateGoalFeedback.mockResolvedValueOnce();
        const actual = await goalAPI.updateGoalFeedback(TEST_DATA.goalIDs[0], "this is feedback");
        expect(parser.updateGoalFeedback).toHaveBeenCalledTimes(1);
        expect(parser.updateGoalFeedback).toHaveBeenCalledWith(TEST_DATA.goalIDs[0], "this is feedback");
        expect(actual).toEqual(StatusCode.OK);
    });

    it('delete goal (pass case)', async () => {
        parser.deleteGoal.mockResolvedValueOnce();
        expect(await goalAPI.deleteGoal(TEST_DATA.goalIDs[0])).toEqual(StatusCode.OK);
    });

    it('delete goal (duplicate case)', async () => {
        parser.deleteGoal.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        expect(await goalAPI.deleteGoal(TEST_DATA.goalIDs[0])).toEqual(StatusCode.CONFLICT);
    });

    it('delete goal (bad data case)', async () => {
        parser.deleteGoal.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await goalAPI.deleteGoal(TEST_DATA.goalIDs[0])).toEqual(StatusCode.BAD_REQUEST);
    });

    it('delete goal (connection lost case)', async () => {
        parser.deleteGoal.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await goalAPI.deleteGoal(TEST_DATA.goalIDs[0])).toEqual(StatusCode.CONNECTION_ERROR);
    });

    it('delete goal (fatal error case)', async () => {
        parser.deleteGoal.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await goalAPI.deleteGoal(TEST_DATA.goalIDs[0])).toEqual(StatusCode.INTERNAL_SERVER_ERROR);
    });

    it('parse goal attribute (name case)', async () => {
        parser.parseGoalVariable.mockResolvedValueOnce([{name: TEST_DATA.firstName}]);
        expect(await goalAPI.getGoalVariable(TEST_DATA.goalIDs[0], "name")).toEqual([{name: TEST_DATA.firstName}]);
    });

    it('parse goal attribute (module id case)', async () => {
        parser.parseGoalVariable.mockResolvedValueOnce([{module_id: TEST_DATA.moduleID}]);
        expect(await goalAPI.getGoalVariable(TEST_DATA.goalIDs[0], "module_id")).toEqual([{module_id: TEST_DATA.moduleID}]);
    });

    it('parse goal attribute (bad request)', async () => {
        parser.parseGoalVariable.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await goalAPI.getGoalVariable(TEST_DATA.goalIDs[0], "name")).toEqual(StatusCode.BAD_REQUEST);
    });

    it('parse goal attribute (network error case)', async () => {
        parser.parseGoalVariable.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await goalAPI.getGoalVariable(TEST_DATA.goalIDs[0], "name")).toEqual(StatusCode.CONNECTION_ERROR);
    });

    it('parse goal attribute (fatal server error case)', async () => {
        parser.parseGoalVariable.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await goalAPI.getGoalVariable(TEST_DATA.goalIDs[0], "name")).toEqual(StatusCode.INTERNAL_SERVER_ERROR);
    });
});
