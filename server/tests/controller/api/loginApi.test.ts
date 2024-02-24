export {};

import bcrypt from "bcryptjs";
import LoginAPI from "../../../controller/api/loginApi";
import LoginParser from "../../../parser/loginParser";
import { StatusCode } from "../../../types";
import { FAKE_ERRORS, TEST_ACCOUNT } from "../global/mockValues.test";
jest.mock("../../../parser/loginParser");

describe('Login Functions', () => {
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
            {id: TEST_ACCOUNT.id, email: TEST_ACCOUNT.email, account_password: TEST_ACCOUNT.password}
        ]);
        jest.spyOn(bcrypt, 'compare').mockImplementationOnce((password, hash) => Promise.resolve(password == hash));
        expect(await loginAPI.verifyLogin(TEST_ACCOUNT.email, TEST_ACCOUNT.password)).toEqual(TEST_ACCOUNT.id);
    });

    it('verify login (email does not exist case)', async () => {
        parser.retrieveLogin.mockResolvedValueOnce([]);
        const result = await loginAPI.verifyLogin(TEST_ACCOUNT.email, TEST_ACCOUNT.password);
        expect(parser.retrieveLogin).toHaveBeenCalledTimes(1);
        expect(parser.retrieveLogin).toHaveBeenCalledWith(TEST_ACCOUNT.email);
        expect(result).toEqual(StatusCode.GONE);
    });

    it('verify login (wrong password case)', async () => {
        parser.retrieveLogin.mockResolvedValueOnce([
            {email: TEST_ACCOUNT.email, account_password: TEST_ACCOUNT.password}
        ]);
        jest.spyOn(bcrypt, 'compare').mockImplementationOnce((s, hash, callback) => {return callback});
        expect(await loginAPI.verifyLogin(TEST_ACCOUNT.email, TEST_ACCOUNT.password)).toEqual(StatusCode.UNAUTHORIZED);
    });

    it('create account (pass case)', async () => {
        jest.spyOn(bcrypt, 'genSalt').mockImplementationOnce((rounds, callback) => callback);
        jest.spyOn(bcrypt, 'hash').mockImplementationOnce((s, salt, callback) => callback);
        parser.storeLogin.mockResolvedValueOnce();
        expect(await loginAPI.createAccount(TEST_ACCOUNT.email, TEST_ACCOUNT.password)).toEqual(StatusCode.OK);
    });

    it('create account (duplicate case)', async () => {
        jest.spyOn(bcrypt, 'genSalt').mockImplementationOnce((rounds, callback) => callback);
        jest.spyOn(bcrypt, 'hash').mockImplementationOnce((s, salt, callback) => callback);
        parser.storeLogin.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        expect(await loginAPI.createAccount(TEST_ACCOUNT.email, TEST_ACCOUNT.password)).toEqual(StatusCode.CONFLICT);
    });

    it('create account (connection lost case)', async () => {
        jest.spyOn(bcrypt, 'genSalt').mockImplementationOnce((rounds, callback) => callback);
        jest.spyOn(bcrypt, 'hash').mockImplementationOnce((s, salt, callback) => callback);
        parser.storeLogin.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await loginAPI.createAccount(TEST_ACCOUNT.email, TEST_ACCOUNT.password)).toEqual(StatusCode.CONNECTION_ERROR);
    });

    it('create account (bad data case)', async () => {
        parser.storeLogin.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await loginAPI.createAccount(TEST_ACCOUNT.email, TEST_ACCOUNT.password)).toEqual(StatusCode.BAD_REQUEST);
    });

    it('create account (fatal error case)', async () => {
        jest.spyOn(bcrypt, 'genSalt').mockImplementationOnce((rounds, callback) => callback);
        jest.spyOn(bcrypt, 'hash').mockImplementationOnce((s, salt, callback) => callback);
        parser.storeLogin.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await loginAPI.createAccount(TEST_ACCOUNT.email, TEST_ACCOUNT.password)).toEqual(StatusCode.INTERNAL_SERVER_ERROR);
    });

    it('set token (pass case)', async () => {
        parser.storeToken.mockResolvedValueOnce();
        expect(await loginAPI.setToken(TEST_ACCOUNT.id, TEST_ACCOUNT.refreshToken)).toEqual(StatusCode.OK);
    });

    it('set token (connection lost case)', async () => {
        parser.storeToken.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await loginAPI.setToken(TEST_ACCOUNT.id, TEST_ACCOUNT.refreshToken)).toEqual(StatusCode.CONNECTION_ERROR);
    });

    it('set token (bad data case)', async () => {
        parser.storeToken.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await loginAPI.setToken(TEST_ACCOUNT.id, TEST_ACCOUNT.refreshToken)).toEqual(StatusCode.BAD_REQUEST);
    });

    it('set token (fatal error case)', async () => {
        parser.storeToken.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await loginAPI.setToken(TEST_ACCOUNT.id, TEST_ACCOUNT.refreshToken)).toEqual(StatusCode.INTERNAL_SERVER_ERROR);
    });

    it('verify token (pass case)', async () => {
        parser.parseToken.mockResolvedValueOnce([{'refresh_token': TEST_ACCOUNT.refreshToken}]);
        expect(await loginAPI.verifyToken(TEST_ACCOUNT.id, TEST_ACCOUNT.refreshToken)).toEqual(StatusCode.OK);
    });

    it('verify token (unauthorized case)', async () => {
        parser.parseToken.mockResolvedValueOnce([{'refresh_token': "I'm a wrong token"}]);
        expect(await loginAPI.verifyToken(TEST_ACCOUNT.id, TEST_ACCOUNT.refreshToken)).toEqual(StatusCode.UNAUTHORIZED);
    });

    it('verify token (gone case)', async () => {
        parser.parseToken.mockResolvedValueOnce([]);
        expect(await loginAPI.verifyToken(TEST_ACCOUNT.id, TEST_ACCOUNT.refreshToken)).toEqual(StatusCode.GONE);
    });

    it('verify token (bad data case)', async () => {
        parser.parseToken.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await loginAPI.verifyToken(TEST_ACCOUNT.id, TEST_ACCOUNT.refreshToken)).toEqual(StatusCode.BAD_REQUEST);
    });

    it('verify token (fatal error case)', async () => {
        parser.parseToken.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await loginAPI.verifyToken(TEST_ACCOUNT.id, TEST_ACCOUNT.refreshToken)).toEqual(StatusCode.INTERNAL_SERVER_ERROR);
    });

    it('logout (pass case)', async () => {
        parser.deleteToken.mockResolvedValueOnce();
        expect(await loginAPI.logout(TEST_ACCOUNT.id)).toEqual(StatusCode.OK);
    });

    it('logout (error case)', async () => {
        parser.deleteToken.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await loginAPI.logout(TEST_ACCOUNT.id)).toEqual(StatusCode.BAD_REQUEST);
    });

    it('delete account (pass case)', async () => {
        parser.deleteAccount.mockResolvedValueOnce();
        expect(await loginAPI.delete(TEST_ACCOUNT.id)).toEqual(StatusCode.OK);
    });

    it('delete account (error case)', async () => {
        parser.deleteAccount.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await loginAPI.delete(TEST_ACCOUNT.id)).toEqual(StatusCode.BAD_REQUEST);
    });
});
