export {};

const GoalAPI = require("../../controller/goalProcessor");
const GoalParser = require("../../parser/goalParser");
const STATUS_CODES = require("../../utils/statusCodes");

jest.mock("../../parser/goalParser", () => {
    const testParser = {
        storeGoal: jest.fn(),
        parseGoals: jest.fn(),
        updateGoal: jest.fn(),
        deleteGoal: jest.fn()
    };
    return jest.fn(() => testParser);
});

const TEST_DATA = {
    name: "do Homework",
    description: "spend 3 hours a day on homework",
    completion: false,
    goal_id: 5,
    module_id: 9,
}

describe('goal processor unit tests', () => {
    let goalAPI : typeof GoalAPI;
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
                name: TEST_DATA.name, description: TEST_DATA.description, completion: TEST_DATA.completion,
                module_id: TEST_DATA.module_id, goal_id: TEST_DATA.goal_id
            }
        ]);
        expect(await goalAPI.getGoals(TEST_DATA.module_id)).toEqual([
            {
                name: TEST_DATA.name, description: TEST_DATA.description, completion: TEST_DATA.completion,
                module_id: TEST_DATA.module_id, goal_id: TEST_DATA.goal_id
            }
        ]);
    });

    it('get goals (network error case)', async () => {
        parser.parseGoals.mockRejectedValue({code: '08000'});
        expect(await goalAPI.getGoals(TEST_DATA.module_id)).toEqual(STATUS_CODES.CONNECTION_ERROR);
    });

    it('get goals (fatal server error case)', async () => {
        parser.parseGoals.mockRejectedValue({code: 'aaaaah'});
        expect(await goalAPI.getGoals(TEST_DATA.module_id)).toEqual(STATUS_CODES.INTERNAL_SERVER_ERROR);
    });

    it('create goal (correct case)', async () => {
        parser.storeGoal.mockResolvedValueOnce({goal_id: TEST_DATA.goal_id});
        var actual = await goalAPI.createGoal(TEST_DATA.name, TEST_DATA.description, TEST_DATA.completion, TEST_DATA.module_id);
        expect(actual).toEqual({goal_id: TEST_DATA.goal_id});
    });

    it('create goal (primary key violation case)', async () => {
        parser.storeGoal.mockRejectedValue({code: '23505'});
        var actual = await goalAPI.createGoal(TEST_DATA.name, TEST_DATA.description, TEST_DATA.completion, TEST_DATA.module_id);
        expect(actual).toEqual(STATUS_CODES.CONFLICT);
    });

    it('create goal (network error case)', async () => {
        parser.storeGoal.mockRejectedValue({code: '08000'});
        var actual = await goalAPI.createGoal(TEST_DATA.name, TEST_DATA.description, TEST_DATA.completion, TEST_DATA.module_id);
        expect(actual).toEqual(STATUS_CODES.CONNECTION_ERROR);
    });

    it('create goal (server error case)', async () => {
        parser.storeGoal.mockRejectedValue({code: 'help'});
        var actual = await goalAPI.createGoal(TEST_DATA.name, TEST_DATA.description, TEST_DATA.completion, TEST_DATA.module_id);
        expect(actual).toEqual(STATUS_CODES.INTERNAL_SERVER_ERROR);
    });

    it('update goal (pass case)', async () => {
        parser.updateGoal.mockResolvedValueOnce();
        expect(await goalAPI.updateGoal(TEST_DATA.goal_id, TEST_DATA.name, TEST_DATA.description, TEST_DATA.completion)).toEqual(STATUS_CODES.OK);
    });

    it('update goal (duplicate case)', async () => {
        parser.updateGoal.mockRejectedValue({code: '23505'});
        expect(await goalAPI.updateGoal(TEST_DATA.goal_id, TEST_DATA.name, TEST_DATA.description, TEST_DATA.completion)).toEqual(STATUS_CODES.CONFLICT);
    });

    it('update goal (bad data case)', async () => {
        parser.updateGoal.mockRejectedValue({code: '23514'});
        expect(await goalAPI.updateGoal(TEST_DATA.goal_id, TEST_DATA.name, TEST_DATA.description, TEST_DATA.completion)).toEqual(STATUS_CODES.BAD_REQUEST);
    });

    it('update goal (connection lost case)', async () => {
        parser.updateGoal.mockRejectedValue({code: '08000'});
        expect(await goalAPI.updateGoal(TEST_DATA.goal_id, TEST_DATA.name, TEST_DATA.description, TEST_DATA.completion)).toEqual(STATUS_CODES.CONNECTION_ERROR);
    });

    it('update goal (fatal error case)', async () => {
        parser.updateGoal.mockRejectedValue({code: 'adsfa'});
        expect(await goalAPI.updateGoal(TEST_DATA.goal_id, TEST_DATA.name, TEST_DATA.description, TEST_DATA.completion)).toEqual(STATUS_CODES.INTERNAL_SERVER_ERROR);
    });

    it('delete goal (pass case)', async () => {
        parser.deleteGoal.mockResolvedValueOnce();
        expect(await goalAPI.deleteGoal(TEST_DATA.goal_id)).toEqual(STATUS_CODES.OK);
    });

    it('delete goal (duplicate case)', async () => {
        parser.deleteGoal.mockRejectedValue({code: '23505'});
        expect(await goalAPI.deleteGoal(TEST_DATA.goal_id)).toEqual(STATUS_CODES.CONFLICT);
    });

    it('delete goal (bad data case)', async () => {
        parser.deleteGoal.mockRejectedValue({code: '23514'});
        expect(await goalAPI.deleteGoal(TEST_DATA.goal_id)).toEqual(STATUS_CODES.BAD_REQUEST);
    });

    it('delete goal (connection lost case)', async () => {
        parser.deleteGoal.mockRejectedValue({code: '08000'});
        expect(await goalAPI.deleteGoal(TEST_DATA.goal_id)).toEqual(STATUS_CODES.CONNECTION_ERROR);
    });

    it('delete goal (fatal error case)', async () => {
        parser.deleteGoal.mockRejectedValue({code: 'adsfa'});
        expect(await goalAPI.deleteGoal(TEST_DATA.goal_id)).toEqual(STATUS_CODES.INTERNAL_SERVER_ERROR);
    });
});