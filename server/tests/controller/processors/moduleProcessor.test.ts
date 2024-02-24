import * as ModuleProcessor from "../../../controller/processors/moduleProcessor";
import ModuleAPI from "../../../controller/api/moduleApi";
import { StatusCode } from "../../../types";
import { initializeErrorMap } from "../../../utils/errorMessages";
import { createMockRequest, MOCK_RESPONSE, TEST_MODULE } from "./universal/mockValues";

jest.mock("../../../controller/api/moduleApi");
const ERROR_MESSAGES = initializeErrorMap();

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
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.OK);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith([TEST_MODULE]);
    });

    it("get account modules (error case)", async () => {
        moduleApi.getModules.mockResolvedValueOnce(StatusCode.INTERNAL_SERVER_ERROR);
        const mRequest = createMockRequest({}, {id: TEST_MODULE.accountId});
        await ModuleProcessor.getAccountModules(mRequest, MOCK_RESPONSE);
        expect(moduleApi.getModules).toHaveBeenCalledTimes(1);
        expect(moduleApi.getModules).toHaveBeenCalledWith(TEST_MODULE.accountId);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.INTERNAL_SERVER_ERROR);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(StatusCode.INTERNAL_SERVER_ERROR));
    });

    it("create module (normal case)", async () => {
        moduleApi.createModule.mockResolvedValueOnce({id: TEST_MODULE.id});
        const mRequest = createMockRequest({
            name: TEST_MODULE.name,
            description: TEST_MODULE.description,
            completion_percent: TEST_MODULE.completionPercent,
            account_id: TEST_MODULE.accountId 
        });
        await ModuleProcessor.postModule(mRequest, MOCK_RESPONSE);
        expect(moduleApi.createModule).toHaveBeenCalledTimes(1);
        expect(moduleApi.createModule).toHaveBeenCalledWith({
            name: TEST_MODULE.name, 
            description: TEST_MODULE.description, 
            completion: TEST_MODULE.completionPercent, 
            accountId: TEST_MODULE.accountId,
            coachId: undefined
        });
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.OK);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith({id: TEST_MODULE.id});
    });

    it("create module (error case)", async () => {
        moduleApi.createModule.mockResolvedValueOnce(StatusCode.CONFLICT);
        const mRequest = createMockRequest({
            name: TEST_MODULE.name,
            description: TEST_MODULE.description,
            completion_percent: TEST_MODULE.completionPercent,
            account_id: TEST_MODULE.accountId 
        });
        await ModuleProcessor.postModule(mRequest, MOCK_RESPONSE);
        expect(moduleApi.createModule).toHaveBeenCalledTimes(1);
        expect(moduleApi.createModule).toHaveBeenCalledWith({
            name: TEST_MODULE.name, 
            description: TEST_MODULE.description, 
            completion: TEST_MODULE.completionPercent, 
            accountId: TEST_MODULE.accountId,
            coachId: undefined
        });
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.CONFLICT);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(StatusCode.CONFLICT));
    });

    it("update module (normal case)", async () => {
        moduleApi.updateModule.mockResolvedValueOnce(StatusCode.OK);
        const mRequest = createMockRequest({
            name: TEST_MODULE.name,
            description: TEST_MODULE.description,
            completion: TEST_MODULE.completionPercent,
            coach_id: TEST_MODULE.coachId
        }, {id: TEST_MODULE.id});
        await ModuleProcessor.putModule(mRequest, MOCK_RESPONSE);
        expect(moduleApi.updateModule).toHaveBeenCalledTimes(1);
        expect(moduleApi.updateModule).toHaveBeenCalledWith({
            id: TEST_MODULE.id, 
            name: TEST_MODULE.name, 
            description: TEST_MODULE.description, 
            completion: TEST_MODULE.completionPercent, 
            coachId: TEST_MODULE.coachId
        });
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(StatusCode.OK);
    });

    it("update module (error case)", async () => {
        moduleApi.updateModule.mockResolvedValueOnce(StatusCode.BAD_REQUEST);
        const mRequest = createMockRequest({
            name: TEST_MODULE.name,
            description: TEST_MODULE.description,
            completion: TEST_MODULE.completionPercent,
            coach_id: TEST_MODULE.coachId
        }, {id: TEST_MODULE.id});
        await ModuleProcessor.putModule(mRequest, MOCK_RESPONSE);
        expect(moduleApi.updateModule).toHaveBeenCalledTimes(1);
        expect(moduleApi.updateModule).toHaveBeenCalledWith({
            id: TEST_MODULE.id, 
            name: TEST_MODULE.name, 
            description: TEST_MODULE.description, 
            completion: TEST_MODULE.completionPercent, 
            coachId: TEST_MODULE.coachId
        });
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.BAD_REQUEST);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(StatusCode.BAD_REQUEST));
    });

    it("delete module (normal case)", async () => {
        moduleApi.deleteModule.mockResolvedValueOnce(StatusCode.OK);
        const mRequest = createMockRequest({}, {id: TEST_MODULE.id});
        await ModuleProcessor.deleteModule(mRequest, MOCK_RESPONSE);
        expect(moduleApi.deleteModule).toHaveBeenCalledTimes(1);
        expect(moduleApi.deleteModule).toHaveBeenCalledWith(TEST_MODULE.id);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(StatusCode.OK);
    });

    it("delete module (error case)", async () => {
        moduleApi.deleteModule.mockResolvedValueOnce(StatusCode.FORBIDDEN);
        const mRequest = createMockRequest({}, {id: TEST_MODULE.id});
        await ModuleProcessor.deleteModule(mRequest, MOCK_RESPONSE);
        expect(moduleApi.deleteModule).toHaveBeenCalledTimes(1);
        expect(moduleApi.deleteModule).toHaveBeenCalledWith(TEST_MODULE.id);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.FORBIDDEN);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(StatusCode.FORBIDDEN));
    });

    it("get module variable (normal case)", async () => {
        moduleApi.getModuleVariable.mockResolvedValueOnce({completion_percent: TEST_MODULE.completionPercent});
        const mRequest = createMockRequest({}, {id: TEST_MODULE.id, variable: "completion_percent"});
        await ModuleProcessor.getModuleVariable(mRequest, MOCK_RESPONSE);
        expect(moduleApi.getModuleVariable).toHaveBeenCalledTimes(1);
        expect(moduleApi.getModuleVariable).toHaveBeenCalledWith(TEST_MODULE.id, "completion_percent");
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.OK);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith({completion_percent: TEST_MODULE.completionPercent});
    });

    it("get module variable (error case)", async () => {
        moduleApi.getModuleVariable.mockResolvedValueOnce(StatusCode.UNAUTHORIZED);
        const mRequest = createMockRequest({}, {id: TEST_MODULE.id, variable: "completion_percent"});
        await ModuleProcessor.getModuleVariable(mRequest, MOCK_RESPONSE);
        expect(moduleApi.getModuleVariable).toHaveBeenCalledTimes(1);
        expect(moduleApi.getModuleVariable).toHaveBeenCalledWith(TEST_MODULE.id, "completion_percent");
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.UNAUTHORIZED);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(StatusCode.UNAUTHORIZED));
    });
});
