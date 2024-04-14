import GoalAPI from "../goalApi";
import GoalParser from "../../../parser/goalParser";
import { STATUS_CODE } from "../../../types";
import { FAKE_ERRORS, TEST_GOAL, TEST_CREATED_GOAL } from "../../global/mockValues";

jest.mock("../../../parser/goalParser");


describe('Goal Api Unit Tests', () => {
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
        const moduleId = TEST_GOAL[0].module_id;
        const parentGoals = [{...TEST_GOAL[0]}, {...TEST_GOAL[1]}, {...TEST_GOAL[4]}];
        const firstParentSubGoals = [{...TEST_GOAL[2]}, {...TEST_GOAL[3]}];
        const secondParentSubGoals = [{...TEST_GOAL[5]}];
        parser.parseParentGoals.mockResolvedValueOnce(parentGoals);
        parser.parseSubGoals.mockImplementation((goalId : number) => {
            switch(goalId) {
                case parentGoals[0].goal_id:
                    return Promise.resolve(firstParentSubGoals);
                case parentGoals[1].goal_id:
                    return Promise.resolve(secondParentSubGoals);
                case parentGoals[2].goal_id:
                    return Promise.resolve([]);
                default:
                    console.error("Something went wrong while executing get goals test.");
                    return Promise.reject(FAKE_ERRORS.fatalServerError);
            }
        });
        expect(await goalAPI.getGoals(moduleId)).toEqual([
            {...parentGoals[0], sub_goals: firstParentSubGoals},
            {...parentGoals[1], sub_goals: secondParentSubGoals},
            {...parentGoals[2], sub_goals: []}
        ]);
    });

    it('get goals (fatal server error case)', async () => {
        const moduleId = TEST_GOAL[0].module_id;
        parser.parseParentGoals.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await goalAPI.getGoals(moduleId)).toEqual(STATUS_CODE.INTERNAL_SERVER_ERROR);
    });

    it('create goal (correct case without due date)', async () => {
        parser.storeGoal.mockResolvedValueOnce({});
        const actual = await goalAPI.createGoal(TEST_CREATED_GOAL[0]);
        expect(actual).toEqual(STATUS_CODE.OK);
    });

    it('create goal (server error case)', async () => {
        parser.storeGoal.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        var actual = await goalAPI.createGoal(TEST_CREATED_GOAL[0]);
        expect(actual).toEqual(STATUS_CODE.INTERNAL_SERVER_ERROR);
    });

    it('update goal (pass case)', async () => {
        parser.updateGoal.mockResolvedValueOnce();
        expect(await goalAPI.updateGoal(TEST_GOAL[0])).toEqual(STATUS_CODE.OK);
    });

    it('update goal (connection lost case)', async () => {
        parser.updateGoal.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await goalAPI.updateGoal(TEST_GOAL[0])).toEqual(STATUS_CODE.CONNECTION_ERROR);
    });

    it('update goal feedback (correct case)', async () => {
        parser.updateGoalFeedback.mockResolvedValueOnce();
        const actual = await goalAPI.updateGoalFeedback(TEST_GOAL[0].goal_id, "this is feedback");
        expect(parser.updateGoalFeedback).toHaveBeenCalledTimes(1);
        expect(parser.updateGoalFeedback).toHaveBeenCalledWith(TEST_GOAL[0].goal_id, "this is feedback");
        expect(actual).toEqual(STATUS_CODE.OK);
    });

    it('delete goal (pass case)', async () => {
        parser.deleteGoal.mockResolvedValueOnce();
        expect(await goalAPI.deleteGoal(TEST_GOAL[0].goal_id)).toEqual(STATUS_CODE.OK);
    });

    it('delete goal (fatal error case)', async () => {
        parser.deleteGoal.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await goalAPI.deleteGoal(TEST_GOAL[0].goal_id)).toEqual(STATUS_CODE.INTERNAL_SERVER_ERROR);
    });

    it('parse goal attribute (name case)', async () => {
        parser.parseGoalVariable.mockResolvedValueOnce([{name: TEST_GOAL[0].name}]);
        expect(await goalAPI.getGoalVariable(TEST_GOAL[0].goal_id, "name")).toEqual([{name: TEST_GOAL[0].name}]);
    });

    it('parse goal attribute (module id case)', async () => {
        parser.parseGoalVariable.mockResolvedValueOnce([{module_id: TEST_GOAL[0].module_id}]);
        expect(await goalAPI.getGoalVariable(TEST_GOAL[0].goal_id, "module_id")).toEqual([{module_id: TEST_GOAL[0].module_id}]);
    });

    it('parse goal attribute (fatal server error case)', async () => {
        parser.parseGoalVariable.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await goalAPI.getGoalVariable(TEST_GOAL[0].goal_id, "name")).toEqual(STATUS_CODE.INTERNAL_SERVER_ERROR);
    });
});
