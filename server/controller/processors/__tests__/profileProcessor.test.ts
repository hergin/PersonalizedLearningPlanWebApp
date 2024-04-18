import * as ProfileProcessor from "../profileProcessor";
import ProfileAPI from "../../api/profileApi";
import { createMockRequest, MOCK_RESPONSE, TEST_PROFILE, TEST_ACCOUNT, TEST_CREATED_PROFILE } from "../../global/mockValues";
import { STATUS_CODE } from "../../../types";
import { getLoginError } from "../../../utils/errorHandlers";

jest.mock("../../../controller/api/profileApi");

describe("Profile Processor unit tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("get all profiles (normal case)", async () => {
        const mockGetAllCoachProfiles = new ProfileAPI().getAllCoachProfiles as jest.Mock;
        mockGetAllCoachProfiles.mockResolvedValueOnce([
            {account_id: TEST_ACCOUNT.id, profile_id: TEST_PROFILE.profileId, username: TEST_PROFILE.username}
        ]);
        const mRequest = createMockRequest({}, {});
        await ProfileProcessor.getAllCoachProfiles(mRequest, MOCK_RESPONSE);
        expect(mockGetAllCoachProfiles).toHaveBeenCalledTimes(1);
        expect(mockGetAllCoachProfiles).toHaveBeenCalledWith();
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.OK);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith([
            {account_id: TEST_ACCOUNT.id, profile_id: TEST_PROFILE.profileId, username: TEST_PROFILE.username}
        ]);
    });

    it("get all profiles (error case)", async () => {
        const mockGetAllCoachProfiles = new ProfileAPI().getAllCoachProfiles as jest.Mock;
        mockGetAllCoachProfiles.mockResolvedValueOnce(STATUS_CODE.FORBIDDEN);
        const mRequest = createMockRequest({}, {});
        await ProfileProcessor.getAllCoachProfiles(mRequest, MOCK_RESPONSE);
        expect(mockGetAllCoachProfiles).toHaveBeenCalledTimes(1);
        expect(mockGetAllCoachProfiles).toHaveBeenCalledWith();
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.FORBIDDEN);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.FORBIDDEN));
    });

    it("get profile (normal case)", async () => {
        const mockGetProfile = new ProfileAPI().getProfile as jest.Mock;
        mockGetProfile.mockResolvedValueOnce(TEST_PROFILE);
        const mRequest = createMockRequest({}, {id: TEST_ACCOUNT.id});
        await ProfileProcessor.sendProfile(mRequest, MOCK_RESPONSE);
        expect(mockGetProfile).toHaveBeenCalledTimes(1);
        expect(mockGetProfile).toHaveBeenCalledWith(TEST_ACCOUNT.id);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.OK);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith(TEST_PROFILE);
    });

    it("get profile (error case)", async () => {
        const mockGetProfile = new ProfileAPI().getProfile as jest.Mock;
        mockGetProfile.mockResolvedValueOnce(STATUS_CODE.UNAUTHORIZED);
        const mRequest = createMockRequest({}, {id: TEST_ACCOUNT.id});
        await ProfileProcessor.sendProfile(mRequest, MOCK_RESPONSE);
        expect(mockGetProfile).toHaveBeenCalledTimes(1);
        expect(mockGetProfile).toHaveBeenCalledWith(TEST_ACCOUNT.id);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.UNAUTHORIZED);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.UNAUTHORIZED));
    });

    it("post profile (normal case)", async () => {
        const mockCreateProfile = new ProfileAPI().createProfile as jest.Mock;
        mockCreateProfile.mockResolvedValueOnce(STATUS_CODE.OK);
        const mRequest = createMockRequest({...TEST_CREATED_PROFILE, account_id: TEST_CREATED_PROFILE.accountId});
        await ProfileProcessor.postProfile(mRequest, MOCK_RESPONSE);
        expect(mockCreateProfile).toHaveBeenCalledTimes(1);
        expect(mockCreateProfile).toHaveBeenCalledWith(TEST_CREATED_PROFILE);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(STATUS_CODE.OK);
    });

    it("post profile (error case)", async () => {
        const mockCreateProfile = new ProfileAPI().createProfile as jest.Mock;
        mockCreateProfile.mockResolvedValueOnce(STATUS_CODE.CONFLICT);
        const mRequest = createMockRequest({...TEST_CREATED_PROFILE, account_id: TEST_CREATED_PROFILE.accountId});
        await ProfileProcessor.postProfile(mRequest, MOCK_RESPONSE);
        expect(mockCreateProfile).toHaveBeenCalledTimes(1);
        expect(mockCreateProfile).toHaveBeenCalledWith(TEST_CREATED_PROFILE);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.CONFLICT);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.CONFLICT));
    });

    it("put profile (correct case)", async () => {
        const mockUpdateProfile = new ProfileAPI().updateProfile as jest.Mock;
        mockUpdateProfile.mockResolvedValueOnce(STATUS_CODE.OK);
        const mRequest = createMockRequest(TEST_PROFILE, {id: TEST_PROFILE.profileId});
        await ProfileProcessor.putProfile(mRequest, MOCK_RESPONSE);
        expect(mockUpdateProfile).toHaveBeenCalledTimes(1);
        expect(mockUpdateProfile).toHaveBeenCalledWith(TEST_PROFILE);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(STATUS_CODE.OK);
    });

    it("put profile (error case)", async () => {
        const mockUpdateProfile = new ProfileAPI().updateProfile as jest.Mock;
        mockUpdateProfile.mockResolvedValueOnce(STATUS_CODE.CONNECTION_ERROR);
        const mRequest = createMockRequest(TEST_PROFILE, {id: TEST_PROFILE.profileId});
        await ProfileProcessor.putProfile(mRequest, MOCK_RESPONSE);
        expect(mockUpdateProfile).toHaveBeenCalledTimes(1);
        expect(mockUpdateProfile).toHaveBeenCalledWith(TEST_PROFILE);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.CONNECTION_ERROR);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.CONNECTION_ERROR));
    });

    it("delete profile (normal case)", async () => {
        const mockDeleteProfile = new ProfileAPI().deleteProfile as jest.Mock;
        mockDeleteProfile.mockResolvedValueOnce(STATUS_CODE.OK);
        const mRequest = createMockRequest({}, {id: TEST_PROFILE.profileId});
        await ProfileProcessor.deleteProfile(mRequest, MOCK_RESPONSE);
        expect(mockDeleteProfile).toHaveBeenCalledTimes(1);
        expect(mockDeleteProfile).toHaveBeenCalledWith(TEST_PROFILE.profileId);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(STATUS_CODE.OK);
    });

    it("delete profile (error case)", async () => {
        const mockDeleteProfile = new ProfileAPI().deleteProfile as jest.Mock;
        mockDeleteProfile.mockResolvedValueOnce(STATUS_CODE.FORBIDDEN);
        const mRequest = createMockRequest({}, {id: TEST_PROFILE.profileId});
        await ProfileProcessor.deleteProfile(mRequest, MOCK_RESPONSE);
        expect(mockDeleteProfile).toHaveBeenCalledTimes(1);
        expect(mockDeleteProfile).toHaveBeenCalledWith(TEST_PROFILE.profileId);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.FORBIDDEN);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.FORBIDDEN));
    });
});
