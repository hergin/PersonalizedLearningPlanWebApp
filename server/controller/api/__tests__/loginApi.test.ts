import bcrypt from "bcryptjs";
import LoginAPI from "../loginApi";
import LoginParser from "../../../parser/loginParser";
import { STATUS_CODE } from "../../../types";
import { FAKE_ERRORS, TEST_ACCOUNT } from "../../global/mockValues";

jest.mock("../../../parser/loginParser");

describe('Login Api Unit Tests', () => {
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
            {id: TEST_ACCOUNT.id, email: TEST_ACCOUNT.email, account_password: TEST_ACCOUNT.password, site_role: TEST_ACCOUNT.role}
        ]);
        jest.spyOn(bcrypt, 'compare').mockImplementationOnce((password, hash) => Promise.resolve(password == hash));
        expect(await loginAPI.verifyLogin(TEST_ACCOUNT.email, TEST_ACCOUNT.password)).toEqual({
            id: TEST_ACCOUNT.id, role: TEST_ACCOUNT.role});
    });

    it('verify login (email does not exist case)', async () => {
        parser.retrieveLogin.mockResolvedValueOnce([]);
        const result = await loginAPI.verifyLogin(TEST_ACCOUNT.email, TEST_ACCOUNT.password);
        expect(parser.retrieveLogin).toHaveBeenCalledTimes(1);
        expect(parser.retrieveLogin).toHaveBeenCalledWith(TEST_ACCOUNT.email);
        expect(result).toEqual(STATUS_CODE.GONE);
    });

    it('verify login (wrong password case)', async () => {
        const wrongPassword = "This is the wrong password."
        parser.retrieveLogin.mockResolvedValueOnce([
            {id: TEST_ACCOUNT.id, email: TEST_ACCOUNT.email, account_password: TEST_ACCOUNT.password, role: TEST_ACCOUNT.role}
        ]);
        const mockCompare = jest.spyOn(bcrypt, 'compare').mockImplementationOnce((s, hash, callback) => {return callback});
        const result = await loginAPI.verifyLogin(TEST_ACCOUNT.email, wrongPassword);
        expect(parser.retrieveLogin).toHaveBeenCalledTimes(1);
        expect(parser.retrieveLogin).toHaveBeenCalledWith(TEST_ACCOUNT.email);
        expect(mockCompare).toHaveBeenCalledTimes(1);
        expect(mockCompare).toHaveBeenCalledWith(wrongPassword, TEST_ACCOUNT.password);
        expect(result).toEqual(STATUS_CODE.UNAUTHORIZED);
    });

    it('verify login (error case)', async () => {
        parser.retrieveLogin.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        const result = await loginAPI.verifyLogin(TEST_ACCOUNT.email, TEST_ACCOUNT.password);
        expect(parser.retrieveLogin).toHaveBeenCalledTimes(1);
        expect(parser.retrieveLogin).toHaveBeenCalledWith(TEST_ACCOUNT.email);
        expect(result).toEqual(STATUS_CODE.INTERNAL_SERVER_ERROR);
    });

    it('create account (pass case)', async () => {
        jest.spyOn(bcrypt, 'genSalt').mockImplementationOnce((rounds, callback) => callback);
        jest.spyOn(bcrypt, 'hash').mockImplementationOnce((s, salt, callback) => callback);
        parser.storeLogin.mockResolvedValueOnce();
        expect(await loginAPI.createAccount(TEST_ACCOUNT.email, TEST_ACCOUNT.password)).toEqual(STATUS_CODE.OK);
    });

    it('create account (duplicate case)', async () => {
        jest.spyOn(bcrypt, 'genSalt').mockImplementationOnce((rounds, callback) => callback);
        jest.spyOn(bcrypt, 'hash').mockImplementationOnce((s, salt, callback) => callback);
        parser.storeLogin.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        expect(await loginAPI.createAccount(TEST_ACCOUNT.email, TEST_ACCOUNT.password)).toEqual(STATUS_CODE.CONFLICT);
    });

    it('create account (connection lost case)', async () => {
        jest.spyOn(bcrypt, 'genSalt').mockImplementationOnce((rounds, callback) => callback);
        jest.spyOn(bcrypt, 'hash').mockImplementationOnce((s, salt, callback) => callback);
        parser.storeLogin.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await loginAPI.createAccount(TEST_ACCOUNT.email, TEST_ACCOUNT.password)).toEqual(STATUS_CODE.CONNECTION_ERROR);
    });

    it('create account (bad data case)', async () => {
        parser.storeLogin.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await loginAPI.createAccount(TEST_ACCOUNT.email, TEST_ACCOUNT.password)).toEqual(STATUS_CODE.BAD_REQUEST);
    });

    it('create account (fatal error case)', async () => {
        jest.spyOn(bcrypt, 'genSalt').mockImplementationOnce((rounds, callback) => callback);
        jest.spyOn(bcrypt, 'hash').mockImplementationOnce((s, salt, callback) => callback);
        parser.storeLogin.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await loginAPI.createAccount(TEST_ACCOUNT.email, TEST_ACCOUNT.password)).toEqual(STATUS_CODE.INTERNAL_SERVER_ERROR);
    });

    it('set token (pass case)', async () => {
        parser.storeToken.mockResolvedValueOnce();
        expect(await loginAPI.setToken(TEST_ACCOUNT.id, TEST_ACCOUNT.refreshToken)).toEqual(STATUS_CODE.OK);
    });

    it('set token (connection lost case)', async () => {
        parser.storeToken.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await loginAPI.setToken(TEST_ACCOUNT.id, TEST_ACCOUNT.refreshToken)).toEqual(STATUS_CODE.CONNECTION_ERROR);
    });

    it('set token (bad data case)', async () => {
        parser.storeToken.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await loginAPI.setToken(TEST_ACCOUNT.id, TEST_ACCOUNT.refreshToken)).toEqual(STATUS_CODE.BAD_REQUEST);
    });

    it('set token (fatal error case)', async () => {
        parser.storeToken.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await loginAPI.setToken(TEST_ACCOUNT.id, TEST_ACCOUNT.refreshToken)).toEqual(STATUS_CODE.INTERNAL_SERVER_ERROR);
    });

    it('verify token (pass case)', async () => {
        parser.parseToken.mockResolvedValueOnce([{'refresh_token': TEST_ACCOUNT.refreshToken}]);
        expect(await loginAPI.verifyToken(TEST_ACCOUNT.id, TEST_ACCOUNT.refreshToken)).toEqual(STATUS_CODE.OK);
    });

    it('verify token (unauthorized case)', async () => {
        parser.parseToken.mockResolvedValueOnce([{'refresh_token': "I'm a wrong token"}]);
        expect(await loginAPI.verifyToken(TEST_ACCOUNT.id, TEST_ACCOUNT.refreshToken)).toEqual(STATUS_CODE.UNAUTHORIZED);
    });

    it('verify token (gone case)', async () => {
        parser.parseToken.mockResolvedValueOnce([]);
        expect(await loginAPI.verifyToken(TEST_ACCOUNT.id, TEST_ACCOUNT.refreshToken)).toEqual(STATUS_CODE.GONE);
    });

    it('verify token (bad data case)', async () => {
        parser.parseToken.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await loginAPI.verifyToken(TEST_ACCOUNT.id, TEST_ACCOUNT.refreshToken)).toEqual(STATUS_CODE.BAD_REQUEST);
    });

    it('verify token (fatal error case)', async () => {
        parser.parseToken.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await loginAPI.verifyToken(TEST_ACCOUNT.id, TEST_ACCOUNT.refreshToken)).toEqual(STATUS_CODE.INTERNAL_SERVER_ERROR);
    });

    it('logout (pass case)', async () => {
        parser.deleteToken.mockResolvedValueOnce();
        expect(await loginAPI.logout(TEST_ACCOUNT.id)).toEqual(STATUS_CODE.OK);
    });

    it('logout (error case)', async () => {
        parser.deleteToken.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await loginAPI.logout(TEST_ACCOUNT.id)).toEqual(STATUS_CODE.BAD_REQUEST);
    });

    it('delete account (pass case)', async () => {
        parser.deleteAccount.mockResolvedValueOnce();
        expect(await loginAPI.delete(TEST_ACCOUNT.id)).toEqual(STATUS_CODE.OK);
    });

    it('delete account (error case)', async () => {
        parser.deleteAccount.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await loginAPI.delete(TEST_ACCOUNT.id)).toEqual(STATUS_CODE.BAD_REQUEST);
    });

    it('get understudies (pass case)', async () => {
        parser.parseUnderstudies.mockResolvedValueOnce([TEST_ACCOUNT]);
        const actual = await loginAPI.getUnderstudies(TEST_ACCOUNT.id);
        expect(parser.parseUnderstudies).toHaveBeenCalledTimes(1);
        expect(parser.parseUnderstudies).toHaveBeenCalledWith(TEST_ACCOUNT.id);
        expect(actual).toEqual([TEST_ACCOUNT]);
    });

    it('get understudies (error case)', async () => {
        parser.parseUnderstudies.mockRejectedValue(FAKE_ERRORS.badRequest);
        const actual = await loginAPI.getUnderstudies(TEST_ACCOUNT.id);
        expect(parser.parseUnderstudies).toHaveBeenCalledTimes(1);
        expect(parser.parseUnderstudies).toHaveBeenCalledWith(TEST_ACCOUNT.id);
        expect(actual).toEqual(STATUS_CODE.BAD_REQUEST);
    });
});
