export {};

import GoalAPI from "../../../controller/api/goalApi";
import GoalParser from "../../../parser/goalParser";
import { StatusCode } from "../../../types";
import { FAKE_ERRORS, TEST_GOAL, TEST_SUB_GOAL } from "../global/mockValues.test";
import { GoalType } from "../../../types";
jest.mock("../../../parser/goalParser");


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
                goal_id: TEST_GOAL.id[0], name: TEST_GOAL.name[0], description: TEST_GOAL.description[0], goal_type: TEST_GOAL.goalType, 
                completion: TEST_GOAL.isComplete, module_id: TEST_GOAL.moduleId, parent_goal: null
            },
            {
                goal_id: TEST_GOAL.id[1], name: TEST_GOAL.name[1], description: TEST_GOAL.description[1], goal_type: TEST_GOAL.goalType,
                completion: TEST_GOAL.isComplete, module_id: TEST_GOAL.moduleId, parent_goal: null
            },
            {
                goal_id: TEST_GOAL.id[2], name: TEST_GOAL.name[2], description: TEST_GOAL.description[2], goal_type: TEST_GOAL.goalType,
                completion: TEST_GOAL.isComplete, module_id: TEST_GOAL.moduleId, parent_goal: null
            }
        ]);
        parser.parseSubGoals.mockImplementation((goalId : number) => {
            switch(goalId) {
                case TEST_GOAL.id[0]:
                    return Promise.resolve([
                        {
                            goal_id: TEST_SUB_GOAL.id[0], name: TEST_SUB_GOAL.name[0], description: TEST_SUB_GOAL.description[0], 
                            goal_type: TEST_GOAL.goalType, completion: false, module_id: TEST_GOAL.moduleId, 
                            parent_goal: TEST_GOAL.id
                        },
                        {
                            goal_id: TEST_SUB_GOAL.id[1], name: TEST_SUB_GOAL.name[1], description: TEST_SUB_GOAL.description[1], 
                            goal_type: TEST_GOAL.goalType,completion: false, module_id: TEST_GOAL.moduleId,  
                            parent_goal: TEST_GOAL.id
                        }
                    ]);
                case TEST_GOAL.id[1]:
                    return Promise.resolve([
                        {
                            goal_id: TEST_SUB_GOAL.id[2], name: TEST_SUB_GOAL.name[2], description: TEST_SUB_GOAL.description[2], 
                            goal_type: TEST_GOAL.goalType, completion: false, module_id: TEST_GOAL.moduleId, parent_goal: 6
                        }
                    ]);
                case TEST_GOAL.id[2]:
                    return Promise.resolve([]);
                default:
                    console.error("Something went wrong while executing get goals test.");
                    return Promise.reject(FAKE_ERRORS.fatalServerError);
            }
        });
        expect(await goalAPI.getGoals(TEST_GOAL.moduleId)).toEqual([
            {
                goal_id: TEST_GOAL.id[0], 
                name: TEST_GOAL.name[0], 
                description: TEST_GOAL.description[0], 
                goal_type: TEST_GOAL.goalType,
                completion: TEST_GOAL.isComplete,
                module_id: TEST_GOAL.moduleId,
                parent_goal: null, 
                sub_goals: [
                    {
                        goal_id: TEST_SUB_GOAL.id[0],
                        name: TEST_SUB_GOAL.name[0],
                        description: TEST_SUB_GOAL.description[0],
                        completion: false,
                        goal_type: TEST_GOAL.goalType,
                        module_id: TEST_GOAL.moduleId,
                        parent_goal: TEST_GOAL.id
                    },
                    {
                        goal_id: TEST_SUB_GOAL.id[1],
                        name: TEST_SUB_GOAL.name[1],
                        description: TEST_SUB_GOAL.description[1],
                        completion: false,
                        goal_type: TEST_GOAL.goalType,
                        module_id: TEST_GOAL.moduleId,
                        parent_goal: TEST_GOAL.id
                    }
                ]
            },
            {
                goal_id: TEST_GOAL.id[1],
                name: TEST_GOAL.name[1],
                description: TEST_GOAL.description[1],
                completion: false,
                goal_type: TEST_GOAL.goalType,
                module_id: TEST_GOAL.moduleId,
                parent_goal: null,
                sub_goals: [
                    {
                        goal_id: TEST_SUB_GOAL.id[2],
                        name: TEST_SUB_GOAL.name[2],
                        description: TEST_SUB_GOAL.description[2],
                        completion: false,
                        goal_type: TEST_GOAL.goalType,
                        module_id: TEST_GOAL.moduleId,
                        parent_goal: 6
                    }
                ]
            },
            {
                goal_id: TEST_GOAL.id[2],
                name: TEST_GOAL.name[2],
                description: TEST_GOAL.description[2],
                completion: false,
                goal_type: TEST_GOAL.goalType,
                module_id: TEST_GOAL.moduleId,
                parent_goal: null,
                sub_goals: []
            }
        ]);
    });

    it('get goals (network error case)', async () => {
        parser.parseParentGoals.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await goalAPI.getGoals(TEST_GOAL.moduleId)).toEqual(StatusCode.CONNECTION_ERROR);
    });

    it('get goals (fatal server error case)', async () => {
        parser.parseParentGoals.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await goalAPI.getGoals(TEST_GOAL.moduleId)).toEqual(StatusCode.INTERNAL_SERVER_ERROR);
    });

    it('create goal (correct case without due date)', async () => {
        parser.storeGoal.mockResolvedValueOnce({goal_id: TEST_GOAL.id[0]});
        var actual = await goalAPI.createGoal({
            name: TEST_GOAL.name[0], 
            description: TEST_GOAL.description[0], 
            goalType: TEST_GOAL.goalType, 
            isComplete: TEST_GOAL.isComplete, 
            moduleId: TEST_GOAL.moduleId}
        );
        expect(actual).toEqual({goal_id: TEST_GOAL.id[0]});
    });

    it('create goal (correct case with due date)', async () => {
        const testObject = {
            name: TEST_GOAL.name[0],
            description: TEST_GOAL.description[0],
            goalType: TEST_GOAL.goalType,
            isComplete: TEST_GOAL.isComplete,
            moduleId: TEST_GOAL.moduleId,
            dueDate: TEST_GOAL.dueDate
        }
        parser.storeGoal.mockResolvedValueOnce({goal_id: TEST_GOAL.id[0]});
        var actual = await goalAPI.createGoal(testObject);
        expect(parser.storeGoal).toHaveBeenCalledTimes(1);
        expect(parser.storeGoal).toHaveBeenCalledWith({
            ...testObject,
            dueDate: "2025-01-01 23:59:59.000 "
        });
        expect(actual).toEqual({goal_id: TEST_GOAL.id[0]});
    });

    it('create goal (primary key violation case)', async () => {
        parser.storeGoal.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        var actual = await goalAPI.createGoal({
            name: TEST_GOAL.name[0], 
            description: TEST_GOAL.description[0], 
            goalType: TEST_GOAL.goalType, 
            isComplete: TEST_GOAL.isComplete, 
            moduleId: TEST_GOAL.moduleId
        });
        expect(actual).toEqual(StatusCode.CONFLICT);
    });

    it('create goal (network error case)', async () => {
        parser.storeGoal.mockRejectedValue(FAKE_ERRORS.networkError);
        var actual = await goalAPI.createGoal({
            name: TEST_GOAL.name[0], 
            description: TEST_GOAL.description[0], 
            goalType: TEST_GOAL.goalType, 
            isComplete: TEST_GOAL.isComplete, 
            moduleId: TEST_GOAL.moduleId
        });
        expect(actual).toEqual(StatusCode.CONNECTION_ERROR);
    });

    it('create goal (server error case)', async () => {
        parser.storeGoal.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        var actual = await goalAPI.createGoal({
            name: TEST_GOAL.name[0], 
            description: TEST_GOAL.description[0], 
            isComplete: TEST_GOAL.isComplete, 
            moduleId: TEST_GOAL.moduleId,
            goalType: GoalType.REPEATABLE
        });
        expect(actual).toEqual(StatusCode.INTERNAL_SERVER_ERROR);
    });

    it('update goal (pass case)', async () => {
        parser.updateGoal.mockResolvedValueOnce();
        expect(await goalAPI.updateGoal({
            id: TEST_GOAL.id[0],
            name: TEST_GOAL.name[0], 
            description: TEST_GOAL.description[0], 
            goalType: TEST_GOAL.goalType, 
            isComplete: TEST_GOAL.isComplete
        })).toEqual(StatusCode.OK);
    });

    it('update goal (duplicate case)', async () => {
        parser.updateGoal.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        expect(await goalAPI.updateGoal({
            id: TEST_GOAL.id[0],
            name: TEST_GOAL.name[0], 
            description: TEST_GOAL.description[0], 
            goalType: TEST_GOAL.goalType, 
            isComplete: TEST_GOAL.isComplete
        })).toEqual(StatusCode.CONFLICT);
    });

    it('update goal (bad data case)', async () => {
        parser.updateGoal.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await goalAPI.updateGoal({
            id: TEST_GOAL.id[0],
            name: TEST_GOAL.name[0], 
            description: TEST_GOAL.description[0], 
            goalType: TEST_GOAL.goalType, 
            isComplete: TEST_GOAL.isComplete
        })).toEqual(StatusCode.BAD_REQUEST);
    });

    it('update goal (connection lost case)', async () => {
        parser.updateGoal.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await goalAPI.updateGoal({
            id: TEST_GOAL.id[0],
            name: TEST_GOAL.name[0], 
            description: TEST_GOAL.description[0], 
            goalType: TEST_GOAL.goalType, 
            isComplete: TEST_GOAL.isComplete
        })).toEqual(StatusCode.CONNECTION_ERROR);
    });

    it('update goal (fatal error case)', async () => {
        parser.updateGoal.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await goalAPI.updateGoal({
            id: TEST_GOAL.id[0],
            name: TEST_GOAL.name[0], 
            description: TEST_GOAL.description[0], 
            goalType: TEST_GOAL.goalType, 
            isComplete: TEST_GOAL.isComplete
        })).toEqual(StatusCode.INTERNAL_SERVER_ERROR);
    });

    it('update goal feedback (correct case)', async () => {
        parser.updateGoalFeedback.mockResolvedValueOnce();
        const actual = await goalAPI.updateGoalFeedback(TEST_GOAL.id[0], "this is feedback");
        expect(parser.updateGoalFeedback).toHaveBeenCalledTimes(1);
        expect(parser.updateGoalFeedback).toHaveBeenCalledWith(TEST_GOAL.id[0], "this is feedback");
        expect(actual).toEqual(StatusCode.OK);
    });

    it('delete goal (pass case)', async () => {
        parser.deleteGoal.mockResolvedValueOnce();
        expect(await goalAPI.deleteGoal(TEST_GOAL.id[0])).toEqual(StatusCode.OK);
    });

    it('delete goal (duplicate case)', async () => {
        parser.deleteGoal.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        expect(await goalAPI.deleteGoal(TEST_GOAL.id[0])).toEqual(StatusCode.CONFLICT);
    });

    it('delete goal (bad data case)', async () => {
        parser.deleteGoal.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await goalAPI.deleteGoal(TEST_GOAL.id[0])).toEqual(StatusCode.BAD_REQUEST);
    });

    it('delete goal (connection lost case)', async () => {
        parser.deleteGoal.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await goalAPI.deleteGoal(TEST_GOAL.id[0])).toEqual(StatusCode.CONNECTION_ERROR);
    });

    it('delete goal (fatal error case)', async () => {
        parser.deleteGoal.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await goalAPI.deleteGoal(TEST_GOAL.id[0])).toEqual(StatusCode.INTERNAL_SERVER_ERROR);
    });

    it('parse goal attribute (name case)', async () => {
        parser.parseGoalVariable.mockResolvedValueOnce([{name: TEST_GOAL.name}]);
        expect(await goalAPI.getGoalVariable(TEST_GOAL.id[0], "name")).toEqual([{name: TEST_GOAL.name}]);
    });

    it('parse goal attribute (module id case)', async () => {
        parser.parseGoalVariable.mockResolvedValueOnce([{module_id: TEST_GOAL.moduleId}]);
        expect(await goalAPI.getGoalVariable(TEST_GOAL.id[0], "module_id")).toEqual([{module_id: TEST_GOAL.moduleId}]);
    });

    it('parse goal attribute (bad request)', async () => {
        parser.parseGoalVariable.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await goalAPI.getGoalVariable(TEST_GOAL.id[0], "name")).toEqual(StatusCode.BAD_REQUEST);
    });

    it('parse goal attribute (network error case)', async () => {
        parser.parseGoalVariable.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await goalAPI.getGoalVariable(TEST_GOAL.id[0], "name")).toEqual(StatusCode.CONNECTION_ERROR);
    });

    it('parse goal attribute (fatal server error case)', async () => {
        parser.parseGoalVariable.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await goalAPI.getGoalVariable(TEST_GOAL.id[0], "name")).toEqual(StatusCode.INTERNAL_SERVER_ERROR);
    });
});
