import React, { PropsWithChildren } from "react";
import { useUnderstudies } from "../useUnderstudies";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UnderstudyApi from "../../api/understudy-api";
import { renderHook, waitFor, cleanup } from "@testing-library/react";

jest.mock("../../api/understudy-api");

const TEST_UNDERSTUDY = {
    account_id: 1,
    profile_id: 1,
    username: "Xx_TestDummy_xX",
    coach_id: 2,
};

describe("useUnderstudies Unit Tests", () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }: PropsWithChildren) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    var accountApi: any;

    beforeEach(() => {
        accountApi = UnderstudyApi();
    });
    
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it("useUnderstudies", async () => {
        accountApi.fetchUnderstudies.mockResolvedValueOnce([TEST_UNDERSTUDY]);
        const { result } = renderHook(() => useUnderstudies(TEST_UNDERSTUDY.coach_id), { wrapper });
        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual([TEST_UNDERSTUDY]);
        expect(accountApi.fetchUnderstudies).toHaveBeenCalledTimes(1);
        expect(accountApi.fetchUnderstudies).toHaveBeenCalledWith(TEST_UNDERSTUDY.coach_id);
    });
});
