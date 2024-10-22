import React, { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLoginService, useRegistrationService, useLogoutService, useDeletionService } from "../useAccountServices";
import { renderHook, cleanup } from "@testing-library/react";
import AccountApi from "../../api/account-api";

jest.mock("../../api/account-api");

const mockInvalidateQueries = jest.fn();
jest.mock("@tanstack/react-query", () => ({
    ...jest.requireActual("@tanstack/react-query"),
    __esModule: true,
    useQueryClient: () => ({
        invalidateQueries: mockInvalidateQueries
    })
}));

const TEST_DATA = {
    email: "tsnicholas@bsu.edu",
    password: "password",
    firstName: "test",
    lastName: "dummy",
    username: "Xx_TestDummy_xX"
}

describe("useAccountServices unit tests", () => {
    var authApi: any;
    
    beforeEach(() => {
        authApi = AccountApi();
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });
    
    const queryClient = new QueryClient();
    const wrapper = ({ children }: PropsWithChildren) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    it("useLoginService", async () => {
        authApi.login.mockReturnValue(Promise.resolve());
        const { mutateAsync } = renderHook(() => useLoginService(), { wrapper }).result.current;
        await mutateAsync({email: TEST_DATA.email, password: TEST_DATA.password});
        expect(authApi.login).toHaveBeenCalledTimes(1);
        expect(authApi.login).toHaveBeenCalledWith(TEST_DATA.email, TEST_DATA.password);
        expect(mockInvalidateQueries).toHaveBeenCalledTimes(1);
        expect(mockInvalidateQueries).toHaveBeenCalledWith({queryKey: ["settings"]});
    });

    it("useRegistrationService", async () => {
        authApi.register.mockReturnValue(Promise.resolve());
        const { mutateAsync } = renderHook(() => useRegistrationService(), { wrapper }).result.current;
        await mutateAsync({
            email: TEST_DATA.email, 
            password: TEST_DATA.password, 
            firstName: TEST_DATA.firstName, 
            lastName: TEST_DATA.lastName, 
            username: TEST_DATA.username
        });
        expect(authApi.register).toHaveBeenCalledTimes(1);
        expect(authApi.register).toHaveBeenCalledWith({
            email: TEST_DATA.email, 
            password: TEST_DATA.password, 
            firstName: TEST_DATA.firstName, 
            lastName: TEST_DATA.lastName, 
            username: TEST_DATA.username
        });
        expect(mockInvalidateQueries).toHaveBeenCalledTimes(1);
        expect(mockInvalidateQueries).toHaveBeenCalledWith({queryKey: ["settings"]});
    });

    it("useLogoutService", async () => {
        authApi.logout.mockReturnValue(Promise.resolve());
        const { mutateAsync } = renderHook(() => useLogoutService(), { wrapper }).result.current;
        await mutateAsync();
        expect(authApi.logout).toHaveBeenCalledTimes(1);
        expect(authApi.logout).toHaveBeenCalledWith();
        expect(mockInvalidateQueries).toHaveBeenCalledTimes(1);
        expect(mockInvalidateQueries).toHaveBeenCalledWith();
    });

    it("useDeletionService", async () => {
        const mockAccountId = 1;
        authApi.deleteAccount.mockReturnValue(Promise.resolve());
        const { mutateAsync } = renderHook(() => useDeletionService(), { wrapper }).result.current;
        await mutateAsync(mockAccountId);
        expect(authApi.deleteAccount).toHaveBeenCalledTimes(1);
        expect(authApi.deleteAccount).toHaveBeenCalledWith(mockAccountId);
    });
});
