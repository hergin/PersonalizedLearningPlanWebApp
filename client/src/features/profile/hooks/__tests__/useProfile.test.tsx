import React, { PropsWithChildren } from "react";
import { useProfile, useCoaches, useProfileCreator, useProfileUpdater } from "../useProfile";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor, cleanup } from "@testing-library/react";
import ProfileApi from "../../api/profile-api";

const mockInvalidateQueries = jest.fn();
jest.mock("@tanstack/react-query", () => ({
    ...jest.requireActual("@tanstack/react-query"),
    __esModule: true,
    useQueryClient: () => ({
        invalidateQueries: mockInvalidateQueries
    })
}));

jest.mock("../../api/profile-api");

const mockId = 1;
const TEST_PROFILE = {
    id: 0,
    username: "Xx_TestDummy_xX",
    firstName: "Test",
    lastName: "Dummy",
    profilePicture: "",
    jobTitle: "Punching Bag",
    bio: "I live to test!"
};

describe("useProfile Unit Tests", () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }: PropsWithChildren) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    var mockApi: any;

    beforeEach(() => {
        mockApi = ProfileApi();
    });
    
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it("useProfile", async () => {
        mockApi.FetchProfile.mockResolvedValueOnce([TEST_PROFILE]);
        const { result } = renderHook(() => useProfile(mockId), { wrapper });
        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(mockApi.FetchProfile).toHaveBeenCalledTimes(1);
        expect(mockApi.FetchProfile).toHaveBeenCalledWith(mockId);
        expect(result.current.data).toEqual([TEST_PROFILE]);
    });

    it("useAllProfiles", async () => {
        mockApi.fetchCoaches.mockResolvedValueOnce([TEST_PROFILE, TEST_PROFILE]);
        const { result } = renderHook(() => useCoaches(), { wrapper });
        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(mockApi.fetchCoaches).toHaveBeenCalledTimes(1);
        expect(result.current.data).toEqual([TEST_PROFILE, TEST_PROFILE]);
    });

    it("useProfileCreator", async () => {
        mockApi.CreateProfile.mockResolvedValueOnce(TEST_PROFILE);
        const { mutateAsync } = renderHook(() => useProfileCreator(mockId), { wrapper }).result.current;
        await mutateAsync({
            username: TEST_PROFILE.username, 
            firstName: TEST_PROFILE.firstName, 
            lastName: TEST_PROFILE.lastName, 
            account_id: mockId
        });
        expect(mockApi.CreateProfile).toHaveBeenCalledTimes(1);
        expect(mockApi.CreateProfile).toHaveBeenCalledWith({
            username: TEST_PROFILE.username, 
            firstName: TEST_PROFILE.firstName, 
            lastName: TEST_PROFILE.lastName, 
            account_id: mockId
        });
        expect(mockInvalidateQueries).toHaveBeenCalledTimes(1);
        expect(mockInvalidateQueries).toHaveBeenCalledWith({queryKey: ["profile", mockId]});
    });

    it("useProfileCreator", async () => {
        mockApi.UpdateProfile.mockResolvedValueOnce(TEST_PROFILE);
        const { mutateAsync } = renderHook(() => useProfileUpdater(mockId), { wrapper }).result.current;
        await mutateAsync(TEST_PROFILE);
        expect(mockApi.UpdateProfile).toHaveBeenCalledTimes(1);
        expect(mockApi.UpdateProfile).toHaveBeenCalledWith(TEST_PROFILE);
        expect(mockInvalidateQueries).toHaveBeenCalledTimes(1);
        expect(mockInvalidateQueries).toHaveBeenCalledWith({queryKey: ["profile", mockId]});
    });
});
