import TagParser from "../tagParser";
import { Pool } from "pg";

jest.mock("pg");

const mockAccountId = 0;
const TEST_TAG = [
    {
        id: 0,
        name: "School",
        color: "#0000FF",
        account_Id: mockAccountId,
    },
    {
        id: 1,
        name: "Social",
        color: "#00FF00",
        account_id: mockAccountId
    }
];

describe("Tag Parser unit tests", () => {
    const parser = new TagParser();
    var mockQuery : jest.Mock<any, any, any>;

    beforeEach(async () => {
        mockQuery = new Pool().query as jest.Mock<any, any, any>;
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it("store tag", async () => {
        const mockTag = TEST_TAG[0];
        mockQuery.mockResolvedValueOnce(undefined);
        await parser.storeTag(mockTag.name, mockTag.color, mockAccountId);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "INSERT INTO TAG(tag_name, color, account_id) VALUES ($1, $2, $3)",
            values: [mockTag.name, mockTag.color, mockAccountId]
        });
    });

    it("parse tags", async () => {
        mockQuery.mockResolvedValueOnce({rows: TEST_TAG});
        const result = await parser.parseTags(mockAccountId);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "SELECT tag_id AS id, tag_name AS name, color, account_id FROM TAG WHERE account_id = $1",
            values: [mockAccountId]
        });
        expect(result).toEqual(TEST_TAG);
    });

    it("delete tag", async () => {
        mockQuery.mockResolvedValueOnce(undefined);
        const deletedTagId = TEST_TAG[0].id;
        await parser.deleteTag(deletedTagId);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "DELETE FROM TAG WHERE tag_id = $1",
            values: [deletedTagId]
        });
    });
});
