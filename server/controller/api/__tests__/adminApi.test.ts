import AdminApi from "../adminApi";
import AdminParser from "../../../parser/adminParser";
import { FAKE_ERRORS } from "../../global/mockValues";
import { STATUS_CODE } from "../../../types";

jest.mock("../../../parser/adminParser");

const mockAccountId = 0;
const mockRole = "coach";
const mockUserData = {
    id: mockAccountId,
    email: "testdummy@outlook.com",
    profile_id: 1,
    username: "Xx_TestDummy_xX"
};

describe("Admin Api", () => {
    const api = new AdminApi();
    var parser: any;
    
    beforeEach(() => {
        parser = new AdminParser();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Get All User Data (normal case)", async () => {
        parser.parseAllUserData.mockResolvedValueOnce([mockUserData]);
        const result = await api.getAllUserData();
        expect(parser.parseAllUserData).toHaveBeenCalledTimes(1);
        expect(parser.parseAllUserData).toHaveBeenCalledWith();
        expect(result).toEqual([mockUserData]);
    });

    it("Get All User Data (error case)", async () => {
        parser.parseAllUserData.mockRejectedValue(FAKE_ERRORS.networkError);
        const result = await api.getAllUserData();
        expect(parser.parseAllUserData).toHaveBeenCalledTimes(1);
        expect(parser.parseAllUserData).toHaveBeenCalledWith();
        expect(result).toEqual(STATUS_CODE.CONNECTION_ERROR);
    });

    it("Get User Data (normal case)", async () => {
        parser.parseUserData.mockResolvedValueOnce([mockUserData]);
        const result = await api.getUserData(mockAccountId);
        expect(parser.parseUserData).toHaveBeenCalledTimes(1);
        expect(parser.parseUserData).toHaveBeenCalledWith(mockAccountId);
        expect(result).toEqual([mockUserData]);
    });

    it("Get User Data (error case)", async () => {
        parser.parseUserData.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        const result = await api.getUserData(mockAccountId);
        expect(parser.parseUserData).toHaveBeenCalledTimes(1);
        expect(parser.parseUserData).toHaveBeenCalledWith(mockAccountId);
        expect(result).toEqual(STATUS_CODE.INTERNAL_SERVER_ERROR);
    });

    it("Set Account To Coach (normal case)", async () => {
        parser.setAccountAsRole.mockResolvedValueOnce({});
        const result = await api.setAccountToRole(mockAccountId, mockRole);
        expect(parser.setAccountAsRole).toHaveBeenCalledTimes(1);
        expect(parser.setAccountAsRole).toHaveBeenCalledWith(mockAccountId, mockRole);
        expect(result).toEqual(STATUS_CODE.OK);
    });

    it("Set Account To Coach (error case)", async () => {
        parser.setAccountAsRole.mockRejectedValue(FAKE_ERRORS.badRequest);
        const result = await api.setAccountToRole(mockAccountId, mockRole);
        expect(parser.setAccountAsRole).toHaveBeenCalledTimes(1);
        expect(parser.setAccountAsRole).toHaveBeenCalledWith(mockAccountId, mockRole);
        expect(result).toEqual(STATUS_CODE.BAD_REQUEST);
    });
});
