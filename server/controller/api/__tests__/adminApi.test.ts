import AdminApi from "../adminApi";
import DatabaseParser from "../../../parser/databaseParser";
import { FAKE_ERRORS } from "../../global/mockValues";
import { STATUS_CODE, Role } from "../../../types";

jest.mock("../../../parser/databaseParser");

const mockAccountId = 0;
const mockRole: Role = "coach";
const mockUserData = {
    id: mockAccountId,
    email: "testdummy@outlook.com",
    profile_id: 1,
    username: "Xx_TestDummy_xX"
};

describe("Admin Api", () => {
    const adminApi = new AdminApi();
    var parser: any;

    beforeEach(() => {
        parser = new DatabaseParser();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Get All User Data (normal case)", async () => {
        parser.parseDatabase.mockResolvedValueOnce([mockUserData]);
        const result = await adminApi.getAllUserData();
        expect(parser.parseDatabase).toHaveBeenCalledTimes(1);
        expect(parser.parseDatabase).toHaveBeenCalledWith("SELECT * FROM USER_DATA");
        expect(result).toEqual([mockUserData]);
    });

    it("Get All User Data (error case)", async () => {
        parser.parseDatabase.mockRejectedValue(FAKE_ERRORS.networkError);
        const result = await adminApi.getAllUserData();
        expect(parser.parseDatabase).toHaveBeenCalledTimes(1);
        expect(parser.parseDatabase).toHaveBeenCalledWith("SELECT * FROM USER_DATA");
        expect(result).toEqual(STATUS_CODE.CONNECTION_ERROR);
    });

    it("Get User Data (normal case)", async () => {
        parser.parseDatabase.mockResolvedValueOnce([mockUserData]);
        const result = await adminApi.getUserData(mockAccountId);
        expect(parser.parseDatabase).toHaveBeenCalledTimes(1);
        expect(parser.parseDatabase).toHaveBeenCalledWith({
            text: "SELECT * FROM USER_DATA WHERE id = $1",
            values: [mockAccountId]
        });
        expect(result).toEqual([mockUserData]);
    });

    it("Get User Data (error case)", async () => {
        parser.parseDatabase.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        const result = await adminApi.getUserData(mockAccountId);
        expect(parser.parseDatabase).toHaveBeenCalledTimes(1);
        expect(parser.parseDatabase).toHaveBeenCalledWith({
            text: "SELECT * FROM USER_DATA WHERE id = $1",
            values: [mockAccountId]
        });
        expect(result).toEqual(STATUS_CODE.INTERNAL_SERVER_ERROR);
    });

    it("Set Account To Coach (normal case)", async () => {
        parser.updateDatabase.mockResolvedValueOnce({});
        const result = await adminApi.setAccountToRole(mockAccountId, mockRole);
        expect(parser.updateDatabase).toHaveBeenCalledTimes(1);
        expect(parser.updateDatabase).toHaveBeenCalledWith({
            text: "UPDATE ACCOUNT SET site_role = $1 WHERE id = $2",
            values: [mockRole, mockAccountId]
        });
        expect(result).toEqual(STATUS_CODE.OK);
    });

    it("Set Account To Coach (error case)", async () => {
        parser.updateDatabase.mockRejectedValue(FAKE_ERRORS.badRequest);
        const result = await adminApi.setAccountToRole(mockAccountId, mockRole);
        expect(parser.updateDatabase).toHaveBeenCalledTimes(1);
        expect(parser.updateDatabase).toHaveBeenCalledWith({
            text: "UPDATE ACCOUNT SET site_role = $1 WHERE id = $2",
            values: [mockRole, mockAccountId]
        });
        expect(result).toEqual(STATUS_CODE.BAD_REQUEST);
    });
});
