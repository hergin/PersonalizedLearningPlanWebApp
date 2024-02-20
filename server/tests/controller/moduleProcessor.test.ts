export { };

import { ModuleAPI } from "../../controller/moduleProcessor";
import ModuleParser from "../../parser/moduleParser";
import { STATUS_CODES } from "../../utils/statusCodes";
import { FAKE_ERRORS } from "./fakeErrors";
jest.mock("../../parser/moduleParser");

const TEST_DATA = {
    module_id: 9,
    module_name: "School",
    description: "For school :3",
    completion_percent: 0,
    email: "example@gmail.com",
    coach_id: null
}

const TEST_DATA2 = {
    module_id: 9,
    module_name: "School",
    description: "For school :3",
    completion_percent: 0,
    email: "example@gmail.com",
    coach_id: "coach@yahoo.com"
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
            {
                module_id: TEST_DATA.module_id, module_name: TEST_DATA.module_name, description: TEST_DATA.description,
                completion_percent: TEST_DATA.completion_percent, email: TEST_DATA.email
            }
        ]);
        expect(await moduleAPI.getModules(TEST_DATA.email)).toEqual([
            {
                module_id: TEST_DATA.module_id, module_name: TEST_DATA.module_name, description: TEST_DATA.description,
                completion_percent: TEST_DATA.completion_percent, email: TEST_DATA.email
            }
        ]);
    });

    it('get module with coach (correct case)', async () => {
        parser.parseModules.mockResolvedValueOnce([
            {
                module_id: TEST_DATA2.module_id, module_name: TEST_DATA2.module_name, description: TEST_DATA2.description,
                completion_percent: TEST_DATA2.completion_percent, email: TEST_DATA2.email, coach_id: TEST_DATA2.coach_id
            }
        ]);
        expect(await moduleAPI.getModules(TEST_DATA2.email)).toEqual([
            {
                module_id: TEST_DATA2.module_id, module_name: TEST_DATA2.module_name, description: TEST_DATA2.description,
                completion_percent: TEST_DATA2.completion_percent, email: TEST_DATA2.email, coach_id: TEST_DATA2.coach_id
            }
        ]);
    });

    it('get module by coach (correct case)', async () => {
        parser.parseModules.mockResolvedValueOnce([
            {
                module_id: TEST_DATA2.module_id, module_name: TEST_DATA2.module_name, description: TEST_DATA2.description,
                completion_percent: TEST_DATA2.completion_percent, email: TEST_DATA2.email, coach_id: TEST_DATA2.coach_id
            }
        ]);
        expect(await moduleAPI.getModules(TEST_DATA2.coach_id)).toEqual([
            {
                module_id: TEST_DATA2.module_id, module_name: TEST_DATA2.module_name, description: TEST_DATA2.description,
                completion_percent: TEST_DATA2.completion_percent, email: TEST_DATA2.email, coach_id: TEST_DATA2.coach_id
            }
        ]);
    });

    it('get module (network error case)', async () => {
        parser.parseModules.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await moduleAPI.getModules(TEST_DATA.email)).toEqual(STATUS_CODES.CONNECTION_ERROR);
    });

    it('get module (fatal server error case)', async () => {
        parser.parseModules.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await moduleAPI.getModules(TEST_DATA.email)).toEqual(STATUS_CODES.INTERNAL_SERVER_ERROR);
    });

    it('create module (correct case)', async () => {
        parser.storeModule.mockResolvedValueOnce({ module_id: TEST_DATA.module_id });
        var actual = await moduleAPI.createModule(TEST_DATA.module_name, TEST_DATA.description, TEST_DATA.completion_percent, TEST_DATA.email);
        expect(actual).toEqual({ module_id: TEST_DATA.module_id });
    });

    it('create module with coach (correct case)', async () => {
        parser.storeModule.mockResolvedValueOnce({ module_id: TEST_DATA2.module_id });
        var actual = await moduleAPI.createModule(TEST_DATA2.module_name, TEST_DATA2.description, TEST_DATA2.completion_percent, TEST_DATA2.email, TEST_DATA2.coach_id);
        expect(actual).toEqual({ module_id: TEST_DATA2.module_id });
    });

    it('create module (primary key violation case)', async () => {
        parser.storeModule.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        var actual = await moduleAPI.createModule(TEST_DATA.module_name, TEST_DATA.description, TEST_DATA.completion_percent, TEST_DATA.email);
        expect(actual).toEqual(STATUS_CODES.CONFLICT);
    });

    it('create module (network error case)', async () => {
        parser.storeModule.mockRejectedValue(FAKE_ERRORS.networkError);
        var actual = await moduleAPI.createModule(TEST_DATA.module_name, TEST_DATA.description, TEST_DATA.completion_percent, TEST_DATA.email);
        expect(actual).toEqual(STATUS_CODES.CONNECTION_ERROR);
    });

    it('create module (server error case)', async () => {
        parser.storeModule.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        var actual = await moduleAPI.createModule(TEST_DATA.module_name, TEST_DATA.description, TEST_DATA.completion_percent, TEST_DATA.email);
        expect(actual).toEqual(STATUS_CODES.INTERNAL_SERVER_ERROR);
    });

    it('update module (pass case)', async () => {
        parser.updateModule.mockResolvedValueOnce();
        expect(await moduleAPI.updateModule(TEST_DATA.module_id, TEST_DATA.module_name, TEST_DATA.description, TEST_DATA.completion_percent, TEST_DATA.email)).toEqual(STATUS_CODES.OK);
    });

    it('update module with coach (pass case)', async () => {
        parser.updateModule.mockResolvedValueOnce();
        expect(await moduleAPI.updateModule(TEST_DATA2.module_id, TEST_DATA2.module_name, TEST_DATA2.description, TEST_DATA2.completion_percent, TEST_DATA2.email, TEST_DATA2.coach_id)).toEqual(STATUS_CODES.OK);
    });

    it('update module (duplicate case)', async () => {
        parser.updateModule.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        expect(await moduleAPI.updateModule(TEST_DATA.module_id, TEST_DATA.module_name, TEST_DATA.description, TEST_DATA.completion_percent, TEST_DATA.email)).toEqual(STATUS_CODES.CONFLICT);
    });

    it('update module (bad data case)', async () => {
        parser.updateModule.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await moduleAPI.updateModule(TEST_DATA.module_id, TEST_DATA.module_name, TEST_DATA.description, TEST_DATA.completion_percent, TEST_DATA.email)).toEqual(STATUS_CODES.BAD_REQUEST);
    });

    it('update module (connection lost case)', async () => {
        parser.updateModule.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await moduleAPI.updateModule(TEST_DATA.module_id, TEST_DATA.module_name, TEST_DATA.description, TEST_DATA.completion_percent, TEST_DATA.email)).toEqual(STATUS_CODES.CONNECTION_ERROR);
    });

    it('update module (fatal error case)', async () => {
        parser.updateModule.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await moduleAPI.updateModule(TEST_DATA.module_id, TEST_DATA.module_name, TEST_DATA.description, TEST_DATA.completion_percent, TEST_DATA.email)).toEqual(STATUS_CODES.INTERNAL_SERVER_ERROR);
    });

    it('delete module (pass case)', async () => {
        parser.deleteModule.mockResolvedValueOnce();
        expect(await moduleAPI.deleteModule(TEST_DATA.module_id)).toEqual(STATUS_CODES.OK);
    });

    it('delete module (duplicate case)', async () => {
        parser.deleteModule.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        expect(await moduleAPI.deleteModule(TEST_DATA.module_id)).toEqual(STATUS_CODES.CONFLICT);
    });

    it('delete module (bad data case)', async () => {
        parser.deleteModule.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await moduleAPI.deleteModule(TEST_DATA.module_id)).toEqual(STATUS_CODES.BAD_REQUEST);
    });

    it('delete module (connection lost case)', async () => {
        parser.deleteModule.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await moduleAPI.deleteModule(TEST_DATA.module_id)).toEqual(STATUS_CODES.CONNECTION_ERROR);
    });

    it('delete module (fatal error case)', async () => {
        parser.deleteModule.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await moduleAPI.deleteModule(TEST_DATA.module_id)).toEqual(STATUS_CODES.INTERNAL_SERVER_ERROR);
    });

    it('get module variable (completion percent case)', async () => {
        parser.getModuleVariable.mockResolvedValueOnce([{ completion_percent: 25 }]);
        expect(await moduleAPI.getModuleVariable(TEST_DATA.module_id, "completion_percent")).toEqual([{ completion_percent: 25 }]);
    });
});
