const bcrypt = require("bcryptjs");
const LoginAPI = require("../../controller/loginProcessor");
const LoginParser = require("../../parser/loginParser");
const STATUS_CODES = require("../../utils/statusCodes");

jest.mock("../../parser/loginParser", () => {
    const testParser = {
        retrieveLogin: jest.fn(),
        storeLogin: jest.fn(),
        storeToken: jest.fn(),
        parseToken: jest.fn(),
        deleteToken: jest.fn(),
    };
    return jest.fn(() => testParser);
});

jest.mock("bcryptjs", () => {
    const testBcrypt = {
        compare: jest.fn(),
        genSalt: jest.fn(),
        hash: jest.fn()
    }
    return testBcrypt;
});

describe('Login Functions', () => {
    const testData = {
        email: "George123@Gmail.com",
        password: "password",
        refreshToken: "UTDefpAEyREXmgCkK04pL1SXK6jrB2tEc2ZyMbrFs61THq2y3bpRZOCj5RiPoZGa",
    };
    
    let loginAPI;
    let parser;

    beforeEach(() => {
        parser = new LoginParser();
        loginAPI = new LoginAPI();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('verify login (pass case)', async () => {
        parser.retrieveLogin.mockResolvedValueOnce([
            {email: testData.email, account_password: testData.password}
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
            {email: testData.email, account_password: testData.password}
        ]);
        bcrypt.compare.mockResolvedValueOnce(false);
        expect(await loginAPI.verifyLogin(testData.email, testData.password)).toEqual(STATUS_CODES.UNAUTHORIZED);
    });

    it('create account (pass case)', async () => {
        bcrypt.genSalt.mockResolvedValueOnce();
        bcrypt.hash.mockResolvedValueOnce();
        parser.storeLogin.mockResolvedValueOnce();
        expect(await loginAPI.createAccount(testData.email, testData.password)).toEqual(STATUS_CODES.OK);
    });

    it('create account (duplicate case)', async () => {
        bcrypt.genSalt.mockResolvedValueOnce();
        bcrypt.hash.mockResolvedValueOnce();
        parser.storeLogin.mockRejectedValue({code: '23505'});
        expect(await loginAPI.createAccount(testData.email, testData.password)).toEqual(STATUS_CODES.CONFLICT);
    });

    it('create account (connection lost case)', async () => {
        bcrypt.genSalt.mockResolvedValueOnce();
        bcrypt.hash.mockResolvedValueOnce();
        parser.storeLogin.mockRejectedValue({code: '08000'});
        expect(await loginAPI.createAccount(testData.email, testData.password)).toEqual(STATUS_CODES.CONNECTION_ERROR);
    });

    it('create account (bad data case)', async () => {
        parser.storeLogin.mockRejectedValue({code: '23514'});
        expect(await loginAPI.createAccount(testData.email, testData.password)).toEqual(STATUS_CODES.BAD_REQUEST);
    });

    it('create account (fatal error case)', async () => {
        bcrypt.genSalt.mockResolvedValueOnce();
        bcrypt.hash.mockResolvedValueOnce();
        parser.storeLogin.mockRejectedValue({code: '11111'});
        expect(await loginAPI.createAccount(testData.email, testData.password)).toEqual(STATUS_CODES.INTERNAL_SERVER_ERROR);
    });

    it('set token (pass case)', async () => {
        parser.storeToken.mockResolvedValueOnce();
        expect(await loginAPI.setToken(testData.email, testData.refreshToken)).toEqual(STATUS_CODES.OK);
    });

    it('set token (connection lost case)', async () => {
        parser.storeToken.mockRejectedValue({code: '08000'});
        expect(await loginAPI.setToken(testData.email, testData.refreshToken)).toEqual(STATUS_CODES.CONNECTION_ERROR);
    });

    it('set token (bad data case)', async () => {
        parser.storeToken.mockRejectedValue({code: '23514'});
        expect(await loginAPI.setToken(testData.email, testData.refreshToken)).toEqual(STATUS_CODES.BAD_REQUEST);
    });

    it('set token (fatal error case)', async () => {
        parser.storeToken.mockRejectedValue({code: 'aaaaah'});
        expect(await loginAPI.setToken(testData.email, testData.refreshToken)).toEqual(STATUS_CODES.INTERNAL_SERVER_ERROR);
    })

    it('verify token (pass case)', async () => {
        parser.parseToken.mockResolvedValueOnce([{'refreshtoken': testData.refreshToken}]);
        expect(await loginAPI.verifyToken(testData.email, testData.refreshToken)).toEqual(STATUS_CODES.OK);
    });

    it('verify token (unauthorized case)', async () => {
        parser.parseToken.mockResolvedValueOnce([{'refreshToken': "I'm a wrong token"}]);
        expect(await loginAPI.verifyToken(testData.email, testData.refreshToken)).toEqual(STATUS_CODES.UNAUTHORIZED);
    });

    it('verify token (gone case)', async () => {
        parser.parseToken.mockResolvedValueOnce([]);
        expect(await loginAPI.verifyToken(testData.email, testData.refreshToken)).toEqual(STATUS_CODES.GONE);
    });

    it('verify token (bad data case)', async () => {
        parser.parseToken.mockRejectedValue({code: '23514'});
        expect(await loginAPI.verifyToken(testData.email, testData.refreshToken)).toEqual(STATUS_CODES.BAD_REQUEST);
    });

    it('verify token (fatal error case)', async () => {
        parser.parseToken.mockRejectedValue({code: 'Im in your walls'});
        expect(await loginAPI.verifyLogin(testData.email, testData.refreshToken)).toEqual(STATUS_CODES.INTERNAL_SERVER_ERROR);
    });

    it('logout (pass case)', async () => {
        parser.deleteToken.mockResolvedValueOnce();
        expect(await loginAPI.logout(testData.email)).toEqual(STATUS_CODES.OK);
    });

    it('logout (error case)', async () => {
        parser.deleteToken.mockRejectedValue({code: '23514'});
        expect(await loginAPI.logout(testData.email)).toEqual(STATUS_CODES.BAD_REQUEST);
    });
});
