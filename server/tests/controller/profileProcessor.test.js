const ProfileAPI = require("../../controller/profileProcessor")
const DatabaseParser = require("../../parser/databaseParser");
const STATUS_CODES = require("../../statusCodes");

jest.mock("../../parser/DatabaseParser", () => {
    const testParser = {
        storeProfile: jest.fn(),
        parseProfile: jest.fn(),
    };
    return jest.fn(() => testParser);
});

describe('profile processor', () => {
    const testData = {
        email: "George123@Gmail.com",
        firstName: "George",
        lastName: "Johnson",
        profilePicture: "",
        bio: "I'm george!",
        jobTitle: "Unemployed"
    }

    let parser;
    let profileAPI;

    beforeEach(() => {
        parser = new DatabaseParser();
        profileAPI = new ProfileAPI();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('create profile (pass case)', async () => {
        parser.storeProfile.mockResolvedValueOnce();
        expect(await profileAPI.createProfile(testData.username, testData.email, testData.password)).toEqual(STATUS_CODES.OK);
    });

    it('create profile (duplicate case)', async () => {
        parser.storeProfile.mockRejectedValue({code: '23505'});
        expect(await profileAPI.createProfile(testData.username, testData.email, testData.password)).toEqual(STATUS_CODES.CONFLICT);
    });

    it('create profile (bad data case)', async () => {
        parser.storeProfile.mockRejectedValue({code: '23514'});
        expect(await profileAPI.createProfile(testData.username, testData.email, testData.password)).toEqual(STATUS_CODES.BAD_REQUEST);
    });

    it('create profile (connection lost case)', async () => {
        parser.storeProfile.mockRejectedValue({code: '08000'});
        expect(await profileAPI.createProfile(testData.username, testData.email, testData.password)).toEqual(STATUS_CODES.CONNECTION_ERROR);
    });

    it('create profile (fatal error case)', async () => {
        parser.storeProfile.mockRejectedValue({code: 'adsfa'});
        expect(await profileAPI.createProfile(testData.username, testData.email, testData.password)).toEqual(STATUS_CODES.INTERNAL_SERVER_ERROR);
    });

    it('get profile (pass case)', async () => {
        parser.parseProfile.mockResolvedValueOnce([
            {
                firstname: testData.firstName, lastname: testData.lastName, profilepicture: testData.profilePicture, 
                jobtitle: testData.jobTitle, bio: testData.bio, email: testData.email
            }
        ]);
        expect(await profileAPI.getProfile(testData.email)).toEqual({
            firstname: testData.firstName, lastname: testData.lastName, profilepicture: testData.profilePicture,
            jobtitle: testData.jobTitle, bio: testData.bio, email: testData.email
        });
    });

    it('get profile (profile missing case)', async () => {
        parser.parseProfile.mockResolvedValueOnce([]);
        expect(await profileAPI.getProfile(testData.email)).toEqual(STATUS_CODES.UNAUTHORIZED);
    });

    it('get profile (connection lost case)', async () => {
        parser.parseProfile.mockRejectedValue({code: '08000'});
        expect(await profileAPI.getProfile(testData.email)).toEqual(STATUS_CODES.CONNECTION_ERROR);
    });

    it('get profile (fatal error case)', async () => {
        parser.parseProfile.mockRejectedValue({code: 'adfads'});
        expect(await profileAPI.getProfile(testData.email)).toEqual(STATUS_CODES.INTERNAL_SERVER_ERROR);
    });
});