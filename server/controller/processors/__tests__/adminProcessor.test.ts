import * as AdminProcessor from "../adminProcessor";
import AdminApi from "../../api/adminApi";
import { StatusCode } from "../../../types";
import { initializeErrorMap } from "../../../utils/errorMessages";
import { createMockRequest, MOCK_RESPONSE } from "../../global/mockValues";

jest.mock("../../../controller/api/adminApi");

const ERROR_MESSAGES = initializeErrorMap();
const mockAccountId = 0;
const mockRole = "coach";
const mockUserData = {
    id: mockAccountId,
    email: "testdummy@outlook.com",
    profile_id: 1,
    username: "Xx_TestDummy_xX"
}

describe("Admin Processor Unit Tests", () => {
    const adminApi: any = new AdminApi();

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Get All Accounts (normal case)", async () => {
        adminApi.getAllUserData.mockResolvedValueOnce([mockUserData]);
        const mRequest = createMockRequest({}, {});
        await AdminProcessor.getAllAccounts(mRequest, MOCK_RESPONSE);
        expect(adminApi.getAllUserData).toHaveBeenCalledTimes(1);
        expect(adminApi.getAllUserData).toHaveBeenCalledWith();
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.OK);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith([mockUserData]);
    });

    it("Get All Accounts (error case)", async () => {
        adminApi.getAllUserData.mockResolvedValueOnce(StatusCode.BAD_REQUEST);
        const mRequest = createMockRequest({}, {});
        await AdminProcessor.getAllAccounts(mRequest, MOCK_RESPONSE);
        expect(adminApi.getAllUserData).toHaveBeenCalledTimes(1);
        expect(adminApi.getAllUserData).toHaveBeenCalledWith();
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.BAD_REQUEST);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(StatusCode.BAD_REQUEST));
    });

    it("Get Account (normal case)", async () => {
        adminApi.getUserData.mockResolvedValueOnce([mockUserData]);
        const mRequest = createMockRequest({}, {id: mockAccountId});
        await AdminProcessor.getAccount(mRequest, MOCK_RESPONSE);
        expect(adminApi.getUserData).toHaveBeenCalledTimes(1);
        expect(adminApi.getUserData).toHaveBeenCalledWith(mockAccountId);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.OK);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith([mockUserData]);
    });

    it("Get Account (error case)", async () => {
        adminApi.getUserData.mockResolvedValueOnce(StatusCode.CONFLICT);
        const mRequest = createMockRequest({}, {id: mockAccountId});
        await AdminProcessor.getAccount(mRequest, MOCK_RESPONSE);
        expect(adminApi.getUserData).toHaveBeenCalledTimes(1);
        expect(adminApi.getUserData).toHaveBeenCalledWith(mockAccountId);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.CONFLICT);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(StatusCode.CONFLICT));
    });

    it("Post Account Role (normal case)", async () => {
        adminApi.setAccountToCoach.mockResolvedValueOnce(StatusCode.OK);
        const mRequest = createMockRequest({id: mockAccountId, newRole: mockRole});
        await AdminProcessor.postAccountRole(mRequest, MOCK_RESPONSE);
        expect(adminApi.setAccountToCoach).toHaveBeenCalledTimes(1);
        expect(adminApi.setAccountToCoach).toHaveBeenCalledWith(mockAccountId);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(StatusCode.OK);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
    });

    it("Post Account Role (error case)", async () => {
        adminApi.setAccountToCoach.mockResolvedValueOnce(StatusCode.CONNECTION_ERROR);
        const mRequest = createMockRequest({id: mockAccountId, newRole: mockRole});
        await AdminProcessor.postAccountRole(mRequest, MOCK_RESPONSE);
        expect(adminApi.setAccountToCoach).toHaveBeenCalledTimes(1);
        expect(adminApi.setAccountToCoach).toHaveBeenCalledWith(mockAccountId);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.CONNECTION_ERROR);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(StatusCode.CONNECTION_ERROR));
    });
});
