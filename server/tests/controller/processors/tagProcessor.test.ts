import * as TagProcessor from "../../../controller/processors/tagProcessor";
import TagApi from "../../../controller/api/tagApi";
import { StatusCode } from "../../../types";
import { initializeErrorMap } from "../../../utils/errorMessages";
import { createMockRequest, MOCK_RESPONSE, TEST_DATA } from "./universal/mockValues";

jest.mock("../../../controller/api/tagApi");

const TEST_TAG = {
    id: TEST_DATA.tagId,
    name: TEST_DATA.tagName,
    color: TEST_DATA.color
};
const ERROR_MESSAGES = initializeErrorMap();

describe("Tag Processor unit tests", () => {
    const tagApi : any = new TagApi();

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("get tags (normal case)", async () => {
        tagApi.getTags.mockResolvedValueOnce([TEST_TAG]);
        const mRequest = createMockRequest({}, {id: TEST_DATA.accountId});
        await TagProcessor.getTags(mRequest, MOCK_RESPONSE);
        expect(tagApi.getTags).toHaveBeenCalledTimes(1);
        expect(tagApi.getTags).toHaveBeenCalledWith(TEST_DATA.accountId);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.OK);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith([TEST_TAG]);
    });

    it("get tags (error case)", async () => {
        tagApi.getTags.mockResolvedValueOnce(StatusCode.FORBIDDEN);
        const mRequest = createMockRequest({}, {id: TEST_DATA.accountId});
        await TagProcessor.getTags(mRequest, MOCK_RESPONSE);
        expect(tagApi.getTags).toHaveBeenCalledTimes(1);
        expect(tagApi.getTags).toHaveBeenCalledWith(TEST_DATA.accountId);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.FORBIDDEN);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(StatusCode.FORBIDDEN));
    });

    it("create tag (normal case)", async () => {
        tagApi.addTag.mockResolvedValueOnce(StatusCode.OK);
        const mRequest = createMockRequest({name: TEST_TAG.name, color: TEST_TAG.color, accountId: TEST_DATA.accountId});
        await TagProcessor.createTag(mRequest, MOCK_RESPONSE);
        expect(tagApi.addTag).toHaveBeenCalledTimes(1);
        expect(tagApi.addTag).toHaveBeenCalledWith(TEST_DATA.accountId, TEST_TAG.name, TEST_TAG.color);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(StatusCode.OK);
    });

    it("create tag (error case)", async () => {
        tagApi.addTag.mockResolvedValueOnce(StatusCode.CONFLICT);
        const mRequest = createMockRequest({name: TEST_TAG.name, color: TEST_TAG.color, accountId: TEST_DATA.accountId});
        await TagProcessor.createTag(mRequest, MOCK_RESPONSE);
        expect(tagApi.addTag).toHaveBeenCalledTimes(1);
        expect(tagApi.addTag).toHaveBeenCalledWith(TEST_DATA.accountId, TEST_TAG.name, TEST_TAG.color);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.CONFLICT);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(StatusCode.CONFLICT));
    });

    it("delete tag (normal case)", async () => {
        tagApi.deleteTag.mockResolvedValueOnce(StatusCode.OK);
        const mRequest = createMockRequest({}, {id: TEST_TAG.id});
        await TagProcessor.deleteTag(mRequest, MOCK_RESPONSE);
        expect(tagApi.deleteTag).toHaveBeenCalledTimes(1);
        expect(tagApi.deleteTag).toHaveBeenCalledWith(TEST_TAG.id);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(StatusCode.OK);
    });

    it("delete tag (error case)", async () => {
        tagApi.deleteTag.mockResolvedValueOnce(StatusCode.FORBIDDEN);
        const mRequest = createMockRequest({}, {id: TEST_TAG.id});
        await TagProcessor.deleteTag(mRequest, MOCK_RESPONSE);
        expect(tagApi.deleteTag).toHaveBeenCalledTimes(1);
        expect(tagApi.deleteTag).toHaveBeenCalledWith(TEST_TAG.id);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.FORBIDDEN);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(StatusCode.FORBIDDEN));
    });
});
