import * as ModuleProcessor from "../moduleProcessor";
import ModuleApi from "../../api/moduleApi";
import { STATUS_CODE } from "../../../types";
import { getLoginError } from "../../../utils/errorHandlers";
import { createMockRequest, MOCK_RESPONSE, TEST_MODULE } from "../../global/mockValues";

jest.mock("../../../controller/api/moduleApi");

describe("Module Processor unit tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("get account modules (normal case)", async () => {
        const mockGetModules = new ModuleApi().getModules as jest.Mock;
        mockGetModules.mockResolvedValueOnce([TEST_MODULE]);
        const mRequest = createMockRequest({}, {id: TEST_MODULE.accountId});
        await ModuleProcessor.getAccountModules(mRequest, MOCK_RESPONSE);
        expect(mockGetModules).toHaveBeenCalledTimes(1);
        expect(mockGetModules).toHaveBeenCalledWith(TEST_MODULE.accountId);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.OK);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith([TEST_MODULE]);
    });

    it("get account modules (error case)", async () => {
        const mockGetModules = new ModuleApi().getModules as jest.Mock;
        mockGetModules.mockResolvedValueOnce(STATUS_CODE.INTERNAL_SERVER_ERROR);
        const mRequest = createMockRequest({}, {id: TEST_MODULE.accountId});
        await ModuleProcessor.getAccountModules(mRequest, MOCK_RESPONSE);
        expect(mockGetModules).toHaveBeenCalledTimes(1);
        expect(mockGetModules).toHaveBeenCalledWith(TEST_MODULE.accountId);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.INTERNAL_SERVER_ERROR);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.INTERNAL_SERVER_ERROR));
    });

    it("create module (normal case)", async () => {
        const mockCreateModule = new ModuleApi().createModule as jest.Mock;
        mockCreateModule.mockResolvedValueOnce(STATUS_CODE.OK);
        const mRequest = createMockRequest({
            name: TEST_MODULE.name,
            description: TEST_MODULE.description,
            completionPercent: TEST_MODULE.completion,
            accountId: TEST_MODULE.accountId
        });
        await ModuleProcessor.postModule(mRequest, MOCK_RESPONSE);
        expect(mockCreateModule).toHaveBeenCalledTimes(1);
        expect(mockCreateModule).toHaveBeenCalledWith({
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
        const mockCreateModule = new ModuleApi().createModule as jest.Mock;
        mockCreateModule.mockResolvedValueOnce(STATUS_CODE.CONFLICT);
        const mRequest = createMockRequest({
            name: TEST_MODULE.name,
            description: TEST_MODULE.description,
            completionPercent: TEST_MODULE.completion,
            accountId: TEST_MODULE.accountId
        });
        await ModuleProcessor.postModule(mRequest, MOCK_RESPONSE);
        expect(mockCreateModule).toHaveBeenCalledTimes(1);
        expect(mockCreateModule).toHaveBeenCalledWith({
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
        const mockUpdateModule = new ModuleApi().updateModule as jest.Mock;
        mockUpdateModule.mockResolvedValueOnce(STATUS_CODE.OK);
        const mRequest = createMockRequest({
            name: TEST_MODULE.name,
            description: TEST_MODULE.description,
            completion: TEST_MODULE.completion,
            userId: TEST_MODULE.accountId
        }, {id: TEST_MODULE.module_id});
        await ModuleProcessor.putModule(mRequest, MOCK_RESPONSE);
        expect(mockUpdateModule).toHaveBeenCalledTimes(1);
        expect(mockUpdateModule).toHaveBeenCalledWith({
            module_id: TEST_MODULE.module_id,
            name: TEST_MODULE.name,
            description: TEST_MODULE.description,
            completion: TEST_MODULE.completion,
            accountId: TEST_MODULE.accountId
        });
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(STATUS_CODE.OK);
    });

    it("update module (error case)", async () => {
        const mockUpdateModule = new ModuleApi().updateModule as jest.Mock;
        mockUpdateModule.mockResolvedValueOnce(STATUS_CODE.BAD_REQUEST);
        const mRequest = createMockRequest({
            name: TEST_MODULE.name,
            description: TEST_MODULE.description,
            completion: TEST_MODULE.completion,
            userId: TEST_MODULE.accountId
        }, {id: TEST_MODULE.module_id});
        await ModuleProcessor.putModule(mRequest, MOCK_RESPONSE);
        expect(mockUpdateModule).toHaveBeenCalledTimes(1);
        expect(mockUpdateModule).toHaveBeenCalledWith({
            module_id: TEST_MODULE.module_id,
            name: TEST_MODULE.name,
            description: TEST_MODULE.description,
            completion: TEST_MODULE.completion,
            accountId: TEST_MODULE.accountId
        });
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.BAD_REQUEST));
    });

    it("delete module (normal case)", async () => {
        const mockDeleteModule = new ModuleApi().deleteModule as jest.Mock;
        mockDeleteModule.mockResolvedValueOnce(STATUS_CODE.OK);
        const mRequest = createMockRequest({}, {id: TEST_MODULE.module_id});
        await ModuleProcessor.deleteModule(mRequest, MOCK_RESPONSE);
        expect(mockDeleteModule).toHaveBeenCalledTimes(1);
        expect(mockDeleteModule).toHaveBeenCalledWith(TEST_MODULE.module_id);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(STATUS_CODE.OK);
    });

    it("delete module (error case)", async () => {
        const mockDeleteModule = new ModuleApi().deleteModule as jest.Mock;
        mockDeleteModule.mockResolvedValueOnce(STATUS_CODE.FORBIDDEN);
        const mRequest = createMockRequest({}, {id: TEST_MODULE.module_id});
        await ModuleProcessor.deleteModule(mRequest, MOCK_RESPONSE);
        expect(mockDeleteModule).toHaveBeenCalledTimes(1);
        expect(mockDeleteModule).toHaveBeenCalledWith(TEST_MODULE.module_id);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.FORBIDDEN);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.FORBIDDEN));
    });

    it("get module variable (normal case)", async () => {
        const mockGetModuleVariable = new ModuleApi().getModuleVariable as jest.Mock;
        mockGetModuleVariable.mockResolvedValueOnce({completion_percent: TEST_MODULE.completion});
        const mRequest = createMockRequest({}, {id: TEST_MODULE.module_id, variable: "completion_percent"});
        await ModuleProcessor.getModuleVariable(mRequest, MOCK_RESPONSE);
        expect(mockGetModuleVariable).toHaveBeenCalledTimes(1);
        expect(mockGetModuleVariable).toHaveBeenCalledWith(TEST_MODULE.module_id, "completion_percent");
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.OK);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith({completion_percent: TEST_MODULE.completion});
    });

    it("get module variable (error case)", async () => {
        const mockGetModuleVariable = new ModuleApi().getModuleVariable as jest.Mock;
        mockGetModuleVariable.mockResolvedValueOnce(STATUS_CODE.UNAUTHORIZED);
        const mRequest = createMockRequest({}, {id: TEST_MODULE.module_id, variable: "completion_percent"});
        await ModuleProcessor.getModuleVariable(mRequest, MOCK_RESPONSE);
        expect(mockGetModuleVariable).toHaveBeenCalledTimes(1);
        expect(mockGetModuleVariable).toHaveBeenCalledWith(TEST_MODULE.module_id, "completion_percent");
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.UNAUTHORIZED);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.UNAUTHORIZED));
    });
});
