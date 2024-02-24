export { };

import ModuleAPI from "../../../controller/api/moduleApi";
import ModuleParser from "../../../parser/moduleParser";
import { StatusCode } from "../../../types";
import { FAKE_ERRORS } from "./universal/fakeErrors";
jest.mock("../../../parser/moduleParser");

const TEST_DATA = {
    module_id: 9,
    module_name: "School",
    description: "For school :3",
    completion_percent: 0,
    account_id: 12,
    coach_id: 10
}

describe('module processor unit tests', () => {
    let moduleAPI: ModuleAPI;
    let parser: any;

    beforeEach(() => {
        parser = new ModuleParser();
        moduleAPI = new ModuleAPI();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('get module (correct case)', async () => {
        parser.parseModules.mockResolvedValueOnce([
          {module_id: TEST_DATA.module_id, module_name: TEST_DATA.module_name, description: TEST_DATA.description, 
                completion_percent: TEST_DATA.completion_percent, account_id: TEST_DATA.account_id}
        ]);
        expect(await moduleAPI.getModules(TEST_DATA.account_id)).toEqual([
            {module_id: TEST_DATA.module_id, module_name: TEST_DATA.module_name, description: TEST_DATA.description, 
                completion_percent: TEST_DATA.completion_percent, account_id: TEST_DATA.account_id}
        ]);
    });

    it('get module with coach (correct case)', async () => {
        parser.parseModules.mockResolvedValueOnce([
            {
                module_id: TEST_DATA.module_id, module_name: TEST_DATA.module_name, description: TEST_DATA.description,
                completion_percent: TEST_DATA.completion_percent, account_id: TEST_DATA.account_id, coach_id: TEST_DATA.coach_id
            }
        ]);
        expect(await moduleAPI.getModules(TEST_DATA.account_id)).toEqual([
            {
                module_id: TEST_DATA.module_id, module_name: TEST_DATA.module_name, description: TEST_DATA.description,
                completion_percent: TEST_DATA.completion_percent, account_id: TEST_DATA.account_id, coach_id: TEST_DATA.coach_id
            }
        ]);
    });

    it('get module by coach (correct case)', async () => {
        parser.parseModules.mockResolvedValueOnce([
            {
                module_id: TEST_DATA.module_id, module_name: TEST_DATA.module_name, description: TEST_DATA.description,
                completion_percent: TEST_DATA.completion_percent, account_id: TEST_DATA.account_id, coach_id: TEST_DATA.coach_id
            }
        ]);
        expect(await moduleAPI.getModules(TEST_DATA.coach_id)).toEqual([
            {
                module_id: TEST_DATA.module_id, module_name: TEST_DATA.module_name, description: TEST_DATA.description,
                completion_percent: TEST_DATA.completion_percent, account_id: TEST_DATA.account_id, coach_id: TEST_DATA.coach_id
            }
        ]);
    });

    it('get module (network error case)', async () => {
        parser.parseModules.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await moduleAPI.getModules(TEST_DATA.account_id)).toEqual(StatusCode.CONNECTION_ERROR);
    });

    it('get module (fatal server error case)', async () => {
        parser.parseModules.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await moduleAPI.getModules(TEST_DATA.account_id)).toEqual(StatusCode.INTERNAL_SERVER_ERROR);
    });

    it('create module (correct case)', async () => {
        parser.storeModule.mockResolvedValueOnce({module_id: TEST_DATA.module_id});
        var actual = await moduleAPI.createModule(TEST_DATA.module_name, TEST_DATA.description, TEST_DATA.completion_percent, TEST_DATA.account_id);
        expect(actual).toEqual({module_id: TEST_DATA.module_id});
    });

    it('create module with coach (correct case)', async () => {
        parser.storeModule.mockResolvedValueOnce({ module_id: TEST_DATA.module_id });
        var actual = await moduleAPI.createModule(TEST_DATA.module_name, TEST_DATA.description, TEST_DATA.completion_percent, TEST_DATA.account_id, TEST_DATA.coach_id);
        expect(actual).toEqual({ module_id: TEST_DATA.module_id });
    });

    it('create module (primary key violation case)', async () => {
        parser.storeModule.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        var actual = await moduleAPI.createModule(TEST_DATA.module_name, TEST_DATA.description, TEST_DATA.completion_percent, TEST_DATA.account_id);
        expect(actual).toEqual(StatusCode.CONFLICT);
    });

    it('create module (network error case)', async () => {
        parser.storeModule.mockRejectedValue(FAKE_ERRORS.networkError);
        var actual = await moduleAPI.createModule(TEST_DATA.module_name, TEST_DATA.description, TEST_DATA.completion_percent, TEST_DATA.account_id);
        expect(actual).toEqual(StatusCode.CONNECTION_ERROR);
    });

    it('create module (server error case)', async () => {
        parser.storeModule.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        var actual = await moduleAPI.createModule(TEST_DATA.module_name, TEST_DATA.description, TEST_DATA.completion_percent, TEST_DATA.account_id);
        expect(actual).toEqual(StatusCode.INTERNAL_SERVER_ERROR);
    });

    it('update module (pass case)', async () => {
        parser.updateModule.mockResolvedValueOnce();
        expect(await moduleAPI.updateModule(TEST_DATA.module_id, TEST_DATA.module_name, TEST_DATA.description, TEST_DATA.completion_percent, TEST_DATA.account_id)).toEqual(StatusCode.OK);
    });

    it('update module with coach (pass case)', async () => {
        parser.updateModule.mockResolvedValueOnce();
        expect(await moduleAPI.updateModule(TEST_DATA.module_id, TEST_DATA.module_name, TEST_DATA.description, TEST_DATA.completion_percent, TEST_DATA.account_id, TEST_DATA.coach_id)).toEqual(StatusCode.OK);
    });

    it('update module (duplicate case)', async () => {
        parser.updateModule.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        expect(await moduleAPI.updateModule(TEST_DATA.module_id, TEST_DATA.module_name, TEST_DATA.description, TEST_DATA.completion_percent, TEST_DATA.account_id)).toEqual(StatusCode.CONFLICT);
    });

    it('update module (bad data case)', async () => {
        parser.updateModule.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await moduleAPI.updateModule(TEST_DATA.module_id, TEST_DATA.module_name, TEST_DATA.description, TEST_DATA.completion_percent, TEST_DATA.account_id)).toEqual(StatusCode.BAD_REQUEST);
    });

    it('update module (connection lost case)', async () => {
        parser.updateModule.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await moduleAPI.updateModule(TEST_DATA.module_id, TEST_DATA.module_name, TEST_DATA.description, TEST_DATA.completion_percent, TEST_DATA.account_id)).toEqual(StatusCode.CONNECTION_ERROR);
    });

    it('update module (fatal error case)', async () => {
        parser.updateModule.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await moduleAPI.updateModule(TEST_DATA.module_id, TEST_DATA.module_name, TEST_DATA.description, TEST_DATA.completion_percent, TEST_DATA.account_id)).toEqual(StatusCode.INTERNAL_SERVER_ERROR);
    });

    it('delete module (pass case)', async () => {
        parser.deleteModule.mockResolvedValueOnce();
        expect(await moduleAPI.deleteModule(TEST_DATA.module_id)).toEqual(StatusCode.OK);
    });

    it('delete module (duplicate case)', async () => {
        parser.deleteModule.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        expect(await moduleAPI.deleteModule(TEST_DATA.module_id)).toEqual(StatusCode.CONFLICT);
    });

    it('delete module (bad data case)', async () => {
        parser.deleteModule.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await moduleAPI.deleteModule(TEST_DATA.module_id)).toEqual(StatusCode.BAD_REQUEST);
    });

    it('delete module (connection lost case)', async () => {
        parser.deleteModule.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await moduleAPI.deleteModule(TEST_DATA.module_id)).toEqual(StatusCode.CONNECTION_ERROR);
    });

    it('delete module (fatal error case)', async () => {
        parser.deleteModule.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await moduleAPI.deleteModule(TEST_DATA.module_id)).toEqual(StatusCode.INTERNAL_SERVER_ERROR);
    });

    it('get module variable (completion percent case)', async () => {
        parser.getModuleVariable.mockResolvedValueOnce([{ completion_percent: 25 }]);
        expect(await moduleAPI.getModuleVariable(TEST_DATA.module_id, "completion_percent")).toEqual([{ completion_percent: 25 }]);
    });
});
