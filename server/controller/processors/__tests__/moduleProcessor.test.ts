import * as ModuleProcessor from "../moduleProcessor";
import ModuleAPI from "../../api/moduleApi";
import { STATUS_CODE } from "../../../types";
import { getLoginError } from "../../../utils/errorHandlers";
import { createMockRequest, MOCK_RESPONSE, TEST_MODULE } from "../../global/mockValues";

jest.mock("../../../controller/api/moduleApi");

describe("Module Processor unit tests", () => {
    const moduleApi: any = new ModuleAPI();

    afterEach(() => {
        jest.clearAllMocks();
    });
    
    it("get account modules (normal case)", async () => {
        moduleApi.getModules.mockResolvedValueOnce([TEST_MODULE]);
        const mRequest = createMockRequest({}, {id: TEST_MODULE.accountId});
        await ModuleProcessor.getAccountModules(mRequest, MOCK_RESPONSE);
        expect(moduleApi.getModules).toHaveBeenCalledTimes(1);
        expect(moduleApi.getModules).toHaveBeenCalledWith(TEST_MODULE.accountId);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.OK);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith([TEST_MODULE]);
    });

    it("get account modules (error case)", async () => {
        moduleApi.getModules.mockResolvedValueOnce(STATUS_CODE.INTERNAL_SERVER_ERROR);
        const mRequest = createMockRequest({}, {id: TEST_MODULE.accountId});
        await ModuleProcessor.getAccountModules(mRequest, MOCK_RESPONSE);
        expect(moduleApi.getModules).toHaveBeenCalledTimes(1);
        expect(moduleApi.getModules).toHaveBeenCalledWith(TEST_MODULE.accountId);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.INTERNAL_SERVER_ERROR);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.INTERNAL_SERVER_ERROR));
    });

    it("create module (normal case)", async () => {
        moduleApi.createModule.mockResolvedValueOnce(STATUS_CODE.OK);
        const mRequest = createMockRequest({
            name: TEST_MODULE.name,
            description: TEST_MODULE.description,
            completionPercent: TEST_MODULE.completion,
            accountId: TEST_MODULE.accountId 
        });
        await ModuleProcessor.postModule(mRequest, MOCK_RESPONSE);
        expect(moduleApi.createModule).toHaveBeenCalledTimes(1);
        expect(moduleApi.createModule).toHaveBeenCalledWith({
            name: TEST_MODULE.name, 
            description: TEST_MODULE.description, 
            completion: TEST_MODULE.completion, 
            accountId: TEST_MODULE.accountId,
            coachId: undefined
        });
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(STATUS_CODE.OK);
    });

    it("create module (error case)", async () => {
        moduleApi.createModule.mockResolvedValueOnce(STATUS_CODE.CONFLICT);
        const mRequest = createMockRequest({
            name: TEST_MODULE.name,
            description: TEST_MODULE.description,
            completionPercent: TEST_MODULE.completion,
            accountId: TEST_MODULE.accountId 
        });
        await ModuleProcessor.postModule(mRequest, MOCK_RESPONSE);
        expect(moduleApi.createModule).toHaveBeenCalledTimes(1);
        expect(moduleApi.createModule).toHaveBeenCalledWith({
            name: TEST_MODULE.name, 
            description: TEST_MODULE.description, 
            completion: TEST_MODULE.completion, 
            accountId: TEST_MODULE.accountId,
            coachId: undefined
        });
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.CONFLICT);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.CONFLICT));
    });

    it("update module (normal case)", async () => {
        moduleApi.updateModule.mockResolvedValueOnce(STATUS_CODE.OK);
        const mRequest = createMockRequest({
            name: TEST_MODULE.name,
            description: TEST_MODULE.description,
            completion: TEST_MODULE.completion
        }, {id: TEST_MODULE.id});
        await ModuleProcessor.putModule(mRequest, MOCK_RESPONSE);
        expect(moduleApi.updateModule).toHaveBeenCalledTimes(1);
        expect(moduleApi.updateModule).toHaveBeenCalledWith({
            id: TEST_MODULE.id, 
            name: TEST_MODULE.name, 
            description: TEST_MODULE.description, 
            completion: TEST_MODULE.completion
        });
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(STATUS_CODE.OK);
    });

    it("update module (error case)", async () => {
        moduleApi.updateModule.mockResolvedValueOnce(STATUS_CODE.BAD_REQUEST);
        const mRequest = createMockRequest({
            name: TEST_MODULE.name,
            description: TEST_MODULE.description,
            completion: TEST_MODULE.completion
        }, {id: TEST_MODULE.id});
        await ModuleProcessor.putModule(mRequest, MOCK_RESPONSE);
        expect(moduleApi.updateModule).toHaveBeenCalledTimes(1);
        expect(moduleApi.updateModule).toHaveBeenCalledWith({
            id: TEST_MODULE.id, 
            name: TEST_MODULE.name, 
            description: TEST_MODULE.description, 
            completion: TEST_MODULE.completion
        });
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.BAD_REQUEST));
    });

    it("delete module (normal case)", async () => {
        moduleApi.deleteModule.mockResolvedValueOnce(STATUS_CODE.OK);
        const mRequest = createMockRequest({}, {id: TEST_MODULE.id});
        await ModuleProcessor.deleteModule(mRequest, MOCK_RESPONSE);
        expect(moduleApi.deleteModule).toHaveBeenCalledTimes(1);
        expect(moduleApi.deleteModule).toHaveBeenCalledWith(TEST_MODULE.id);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(STATUS_CODE.OK);
    });

    it("delete module (error case)", async () => {
        moduleApi.deleteModule.mockResolvedValueOnce(STATUS_CODE.FORBIDDEN);
        const mRequest = createMockRequest({}, {id: TEST_MODULE.id});
        await ModuleProcessor.deleteModule(mRequest, MOCK_RESPONSE);
        expect(moduleApi.deleteModule).toHaveBeenCalledTimes(1);
        expect(moduleApi.deleteModule).toHaveBeenCalledWith(TEST_MODULE.id);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.FORBIDDEN);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.FORBIDDEN));
    });

    it("get module variable (normal case)", async () => {
        moduleApi.getModuleVariable.mockResolvedValueOnce({completion_percent: TEST_MODULE.completion});
        const mRequest = createMockRequest({}, {id: TEST_MODULE.id, variable: "completion_percent"});
        await ModuleProcessor.getModuleVariable(mRequest, MOCK_RESPONSE);
        expect(moduleApi.getModuleVariable).toHaveBeenCalledTimes(1);
        expect(moduleApi.getModuleVariable).toHaveBeenCalledWith(TEST_MODULE.id, "completion_percent");
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.OK);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith({completion_percent: TEST_MODULE.completion});
    });

    it("get module variable (error case)", async () => {
        moduleApi.getModuleVariable.mockResolvedValueOnce(STATUS_CODE.UNAUTHORIZED);
        const mRequest = createMockRequest({}, {id: TEST_MODULE.id, variable: "completion_percent"});
        await ModuleProcessor.getModuleVariable(mRequest, MOCK_RESPONSE);
        expect(moduleApi.getModuleVariable).toHaveBeenCalledTimes(1);
        expect(moduleApi.getModuleVariable).toHaveBeenCalledWith(TEST_MODULE.id, "completion_percent");
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.UNAUTHORIZED);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.UNAUTHORIZED));
    });
});
