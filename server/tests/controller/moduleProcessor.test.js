const ModuleAPI = require("../../controller/moduleProcessor");
const DatabaseParser = require("../../parser/databaseParser");
const STATUS_CODES = require("../../utils/statusCodes");

jest.mock("../../parser/DatabaseParser", () => {
    const testParser = {
        storeModule: jest.fn(),
        parseModules: jest.fn(),
        updateModule: jest.fn(),
        deleteModule: jest.fn(),
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
        parser.parseModules.mockResolvedValueOnce([
            {module_id: TEST_DATA.module_id, module_name: TEST_DATA.module_name, description: TEST_DATA.description, 
                completion_percent: TEST_DATA.completion_percent, email: TEST_DATA.email}
        ]);
        expect(await moduleAPI.getModules(TEST_DATA.email)).toEqual([
            {module_id: TEST_DATA.module_id, module_name: TEST_DATA.module_name, description: TEST_DATA.description, 
                completion_percent: TEST_DATA.completion_percent, email: TEST_DATA.email}
        ]);
    });
    
    it('get module (network error case)', async () => {
        parser.parseModules.mockRejectedValue({code: '08000'});
        expect(await moduleAPI.getModules(TEST_DATA.email)).toEqual(STATUS_CODES.CONNECTION_ERROR);
    });

    it('get module (fatal server error case)', async () => {
        parser.parseModules.mockRejectedValue({code: 'aaaaah'});
        expect(await moduleAPI.getModules(TEST_DATA.email)).toEqual(STATUS_CODES.INTERNAL_SERVER_ERROR);
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

    it('update module (pass case)', async () => {
        parser.updateModule.mockResolvedValueOnce();
        expect(await moduleAPI.updateModule(TEST_DATA.name, TEST_DATA.description, TEST_DATA.completion_percent, TEST_DATA.email, TEST_DATA.module_id)).toEqual(STATUS_CODES.OK);
    });

    it('update module (duplicate case)', async () => {
        parser.updateModule.mockRejectedValue({code: '23505'});
        expect(await moduleAPI.updateModule(TEST_DATA.name, TEST_DATA.description, TEST_DATA.completion_percent, TEST_DATA.email, TEST_DATA.module_id)).toEqual(STATUS_CODES.CONFLICT);
    });

    it('update module (bad data case)', async () => {
        parser.updateModule.mockRejectedValue({code: '23514'});
        expect(await moduleAPI.updateModule(TEST_DATA.name, TEST_DATA.description, TEST_DATA.completion_percent, TEST_DATA.email, TEST_DATA.module_id)).toEqual(STATUS_CODES.BAD_REQUEST);
    });

    it('update module (connection lost case)', async () => {
        parser.updateModule.mockRejectedValue({code: '08000'});
        expect(await moduleAPI.updateModule(TEST_DATA.name, TEST_DATA.description, TEST_DATA.completion_percent, TEST_DATA.email, TEST_DATA.module_id)).toEqual(STATUS_CODES.CONNECTION_ERROR);
    });

    it('update module (fatal error case)', async () => {
        parser.updateModule.mockRejectedValue({code: 'adsfa'});
        expect(await moduleAPI.updateModule(TEST_DATA.name, TEST_DATA.description, TEST_DATA.completion_percent, TEST_DATA.email, TEST_DATA.module_id)).toEqual(STATUS_CODES.INTERNAL_SERVER_ERROR);
    });

    it('delete module (pass case)', async () => {
        parser.deleteModule.mockResolvedValueOnce();
        expect(await moduleAPI.deleteModule(TEST_DATA.module_id)).toEqual(STATUS_CODES.OK);
    });

    it('delete module (duplicate case)', async () => {
        parser.deleteModule.mockRejectedValue({code: '23505'});
        expect(await moduleAPI.deleteModule(TEST_DATA.module_id)).toEqual(STATUS_CODES.CONFLICT);
    });

    it('delete module (bad data case)', async () => {
        parser.deleteModule.mockRejectedValue({code: '23514'});
        expect(await moduleAPI.deleteModule(TEST_DATA.module_id)).toEqual(STATUS_CODES.BAD_REQUEST);
    });

    it('delete module (connection lost case)', async () => {
        parser.deleteModule.mockRejectedValue({code: '08000'});
        expect(await moduleAPI.deleteModule(TEST_DATA.module_id)).toEqual(STATUS_CODES.CONNECTION_ERROR);
    });

    it('delete module (fatal error case)', async () => {
        parser.deleteModule.mockRejectedValue({code: 'adsfa'});
        expect(await moduleAPI.deleteModule(TEST_DATA.module_id)).toEqual(STATUS_CODES.INTERNAL_SERVER_ERROR);
    });
});
