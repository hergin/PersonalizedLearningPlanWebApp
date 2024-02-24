import * as LoginProcessor from "../../../controller/processors/loginProcessor";
import { StatusCode } from "../../../types";
import LoginAPI from "../../../controller/api/loginApi";
import { initializeErrorMap } from "../../../utils/errorMessages";

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

    it("verify login (correct case)", async () => {
        loginApi.verifyLogin.mockResolvedValueOnce(TEST_DATA.id);
        loginApi.setToken.mockResolvedValueOnce(StatusCode.OK);
        const mRequest = createMockRequest({email: TEST_DATA.email, password: TEST_DATA.password});
        await LoginProcessor.verifyLogin(mRequest, MOCK_RESPONSE);
        expect(loginApi.verifyLogin).toHaveBeenCalledTimes(1);
        expect(loginApi.verifyLogin).toHaveBeenCalledWith(TEST_DATA.email, TEST_DATA.password);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
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

    it("verify login (no matching account case)", async () => {
        loginApi.verifyLogin.mockResolvedValueOnce(StatusCode.GONE);
        const mRequest = createMockRequest({email: TEST_DATA.email, password: TEST_DATA.password});
        await LoginProcessor.verifyLogin(mRequest, MOCK_RESPONSE);
        expect(loginApi.verifyLogin).toHaveBeenCalledTimes(1);
        expect(loginApi.verifyLogin).toHaveBeenCalledWith(TEST_DATA.email, TEST_DATA.password);
        expect(loginApi.setToken).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.GONE);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(StatusCode.GONE));
    });

    it("verify (unauthorized case)", async () => {
        loginApi.verifyLogin.mockResolvedValueOnce(StatusCode.UNAUTHORIZED);
        const mRequest = createMockRequest({email: TEST_DATA.email, password: TEST_DATA.password});
        await LoginProcessor.verifyLogin(mRequest, MOCK_RESPONSE);
        expect(loginApi.verifyLogin).toHaveBeenCalledTimes(1);
        expect(loginApi.verifyLogin).toHaveBeenCalledWith(TEST_DATA.email, TEST_DATA.password);
        expect(loginApi.setToken).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.UNAUTHORIZED);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(StatusCode.UNAUTHORIZED));
    });
});
