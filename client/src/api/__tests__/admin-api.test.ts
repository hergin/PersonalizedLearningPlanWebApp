import AdminApi from "../admin-api";
import { useApiConnection } from "../../hooks/useApiConnection";
import { throwServerError } from "../../utils/errorHandlers";
import { User } from "../../types";

jest.mock("../../hooks/useApiConnection");
jest.mock("../../utils/errorHandlers");

const mockAccountId = 1;
var mockUser: User = {
    id: mockAccountId,
    role: "admin",
    accessToken: "access token",
    refreshToken: "refresh token",
};
jest.mock("../../context/AuthContext", () => ({
    useAuth: () => ({
        user: mockUser,
    }),
}));

const mockError = "Insert Error Here";
const mockUserData = {
    id: mockAccountId,
    email: "testdummy@outlook.com",
    profile_id: 1,
    username: "Xx_TestDummy_xX"
}

describe("Admin Api Unit Tests", () => {
    var mockApiHook: any;
    var mockThrowError: jest.Mock<any, any, any>;
    
    beforeEach(() => {
        mockUser = {
            id: mockAccountId,
            role: "admin",
            accessToken: "access token",
            refreshToken: "refresh token",
        };
        mockApiHook = useApiConnection();
        mockThrowError = throwServerError as jest.Mock<any, any, any>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Fetch All Accounts (normal case)", async () => {
        const { fetchAllAccounts } = AdminApi();
        mockApiHook.get.mockResolvedValueOnce([mockUserData]);
        const result = await fetchAllAccounts();
        expect(mockThrowError).toHaveBeenCalledTimes(0);
        expect(mockApiHook.get).toHaveBeenCalledTimes(1);
        expect(mockApiHook.get).toHaveBeenCalledWith("/admin/account");
        expect(result).toEqual([mockUserData]);
    });

    it("Fetch All Accounts (error case)", async () => {
        const { fetchAllAccounts } = AdminApi();
        mockApiHook.get.mockRejectedValue(mockError);
        const result = await fetchAllAccounts();
        expect(mockApiHook.get).toHaveBeenCalledTimes(1);
        expect(mockApiHook.get).toHaveBeenCalledWith("/admin/account");
        expect(mockThrowError).toHaveBeenCalledTimes(1);
        expect(mockThrowError).toHaveBeenCalledWith(mockError);
        expect(result).toBeNull();
    });

    it("Fetch All Accounts (not admin case)", async () => {
        const { fetchAllAccounts } = AdminApi();
        mockUser.role = "basic";
        const result = await fetchAllAccounts();
        expect(mockApiHook.get).toHaveBeenCalledTimes(0);
        expect(mockThrowError).toHaveBeenCalledTimes(0);
        expect(result).toBeNull();
    });

    it("Set Account As Role (normal case)", async () => {
        const { setAccountAsRole } = AdminApi();
        mockApiHook.put.mockResolvedValueOnce();
        await setAccountAsRole(mockAccountId, "coach");
        expect(mockThrowError).toHaveBeenCalledTimes(0);
        expect(mockApiHook.put).toHaveBeenCalledTimes(1);
        expect(mockApiHook.put).toHaveBeenCalledWith(`/admin/account/${mockAccountId}`, {role: "coach"});
    });

    it("Set Account As Role (error case)", async () => {
        const { setAccountAsRole } = AdminApi();
        mockApiHook.put.mockRejectedValue(mockError);
        await setAccountAsRole(mockAccountId, "coach");
        expect(mockApiHook.put).toHaveBeenCalledTimes(1);
        expect(mockApiHook.put).toHaveBeenCalledWith(`/admin/account/${mockAccountId}`, {role: "coach"});
        expect(mockThrowError).toHaveBeenCalledTimes(1);
        expect(mockThrowError).toHaveBeenCalledWith(mockError);
    });

    it("Set Account As Role (not admin case)", async () => {
        const { setAccountAsRole } = AdminApi();
        mockUser.role = "basic";
        await setAccountAsRole(mockAccountId, "coach");
        expect(mockApiHook.put).toHaveBeenCalledTimes(0);
        expect(mockThrowError).toHaveBeenCalledTimes(0);
    });
});
