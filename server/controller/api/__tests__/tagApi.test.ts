import TagApi from "../tagApi";
import { STATUS_CODE } from "../../../types";
import DatabaseParser from "../../../parser/databaseParser";

jest.mock("../../../parser/databaseParser");

const TEST_TAG = {
    id: 1,
    name: "school",
    accountId: 1
}

describe("Tag Api Unit Tests", () => {
    var api: TagApi;
    var parser: any;

    beforeEach(() => {
        api = new TagApi();
        parser = new DatabaseParser();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("get tags (normal case)", async () => {
        const parseDatabase = parser.parseDatabase as jest.Mock;
        parseDatabase.mockResolvedValueOnce([TEST_TAG]);
        const result = await api.getTags(TEST_TAG.accountId);
        expect(parseDatabase).toHaveBeenCalledTimes(1);
        expect(parseDatabase).toHaveBeenCalledWith({
            text: "SELECT tag_id AS id, tag_name AS name, account_id FROM TAG WHERE account_id = $1",
            values: [TEST_TAG.accountId]
        });
        expect(result).toEqual([TEST_TAG]);
    });

    it("store tag (normal case)", async () => {
        const updateDatabase = parser.updateDatabase as jest.Mock;
        updateDatabase.mockResolvedValueOnce({});
        const result = await api.addTag(TEST_TAG.accountId, TEST_TAG.name);
        expect(parser.updateDatabase).toHaveBeenCalledTimes(1);
        expect(parser.updateDatabase).toHaveBeenCalledWith({
            text: "INSERT INTO TAG(tag_name, account_id) VALUES ($1, $2)",
            values: [TEST_TAG.name, TEST_TAG.accountId]
        });
        expect(result).toEqual(STATUS_CODE.OK);
    });

    it("Delete tag (normal case)", async () => {
        const updateDatabase = parser.updateDatabase as jest.Mock;
        updateDatabase.mockResolvedValueOnce({});
        const result = await api.deleteTag(TEST_TAG.id);
        expect(updateDatabase).toHaveBeenCalledTimes(1);
        expect(updateDatabase).toHaveBeenCalledWith({
            text: "DELETE FROM TAG WHERE tag_id = $1",
            values: [TEST_TAG.id]
        });
        expect(result).toEqual(STATUS_CODE.OK);
    });
});
