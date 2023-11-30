const bcrypt = require("bcrypt");
const LoginAPI = require("../../controller/loginProcessor");
const DatabaseParser = require("../../parser/databaseParser");
const STATUS_CODES = require("../../statusCodes");

jest.mock("../../parser/DatabaseParser", () => {
    const testParser = {
        retrieveLogin: jest.fn(),
        storeLogin: jest.fn(),
        storeToken: jest.fn(),
        parseToken: jest.fn(),
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
});
    