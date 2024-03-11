import * as ProfileProcessor from "../../../controller/processors/profileProcessor";
import ProfileAPI from "../../../controller/api/profileApi";
import { createMockRequest, MOCK_RESPONSE, TEST_PROFILE, TEST_ACCOUNT } from "../global/mockValues";
import { StatusCode } from "../../../types";
import { initializeErrorMap } from "../../../utils/errorMessages";

jest.mock("../../../controller/api/profileApi");
const ERROR_MESSAGES = initializeErrorMap();

describe("Profile Processor unit tests", () => {
    var profileApi : any;

    beforeEach(() => {
        profileApi = new ProfileAPI();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("get all profiles (normal case)", async () => {
        profileApi.getAllProfiles.mockResolvedValueOnce([
            {account_id: TEST_ACCOUNT.id, profile_id: TEST_PROFILE.id, username: TEST_PROFILE.username}
        ]);
        const mRequest = createMockRequest({}, {});
        await ProfileProcessor.getAllProfiles(mRequest, MOCK_RESPONSE);
        expect(profileApi.getAllProfiles).toHaveBeenCalledTimes(1);
        expect(profileApi.getAllProfiles).toHaveBeenCalledWith();
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.OK);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith([
            {account_id: TEST_ACCOUNT.id, profile_id: TEST_PROFILE.id, username: TEST_PROFILE.username}
        ]);
    });

    it("get all profiles (error case)", async () => {
        profileApi.getAllProfiles.mockResolvedValueOnce(StatusCode.FORBIDDEN);
        const mRequest = createMockRequest({}, {});
        await ProfileProcessor.getAllProfiles(mRequest, MOCK_RESPONSE);
        expect(profileApi.getAllProfiles).toHaveBeenCalledTimes(1);
        expect(profileApi.getAllProfiles).toHaveBeenCalledWith();
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.FORBIDDEN);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(StatusCode.FORBIDDEN));
    });

    it("get profile (normal case)", async () => {
        profileApi.getProfile.mockResolvedValueOnce(TEST_PROFILE);
        const mRequest = createMockRequest({}, {id: TEST_ACCOUNT.id});
        await ProfileProcessor.sendProfile(mRequest, MOCK_RESPONSE);
        expect(profileApi.getProfile).toHaveBeenCalledTimes(1);
        expect(profileApi.getProfile).toHaveBeenCalledWith(TEST_ACCOUNT.id);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.OK);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith(TEST_PROFILE);
    });

    it("get profile (error case)", async () => {
        profileApi.getProfile.mockResolvedValueOnce(StatusCode.UNAUTHORIZED);
        const mRequest = createMockRequest({}, {id: TEST_ACCOUNT.id});
        await ProfileProcessor.sendProfile(mRequest, MOCK_RESPONSE);
        expect(profileApi.getProfile).toHaveBeenCalledTimes(1);
        expect(profileApi.getProfile).toHaveBeenCalledWith(TEST_ACCOUNT.id);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.UNAUTHORIZED);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(StatusCode.UNAUTHORIZED));
    });

    it("post profile (normal case)", async () => {
        profileApi.createProfile.mockResolvedValueOnce(StatusCode.OK);
        const mRequest = createMockRequest({username: TEST_PROFILE.username, firstName: TEST_PROFILE.firstName, lastName: TEST_PROFILE.lastName, account_id: TEST_ACCOUNT.id});
        await ProfileProcessor.postProfile(mRequest, MOCK_RESPONSE);
        expect(profileApi.createProfile).toHaveBeenCalledTimes(1);
        expect(profileApi.createProfile).toHaveBeenCalledWith(TEST_PROFILE.username, TEST_PROFILE.firstName, TEST_PROFILE.lastName, TEST_ACCOUNT.id);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(StatusCode.OK);
    });

    it("post profile (error case)", async () => {
        profileApi.createProfile.mockResolvedValueOnce(StatusCode.CONFLICT);
        const mRequest = createMockRequest({username: TEST_PROFILE.username, firstName: TEST_PROFILE.firstName, lastName: TEST_PROFILE.lastName, account_id: TEST_ACCOUNT.id});
        await ProfileProcessor.postProfile(mRequest, MOCK_RESPONSE);
        expect(profileApi.createProfile).toHaveBeenCalledTimes(1);
        expect(profileApi.createProfile).toHaveBeenCalledWith(TEST_PROFILE.username, TEST_PROFILE.firstName, TEST_PROFILE.lastName, TEST_ACCOUNT.id);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.CONFLICT);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(StatusCode.CONFLICT));
    });

    it("put profile (correct case)", async () => {
        profileApi.updateProfile.mockResolvedValueOnce(StatusCode.OK);
        const mRequest = createMockRequest(TEST_PROFILE, {id: TEST_PROFILE.id});
        await ProfileProcessor.putProfile(mRequest, MOCK_RESPONSE);
        expect(profileApi.updateProfile).toHaveBeenCalledTimes(1);
        expect(profileApi.updateProfile).toHaveBeenCalledWith(TEST_PROFILE);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(StatusCode.OK);
    });

    it("put profile (error case)", async () => {
        profileApi.updateProfile.mockResolvedValueOnce(StatusCode.CONNECTION_ERROR);
        const mRequest = createMockRequest(TEST_PROFILE, {id: TEST_PROFILE.id});
        await ProfileProcessor.putProfile(mRequest, MOCK_RESPONSE);
        expect(profileApi.updateProfile).toHaveBeenCalledTimes(1);
        expect(profileApi.updateProfile).toHaveBeenCalledWith(TEST_PROFILE);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.CONNECTION_ERROR);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(StatusCode.CONNECTION_ERROR));
    });

    it("delete profile (normal case)", async () => {
        profileApi.deleteProfile.mockResolvedValueOnce(StatusCode.OK);
        const mRequest = createMockRequest({}, {id: TEST_PROFILE.id});
        await ProfileProcessor.deleteProfile(mRequest, MOCK_RESPONSE);
        expect(profileApi.deleteProfile).toHaveBeenCalledTimes(1);
        expect(profileApi.deleteProfile).toHaveBeenCalledWith(TEST_PROFILE.id);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(StatusCode.OK);
    });

    it("delete profile (error case)", async () => {
        profileApi.deleteProfile.mockResolvedValueOnce(StatusCode.FORBIDDEN);
        const mRequest = createMockRequest({}, {id: TEST_PROFILE.id});
        await ProfileProcessor.deleteProfile(mRequest, MOCK_RESPONSE);
        expect(profileApi.deleteProfile).toHaveBeenCalledTimes(1);
        expect(profileApi.deleteProfile).toHaveBeenCalledWith(TEST_PROFILE.id);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.FORBIDDEN);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(StatusCode.FORBIDDEN));
    });
});
