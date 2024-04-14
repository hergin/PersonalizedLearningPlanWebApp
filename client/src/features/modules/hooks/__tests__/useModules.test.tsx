import React, { PropsWithChildren } from "react";
import { useModules, useModuleCreator, useModuleUpdater, useModuleRemover } from "../useModules";
import { ModuleApi } from "../../api/module-api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, cleanup, waitFor } from "@testing-library/react";
import { Module } from "../../../../types";

const mockInvalidateQueries = jest.fn();
jest.mock("@tanstack/react-query", () => ({
    ...jest.requireActual("@tanstack/react-query"),
    __esModule: true,
    useQueryClient: () => ({
        invalidateQueries: mockInvalidateQueries
    })
}));

jest.mock("../../api/module-api");

const mockUserId = 0;
const mockModule: Module = {
    id: 1,
    name: "Test Module",
    description: "This module is used for testing.",
    completion: 100,
};

describe("Use Modules Unit Tests", () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }: PropsWithChildren) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    var mockApi: any;

    beforeEach(() => {
        mockApi = ModuleApi();
    });
    
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it("Use Modules", async () => {
        const mockFetchModules = mockApi.fetchModules as jest.Mock;
        mockFetchModules.mockResolvedValueOnce([mockModule]);
        const { result } = renderHook(() => useModules(mockUserId), { wrapper });
        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(mockInvalidateQueries).toHaveBeenCalledTimes(0);
        expect(mockFetchModules).toHaveBeenCalledTimes(1);
        expect(mockFetchModules).toHaveBeenCalledWith(mockUserId);
        expect(result.current.data).toEqual([mockModule]);
    });

    it("Use Module Creator", async () => {
        const mockCreateModule = mockApi.createModule as jest.Mock;
        mockCreateModule.mockResolvedValueOnce({});
        const { mutateAsync } = renderHook(() => useModuleCreator(), { wrapper }).result.current;
        await mutateAsync({module_name: mockModule.name, description: mockModule.description, account_id: mockUserId});
        expect(mockCreateModule).toHaveBeenCalledTimes(1);
        expect(mockCreateModule).toHaveBeenCalledWith({module_name: mockModule.name, description: mockModule.description, account_id: mockUserId});
        expect(mockInvalidateQueries).toHaveBeenCalledTimes(1);
        expect(mockInvalidateQueries).toHaveBeenCalledWith({queryKey: ["modules"]});
    });

    it("Use Module Editor", async () => {
        const mockUpdateModule = mockApi.updateModule as jest.Mock;
        mockUpdateModule.mockResolvedValueOnce({});
        const { mutateAsync } = renderHook(() => useModuleUpdater(), { wrapper }).result.current;
        await mutateAsync(mockModule);
        expect(mockUpdateModule).toHaveBeenCalledTimes(1);
        expect(mockUpdateModule).toHaveBeenCalledWith(mockModule);
        expect(mockInvalidateQueries).toHaveBeenCalledTimes(1);
        expect(mockInvalidateQueries).toHaveBeenCalledWith({queryKey: ["modules"]});
    });

    it("Use Module Remover", async () => {
        const mockDeleteModule = mockApi.deleteModule as jest.Mock;
        mockDeleteModule.mockResolvedValueOnce({});
        const { mutateAsync } = renderHook(() => useModuleRemover(), { wrapper }).result.current;
        await mutateAsync(mockModule.id);
        expect(mockDeleteModule).toHaveBeenCalledTimes(1);
        expect(mockDeleteModule).toHaveBeenCalledWith(mockModule.id);
        expect(mockInvalidateQueries).toHaveBeenCalledTimes(1);
        expect(mockInvalidateQueries).toHaveBeenCalledWith({queryKey: ["modules"]});
    });
});
