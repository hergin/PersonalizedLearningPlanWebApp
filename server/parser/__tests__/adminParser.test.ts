import AdminParser from "../adminParser";
import { Pool } from "pg";
import { Role } from "../../types";

jest.mock("pg");

const mockAccountId = 0;
const mockUserData = {
    id: mockAccountId,
    email: "testdummy@outlook.com",
    role: "basic",
    profile_id: 1,
    username: "Xx_TestDummy_xX"
}

describe("Admin Parser Unit Tests", () => {
    const parser = new AdminParser();
    var mockQuery: jest.Mock<any, any, any>;
    
    beforeEach(() => {
        mockQuery = new Pool().query as jest.Mock<any, any, any>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    
    it("Parse All User Data", async () => {
        mockQuery.mockResolvedValueOnce({rows: [mockUserData]});
        const result = await parser.parseAllUserData();
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith("SELECT * FROM USER_DATA");
        expect(result).toEqual([mockUserData]);
    });

    it("Parse User Data", async () => {
        mockQuery.mockResolvedValueOnce({rows: [mockUserData]});
        const result = await parser.parseUserData(mockAccountId);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "SELECT * FROM USER_DATA WHERE id = $1",
            values: [mockAccountId]
        });
        expect(result).toEqual([mockUserData]);
    });

    it("Set Account As Role", async () => {
        mockQuery.mockResolvedValueOnce({});
        const mockRole: Role = "coach";
        await parser.setAccountAsRole(mockAccountId, mockRole);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "UPDATE ACCOUNT SET site_role = $1 WHERE id = $2",
            values: [mockRole, mockAccountId]
        });
    });
});
