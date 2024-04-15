import React, { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor, cleanup } from "@testing-library/react";
import { useAccountData, useRoleUpdater } from "../useAdminFeatures";
import AdminApi from "../../api/admin-api";
import { Role, User } from "../../types";

const mockInvalidateQueries = jest.fn();
jest.mock("@tanstack/react-query", () => ({
    ...jest.requireActual("@tanstack/react-query"),
    __esModule: true,
    useQueryClient: () => ({
        invalidateQueries: mockInvalidateQueries
    })
}));

jest.mock("../../api/admin-api");

const mockAccountId = 1;
const mockUser: User = {
    id: mockAccountId,
    role: "admin",
    accessToken: "access token",
    refreshToken: "refresh token",
};

describe("Use Admin Features Unit Tests", () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }: PropsWithChildren) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
    var mockApi: any;

    beforeEach(() => {
        mockApi = AdminApi();
    });
    
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it("Use Account Data", async () => {
        mockApi.fetchAllAccounts.mockResolvedValueOnce([mockUser]);
        const { result } = renderHook(() => useAccountData(), { wrapper });
        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(mockInvalidateQueries).toHaveBeenCalledTimes(0);
        expect(mockApi.fetchAllAccounts).toHaveBeenCalledTimes(1);
        expect(result.current.data).toEqual([mockUser]);
    });

    it("Use Role Updater", async () => {
        const mockRole: Role = "coach";
        mockApi.setAccountAsRole.mockResolvedValueOnce({});
        const { mutateAsync } = renderHook(() => useRoleUpdater(), { wrapper }).result.current;
        await mutateAsync({id: mockAccountId, role: mockRole});
        expect(mockApi.setAccountAsRole).toHaveBeenCalledTimes(1);
        expect(mockApi.setAccountAsRole).toHaveBeenCalledWith(mockAccountId, mockRole);
        expect(mockInvalidateQueries).toHaveBeenCalledTimes(1);
        expect(mockInvalidateQueries).toHaveBeenCalledWith({queryKey: ["account"]});
    });
});
