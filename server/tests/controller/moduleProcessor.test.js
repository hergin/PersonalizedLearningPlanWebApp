const ModuleAPI = require("../../controller/moduleProcessor");
const DatabaseParser = require("../../parser/databaseParser");
const STATUS_CODES = require("../../statusCodes");

jest.mock("../../parser/DatabaseParser", () => {
    const testParser = {
        storeModule: jest.fn(),
        parseModule: jest.fn(),
        updateModule: jest.fn()
    };
    return jest.fn(() => testParser);
});

const TEST_DATA = {
    module_id: 9,
    module_name: "School",
    description: "For school :3",
    completion_percent: 0,
    email: "example@gmail.com"
}

describe('module processor unit tests', () => {
    let moduleAPI;
    let parser;
    
    beforeEach(() => {
        parser = new DatabaseParser();
        moduleAPI = new ModuleAPI();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('get module (correct case)', async () => {
        parser.parseModule.mockResolvedValueOnce([
            {module_id: TEST_DATA.module_id, module_name: TEST_DATA.module_name, description: TEST_DATA.description, 
                completion_percent: TEST_DATA.completion_percent, email: TEST_DATA.email}
        ]);
        expect(await moduleAPI.getModule(TEST_DATA.email)).toEqual(
            {module_id: TEST_DATA.module_id, module_name: TEST_DATA.module_name, description: TEST_DATA.description, 
                completion_percent: TEST_DATA.completion_percent, email: TEST_DATA.email}
        );
    });
    
    it('get module (unauthorized case)', async () => {
        parser.parseModule.mockResolvedValueOnce([]);
        expect(await moduleAPI.getModule(TEST_DATA.email)).toEqual(STATUS_CODES.UNAUTHORIZED);
    });

    it('get module (network error case)', async () => {
        parser.parseModule.mockRejectedValue({code: '08000'});
        expect(await moduleAPI.getModule(TEST_DATA.email)).toEqual(STATUS_CODES.CONNECTION_ERROR);
    });

    it('get module (fatal server error case)', async () => {
        parser.parseModule.mockRejectedValue({code: 'aaaaah'});
        expect(await moduleAPI.getModule(TEST_DATA.email)).toEqual(STATUS_CODES.INTERNAL_SERVER_ERROR);
    });

    it('create module (correct case)', async () => {
        parser.storeModule.mockResolvedValueOnce();
        var actual = await moduleAPI.createModule(TEST_DATA.module_name, TEST_DATA.description, TEST_DATA.completion_percent, TEST_DATA.email);
        expect(actual).toEqual(STATUS_CODES.OK);
    });

    it('create module (primary key violation case)', async () => {
        parser.storeModule.mockRejectedValue({code: '23505'});
        var actual = await moduleAPI.createModule(TEST_DATA.module_name, TEST_DATA.description, TEST_DATA.completion_percent, TEST_DATA.email);
        expect(actual).toEqual(STATUS_CODES.CONFLICT);
    });

    it('create module (network error case)', async () => {
        parser.storeModule.mockRejectedValue({code: '08000'});
        var actual = await moduleAPI.createModule(TEST_DATA.module_name, TEST_DATA.description, TEST_DATA.completion_percent, TEST_DATA.email);
        expect(actual).toEqual(STATUS_CODES.CONNECTION_ERROR);
    });

    it('create module (server error case)', async () => {
        parser.storeModule.mockRejectedValue({code: 'help'});
        var actual = await moduleAPI.createModule(TEST_DATA.module_name, TEST_DATA.description, TEST_DATA.completion_percent, TEST_DATA.email);
        expect(actual).toEqual(STATUS_CODES.INTERNAL_SERVER_ERROR);
    });
});
