import ProfileApi from "../profile-api";
import { renderHook, cleanup } from "@testing-library/react";
import { useApiConnection } from "../../../../hooks/useApiConnection";
import { throwServerError } from "../../../../utils/errorHandlers";

jest.mock("../../../../hooks/useApiConnection");
jest.mock("../../../../utils/errorHandlers");

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
const TEST_ERROR = {message: "I don't feel like querying right now. :("};

describe("Profile Api Unit Tests", () => {
    const { FetchProfile, fetchCoaches, CreateProfile, UpdateProfile } = renderHook(ProfileApi).result.current;
    let mockApi: any;
    let mockServerThrower: jest.Mock;

    beforeEach(() => {
        mockApi = useApiConnection();
        mockServerThrower = throwServerError as jest.Mock;
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
        expect(mockServerThrower).toHaveBeenCalledTimes(0);
    });

    it("FetchProfile (error case)", async () => {
        mockApi.get.mockRejectedValue(TEST_ERROR);
        const result = await FetchProfile(TEST_PROFILE.account_id);
        expect(mockApi.get).toHaveBeenCalledTimes(1);
        expect(mockApi.get).toHaveBeenCalledWith(`profile/get/${TEST_PROFILE.account_id}`);
        expect(result).toBeUndefined();
        expect(mockServerThrower).toHaveBeenCalledTimes(1);
        expect(mockServerThrower).toHaveBeenCalledWith(TEST_ERROR);
    });

    it("FetchAllProfiles (normal case)", async () => {
        mockApi.get.mockResolvedValueOnce([TEST_PROFILE, TEST_PROFILE]);
        const result = await fetchCoaches();
        expect(mockApi.get).toHaveBeenCalledTimes(1);
        expect(mockApi.get).toHaveBeenCalledWith("profile/get");
        expect(result).toEqual([TEST_PROFILE, TEST_PROFILE]);
        expect(mockServerThrower).toHaveBeenCalledTimes(0);
    });

    it("FetchAllProfiles (error case)", async () => {
        mockApi.get.mockRejectedValue(TEST_ERROR);
        const result = await fetchCoaches();
        expect(mockApi.get).toHaveBeenCalledTimes(1);
        expect(mockApi.get).toHaveBeenCalledWith("profile/get");
        expect(result).toBeUndefined();
        expect(mockServerThrower).toHaveBeenCalledTimes(1);
        expect(mockServerThrower).toHaveBeenCalledWith(TEST_ERROR);
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
        expect(mockServerThrower).toHaveBeenCalledTimes(0);
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
        expect(mockServerThrower).toHaveBeenCalledTimes(1);
        expect(mockServerThrower).toHaveBeenCalledWith(TEST_ERROR);
    });

    it("UpdateProfile (normal case)", async () => {
        const updatedBio = "Updated Bio";
        mockApi.put.mockResolvedValueOnce({});
        await UpdateProfile({...TEST_PROFILE, bio: updatedBio});
        expect(mockApi.put).toHaveBeenCalledTimes(1);
        expect(mockApi.put).toHaveBeenCalledWith(`profile/edit/${TEST_PROFILE.id}`, {...TEST_PROFILE, bio: updatedBio});
        expect(mockServerThrower).toHaveBeenCalledTimes(0);
    });

    it("UpdateProfile (error case)", async () => {
        const updatedBio = "Updated Bio";
        mockApi.put.mockRejectedValue(TEST_ERROR);
        await UpdateProfile({...TEST_PROFILE, bio: updatedBio});
        expect(mockApi.put).toHaveBeenCalledTimes(1);
        expect(mockApi.put).toHaveBeenCalledWith(`profile/edit/${TEST_PROFILE.id}`, {...TEST_PROFILE, bio: updatedBio});
        expect(mockServerThrower).toHaveBeenCalledTimes(1);
        expect(mockServerThrower).toHaveBeenCalledWith(TEST_ERROR);
    });
});
