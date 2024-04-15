import ProfileAPI from "../profileApi";
import DatabaseParser from "../../../parser/databaseParser";
import { STATUS_CODE } from "../../../types";
import { FAKE_ERRORS, TEST_PROFILE, TEST_ACCOUNT, TEST_CREATED_PROFILE } from "../../global/mockValues";

jest.mock("../../../parser/databaseParser");

describe('Profile Api Unit Tests', () => {
    let parser : any;
    let profileAPI : ProfileAPI;

    beforeEach(() => {
        parser = new DatabaseParser();
        profileAPI = new ProfileAPI();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('create profile (pass case)', async () => {
        parser.updateDatabase.mockResolvedValueOnce();
        expect(await profileAPI.createProfile(TEST_CREATED_PROFILE)).toEqual(STATUS_CODE.OK);
    });

    it('create profile (error case)', async () => {
        parser.updateDatabase.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await profileAPI.createProfile(TEST_CREATED_PROFILE)).toEqual(STATUS_CODE.BAD_REQUEST);
    });

    it('get all profiles (normal case)', async() => {
        parser.parseDatabase.mockResolvedValueOnce([{account_id: TEST_ACCOUNT.id, profile_id: TEST_PROFILE.profileId, username: TEST_PROFILE.username}]);
        const actual = await profileAPI.getAllCoachProfiles();
        expect(parser.parseDatabase).toHaveBeenCalledTimes(1);
        expect(parser.parseDatabase).toHaveBeenCalledWith("SELECT * FROM COACH_DATA");
        expect(actual).toEqual([{account_id: TEST_ACCOUNT.id, profile_id: TEST_PROFILE.profileId, username: TEST_PROFILE.username}]);
    });

    it('get all profiles (error case)', async () => {
        parser.parseDatabase.mockRejectedValue(FAKE_ERRORS.networkError);
        const actual = await profileAPI.getAllCoachProfiles();
        expect(parser.parseDatabase).toHaveBeenCalledTimes(1);
        expect(parser.parseDatabase).toHaveBeenCalledWith("SELECT * FROM COACH_DATA");
        expect(actual).toEqual(STATUS_CODE.CONNECTION_ERROR);
    });

    it('get profile (pass case)', async () => {
        parser.parseDatabase.mockResolvedValueOnce({
            username: TEST_PROFILE.username, first_name: TEST_PROFILE.firstName, last_name: TEST_PROFILE.lastName, job_title: TEST_PROFILE.jobTitle, bio: TEST_PROFILE.bio, accountId: TEST_ACCOUNT.id
        });
        expect(await profileAPI.getProfile(TEST_ACCOUNT.id)).toEqual({
            username: TEST_PROFILE.username, first_name: TEST_PROFILE.firstName, last_name: TEST_PROFILE.lastName, job_title: TEST_PROFILE.jobTitle, bio: TEST_PROFILE.bio, accountId: TEST_ACCOUNT.id
        });
    });

    it('get profile (error case)', async () => {
        parser.parseDatabase.mockResolvedValueOnce(undefined);
        expect(await profileAPI.getProfile(TEST_ACCOUNT.id)).toEqual(STATUS_CODE.GONE);
    });

    it('update profile (pass case)', async () => {
        parser.updateDatabase.mockResolvedValueOnce();
        expect(await profileAPI.updateProfile(TEST_PROFILE)).toEqual(STATUS_CODE.OK);
    });

    it('update profile (error case)', async () => {
        parser.updateDatabase.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await profileAPI.updateProfile(TEST_PROFILE)).toEqual(STATUS_CODE.CONNECTION_ERROR);
    });

    it('delete profile (pass case)', async () => {
        if(!TEST_PROFILE.profileId) throw new Error("Profile Id was null!");
        parser.updateDatabase.mockResolvedValueOnce();
        expect(await profileAPI.deleteProfile(TEST_PROFILE.profileId)).toEqual(STATUS_CODE.OK);
    });

    it('delete profile (duplicate case)', async () => {
        if(!TEST_PROFILE.profileId) throw new Error("Profile Id was null!");
        parser.updateDatabase.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        expect(await profileAPI.deleteProfile(TEST_PROFILE.profileId)).toEqual(STATUS_CODE.CONFLICT);
    });
});
