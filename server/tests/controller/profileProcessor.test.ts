export {};

import { ProfileAPI } from "../../controller/profileProcessor";
import { ProfileParser } from "../../parser/profileParser";
import { STATUS_CODES } from "../../utils/statusCodes";
import { FAKE_ERRORS } from "./fakeErrors";

jest.mock("../../parser/profileParser", () => {
    const testParser = {
        storeProfile: jest.fn(),
        parseProfile: jest.fn(),
        updateProfile: jest.fn(),
        deleteProfile: jest.fn(),
    };
    return jest.fn(() => testParser);
});

describe('profile processor', () => {
    const testData = {
        email: "George123@Gmail.com",
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
        expect(await profileAPI.createProfile(testData.username, testData.firstName, testData.lastName, testData.email)).toEqual(STATUS_CODES.OK);
    });

    it('create profile (duplicate case)', async () => {
        parser.storeProfile.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        expect(await profileAPI.createProfile(testData.username, testData.firstName, testData.lastName, testData.email)).toEqual(STATUS_CODES.CONFLICT);
    });

    it('create profile (bad data case)', async () => {
        parser.storeProfile.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await profileAPI.createProfile(testData.username, testData.firstName, testData.lastName, testData.email)).toEqual(STATUS_CODES.BAD_REQUEST);
    });

    it('create profile (connection lost case)', async () => {
        parser.storeProfile.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await profileAPI.createProfile(testData.username, testData.firstName, testData.lastName, testData.email)).toEqual(STATUS_CODES.CONNECTION_ERROR);
    });

    it('create profile (fatal error case)', async () => {
        parser.storeProfile.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await profileAPI.createProfile(testData.username, testData.firstName, testData.lastName, testData.email)).toEqual(STATUS_CODES.INTERNAL_SERVER_ERROR);
    });

    it('get profile (pass case)', async () => {
        parser.parseProfile.mockResolvedValueOnce({
            username: testData.username, first_name: testData.firstName, last_name: testData.lastName, 
            profile_picture: testData.profilePicture, job_title: testData.jobTitle, bio: testData.bio, email: testData.email
        });
        expect(await profileAPI.getProfile(testData.email)).toEqual({
            username: testData.username, first_name: testData.firstName, last_name: testData.lastName, 
            profile_picture: testData.profilePicture, job_title: testData.jobTitle, bio: testData.bio, email: testData.email
        });
    });

    it('get profile (profile missing case)', async () => {
        parser.parseProfile.mockResolvedValueOnce(undefined);
        expect(await profileAPI.getProfile(testData.email)).toEqual(STATUS_CODES.UNAUTHORIZED);
    });

    it('get profile (connection lost case)', async () => {
        parser.parseProfile.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await profileAPI.getProfile(testData.email)).toEqual(STATUS_CODES.CONNECTION_ERROR);
    });

    it('get profile (fatal error case)', async () => {
        parser.parseProfile.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await profileAPI.getProfile(testData.email)).toEqual(STATUS_CODES.INTERNAL_SERVER_ERROR);
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
        })).toEqual(STATUS_CODES.OK);
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
        })).toEqual(STATUS_CODES.CONFLICT);
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
        })).toEqual(STATUS_CODES.BAD_REQUEST);
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
        })).toEqual(STATUS_CODES.CONNECTION_ERROR);
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
        })).toEqual(STATUS_CODES.INTERNAL_SERVER_ERROR);
    });

    it('delete profile (pass case)', async () => {
        parser.deleteProfile.mockResolvedValueOnce();
        expect(await profileAPI.deleteProfile(testData.profile_id)).toEqual(STATUS_CODES.OK);
    });

    it('delete profile (duplicate case)', async () => {
        parser.deleteProfile.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        expect(await profileAPI.deleteProfile(testData.profile_id)).toEqual(STATUS_CODES.CONFLICT);
    });

    it('delete profile (bad data case)', async () => {
        parser.deleteProfile.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await profileAPI.deleteProfile(testData.profile_id)).toEqual(STATUS_CODES.BAD_REQUEST);
    });

    it('delete profile (connection lost case)', async () => {
        parser.deleteProfile.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await profileAPI.deleteProfile(testData.profile_id)).toEqual(STATUS_CODES.CONNECTION_ERROR);
    });

    it('delete profile (fatal error case)', async () => {
        parser.deleteProfile.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await profileAPI.deleteProfile(testData.profile_id)).toEqual(STATUS_CODES.INTERNAL_SERVER_ERROR);
    });
});
