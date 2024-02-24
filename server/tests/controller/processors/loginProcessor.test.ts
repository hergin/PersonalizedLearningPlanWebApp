import * as LoginProcessor from "../../../controller/processors/loginProcessor";
import { StatusCode } from "../../../types";
import LoginAPI from "../../../controller/api/loginApi";
import { initializeErrorMap } from "../../../utils/errorMessages";
import { generateAccessToken, generateRefreshToken } from "../../../utils/token";

jest.mock("../../../controller/api/loginAPI");
jest.mock("../../../utils/token", () => ({
    generateAccessToken: jest.fn().mockReturnValue("1234567890"),
    generateRefreshToken: jest.fn().mockReturnValue("refresh please"),
}));

const TEST_DATA = {
    id: 1,
    email: "example@outlook.com",
    password: "09122001",
    accessToken: "1234567890",
    refreshToken: "refresh please"
}
const ERROR_MESSAGES = initializeErrorMap();
const MOCK_RESPONSE : any = {
    sendStatus: jest.fn().mockImplementation((status: number) => {
        console.log(`Status being sent: ${status}`);
        return MOCK_RESPONSE as any;
    }),
    json: jest.fn().mockImplementation((json: object) => {
        console.log(`Json: ${JSON.stringify(json)}`);
        return MOCK_RESPONSE as any;
    }),
    send: jest.fn().mockImplementation((message: string) => {
        console.log(`Sending message: ${message}`);
        return MOCK_RESPONSE as any;
    }),
    status: jest.fn().mockImplementation((status: number) => {
        console.log(`Setting status as: ${status}`);
        return MOCK_RESPONSE as any;
    })
};

describe("Login Processor unit tests", () => {
    var loginApi: any;

    beforeEach(() => {
        loginApi = new LoginAPI();
    });

    function createMockRequest(body: any, params?: any): any {
        return {
            body: body,
            params: params
        };
    }
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("verify login (normal case)", async () => {
        loginApi.verifyLogin.mockResolvedValueOnce(TEST_DATA.id);
        loginApi.setToken.mockResolvedValueOnce(StatusCode.OK);
        const mRequest = createMockRequest({email: TEST_DATA.email, password: TEST_DATA.password});
        await LoginProcessor.verifyLogin(mRequest, MOCK_RESPONSE);
        expect(loginApi.verifyLogin).toHaveBeenCalledTimes(1);
        expect(loginApi.verifyLogin).toHaveBeenCalledWith(TEST_DATA.email, TEST_DATA.password);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(generateAccessToken).toHaveBeenCalledTimes(1);
        expect(generateAccessToken).toHaveBeenCalledWith(TEST_DATA.email);
        expect(generateRefreshToken).toHaveBeenCalledTimes(1);
        expect(generateRefreshToken).toHaveBeenCalledWith(TEST_DATA.email);
        expect(loginApi.setToken).toHaveBeenCalledTimes(1);
        expect(loginApi.setToken).toHaveBeenCalledWith(TEST_DATA.id, TEST_DATA.refreshToken);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith({
            id: TEST_DATA.id, 
            accessToken: TEST_DATA.accessToken, 
            refreshToken: TEST_DATA.refreshToken
        });
    });

    it("verify login (account error case)", async () => {
        loginApi.verifyLogin.mockResolvedValueOnce(StatusCode.GONE);
        const mRequest = createMockRequest({email: TEST_DATA.email, password: TEST_DATA.password});
        await LoginProcessor.verifyLogin(mRequest, MOCK_RESPONSE);
        expect(loginApi.verifyLogin).toHaveBeenCalledTimes(1);
        expect(loginApi.verifyLogin).toHaveBeenCalledWith(TEST_DATA.email, TEST_DATA.password);
        expect(loginApi.setToken).toHaveBeenCalledTimes(0);
        expect(generateAccessToken).toHaveBeenCalledTimes(0);
        expect(generateRefreshToken).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.GONE);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(StatusCode.GONE));
    });

    it("verify login (token error case)", async () => {
        loginApi.verifyLogin.mockResolvedValueOnce(TEST_DATA.id);
        loginApi.setToken.mockResolvedValueOnce(StatusCode.CONNECTION_ERROR);
        const mRequest = createMockRequest({email: TEST_DATA.email, password: TEST_DATA.password});
        await LoginProcessor.verifyLogin(mRequest, MOCK_RESPONSE);
        expect(loginApi.verifyLogin).toHaveBeenCalledTimes(1);
        expect(loginApi.verifyLogin).toHaveBeenCalledWith(TEST_DATA.email, TEST_DATA.password);
        expect(generateAccessToken).toHaveBeenCalledTimes(1);
        expect(generateAccessToken).toHaveBeenCalledWith(TEST_DATA.email);
        expect(generateRefreshToken).toHaveBeenCalledTimes(1);
        expect(generateRefreshToken).toHaveBeenCalledWith(TEST_DATA.email);
        expect(loginApi.setToken).toHaveBeenCalledTimes(1);
        expect(loginApi.setToken).toHaveBeenCalledWith(TEST_DATA.id, TEST_DATA.refreshToken);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.CONNECTION_ERROR);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(StatusCode.CONNECTION_ERROR));
    });

    it("verify token (normal case)", async () => {
        loginApi.verifyToken.mockResolvedValueOnce(StatusCode.OK);
        const mRequest = createMockRequest({id: TEST_DATA.id, refreshToken: TEST_DATA.refreshToken});
        await LoginProcessor.verifyToken(mRequest, MOCK_RESPONSE);
        expect(loginApi.verifyToken).toHaveBeenCalledTimes(1);
        expect(loginApi.verifyToken).toHaveBeenCalledWith(TEST_DATA.id, TEST_DATA.refreshToken);
        expect(generateAccessToken).toHaveBeenCalledTimes(1);
        expect(generateAccessToken).toHaveBeenCalledWith(TEST_DATA.id);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.OK);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith({accessToken: TEST_DATA.accessToken});
    });

    it("verify token (error case)", async () => {
        loginApi.verifyToken.mockResolvedValueOnce(StatusCode.GONE);
        const mRequest = createMockRequest({id: TEST_DATA.id, refreshToken: TEST_DATA.refreshToken});
        await LoginProcessor.verifyToken(mRequest, MOCK_RESPONSE);
        expect(loginApi.verifyToken).toHaveBeenCalledTimes(1);
        expect(loginApi.verifyToken).toHaveBeenCalledWith(TEST_DATA.id, TEST_DATA.refreshToken);
        expect(generateAccessToken).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.GONE);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(StatusCode.GONE));
    });

    it("register account (normal case)", async () => {
        loginApi.createAccount.mockResolvedValueOnce(StatusCode.OK);
        const mRequest = createMockRequest({email: TEST_DATA.email, password: TEST_DATA.password});
        await LoginProcessor.registerAccount(mRequest, MOCK_RESPONSE);
        expect(loginApi.createAccount).toHaveBeenCalledTimes(1);
        expect(loginApi.createAccount).toHaveBeenCalledWith(TEST_DATA.email, TEST_DATA.password);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(StatusCode.OK);
    });

    it("register account (error case)", async () => {
        loginApi.createAccount.mockResolvedValueOnce(StatusCode.CONFLICT);
        const mRequest = createMockRequest({email: TEST_DATA.email, password: TEST_DATA.password});
        await LoginProcessor.registerAccount(mRequest, MOCK_RESPONSE);
        expect(loginApi.createAccount).toHaveBeenCalledTimes(1);
        expect(loginApi.createAccount).toHaveBeenCalledWith(TEST_DATA.email, TEST_DATA.password);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.CONFLICT);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(StatusCode.CONFLICT));
    });

    it("logout user (normal case)", async () => {
        loginApi.logout.mockResolvedValueOnce(StatusCode.OK);
        const mRequest = createMockRequest({id: TEST_DATA.id});
        await LoginProcessor.logoutUser(mRequest, MOCK_RESPONSE);
        expect(loginApi.logout).toHaveBeenCalledTimes(1);
        expect(loginApi.logout).toHaveBeenCalledWith(TEST_DATA.id);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(StatusCode.OK);
    });

    it("logout user (error case)", async () => {
        loginApi.logout.mockResolvedValueOnce(StatusCode.FORBIDDEN);
        const mRequest = createMockRequest({id: TEST_DATA.id});
        await LoginProcessor.logoutUser(mRequest, MOCK_RESPONSE);
        expect(loginApi.logout).toHaveBeenCalledTimes(1);
        expect(loginApi.logout).toHaveBeenCalledWith(TEST_DATA.id);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.FORBIDDEN);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(StatusCode.FORBIDDEN));
    });

    it("delete account (normal case)", async () => {
        loginApi.delete.mockResolvedValueOnce(StatusCode.OK);
        const mRequest = createMockRequest({}, {id: TEST_DATA.id});
        await LoginProcessor.deleteAccount(mRequest, MOCK_RESPONSE);
        expect(loginApi.delete).toHaveBeenCalledTimes(1);
        expect(loginApi.delete).toHaveBeenCalledWith(TEST_DATA.id);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(StatusCode.OK);
    });

    it("delete account (error case)", async () => {
        loginApi.delete.mockResolvedValueOnce(StatusCode.INTERNAL_SERVER_ERROR);
        const mRequest = createMockRequest({}, {id: TEST_DATA.id});
        await LoginProcessor.deleteAccount(mRequest, MOCK_RESPONSE);
        expect(loginApi.delete).toHaveBeenCalledTimes(1);
        expect(loginApi.delete).toHaveBeenCalledWith(TEST_DATA.id);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.INTERNAL_SERVER_ERROR);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(StatusCode.INTERNAL_SERVER_ERROR));
    });
});
