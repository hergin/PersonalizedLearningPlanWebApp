import * as AdminProcessor from "../adminProcessor";
import AdminApi from "../../api/adminApi";
import { STATUS_CODE } from "../../../types";
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
};

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
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.OK);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith([mockUserData]);
    });

    it("Get All Accounts (error case)", async () => {
        adminApi.getAllUserData.mockResolvedValueOnce(STATUS_CODE.BAD_REQUEST);
        const mRequest = createMockRequest({}, {});
        await AdminProcessor.getAllAccounts(mRequest, MOCK_RESPONSE);
        expect(adminApi.getAllUserData).toHaveBeenCalledTimes(1);
        expect(adminApi.getAllUserData).toHaveBeenCalledWith();
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(STATUS_CODE.BAD_REQUEST));
    });

    it("Get Account (normal case)", async () => {
        adminApi.getUserData.mockResolvedValueOnce([mockUserData]);
        const mRequest = createMockRequest({}, {id: mockAccountId});
        await AdminProcessor.getAccount(mRequest, MOCK_RESPONSE);
        expect(adminApi.getUserData).toHaveBeenCalledTimes(1);
        expect(adminApi.getUserData).toHaveBeenCalledWith(mockAccountId);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.OK);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith([mockUserData]);
    });

    it("Get Account (error case)", async () => {
        adminApi.getUserData.mockResolvedValueOnce(STATUS_CODE.CONFLICT);
        const mRequest = createMockRequest({}, {id: mockAccountId});
        await AdminProcessor.getAccount(mRequest, MOCK_RESPONSE);
        expect(adminApi.getUserData).toHaveBeenCalledTimes(1);
        expect(adminApi.getUserData).toHaveBeenCalledWith(mockAccountId);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.CONFLICT);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(STATUS_CODE.CONFLICT));
    });

    it("Put Account Role (normal case)", async () => {
        adminApi.setAccountToRole.mockResolvedValueOnce(STATUS_CODE.OK);
        const mRequest = createMockRequest({newRole: mockRole}, {id: mockAccountId});
        await AdminProcessor.postAccountRole(mRequest, MOCK_RESPONSE);
        expect(adminApi.setAccountToRole).toHaveBeenCalledTimes(1);
        expect(adminApi.setAccountToRole).toHaveBeenCalledWith(mockAccountId, mockRole);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(STATUS_CODE.OK);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
    });

    it("Put Account Role (error case)", async () => {
        adminApi.setAccountToRole.mockResolvedValueOnce(STATUS_CODE.CONNECTION_ERROR);
        const mRequest = createMockRequest({newRole: mockRole}, {id: mockAccountId});
        await AdminProcessor.postAccountRole(mRequest, MOCK_RESPONSE);
        expect(adminApi.setAccountToRole).toHaveBeenCalledTimes(1);
        expect(adminApi.setAccountToRole).toHaveBeenCalledWith(mockAccountId, mockRole);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.CONNECTION_ERROR);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(STATUS_CODE.CONNECTION_ERROR));
    });
});
