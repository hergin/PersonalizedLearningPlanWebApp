const bcrypt = require("bcrypt");
const LoginAPI = require("../../controller/loginProcessor");
const ProfileAPI = require("../../controller/profileProcessor")
const DatabaseParser = require("../../parser/databaseParser");
const STATUS_CODES = require("../../statusCodes");

jest.mock("../../parser/DatabaseParser", () => {
    const testParser = {
        retrieveLogin: jest.fn(),
        storeLogin: jest.fn(),
        storeToken: jest.fn(),
        parseToken: jest.fn(),
        storeProfile: jest.fn(),
        parseProfile: jest.fn(),
    };
    return jest.fn(() => testParser);
});

jest.mock("bcrypt", () => {
    const testBcrypt = {
        compare: jest.fn(),
        genSalt: jest.fn(),
        hash: jest.fn()
    }
    return testBcrypt;
});

describe('Login Functions', () => {
    const testData = {
        username: "Xx_george_xX",
        password: "password",
        email: "George123@Gmail.com",
        refreshToken: "UTDefpAEyREXmgCkK04pL1SXK6jrB2tEc2ZyMbrFs61THq2y3bpRZOCj5RiPoZGa",
        firstName: "George",
        lastName: "Johnson",
        profilePicture: "",
        bio: "I'm george!",
        jobTitle: "Unemployed"
    };
    
    let loginAPI;
    let parser;
    let profileAPI;

    beforeEach(() => {
        parser = new DatabaseParser();
        loginAPI = new LoginAPI();
        profileAPI = new ProfileAPI();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('verify login (pass case)', async () => {
        parser.retrieveLogin.mockResolvedValueOnce([
            {email: testData.email, username: testData.username, account_password: testData.password}
        ]);
        bcrypt.compare.mockResolvedValueOnce((password, hash) => {password == hash});
        expect(await loginAPI.verifyLogin(testData.email, testData.password)).toEqual(STATUS_CODES.OK);
    });

    it('verify login (email does not exist case)', async () => {
        parser.retrieveLogin.mockResolvedValueOnce([]);
        expect(await loginAPI.verifyLogin(testData.email, testData.password)).toEqual(STATUS_CODES.GONE);
    });

    it('verify login (wrong password case)', async () => {
        parser.retrieveLogin.mockResolvedValueOnce([
            {email: testData.email, username: testData.username, account_password: testData.password}
        ]);
        bcrypt.compare.mockResolvedValueOnce(false);
        expect(await loginAPI.verifyLogin(testData.email, testData.password)).toEqual(STATUS_CODES.UNAUTHORIZED);
    });

    it('create account (pass case)', async () => {
        bcrypt.genSalt.mockResolvedValueOnce();
        bcrypt.hash.mockResolvedValueOnce();
        parser.storeLogin.mockResolvedValueOnce();
        expect(await loginAPI.createAccount(testData.username, testData.email, testData.password)).toEqual(STATUS_CODES.OK);
    });

    it('create account (duplicate case)', async () => {
        bcrypt.genSalt.mockResolvedValueOnce();
        bcrypt.hash.mockResolvedValueOnce();
        parser.storeLogin.mockRejectedValue({code: '23505'});
        expect(await loginAPI.createAccount(testData.username, testData.email, testData.password)).toEqual(STATUS_CODES.CONFLICT);
    });

    it('create account (connection lost case)', async () => {
        bcrypt.genSalt.mockResolvedValueOnce();
        bcrypt.hash.mockResolvedValueOnce();
        parser.storeLogin.mockRejectedValue({code: '08000'});
        expect(await loginAPI.createAccount(testData.username, testData.email, testData.password)).toEqual(STATUS_CODES.CONNECTION_ERROR);
    });

    it('create account (bad data case)', async () => {
        parser.storeLogin.mockRejectedValue({code: '23514'});
        expect(await loginAPI.createAccount(testData.username, testData.email, testData.password)).toEqual(STATUS_CODES.BAD_REQUEST);
    });

    it('create account (fatal error case)', async () => {
        bcrypt.genSalt.mockResolvedValueOnce();
        bcrypt.hash.mockResolvedValueOnce();
        parser.storeLogin.mockRejectedValue({code: '11111'});
        expect(await loginAPI.createAccount(testData.username, testData.email, testData.password)).toEqual(STATUS_CODES.INTERNAL_SERVER_ERROR);
    });

    it('set token (pass case)', async () => {
        parser.storeToken.mockResolvedValueOnce();
        expect(await loginAPI.setToken(testData.email)).toEqual(STATUS_CODES.OK);
    });

    it('parse token (pass case)', async () => {
        parser.parseToken.mockResolvedValueOnce([{'refreshtoken': testData.refreshToken}]);
        expect(await loginAPI.verifyToken(testData.email, testData.refreshToken)).toEqual(STATUS_CODES.OK);
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
        expect(await loginAPI.getProfile(testData.email)).toEqual([
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
