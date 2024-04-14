import ModuleAPI from "../moduleApi";
import DatabaseParser from "../../../parser/databaseParser";
import { STATUS_CODE } from "../../../types";
import { FAKE_ERRORS, TEST_CREATED_MODULE, TEST_MODULE } from "../../global/mockValues";

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
        parser.parseDatabase.mockResolvedValueOnce([TEST_MODULE]);
        expect(await moduleAPI.getModules(TEST_MODULE.accountId)).toEqual([TEST_MODULE]);
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
        const actual = await moduleAPI.createModule(TEST_CREATED_MODULE);
        expect(actual).toEqual(STATUS_CODE.OK);
    });

    it('create module (server error case)', async () => {
        parser.updateDatabase.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        var actual = await moduleAPI.createModule(TEST_CREATED_MODULE);
        expect(actual).toEqual(STATUS_CODE.INTERNAL_SERVER_ERROR);
    });

    it('update module (pass case)', async () => {
        parser.updateDatabase.mockResolvedValueOnce();
        expect(await moduleAPI.updateModule(TEST_MODULE)).toEqual(STATUS_CODE.OK);
    });

    it('update module (duplicate case)', async () => {
        parser.updateDatabase.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        expect(await moduleAPI.updateModule(TEST_MODULE)).toEqual(STATUS_CODE.CONFLICT);
    });

    it('delete module (pass case)', async () => {
        parser.updateDatabase.mockResolvedValueOnce();
        expect(await moduleAPI.deleteModule(TEST_MODULE.module_id)).toEqual(STATUS_CODE.OK);
    });

    it('delete module (duplicate case)', async () => {
        parser.updateDatabase.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        expect(await moduleAPI.deleteModule(TEST_MODULE.module_id)).toEqual(STATUS_CODE.CONFLICT);
    });

    it('get module variable (completion percent case)', async () => {
        parser.parseDatabase.mockResolvedValueOnce([{ completion_percent: 25 }]);
        expect(await moduleAPI.getModuleVariable(TEST_MODULE.module_id, "completion_percent")).toEqual([{ completion_percent: 25 }]);
    });
});
