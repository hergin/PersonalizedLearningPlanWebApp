const bcrypt = require("bcrypt");
const LoginAPI = require("../../controller/loginProcessor");
const DatabaseParser = require("../../parser/databaseParser");
const STATUS_CODES = require("../../statusCodes");

jest.mock("../../parser/DatabaseParser", () => {
    const testParser = {
        retrieveLogin: jest.fn(),
        storeLogin: jest.fn(),
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
        firstName: "George",
        lastName: "Johnson",
        profilePicture: "",
        bio: "I'm george!",
        jobTitle: "Unemployed"
    };
    
    let loginAPI;
    let parser;

    beforeEach(() => {
        parser = new DatabaseParser();
        loginAPI = new LoginAPI();
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

    it('create account (fatal error case)', async () => {
        bcrypt.genSalt.mockResolvedValueOnce();
        bcrypt.hash.mockResolvedValueOnce();
        parser.storeLogin.mockRejectedValue({code: '11111'});
        expect(await loginAPI.createAccount(testData.username, testData.email, testData.password)).toEqual(STATUS_CODES.INTERNAL_SERVER_ERROR);
    });

    it('create profile (pass case)', async () => {
        parser.storeProfile.mockResolvedValueOnce();
        expect(await loginAPI.createProfile(testData.username, testData.email, testData.password)).toEqual(STATUS_CODES.OK);
    });

    it('create profile (duplicate case)', async () => {
        parser.storeProfile.mockRejectedValue({code: '23505'});
        expect(await loginAPI.createProfile(testData.username, testData.email, testData.password)).toEqual(STATUS_CODES.CONFLICT);
    });

    it('create profile (connection lost case)', async () => {
        parser.storeProfile.mockRejectedValue({code: '08000'});
        expect(await loginAPI.createProfile(testData.username, testData.email, testData.password)).toEqual(STATUS_CODES.CONNECTION_ERROR);
    });

    it('create profile (fatal error case)', async () => {
        parser.storeProfile.mockRejectedValue({code: 'adsfa'});
        expect(await loginAPI.createProfile(testData.username, testData.email, testData.password)).toEqual(STATUS_CODES.INTERNAL_SERVER_ERROR);
    });

    it('get profile (pass case)', async () => {
        parser.parseProfile.mockResolvedValueOnce([
            {firstname: testData.firstName, lastname: testData.lastName, profilepicture: testData.profilePicture, 
                jobtitle: testData.jobTitle, bio: testData.bio, email: testData.email}
        ]);
        expect(await loginAPI.getProfile(testData.email)).toEqual({
            firstname: testData.firstName, lastname: testData.lastName, profilepicture: testData.profilePicture,
            jobtitle: testData.jobTitle, bio: testData.bio, email: testData.email
        });
    });

    it('get profile (profile missing case)', async () => {
        parser.parseProfile.mockResolvedValueOnce([]);
        expect(await loginAPI.getProfile(testData.email)).toEqual(STATUS_CODES.UNAUTHORIZED);
    });

    it('get profile (connection lost case)', async () => {
        parser.parseProfile.mockRejectedValue({code: '08000'});
        expect(await loginAPI.getProfile(testData.email)).toEqual(STATUS_CODES.CONNECTION_ERROR);
    });

    it('get profile (fatal error case)', async () => {
        parser.parseProfile.mockRejectedValue({code: 'adfads'});
        expect(await loginAPI.getProfile(testData.email)).toEqual(STATUS_CODES.INTERNAL_SERVER_ERROR);
    });
});
