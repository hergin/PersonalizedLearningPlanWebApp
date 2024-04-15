import React, { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { useSettings, useSettingsMutation } from "../useSettings";
import { SettingsApi } from "../../api/settings-api";
import { defaultSettings } from "../../types";

const mockInvalidateQueries = jest.fn();
jest.mock("@tanstack/react-query", () => ({
    ...jest.requireActual("@tanstack/react-query"),
    __esModule: true,
    useQueryClient: () => ({
        invalidateQueries: mockInvalidateQueries
    })
}));

jest.mock("../../api/settings-api");

describe("useSettings Unit Tests", () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }: PropsWithChildren) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
    
    var api: any;

    beforeEach(() => {
        api = SettingsApi();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    
    it("useSettings", async () => {
        api.FetchSettings.mockResolvedValueOnce([defaultSettings]);
        const { result } = renderHook(() => useSettings(2), { wrapper });
        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(mockInvalidateQueries).toHaveBeenCalledTimes(0);
        expect(api.FetchSettings).toHaveBeenCalledTimes(1);
        expect(api.FetchSettings).toHaveBeenCalledWith(2);
        expect(result.current.data).toEqual([defaultSettings]);
    });

    it("useSettingsMutation", async () => {
        api.MutateSettings.mockResolvedValueOnce();
        const { mutateAsync } = renderHook(() => useSettingsMutation(2), { wrapper }).result.current;
        await mutateAsync({...defaultSettings, allowCoachInvitations: false});
        expect(api.MutateSettings).toHaveBeenCalledTimes(1);
        expect(api.MutateSettings).toHaveBeenCalledWith(2, {...defaultSettings, allowCoachInvitations: false});
        expect(mockInvalidateQueries).toHaveBeenCalledTimes(1);
        expect(mockInvalidateQueries).toHaveBeenCalledWith({queryKey: ["settings"]});
    })
});
