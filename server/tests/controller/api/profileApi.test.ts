export {};

import ProfileAPI from "../../../controller/api/profileApi";
import ProfileParser from "../../../parser/profileParser";
import { StatusCode } from "../../../types";
import { FAKE_ERRORS, TEST_PROFILE, TEST_ACCOUNT } from "../global/mockValues.test";
jest.mock("../../../parser/profileParser");

describe('profile processor', () => {


    let parser : any;
    let profileAPI : ProfileAPI;

    beforeEach(() => {
        parser = new ProfileParser();
        profileAPI = new ProfileAPI();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('create profile (pass case)', async () => {
        parser.storeProfile.mockResolvedValueOnce();
        expect(await profileAPI.createProfile(TEST_PROFILE.username, TEST_PROFILE.firstName, TEST_PROFILE.lastName, TEST_ACCOUNT.id)).toEqual(StatusCode.OK);
    });

    it('create profile (duplicate case)', async () => {
        parser.storeProfile.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        expect(await profileAPI.createProfile(TEST_PROFILE.username, TEST_PROFILE.firstName, TEST_PROFILE.lastName, TEST_ACCOUNT.id)).toEqual(StatusCode.CONFLICT);
    });

    it('create profile (bad data case)', async () => {
        parser.storeProfile.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await profileAPI.createProfile(TEST_PROFILE.username, TEST_PROFILE.firstName, TEST_PROFILE.lastName, TEST_ACCOUNT.id)).toEqual(StatusCode.BAD_REQUEST);
    });

    it('create profile (connection lost case)', async () => {
        parser.storeProfile.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await profileAPI.createProfile(TEST_PROFILE.username, TEST_PROFILE.firstName, TEST_PROFILE.lastName, TEST_ACCOUNT.id)).toEqual(StatusCode.CONNECTION_ERROR);
    });

    it('create profile (fatal error case)', async () => {
        parser.storeProfile.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await profileAPI.createProfile(TEST_PROFILE.username, TEST_PROFILE.firstName, TEST_PROFILE.lastName, TEST_ACCOUNT.id)).toEqual(StatusCode.INTERNAL_SERVER_ERROR);
    });

    it('get profile (pass case)', async () => {
        parser.parseProfile.mockResolvedValueOnce({
            username: TEST_PROFILE.username, first_name: TEST_PROFILE.firstName, last_name: TEST_PROFILE.lastName, 
            profile_picture: TEST_PROFILE.profilePicture, job_title: TEST_PROFILE.jobTitle, bio: TEST_PROFILE.bio, accountId: TEST_ACCOUNT.id
        });
        expect(await profileAPI.getProfile(TEST_ACCOUNT.id)).toEqual({
            username: TEST_PROFILE.username, first_name: TEST_PROFILE.firstName, last_name: TEST_PROFILE.lastName, 
            profile_picture: TEST_PROFILE.profilePicture, job_title: TEST_PROFILE.jobTitle, bio: TEST_PROFILE.bio, accountId: TEST_ACCOUNT.id
        });
    });

    it('get profile (profile missing case)', async () => {
        parser.parseProfile.mockResolvedValueOnce(undefined);
        expect(await profileAPI.getProfile(TEST_ACCOUNT.id)).toEqual(StatusCode.UNAUTHORIZED);
    });

    it('get profile (connection lost case)', async () => {
        parser.parseProfile.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await profileAPI.getProfile(TEST_ACCOUNT.id)).toEqual(StatusCode.CONNECTION_ERROR);
    });

    it('get profile (fatal error case)', async () => {
        parser.parseProfile.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await profileAPI.getProfile(TEST_ACCOUNT.id)).toEqual(StatusCode.INTERNAL_SERVER_ERROR);
    });

    it('update profile (pass case)', async () => {
        parser.updateProfile.mockResolvedValueOnce();
        expect(await profileAPI.updateProfile({
            id: TEST_PROFILE.id,
            username: TEST_PROFILE.username, 
            firstName: TEST_PROFILE.firstName, 
            lastName: TEST_PROFILE.lastName, 
            profilePicture: TEST_PROFILE.profilePicture, 
            jobTitle: TEST_PROFILE.jobTitle, 
            bio: TEST_PROFILE.bio, 
        })).toEqual(StatusCode.OK);
    });

    it('update profile (duplicate case)', async () => {
        parser.updateProfile.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        expect(await profileAPI.updateProfile({
            id: TEST_PROFILE.id,
            username: TEST_PROFILE.username, 
            firstName: TEST_PROFILE.firstName, 
            lastName: TEST_PROFILE.lastName, 
            profilePicture: TEST_PROFILE.profilePicture, 
            jobTitle: TEST_PROFILE.jobTitle, 
            bio: TEST_PROFILE.bio, 
        })).toEqual(StatusCode.CONFLICT);
    });

    it('update profile (bad data case)', async () => {
        parser.updateProfile.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await profileAPI.updateProfile({
            id: TEST_PROFILE.id,
            username: TEST_PROFILE.username, 
            firstName: TEST_PROFILE.firstName, 
            lastName: TEST_PROFILE.lastName, 
            profilePicture: TEST_PROFILE.profilePicture, 
            jobTitle: TEST_PROFILE.jobTitle, 
            bio: TEST_PROFILE.bio, 
        })).toEqual(StatusCode.BAD_REQUEST);
    });

    it('update profile (connection lost case)', async () => {
        parser.updateProfile.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await profileAPI.updateProfile({
            id: TEST_PROFILE.id,
            username: TEST_PROFILE.username, 
            firstName: TEST_PROFILE.firstName, 
            lastName: TEST_PROFILE.lastName, 
            profilePicture: TEST_PROFILE.profilePicture, 
            jobTitle: TEST_PROFILE.jobTitle, 
            bio: TEST_PROFILE.bio, 
        })).toEqual(StatusCode.CONNECTION_ERROR);
    });

    it('update profile (fatal error case)', async () => {
        parser.updateProfile.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await profileAPI.updateProfile({
            id: TEST_PROFILE.id,
            username: TEST_PROFILE.username, 
            firstName: TEST_PROFILE.firstName, 
            lastName: TEST_PROFILE.lastName, 
            profilePicture: TEST_PROFILE.profilePicture, 
            jobTitle: TEST_PROFILE.jobTitle, 
            bio: TEST_PROFILE.bio, 
        })).toEqual(StatusCode.INTERNAL_SERVER_ERROR);
    });

    it('delete profile (pass case)', async () => {
        parser.deleteProfile.mockResolvedValueOnce();
        expect(await profileAPI.deleteProfile(TEST_PROFILE.id)).toEqual(StatusCode.OK);
    });

    it('delete profile (duplicate case)', async () => {
        parser.deleteProfile.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        expect(await profileAPI.deleteProfile(TEST_PROFILE.id)).toEqual(StatusCode.CONFLICT);
    });

    it('delete profile (bad data case)', async () => {
        parser.deleteProfile.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await profileAPI.deleteProfile(TEST_PROFILE.id)).toEqual(StatusCode.BAD_REQUEST);
    });

    it('delete profile (connection lost case)', async () => {
        parser.deleteProfile.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await profileAPI.deleteProfile(TEST_PROFILE.id)).toEqual(StatusCode.CONNECTION_ERROR);
    });

    it('delete profile (fatal error case)', async () => {
        parser.deleteProfile.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await profileAPI.deleteProfile(TEST_PROFILE.id)).toEqual(StatusCode.INTERNAL_SERVER_ERROR);
    });

    it('get user data (normal case)', async() => {
        parser.parseUserData.mockResolvedValueOnce([{id: TEST_ACCOUNT.id, email: TEST_ACCOUNT.email, username: TEST_PROFILE.username}]);
        const result = await profileAPI.getUserData(TEST_ACCOUNT.id);
        expect(parser.parseUserData).toHaveBeenCalledTimes(1);
        expect(parser.parseUserData).toHaveBeenCalledWith(TEST_ACCOUNT.id);
        expect(result).toEqual([{id: TEST_ACCOUNT.id, email: TEST_ACCOUNT.email, username: TEST_PROFILE.username}]);
    });

    it('get user data (error case)', async () => {
        parser.parseUserData.mockRejectedValue(FAKE_ERRORS.badRequest);
        const result = await profileAPI.getUserData(TEST_ACCOUNT.id);
        expect(parser.parseUserData).toHaveBeenCalledTimes(1);
        expect(parser.parseUserData).toHaveBeenCalledWith(TEST_ACCOUNT.id);
        expect(result).toEqual(StatusCode.BAD_REQUEST);
    });
});
