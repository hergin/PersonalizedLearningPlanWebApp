import bcrypt from "bcryptjs";
import LoginAPI from "../loginApi";
import DatabaseParser from "../../../parser/databaseParser";
import { STATUS_CODE } from "../../../types";
import { FAKE_ERRORS, TEST_ACCOUNT } from "../../global/mockValues";

jest.mock("../../../parser/databaseParser");
jest.mock("bcryptjs", () => ({
    ...jest.requireActual,
    compare: jest.fn(),
    genSalt: jest.fn(),
    hash: jest.fn(),
}));

describe('Login Api Unit Tests', () => {
    var loginAPI : LoginAPI;
    var mockParseDatabase: jest.Mock;
    var mockUpdateDatabase: jest.Mock;
    var mockCompare: jest.Mock;
    var mockGenSalt: jest.Mock;
    var mockHash: jest.Mock;

    beforeEach(() => {
        const parser = new DatabaseParser();
        mockParseDatabase = parser.parseDatabase as jest.Mock;
        mockUpdateDatabase = parser.updateDatabase as jest.Mock;
        loginAPI = new LoginAPI();
        mockCompare = bcrypt.compare as jest.Mock;
        mockGenSalt = bcrypt.genSalt as jest.Mock;
        mockHash = bcrypt.hash as jest.Mock;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('verify login (pass case)', async () => {
        mockParseDatabase.mockResolvedValueOnce([
            {id: TEST_ACCOUNT.id, email: TEST_ACCOUNT.email, account_password: TEST_ACCOUNT.password, site_role: TEST_ACCOUNT.role}
        ]);
        mockCompare.mockReturnValueOnce(true);
        const result = await loginAPI.verifyLogin(TEST_ACCOUNT.email, TEST_ACCOUNT.password);
        expect(mockParseDatabase).toHaveBeenCalledTimes(1);
        expect(mockParseDatabase).toHaveBeenCalledWith({
            text: "SELECT * FROM ACCOUNT WHERE email = $1",
            values: [TEST_ACCOUNT.email]
        });
        expect(mockCompare).toHaveBeenCalledTimes(1);
        expect(mockCompare).toHaveBeenCalledWith(TEST_ACCOUNT.password, TEST_ACCOUNT.password);
        expect(result).toEqual({id: TEST_ACCOUNT.id, role: TEST_ACCOUNT.role});
    });

    it('verify login (email does not exist case)', async () => {
        mockParseDatabase.mockResolvedValueOnce([]);
        const result = await loginAPI.verifyLogin(TEST_ACCOUNT.email, TEST_ACCOUNT.password);
        expect(mockParseDatabase).toHaveBeenCalledTimes(1);
        expect(mockParseDatabase).toHaveBeenCalledWith({
            text: "SELECT * FROM ACCOUNT WHERE email = $1",
            values: [TEST_ACCOUNT.email]
        });
        expect(result).toEqual(STATUS_CODE.GONE);
    });

    it('verify login (wrong password case)', async () => {
        const wrongPassword = "This is the wrong password."
        mockParseDatabase.mockResolvedValueOnce([
            {id: TEST_ACCOUNT.id, email: TEST_ACCOUNT.email, account_password: TEST_ACCOUNT.password, role: TEST_ACCOUNT.role}
        ]);
        mockCompare.mockReturnValueOnce(false);
        const result = await loginAPI.verifyLogin(TEST_ACCOUNT.email, wrongPassword);
        expect(mockParseDatabase).toHaveBeenCalledTimes(1);
        expect(mockParseDatabase).toHaveBeenCalledWith({
            text: "SELECT * FROM ACCOUNT WHERE email = $1",
            values: [TEST_ACCOUNT.email]
        });
        expect(mockCompare).toHaveBeenCalledTimes(1);
        expect(mockCompare).toHaveBeenCalledWith(wrongPassword, TEST_ACCOUNT.password);
        expect(result).toEqual(STATUS_CODE.UNAUTHORIZED);
    });

    it('verify login (error case)', async () => {
        mockParseDatabase.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        const result = await loginAPI.verifyLogin(TEST_ACCOUNT.email, TEST_ACCOUNT.password);
        expect(mockParseDatabase).toHaveBeenCalledTimes(1);
        expect(mockParseDatabase).toHaveBeenCalledWith({
            text: "SELECT * FROM ACCOUNT WHERE email = $1",
            values: [TEST_ACCOUNT.email]
        });
        expect(result).toEqual(STATUS_CODE.INTERNAL_SERVER_ERROR);
    });

    it('create account (pass case)', async () => {
        const saltResult = "ur salty";
        const hashedPassword = "super secret password";
        mockGenSalt.mockResolvedValueOnce(saltResult);
        mockHash.mockResolvedValueOnce(hashedPassword);
        mockUpdateDatabase.mockResolvedValueOnce({});
        const result = await loginAPI.createAccount(TEST_ACCOUNT.email, TEST_ACCOUNT.password);
        expect(mockGenSalt).toHaveBeenCalledTimes(1);
        expect(mockGenSalt).toHaveBeenCalledWith(10);
        expect(mockHash).toHaveBeenCalledTimes(1);
        expect(mockHash).toHaveBeenCalledWith(TEST_ACCOUNT.password, saltResult);
        expect(mockUpdateDatabase).toHaveBeenCalledTimes(1);
        expect(mockUpdateDatabase).toHaveBeenCalledWith({
            text: "INSERT INTO ACCOUNT(email, account_password) VALUES($1, $2)",
            values: [TEST_ACCOUNT.email, hashedPassword]
        });
        expect(result).toEqual(STATUS_CODE.OK);
    });

    it('create account (fatal error case)', async () => {
        const saltResult = "ur salty";
        const hashedPassword = "super secret password";
        mockGenSalt.mockResolvedValueOnce(saltResult);
        mockHash.mockResolvedValueOnce(hashedPassword);
        mockUpdateDatabase.mockRejectedValueOnce(FAKE_ERRORS.fatalServerError);
        const result = await loginAPI.createAccount(TEST_ACCOUNT.email, TEST_ACCOUNT.password);
        expect(mockGenSalt).toHaveBeenCalledTimes(1);
        expect(mockGenSalt).toHaveBeenCalledWith(10);
        expect(mockHash).toHaveBeenCalledTimes(1);
        expect(mockHash).toHaveBeenCalledWith(TEST_ACCOUNT.password, saltResult);
        expect(mockUpdateDatabase).toHaveBeenCalledTimes(1);
        expect(mockUpdateDatabase).toHaveBeenCalledWith({
            text: "INSERT INTO ACCOUNT(email, account_password) VALUES($1, $2)",
            values: [TEST_ACCOUNT.email, hashedPassword]
        });
        expect(result).toEqual(STATUS_CODE.INTERNAL_SERVER_ERROR);
    });

    it('set token (pass case)', async () => {
        mockUpdateDatabase.mockResolvedValueOnce({});
        expect(await loginAPI.setToken(TEST_ACCOUNT.id, TEST_ACCOUNT.refreshToken)).toEqual(STATUS_CODE.OK);
    });

    it('set token (fatal error case)', async () => {
        mockUpdateDatabase.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await loginAPI.setToken(TEST_ACCOUNT.id, TEST_ACCOUNT.refreshToken)).toEqual(STATUS_CODE.INTERNAL_SERVER_ERROR);
    });

    it('verify token (pass case)', async () => {
        mockParseDatabase.mockResolvedValueOnce([{'refresh_token': TEST_ACCOUNT.refreshToken}]);
        expect(await loginAPI.verifyToken(TEST_ACCOUNT.id, TEST_ACCOUNT.refreshToken)).toEqual(STATUS_CODE.OK);
    });

    it('verify token (fatal error case)', async () => {
        mockParseDatabase.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await loginAPI.verifyToken(TEST_ACCOUNT.id, TEST_ACCOUNT.refreshToken)).toEqual(STATUS_CODE.INTERNAL_SERVER_ERROR);
    });

    it('logout (pass case)', async () => {
        mockUpdateDatabase.mockResolvedValueOnce({});
        expect(await loginAPI.logout(TEST_ACCOUNT.id)).toEqual(STATUS_CODE.OK);
    });

    it('logout (error case)', async () => {
        mockUpdateDatabase.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await loginAPI.logout(TEST_ACCOUNT.id)).toEqual(STATUS_CODE.BAD_REQUEST);
    });

    it('delete account (pass case)', async () => {
        mockUpdateDatabase.mockResolvedValueOnce({});
        expect(await loginAPI.delete(TEST_ACCOUNT.id)).toEqual(STATUS_CODE.OK);
    });

    it('delete account (error case)', async () => {
        mockUpdateDatabase.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await loginAPI.delete(TEST_ACCOUNT.id)).toEqual(STATUS_CODE.BAD_REQUEST);
    });

    it('get understudies (pass case)', async () => {
        mockParseDatabase.mockResolvedValueOnce([TEST_ACCOUNT]);
        const actual = await loginAPI.getUnderstudies(TEST_ACCOUNT.id);
        expect(mockParseDatabase).toHaveBeenCalledTimes(1);
        expect(mockParseDatabase).toHaveBeenCalledWith({
            text: "SELECT * FROM UNDERSTUDY_DATA WHERE coach_id = $1",
            values: [TEST_ACCOUNT.id]
        });
        expect(actual).toEqual([TEST_ACCOUNT]);
    });

    it('get understudies (error case)', async () => {
        mockParseDatabase.mockRejectedValue(FAKE_ERRORS.badRequest);
        const actual = await loginAPI.getUnderstudies(TEST_ACCOUNT.id);
        expect(mockParseDatabase).toHaveBeenCalledTimes(1);
        expect(mockParseDatabase).toHaveBeenCalledWith({
            text: "SELECT * FROM UNDERSTUDY_DATA WHERE coach_id = $1",
            values: [TEST_ACCOUNT.id]
        });
        expect(actual).toEqual(STATUS_CODE.BAD_REQUEST);
    });
});
