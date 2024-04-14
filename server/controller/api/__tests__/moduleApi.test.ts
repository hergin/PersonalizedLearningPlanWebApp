import ModuleAPI from "../moduleApi";
import DatabaseParser from "../../../parser/databaseParser";
import { STATUS_CODE } from "../../../types";
import { FAKE_ERRORS, TEST_MODULE } from "../../global/mockValues";

jest.mock("../../../parser/databaseParser");

describe('Module Api Unit Tests', () => {
    let moduleAPI: ModuleAPI;
    let parser: any;

    beforeEach(() => {
        parser = new DatabaseParser();
        moduleAPI = new ModuleAPI();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('get module (correct case)', async () => {
        if(!TEST_MODULE.accountId) throw new Error("Module Id was null!");
        parser.parseDatabase.mockResolvedValueOnce([
          {module_id: TEST_MODULE.id, module_name: TEST_MODULE.name, description: TEST_MODULE.description,
                completion_percent: TEST_MODULE.completion, account_id: TEST_MODULE.accountId}
        ]);
        expect(await moduleAPI.getModules(TEST_MODULE.accountId)).toEqual([
            {module_id: TEST_MODULE.id, module_name: TEST_MODULE.name, description: TEST_MODULE.description,
                completion_percent: TEST_MODULE.completion, account_id: TEST_MODULE.accountId}
        ]);
    });

    it('get module with coach (correct case)', async () => {
        if(!TEST_MODULE.accountId) throw new Error("Module Id was null!");
        parser.parseDatabase.mockResolvedValueOnce([
            {
                module_id: TEST_MODULE.id, module_name: TEST_MODULE.name, description: TEST_MODULE.description,
                completion_percent: TEST_MODULE.completion, account_id: TEST_MODULE.accountId
            }
        ]);
        expect(await moduleAPI.getModules(TEST_MODULE.accountId)).toEqual([
            {
                module_id: TEST_MODULE.id, module_name: TEST_MODULE.name, description: TEST_MODULE.description,
                completion_percent: TEST_MODULE.completion, account_id: TEST_MODULE.accountId
            }
        ]);
    });

    it('get module (network error case)', async () => {
        if(!TEST_MODULE.accountId) throw new Error("Module Id was null!");
        parser.parseDatabase.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await moduleAPI.getModules(TEST_MODULE.accountId)).toEqual(STATUS_CODE.CONNECTION_ERROR);
    });

    it('get module (fatal server error case)', async () => {
        if(!TEST_MODULE.accountId) throw new Error("Module Id was null!");
        parser.parseDatabase.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await moduleAPI.getModules(TEST_MODULE.accountId)).toEqual(STATUS_CODE.INTERNAL_SERVER_ERROR);
    });

    it('create module (correct case)', async () => {
        parser.updateDatabase.mockResolvedValueOnce({});
        const actual = await moduleAPI.createModule({
            name: TEST_MODULE.name,
            description: TEST_MODULE.description,
            completion: TEST_MODULE.completion,
            accountId: TEST_MODULE.accountId
        });
        expect(actual).toEqual(STATUS_CODE.OK);
    });

    it('create module (server error case)', async () => {
        parser.updateDatabase.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        var actual = await moduleAPI.createModule({
            name: TEST_MODULE.name,
            description: TEST_MODULE.description,
            completion: TEST_MODULE.completion,
            accountId: TEST_MODULE.accountId
        });
        expect(actual).toEqual(STATUS_CODE.INTERNAL_SERVER_ERROR);
    });

    it('update module (pass case)', async () => {
        if(!TEST_MODULE.id) throw new Error("Module Id was null!");
        parser.updateDatabase.mockResolvedValueOnce();
        expect(await moduleAPI.updateModule({
            id: TEST_MODULE.id,
            name: TEST_MODULE.name,
            description: TEST_MODULE.description,
            completion: TEST_MODULE.completion,
        })).toEqual(STATUS_CODE.OK);
    });

    it('update module (duplicate case)', async () => {
        if(!TEST_MODULE.id) throw new Error("Module Id was null!");
        parser.updateDatabase.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        expect(await moduleAPI.updateModule({
            id: TEST_MODULE.id,
            name: TEST_MODULE.name,
            description: TEST_MODULE.description,
            completion: TEST_MODULE.completion,
        })).toEqual(STATUS_CODE.CONFLICT);
    });

    it('delete module (pass case)', async () => {
        if(!TEST_MODULE.id) throw new Error("Module Id was null!");
        parser.updateDatabase.mockResolvedValueOnce();
        expect(await moduleAPI.deleteModule(TEST_MODULE.id)).toEqual(STATUS_CODE.OK);
    });

    it('delete module (duplicate case)', async () => {
        if(!TEST_MODULE.id) throw new Error("Module Id was null!");
        parser.updateDatabase.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        expect(await moduleAPI.deleteModule(TEST_MODULE.id)).toEqual(STATUS_CODE.CONFLICT);
    });

    it('delete module (bad data case)', async () => {
        if(!TEST_MODULE.id) throw new Error("Module Id was null!");
        parser.updateDatabase.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await moduleAPI.deleteModule(TEST_MODULE.id)).toEqual(STATUS_CODE.BAD_REQUEST);
    });

    it('delete module (connection lost case)', async () => {
        if(!TEST_MODULE.id) throw new Error("Module Id was null!");
        parser.updateDatabase.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await moduleAPI.deleteModule(TEST_MODULE.id)).toEqual(STATUS_CODE.CONNECTION_ERROR);
    });

    it('delete module (fatal error case)', async () => {
        if(!TEST_MODULE.id) throw new Error("Module Id was null!");
        parser.updateDatabase.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await moduleAPI.deleteModule(TEST_MODULE.id)).toEqual(STATUS_CODE.INTERNAL_SERVER_ERROR);
    });

    it('get module variable (completion percent case)', async () => {
        if(!TEST_MODULE.id) throw new Error("Module Id was null!");
        parser.parseDatabase.mockResolvedValueOnce([{ completion_percent: 25 }]);
        expect(await moduleAPI.getModuleVariable(TEST_MODULE.id, "completion_percent")).toEqual([{ completion_percent: 25 }]);
    });
});
