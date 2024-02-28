import TagApi from "../../../controller/api/tagApi";
import { StatusCode } from "../../../types";
import TagParser from "../../../parser/tagParser";
jest.mock("../../../parser/tagParser");

const TEST_DATA = {
    id: 1,
    name: "school",
    color: "#0000FF",
    accountId: 1
}

describe("Tag Processor unit tests", () => {
    var api: TagApi;
    var parser: any;

    beforeEach(() => {
        api = new TagApi();
        parser = new TagParser();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("get tags (normal case)", async () => {
        parser.parseTags.mockResolvedValueOnce([{id: TEST_DATA.id, color: TEST_DATA.color, name: TEST_DATA.name}]);
        const result = await api.getTags(TEST_DATA.accountId);
        expect(parser.parseTags).toHaveBeenCalledTimes(1);
        expect(parser.parseTags).toHaveBeenCalledWith(TEST_DATA.id);
        expect(result).toEqual([
            {
                id: TEST_DATA.id,
                name: TEST_DATA.name,
                color: TEST_DATA.color
            }
        ]);
    });

    it("store tag (normal case)", async () => {
        parser.storeTag.mockResolvedValueOnce();
        const result = await api.addTag(TEST_DATA.accountId, TEST_DATA.name, TEST_DATA.color);
        expect(parser.storeTag).toHaveBeenCalledTimes(1);
        expect(parser.storeTag).toHaveBeenCalledWith(TEST_DATA.name, TEST_DATA.color, TEST_DATA.accountId);
        expect(result).toEqual(StatusCode.OK);
    });

    it("Delete tag (normal case)", async () => {
        parser.deleteTag.mockResolvedValueOnce();
        const result = await api.deleteTag(TEST_DATA.id);
        expect(parser.deleteTag).toHaveBeenCalledTimes(1);
        expect(parser.deleteTag).toHaveBeenCalledWith(TEST_DATA.id);
        expect(result).toEqual(StatusCode.OK);
    });
});
