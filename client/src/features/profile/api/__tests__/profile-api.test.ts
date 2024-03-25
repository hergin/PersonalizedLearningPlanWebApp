import ProfileApi from "../profile-api";
import { renderHook, cleanup } from "@testing-library/react";
import { useApiConnection } from "../../../../hooks/useApiConnection";
import { AxiosError } from "axios";

jest.mock("../../../../hooks/useApiConnection");

const TEST_PROFILE = {
    id: 0,
    username: "Xx_TestDummy_xX",
    firstName: "Test",
    lastName: "Dummy",
    profilePicture: "",
    jobTitle: "Punching Bag",
    bio: "I live to test!",
    account_id: 999
}
const TEST_ERROR : AxiosError = {message: "I don't feel like querying right now. :("} as AxiosError;

describe("Profile Api Unit Tests", () => {
    const { FetchProfile, FetchAllProfiles, CreateProfile, UpdateProfile } = renderHook(ProfileApi).result.current;
    var mockApi: any;
    var mockError: any;
    var mockAlert: any;

    beforeEach(() => {
        mockApi = useApiConnection();
        mockError = jest.spyOn(global.console, 'error');
        mockAlert = jest.spyOn(window, 'alert');
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it("FetchProfile (normal case)", async () => {
        mockApi.get.mockResolvedValueOnce([TEST_PROFILE]);
        const result = await FetchProfile(TEST_PROFILE.account_id);
        expect(mockApi.get).toHaveBeenCalledTimes(1);
        expect(mockApi.get).toHaveBeenCalledWith(`profile/get/${TEST_PROFILE.account_id}`);
        expect(result).toEqual([TEST_PROFILE]);
        expect(mockError).toHaveBeenCalledTimes(0);
        expect(mockAlert).toHaveBeenCalledTimes(0);
    });

    it("FetchProfile (error case)", async () => {
        mockApi.get.mockRejectedValue(TEST_ERROR);
        const result = await FetchProfile(TEST_PROFILE.account_id);
        expect(mockApi.get).toHaveBeenCalledTimes(1);
        expect(mockApi.get).toHaveBeenCalledWith(`profile/get/${TEST_PROFILE.account_id}`);
        expect(result).toBeUndefined();
        expect(mockError).toHaveBeenCalledTimes(1);
        expect(mockError).toHaveBeenCalledWith(TEST_ERROR);
        expect(mockAlert).toHaveBeenCalledTimes(1);
        expect(mockAlert).toHaveBeenCalledWith(TEST_ERROR.message);
    });

    it("FetchAllProfiles (normal case)", async () => {
        mockApi.get.mockResolvedValueOnce([TEST_PROFILE, TEST_PROFILE]);
        const result = await FetchAllProfiles();
        expect(mockApi.get).toHaveBeenCalledTimes(1);
        expect(mockApi.get).toHaveBeenCalledWith("profile/get");
        expect(result).toEqual([TEST_PROFILE, TEST_PROFILE]);
        expect(mockError).toHaveBeenCalledTimes(0);
        expect(mockAlert).toHaveBeenCalledTimes(0);
    });

    it("FetchAllProfiles (error case)", async () => {
        mockApi.get.mockRejectedValue(TEST_ERROR);
        const result = await FetchAllProfiles();
        expect(mockApi.get).toHaveBeenCalledTimes(1);
        expect(mockApi.get).toHaveBeenCalledWith("profile/get");
        expect(result).toBeUndefined();
        expect(mockError).toHaveBeenCalledTimes(1);
        expect(mockError).toHaveBeenCalledWith(TEST_ERROR);
        expect(mockAlert).toHaveBeenCalledTimes(1);
        expect(mockAlert).toHaveBeenCalledWith(TEST_ERROR.message);
    });

    it("CreateProfile (normal case)", async () => {
        mockApi.post.mockResolvedValueOnce({});
        await CreateProfile({
            username: TEST_PROFILE.username, 
            firstName: TEST_PROFILE.firstName, 
            lastName: TEST_PROFILE.lastName, 
            account_id: TEST_PROFILE.account_id
        });
        expect(mockApi.post).toHaveBeenCalledTimes(1);
        expect(mockApi.post).toHaveBeenCalledWith("profile/create", {
            username: TEST_PROFILE.username, 
            firstName: TEST_PROFILE.firstName, 
            lastName: TEST_PROFILE.lastName, 
            account_id: TEST_PROFILE.account_id
        });
        expect(mockError).toHaveBeenCalledTimes(0);
        expect(mockAlert).toHaveBeenCalledTimes(0);
    });

    it("CreateProfile (error case)", async () => {
        mockApi.post.mockRejectedValue(TEST_ERROR);
        await CreateProfile({
            username: TEST_PROFILE.username, 
            firstName: TEST_PROFILE.firstName, 
            lastName: TEST_PROFILE.lastName, 
            account_id: TEST_PROFILE.account_id
        });
        expect(mockApi.post).toHaveBeenCalledTimes(1);
        expect(mockApi.post).toHaveBeenCalledWith("profile/create", {
            username: TEST_PROFILE.username, 
            firstName: TEST_PROFILE.firstName, 
            lastName: TEST_PROFILE.lastName, 
            account_id: TEST_PROFILE.account_id
        });
        expect(mockError).toHaveBeenCalledTimes(1);
        expect(mockError).toHaveBeenCalledWith(TEST_ERROR);
        expect(mockAlert).toHaveBeenCalledTimes(1);
        expect(mockAlert).toHaveBeenCalledWith(TEST_ERROR.message);
    });

    it("UpdateProfile (normal case)", async () => {
        const updatedBio = "Updated Bio";
        mockApi.put.mockResolvedValueOnce({});
        await UpdateProfile({...TEST_PROFILE, bio: updatedBio});
        expect(mockApi.put).toHaveBeenCalledTimes(1);
        expect(mockApi.put).toHaveBeenCalledWith(`profile/edit/${TEST_PROFILE.id}`, {
            firstName: TEST_PROFILE.firstName,
            lastName: TEST_PROFILE.lastName,
            username: TEST_PROFILE.username,
            profilePicture: TEST_PROFILE.profilePicture,
            jobTitle: TEST_PROFILE.jobTitle, 
            bio: updatedBio
        });
        expect(mockError).toHaveBeenCalledTimes(0);
        expect(mockAlert).toHaveBeenCalledTimes(0);
    });

    it("UpdateProfile (error case)", async () => {
        const updatedBio = "Updated Bio";
        mockApi.put.mockRejectedValue(TEST_ERROR);
        await UpdateProfile({...TEST_PROFILE, bio: updatedBio});
        expect(mockApi.put).toHaveBeenCalledTimes(1);
        expect(mockApi.put).toHaveBeenCalledWith(`profile/edit/${TEST_PROFILE.id}`, {
            firstName: TEST_PROFILE.firstName,
            lastName: TEST_PROFILE.lastName,
            username: TEST_PROFILE.username,
            profilePicture: TEST_PROFILE.profilePicture,
            jobTitle: TEST_PROFILE.jobTitle, 
            bio: updatedBio
        });
        expect(mockError).toHaveBeenCalledTimes(1);
        expect(mockError).toHaveBeenCalledWith(TEST_ERROR);
        expect(mockAlert).toHaveBeenCalledTimes(1);
        expect(mockAlert).toHaveBeenCalledWith(TEST_ERROR.message);
    });
});
