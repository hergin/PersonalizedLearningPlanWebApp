const GoalAPI = require("../../controller/goalProcessor");
const DatabaseParser = require("../../parser/databaseParser");
const STATUS_CODES = require("../../statusCodes");

jest.mock("../../parser/DatabaseParser", () => {
    const testParser = {
        storeGoal: jest.fn(),
        parseGoal: jest.fn(),
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
    let goalAPI;
    let parser;

    beforeEach(() => {
        parser = new DatabaseParser();
        goalAPI = new GoalAPI();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('get goal (correct case)', async () => {
        parser.parseGoal.mockResolvedValueOnce([
            {
                name: TEST_DATA.name, description: TEST_DATA.description, completion: TEST_DATA.completion,
                module_id: TEST_DATA.module_id, goal_id: TEST_DATA.goal_id
            }
        ]);
        expect(await goalAPI.getGoal(TEST_DATA.module_id)).toEqual(
            {
                name: TEST_DATA.name, description: TEST_DATA.description, completion: TEST_DATA.completion,
                module_id: TEST_DATA.module_id, goal_id: TEST_DATA.goal_id
            }
        );
    });

    it('get goal (unauthorized case)', async () => {
        parser.parseGoal.mockResolvedValueOnce([]);
        expect(await goalAPI.getGoal(TEST_DATA.module_id)).toEqual(STATUS_CODES.UNAUTHORIZED);
    });

    it('get goal (network error case)', async () => {
        parser.parseGoal.mockRejectedValue({code: '08000'});
        expect(await goalAPI.getGoal(TEST_DATA.module_id)).toEqual(STATUS_CODES.CONNECTION_ERROR);
    });

    it('get goal (fatal server error case)', async () => {
        parser.parseGoal.mockRejectedValue({code: 'aaaaah'});
        expect(await goalAPI.getGoal(TEST_DATA.module_id)).toEqual(STATUS_CODES.INTERNAL_SERVER_ERROR);
    });

    it('create goal (correct case)', async () => {
        parser.storeGoal.mockResolvedValueOnce();
        var actual = await goalAPI.createGoal(TEST_DATA.name, TEST_DATA.description, TEST_DATA.completion, TEST_DATA.module_id);
        expect(actual).toEqual(STATUS_CODES.OK);
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

});