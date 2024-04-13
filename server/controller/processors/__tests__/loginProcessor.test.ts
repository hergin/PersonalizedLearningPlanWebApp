import * as LoginProcessor from "../loginProcessor";
import { STATUS_CODE } from "../../../types";
import LoginAPI from "../../api/loginApi";
import { initializeErrorMap } from "../../../utils/errorMessages";
import { generateAccessToken, generateRefreshToken } from "../../../middleware/tokenHandler";
import { createMockRequest, MOCK_RESPONSE, TEST_ACCOUNT } from "../../global/mockValues";

jest.mock("../../../controller/api/loginAPI");
jest.mock("../../../middleware/tokenHandler", () => ({
    generateAccessToken: jest.fn().mockReturnValue("1234567890"),
    generateRefreshToken: jest.fn().mockReturnValue("refresh please"),
}));

const ERROR_MESSAGES = initializeErrorMap();

describe("Login Processor unit tests", () => {
    var loginApi: any;

    beforeEach(() => {
        loginApi = new LoginAPI();
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("verify login (normal case)", async () => {
        loginApi.verifyLogin.mockResolvedValueOnce({id: TEST_ACCOUNT.id, role: TEST_ACCOUNT.role});
        loginApi.setToken.mockResolvedValueOnce(STATUS_CODE.OK);
        const mRequest = createMockRequest({email: TEST_ACCOUNT.email, password: TEST_ACCOUNT.password});
        await LoginProcessor.verifyLogin(mRequest, MOCK_RESPONSE);
        expect(loginApi.verifyLogin).toHaveBeenCalledTimes(1);
        expect(loginApi.verifyLogin).toHaveBeenCalledWith(TEST_ACCOUNT.email, TEST_ACCOUNT.password);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(generateAccessToken).toHaveBeenCalledTimes(1);
        expect(generateAccessToken).toHaveBeenCalledWith({id: TEST_ACCOUNT.id, role: TEST_ACCOUNT.role});
        expect(generateRefreshToken).toHaveBeenCalledTimes(1);
        expect(generateRefreshToken).toHaveBeenCalledWith({id: TEST_ACCOUNT.id, role: TEST_ACCOUNT.role});
        expect(loginApi.setToken).toHaveBeenCalledTimes(1);
        expect(loginApi.setToken).toHaveBeenCalledWith(TEST_ACCOUNT.id, TEST_ACCOUNT.refreshToken);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith({
            id: TEST_ACCOUNT.id,
            role: TEST_ACCOUNT.role, 
            accessToken: TEST_ACCOUNT.accessToken, 
            refreshToken: TEST_ACCOUNT.refreshToken
        });
    });

    it("verify login (account error case)", async () => {
        loginApi.verifyLogin.mockResolvedValueOnce(STATUS_CODE.GONE);
        const mRequest = createMockRequest({email: TEST_ACCOUNT.email, password: TEST_ACCOUNT.password});
        await LoginProcessor.verifyLogin(mRequest, MOCK_RESPONSE);
        expect(loginApi.verifyLogin).toHaveBeenCalledTimes(1);
        expect(loginApi.verifyLogin).toHaveBeenCalledWith(TEST_ACCOUNT.email, TEST_ACCOUNT.password);
        expect(loginApi.setToken).toHaveBeenCalledTimes(0);
        expect(generateAccessToken).toHaveBeenCalledTimes(0);
        expect(generateRefreshToken).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.GONE);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(STATUS_CODE.GONE));
    });

    it("verify login (token error case)", async () => {
        loginApi.verifyLogin.mockResolvedValueOnce({id: TEST_ACCOUNT.id, role: TEST_ACCOUNT.role});
        loginApi.setToken.mockResolvedValueOnce(STATUS_CODE.CONNECTION_ERROR);
        const mRequest = createMockRequest({email: TEST_ACCOUNT.email, password: TEST_ACCOUNT.password});
        await LoginProcessor.verifyLogin(mRequest, MOCK_RESPONSE);
        expect(loginApi.verifyLogin).toHaveBeenCalledTimes(1);
        expect(loginApi.verifyLogin).toHaveBeenCalledWith(TEST_ACCOUNT.email, TEST_ACCOUNT.password);
        expect(generateAccessToken).toHaveBeenCalledTimes(1);
        expect(generateAccessToken).toHaveBeenCalledWith({id: TEST_ACCOUNT.id, role: TEST_ACCOUNT.role});
        expect(generateRefreshToken).toHaveBeenCalledTimes(1);
        expect(generateRefreshToken).toHaveBeenCalledWith({id: TEST_ACCOUNT.id, role: TEST_ACCOUNT.role});
        expect(loginApi.setToken).toHaveBeenCalledTimes(1);
        expect(loginApi.setToken).toHaveBeenCalledWith(TEST_ACCOUNT.id, TEST_ACCOUNT.refreshToken);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.CONNECTION_ERROR);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(STATUS_CODE.CONNECTION_ERROR));
    });

    it("verify token (normal case)", async () => {
        loginApi.verifyToken.mockResolvedValueOnce(STATUS_CODE.OK);
        const mRequest = createMockRequest({id: TEST_ACCOUNT.id, refreshToken: TEST_ACCOUNT.refreshToken});
        await LoginProcessor.verifyToken(mRequest, MOCK_RESPONSE);
        expect(loginApi.verifyToken).toHaveBeenCalledTimes(1);
        expect(loginApi.verifyToken).toHaveBeenCalledWith(TEST_ACCOUNT.id, TEST_ACCOUNT.refreshToken);
        expect(generateAccessToken).toHaveBeenCalledTimes(1);
        expect(generateAccessToken).toHaveBeenCalledWith(TEST_ACCOUNT.id);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.OK);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith({accessToken: TEST_ACCOUNT.accessToken});
    });

    it("verify token (error case)", async () => {
        loginApi.verifyToken.mockResolvedValueOnce(STATUS_CODE.GONE);
        const mRequest = createMockRequest({id: TEST_ACCOUNT.id, refreshToken: TEST_ACCOUNT.refreshToken});
        await LoginProcessor.verifyToken(mRequest, MOCK_RESPONSE);
        expect(loginApi.verifyToken).toHaveBeenCalledTimes(1);
        expect(loginApi.verifyToken).toHaveBeenCalledWith(TEST_ACCOUNT.id, TEST_ACCOUNT.refreshToken);
        expect(generateAccessToken).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.GONE);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(STATUS_CODE.GONE));
    });

    it("register account (normal case)", async () => {
        loginApi.createAccount.mockResolvedValueOnce(STATUS_CODE.OK);
        const mRequest = createMockRequest({email: TEST_ACCOUNT.email, password: TEST_ACCOUNT.password});
        await LoginProcessor.registerAccount(mRequest, MOCK_RESPONSE);
        expect(loginApi.createAccount).toHaveBeenCalledTimes(1);
        expect(loginApi.createAccount).toHaveBeenCalledWith(TEST_ACCOUNT.email, TEST_ACCOUNT.password);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(STATUS_CODE.OK);
    });

    it("register account (error case)", async () => {
        loginApi.createAccount.mockResolvedValueOnce(STATUS_CODE.CONFLICT);
        const mRequest = createMockRequest({email: TEST_ACCOUNT.email, password: TEST_ACCOUNT.password});
        await LoginProcessor.registerAccount(mRequest, MOCK_RESPONSE);
        expect(loginApi.createAccount).toHaveBeenCalledTimes(1);
        expect(loginApi.createAccount).toHaveBeenCalledWith(TEST_ACCOUNT.email, TEST_ACCOUNT.password);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.CONFLICT);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(STATUS_CODE.CONFLICT));
    });

    it("logout user (normal case)", async () => {
        loginApi.logout.mockResolvedValueOnce(STATUS_CODE.OK);
        const mRequest = createMockRequest({id: TEST_ACCOUNT.id});
        await LoginProcessor.logoutUser(mRequest, MOCK_RESPONSE);
        expect(loginApi.logout).toHaveBeenCalledTimes(1);
        expect(loginApi.logout).toHaveBeenCalledWith(TEST_ACCOUNT.id);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(STATUS_CODE.OK);
    });

    it("logout user (error case)", async () => {
        loginApi.logout.mockResolvedValueOnce(STATUS_CODE.FORBIDDEN);
        const mRequest = createMockRequest({id: TEST_ACCOUNT.id});
        await LoginProcessor.logoutUser(mRequest, MOCK_RESPONSE);
        expect(loginApi.logout).toHaveBeenCalledTimes(1);
        expect(loginApi.logout).toHaveBeenCalledWith(TEST_ACCOUNT.id);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.FORBIDDEN);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(STATUS_CODE.FORBIDDEN));
    });

    it("delete account (normal case)", async () => {
        loginApi.delete.mockResolvedValueOnce(STATUS_CODE.OK);
        const mRequest = createMockRequest({}, {id: TEST_ACCOUNT.id});
        await LoginProcessor.deleteAccount(mRequest, MOCK_RESPONSE);
        expect(loginApi.delete).toHaveBeenCalledTimes(1);
        expect(loginApi.delete).toHaveBeenCalledWith(TEST_ACCOUNT.id);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(STATUS_CODE.OK);
    });

    it("delete account (error case)", async () => {
        loginApi.delete.mockResolvedValueOnce(STATUS_CODE.INTERNAL_SERVER_ERROR);
        const mRequest = createMockRequest({}, {id: TEST_ACCOUNT.id});
        await LoginProcessor.deleteAccount(mRequest, MOCK_RESPONSE);
        expect(loginApi.delete).toHaveBeenCalledTimes(1);
        expect(loginApi.delete).toHaveBeenCalledWith(TEST_ACCOUNT.id);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.INTERNAL_SERVER_ERROR);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(STATUS_CODE.INTERNAL_SERVER_ERROR));
    });

    it("get understudies (normal case)", async () => {
        loginApi.getUnderstudies.mockResolvedValueOnce([TEST_ACCOUNT]);
        const mRequest = createMockRequest({}, {id: TEST_ACCOUNT.id});
        await LoginProcessor.getUnderstudies(mRequest, MOCK_RESPONSE);
        expect(loginApi.getUnderstudies).toHaveBeenCalledTimes(1);
        expect(loginApi.getUnderstudies).toHaveBeenCalledWith(TEST_ACCOUNT.id);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.OK);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith([TEST_ACCOUNT]);
    });

    it("get understudies (error case)", async () => {
        loginApi.getUnderstudies.mockResolvedValueOnce(STATUS_CODE.CONNECTION_ERROR);
        const mRequest = createMockRequest({}, {id: TEST_ACCOUNT.id});
        await LoginProcessor.getUnderstudies(mRequest, MOCK_RESPONSE);
        expect(loginApi.getUnderstudies).toHaveBeenCalledTimes(1);
        expect(loginApi.getUnderstudies).toHaveBeenCalledWith(TEST_ACCOUNT.id);
        
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.CONNECTION_ERROR);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(STATUS_CODE.CONNECTION_ERROR));
    });
});
