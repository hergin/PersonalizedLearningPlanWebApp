import * as ProfileProcessor from "../profileProcessor";
import ProfileAPI from "../../api/profileApi";
import { createMockRequest, MOCK_RESPONSE, TEST_PROFILE, TEST_ACCOUNT } from "../../global/mockValues";
import { STATUS_CODE } from "../../../types";
import { getLoginError } from "../../../utils/errorHandlers";

jest.mock("../../../controller/api/profileApi");

describe("Profile Processor unit tests", () => {
    var profileApi : any;

    beforeEach(() => {
        profileApi = new ProfileAPI();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("get all profiles (normal case)", async () => {
        profileApi.getAllCoachProfiles.mockResolvedValueOnce([
            {account_id: TEST_ACCOUNT.id, profile_id: TEST_PROFILE.profileId, username: TEST_PROFILE.username}
        ]);
        const mRequest = createMockRequest({}, {});
        await ProfileProcessor.getAllCoachProfiles(mRequest, MOCK_RESPONSE);
        expect(profileApi.getAllCoachProfiles).toHaveBeenCalledTimes(1);
        expect(profileApi.getAllCoachProfiles).toHaveBeenCalledWith();
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.OK);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith([
            {account_id: TEST_ACCOUNT.id, profile_id: TEST_PROFILE.profileId, username: TEST_PROFILE.username}
        ]);
    });

    it("get all profiles (error case)", async () => {
        profileApi.getAllCoachProfiles.mockResolvedValueOnce(STATUS_CODE.FORBIDDEN);
        const mRequest = createMockRequest({}, {});
        await ProfileProcessor.getAllCoachProfiles(mRequest, MOCK_RESPONSE);
        expect(profileApi.getAllCoachProfiles).toHaveBeenCalledTimes(1);
        expect(profileApi.getAllCoachProfiles).toHaveBeenCalledWith();
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.FORBIDDEN);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.FORBIDDEN));
    });

    it("get profile (normal case)", async () => {
        profileApi.getProfile.mockResolvedValueOnce(TEST_PROFILE);
        const mRequest = createMockRequest({}, {id: TEST_ACCOUNT.id});
        await ProfileProcessor.sendProfile(mRequest, MOCK_RESPONSE);
        expect(profileApi.getProfile).toHaveBeenCalledTimes(1);
        expect(profileApi.getProfile).toHaveBeenCalledWith(TEST_ACCOUNT.id);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.OK);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith(TEST_PROFILE);
    });

    it("get profile (error case)", async () => {
        profileApi.getProfile.mockResolvedValueOnce(STATUS_CODE.UNAUTHORIZED);
        const mRequest = createMockRequest({}, {id: TEST_ACCOUNT.id});
        await ProfileProcessor.sendProfile(mRequest, MOCK_RESPONSE);
        expect(profileApi.getProfile).toHaveBeenCalledTimes(1);
        expect(profileApi.getProfile).toHaveBeenCalledWith(TEST_ACCOUNT.id);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.UNAUTHORIZED);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.UNAUTHORIZED));
    });

    it("post profile (normal case)", async () => {
        profileApi.createProfile.mockResolvedValueOnce(STATUS_CODE.OK);
        const mRequest = createMockRequest({username: TEST_PROFILE.username, firstName: TEST_PROFILE.firstName, lastName: TEST_PROFILE.lastName, account_id: TEST_ACCOUNT.id});
        await ProfileProcessor.postProfile(mRequest, MOCK_RESPONSE);
        expect(profileApi.createProfile).toHaveBeenCalledTimes(1);
        expect(profileApi.createProfile).toHaveBeenCalledWith(TEST_PROFILE.username, TEST_PROFILE.firstName, TEST_PROFILE.lastName, TEST_ACCOUNT.id);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(STATUS_CODE.OK);
    });

    it("post profile (error case)", async () => {
        profileApi.createProfile.mockResolvedValueOnce(STATUS_CODE.CONFLICT);
        const mRequest = createMockRequest({username: TEST_PROFILE.username, firstName: TEST_PROFILE.firstName, lastName: TEST_PROFILE.lastName, account_id: TEST_ACCOUNT.id});
        await ProfileProcessor.postProfile(mRequest, MOCK_RESPONSE);
        expect(profileApi.createProfile).toHaveBeenCalledTimes(1);
        expect(profileApi.createProfile).toHaveBeenCalledWith(TEST_PROFILE.username, TEST_PROFILE.firstName, TEST_PROFILE.lastName, TEST_ACCOUNT.id);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.CONFLICT);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.CONFLICT));
    });

    it("put profile (correct case)", async () => {
        profileApi.updateProfile.mockResolvedValueOnce(STATUS_CODE.OK);
        const mRequest = createMockRequest(TEST_PROFILE, {id: TEST_PROFILE.profileId});
        await ProfileProcessor.putProfile(mRequest, MOCK_RESPONSE);
        expect(profileApi.updateProfile).toHaveBeenCalledTimes(1);
        expect(profileApi.updateProfile).toHaveBeenCalledWith(TEST_PROFILE);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(STATUS_CODE.OK);
    });

    it("put profile (error case)", async () => {
        profileApi.updateProfile.mockResolvedValueOnce(STATUS_CODE.CONNECTION_ERROR);
        const mRequest = createMockRequest(TEST_PROFILE, {id: TEST_PROFILE.profileId});
        await ProfileProcessor.putProfile(mRequest, MOCK_RESPONSE);
        expect(profileApi.updateProfile).toHaveBeenCalledTimes(1);
        expect(profileApi.updateProfile).toHaveBeenCalledWith(TEST_PROFILE);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.CONNECTION_ERROR);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.CONNECTION_ERROR));
    });

    it("delete profile (normal case)", async () => {
        profileApi.deleteProfile.mockResolvedValueOnce(STATUS_CODE.OK);
        const mRequest = createMockRequest({}, {id: TEST_PROFILE.profileId});
        await ProfileProcessor.deleteProfile(mRequest, MOCK_RESPONSE);
        expect(profileApi.deleteProfile).toHaveBeenCalledTimes(1);
        expect(profileApi.deleteProfile).toHaveBeenCalledWith(TEST_PROFILE.profileId);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(STATUS_CODE.OK);
    });

    it("delete profile (error case)", async () => {
        profileApi.deleteProfile.mockResolvedValueOnce(STATUS_CODE.FORBIDDEN);
        const mRequest = createMockRequest({}, {id: TEST_PROFILE.profileId});
        await ProfileProcessor.deleteProfile(mRequest, MOCK_RESPONSE);
        expect(profileApi.deleteProfile).toHaveBeenCalledTimes(1);
        expect(profileApi.deleteProfile).toHaveBeenCalledWith(TEST_PROFILE.profileId);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.FORBIDDEN);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.FORBIDDEN));
    });
});
