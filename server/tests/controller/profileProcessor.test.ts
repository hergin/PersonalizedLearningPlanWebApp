export {};

import { ProfileAPI } from "../../controller/profileProcessor";
import ProfileParser from "../../parser/profileParser";
import { StatusCode } from "../../types";
import { FAKE_ERRORS } from "./fakeErrors";
jest.mock("../../parser/profileParser");

describe('profile processor', () => {
    const testData = {
        account_id: 12,
        username: "Xx_george_xX",
        firstName: "George",
        lastName: "Johnson",
        profilePicture: "",
        bio: "I'm george!",
        jobTitle: "Unemployed",
        profile_id: 5,
    }


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
        expect(await profileAPI.createProfile(testData.username, testData.firstName, testData.lastName, testData.account_id)).toEqual(StatusCode.OK);
    });

    it('create profile (duplicate case)', async () => {
        parser.storeProfile.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        expect(await profileAPI.createProfile(testData.username, testData.firstName, testData.lastName, testData.account_id)).toEqual(StatusCode.CONFLICT);
    });

    it('create profile (bad data case)', async () => {
        parser.storeProfile.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await profileAPI.createProfile(testData.username, testData.firstName, testData.lastName, testData.account_id)).toEqual(StatusCode.BAD_REQUEST);
    });

    it('create profile (connection lost case)', async () => {
        parser.storeProfile.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await profileAPI.createProfile(testData.username, testData.firstName, testData.lastName, testData.account_id)).toEqual(StatusCode.CONNECTION_ERROR);
    });

    it('create profile (fatal error case)', async () => {
        parser.storeProfile.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await profileAPI.createProfile(testData.username, testData.firstName, testData.lastName, testData.account_id)).toEqual(StatusCode.INTERNAL_SERVER_ERROR);
    });

    it('get profile (pass case)', async () => {
        parser.parseProfile.mockResolvedValueOnce({
            username: testData.username, first_name: testData.firstName, last_name: testData.lastName, 
            profile_picture: testData.profilePicture, job_title: testData.jobTitle, bio: testData.bio, email: testData.account_id
        });
        expect(await profileAPI.getProfile(testData.account_id)).toEqual({
            username: testData.username, first_name: testData.firstName, last_name: testData.lastName, 
            profile_picture: testData.profilePicture, job_title: testData.jobTitle, bio: testData.bio, email: testData.account_id
        });
    });

    it('get profile (profile missing case)', async () => {
        parser.parseProfile.mockResolvedValueOnce(undefined);
        expect(await profileAPI.getProfile(testData.account_id)).toEqual(StatusCode.UNAUTHORIZED);
    });

    it('get profile (connection lost case)', async () => {
        parser.parseProfile.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await profileAPI.getProfile(testData.account_id)).toEqual(StatusCode.CONNECTION_ERROR);
    });

    it('get profile (fatal error case)', async () => {
        parser.parseProfile.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await profileAPI.getProfile(testData.account_id)).toEqual(StatusCode.INTERNAL_SERVER_ERROR);
    });

    it('update profile (pass case)', async () => {
        parser.updateProfile.mockResolvedValueOnce();
        expect(await profileAPI.updateProfile({
            id: testData.profile_id,
            username: testData.username, 
            firstName: testData.firstName, 
            lastName: testData.lastName, 
            profilePicture: testData.profilePicture, 
            jobTitle: testData.jobTitle, 
            bio: testData.bio, 
        })).toEqual(StatusCode.OK);
    });

    it('update profile (duplicate case)', async () => {
        parser.updateProfile.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        expect(await profileAPI.updateProfile({
            id: testData.profile_id,
            username: testData.username, 
            firstName: testData.firstName, 
            lastName: testData.lastName, 
            profilePicture: testData.profilePicture, 
            jobTitle: testData.jobTitle, 
            bio: testData.bio, 
        })).toEqual(StatusCode.CONFLICT);
    });

    it('update profile (bad data case)', async () => {
        parser.updateProfile.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await profileAPI.updateProfile({
            id: testData.profile_id,
            username: testData.username, 
            firstName: testData.firstName, 
            lastName: testData.lastName, 
            profilePicture: testData.profilePicture, 
            jobTitle: testData.jobTitle, 
            bio: testData.bio, 
        })).toEqual(StatusCode.BAD_REQUEST);
    });

    it('update profile (connection lost case)', async () => {
        parser.updateProfile.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await profileAPI.updateProfile({
            id: testData.profile_id,
            username: testData.username, 
            firstName: testData.firstName, 
            lastName: testData.lastName, 
            profilePicture: testData.profilePicture, 
            jobTitle: testData.jobTitle, 
            bio: testData.bio, 
        })).toEqual(StatusCode.CONNECTION_ERROR);
    });

    it('update profile (fatal error case)', async () => {
        parser.updateProfile.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await profileAPI.updateProfile({
            id: testData.profile_id,
            username: testData.username, 
            firstName: testData.firstName, 
            lastName: testData.lastName, 
            profilePicture: testData.profilePicture, 
            jobTitle: testData.jobTitle, 
            bio: testData.bio, 
        })).toEqual(StatusCode.INTERNAL_SERVER_ERROR);
    });

    it('delete profile (pass case)', async () => {
        parser.deleteProfile.mockResolvedValueOnce();
        expect(await profileAPI.deleteProfile(testData.profile_id)).toEqual(StatusCode.OK);
    });

    it('delete profile (duplicate case)', async () => {
        parser.deleteProfile.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        expect(await profileAPI.deleteProfile(testData.profile_id)).toEqual(StatusCode.CONFLICT);
    });

    it('delete profile (bad data case)', async () => {
        parser.deleteProfile.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await profileAPI.deleteProfile(testData.profile_id)).toEqual(StatusCode.BAD_REQUEST);
    });

    it('delete profile (connection lost case)', async () => {
        parser.deleteProfile.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await profileAPI.deleteProfile(testData.profile_id)).toEqual(StatusCode.CONNECTION_ERROR);
    });

    it('delete profile (fatal error case)', async () => {
        parser.deleteProfile.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await profileAPI.deleteProfile(testData.profile_id)).toEqual(StatusCode.INTERNAL_SERVER_ERROR);
    });
});
