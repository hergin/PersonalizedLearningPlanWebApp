import bcrypt from "bcryptjs";
import LoginAPI from "../../controller/loginProcessor";
import LoginParser from "../../parser/loginParser";
import { STATUS_CODES } from "../../utils/statusCodes";

jest.mock("../../parser/loginParser", () => {
    const testParser = {
        retrieveLogin: jest.fn(),
        storeLogin: jest.fn(),
        storeToken: jest.fn(),
        parseToken: jest.fn(),
        deleteToken: jest.fn(),
        deleteAccount: jest.fn(),
    };
    return jest.fn(() => testParser);
});

describe('Login Functions', () => {
    const testData = {
        email: "George123@Gmail.com",
        password: "password",
        refreshToken: "UTDefpAEyREXmgCkK04pL1SXK6jrB2tEc2ZyMbrFs61THq2y3bpRZOCj5RiPoZGa",
    };
    
    let loginAPI : LoginAPI;
    let parser : any;

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
        jest.spyOn(bcrypt, 'compare').mockImplementationOnce((password, hash) => Promise.resolve(password == hash));
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
        jest.spyOn(bcrypt, 'compare').mockImplementationOnce((s, hash, callback) => {return callback});
        expect(await loginAPI.verifyLogin(testData.email, testData.password)).toEqual(STATUS_CODES.UNAUTHORIZED);
    });

    it('create account (pass case)', async () => {
        jest.spyOn(bcrypt, 'genSalt').mockImplementationOnce((rounds, callback) => callback);
        jest.spyOn(bcrypt, 'hash').mockImplementationOnce((s, salt, callback) => callback);
        parser.storeLogin.mockResolvedValueOnce();
        expect(await loginAPI.createAccount(testData.email, testData.password)).toEqual(STATUS_CODES.OK);
    });

    it('create account (duplicate case)', async () => {
        jest.spyOn(bcrypt, 'genSalt').mockImplementationOnce((rounds, callback) => callback);
        jest.spyOn(bcrypt, 'hash').mockImplementationOnce((s, salt, callback) => callback);
        parser.storeLogin.mockRejectedValue({code: '23505'});
        expect(await loginAPI.createAccount(testData.email, testData.password)).toEqual(STATUS_CODES.CONFLICT);
    });

    it('create account (connection lost case)', async () => {
        jest.spyOn(bcrypt, 'genSalt').mockImplementationOnce((rounds, callback) => callback);
        jest.spyOn(bcrypt, 'hash').mockImplementationOnce((s, salt, callback) => callback);
        parser.storeLogin.mockRejectedValue({code: '08000'});
        expect(await loginAPI.createAccount(testData.email, testData.password)).toEqual(STATUS_CODES.CONNECTION_ERROR);
    });

    it('create account (bad data case)', async () => {
        parser.storeLogin.mockRejectedValue({code: '23514'});
        expect(await loginAPI.createAccount(testData.email, testData.password)).toEqual(STATUS_CODES.BAD_REQUEST);
    });

    it('create account (fatal error case)', async () => {
        jest.spyOn(bcrypt, 'genSalt').mockImplementationOnce((rounds, callback) => callback);
        jest.spyOn(bcrypt, 'hash').mockImplementationOnce((s, salt, callback) => callback);
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
    });

    it('verify token (pass case)', async () => {
        parser.parseToken.mockResolvedValueOnce([{'refresh_token': testData.refreshToken}]);
        expect(await loginAPI.verifyToken(testData.email, testData.refreshToken)).toEqual(STATUS_CODES.OK);
    });

    it('verify token (unauthorized case)', async () => {
        parser.parseToken.mockResolvedValueOnce([{'refresh_token': "I'm a wrong token"}]);
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

    it('delete account (pass case)', async () => {
        parser.deleteAccount.mockResolvedValueOnce();
        expect(await loginAPI.delete(testData.email)).toEqual(STATUS_CODES.OK);
    });

    it('delete account (error case)', async () => {
        parser.deleteAccount.mockRejectedValue({code: '23514'});
        expect(await loginAPI.delete(testData.email)).toEqual(STATUS_CODES.BAD_REQUEST);
    });
});
