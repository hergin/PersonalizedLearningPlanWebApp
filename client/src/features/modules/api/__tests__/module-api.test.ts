import { ModuleApi } from "../module-api";
import { useApiConnection } from "../../../../hooks/useApiConnection";
import { throwServerError } from "../../../../utils/errorHandlers";
import { CreateModuleProps, Module } from "../../../../types";

jest.mock("../../../../hooks/useApiConnection");
jest.mock("../../../../utils/errorHandlers");

const mockAccountId = 0;
const mockModule: Module = {
    id: 1,
    name: "Test Module",
    description: "This module is used for testing.",
    completion: 100,
};
const mockCreatedModule: CreateModuleProps = {
    module_name: mockModule.name, 
    description: mockModule.description, 
    account_id: mockAccountId
};
const mockError = {message: "I am error."};

describe("Module Api Unit Tests", () => {
    var mockConnection: any;
    var mockServerError: jest.Mock;

    beforeEach(() => {
        mockConnection = useApiConnection();
        mockServerError = throwServerError as jest.Mock;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Fetch Modules (correct case)", async () => {
        const mockGet = mockConnection.get as jest.Mock;
        mockGet.mockResolvedValueOnce([mockModule]);
        const { fetchModules } = ModuleApi();
        const result = await fetchModules(mockAccountId);
        expect(mockServerError).toHaveBeenCalledTimes(0);
        expect(mockGet).toHaveBeenCalledTimes(1);
        expect(mockGet).toHaveBeenCalledWith(`/module/get/${mockAccountId}`);
        expect(result).toEqual([mockModule]);
    });

    it("Fetch Modules (error case)", async () => {
        const mockGet = mockConnection.get as jest.Mock;
        mockGet.mockRejectedValue(mockError);
        const { fetchModules } = ModuleApi();
        const result = await fetchModules(mockAccountId);
        expect(mockGet).toHaveBeenCalledTimes(1);
        expect(mockGet).toHaveBeenCalledWith(`/module/get/${mockAccountId}`);
        expect(mockServerError).toHaveBeenCalledTimes(1);
        expect(mockServerError).toHaveBeenCalledWith(mockError);
        expect(result).toBeUndefined();
    });

    it("Create Module (normal case)", async () => {
        const mockPost = mockConnection.post as jest.Mock;
        mockPost.mockResolvedValueOnce({});
        const { createModule } = ModuleApi();
        await createModule(mockCreatedModule);
        expect(mockServerError).toHaveBeenCalledTimes(0);
        expect(mockPost).toHaveBeenCalledTimes(1);
        expect(mockPost).toHaveBeenCalledWith("/module/add", {
            name: mockCreatedModule.module_name,
            description: mockCreatedModule.description,
            accountId: mockCreatedModule.account_id, 
            completionPercent: 0,
        });
    });

    it("Create Module (error case)", async () => {
        const mockPost = mockConnection.post as jest.Mock;
        mockPost.mockRejectedValueOnce(mockError);
        const { createModule } = ModuleApi();
        await createModule(mockCreatedModule);
        expect(mockPost).toHaveBeenCalledTimes(1);
        expect(mockPost).toHaveBeenCalledWith("/module/add", {
            name: mockCreatedModule.module_name,
            description: mockCreatedModule.description,
            accountId: mockCreatedModule.account_id, 
            completionPercent: 0,
        });
        expect(mockServerError).toHaveBeenCalledTimes(1);
        expect(mockServerError).toHaveBeenCalledWith(mockError);
    });

    it("Update Module (normal case)", async () => {
        const mockPut = mockConnection.put as jest.Mock;
        mockPut.mockResolvedValueOnce({});
        const { updateModule } = ModuleApi();
        await updateModule(mockModule);
        expect(mockServerError).toHaveBeenCalledTimes(0);
        expect(mockPut).toHaveBeenCalledTimes(1);
        expect(mockPut).toHaveBeenCalledWith(`/module/edit/${mockModule.id}`, {
            name: mockModule.name,
            description: mockModule.description,
            completion: mockModule.completion,
        });
    });

    it("Update Module (error case)", async () => {
        const mockPut = mockConnection.put as jest.Mock;
        mockPut.mockRejectedValueOnce(mockError);
        const { updateModule } = ModuleApi();
        await updateModule(mockModule);
        expect(mockPut).toHaveBeenCalledTimes(1);
        expect(mockPut).toHaveBeenCalledWith(`/module/edit/${mockModule.id}`, {
            name: mockModule.name,
            description: mockModule.description,
            completion: mockModule.completion,
        });
        expect(mockServerError).toHaveBeenCalledTimes(1);
        expect(mockServerError).toHaveBeenCalledWith(mockError);
    });

    it("Delete Module (normal case)", async () => {
        const mockDel = mockConnection.del as jest.Mock;
        mockDel.mockResolvedValueOnce({});
        const { deleteModule } = ModuleApi();
        await deleteModule(mockModule.id);
        expect(mockServerError).toHaveBeenCalledTimes(0);
        expect(mockDel).toHaveBeenCalledTimes(1);
        expect(mockDel).toHaveBeenCalledWith(`/module/delete/${mockModule.id}`);
    });

    it("Delete Module (error case)", async () => {
        const mockDel = mockConnection.del as jest.Mock;
        mockDel.mockRejectedValueOnce(mockError);
        const { deleteModule } = ModuleApi();
        await deleteModule(mockModule.id);
        expect(mockDel).toHaveBeenCalledTimes(1);
        expect(mockDel).toHaveBeenCalledWith(`/module/delete/${mockModule.id}`);
        expect(mockServerError).toHaveBeenCalledTimes(1);
        expect(mockServerError).toHaveBeenCalledWith(mockError);
    });
});
