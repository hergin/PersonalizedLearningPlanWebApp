import * as TagProcessor from "../tagProcessor";
import TagApi from "../../api/tagApi";
import { STATUS_CODE } from "../../../types";
import { getLoginError } from "../../../utils/errorHandlers";
import { createMockRequest, MOCK_RESPONSE, TEST_TAG } from "../../global/mockValues";

jest.mock("../../../controller/api/tagApi");

describe("Tag Processor unit tests", () => {
    const tagApi : any = new TagApi();

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("get tags (normal case)", async () => {
        tagApi.getTags.mockResolvedValueOnce([TEST_TAG]);
        const mRequest = createMockRequest({}, {id: TEST_TAG.accountId});
        await TagProcessor.getTags(mRequest, MOCK_RESPONSE);
        expect(tagApi.getTags).toHaveBeenCalledTimes(1);
        expect(tagApi.getTags).toHaveBeenCalledWith(TEST_TAG.accountId);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.OK);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith([TEST_TAG]);
    });

    it("get tags (error case)", async () => {
        tagApi.getTags.mockResolvedValueOnce(STATUS_CODE.FORBIDDEN);
        const mRequest = createMockRequest({}, {id: TEST_TAG.accountId});
        await TagProcessor.getTags(mRequest, MOCK_RESPONSE);
        expect(tagApi.getTags).toHaveBeenCalledTimes(1);
        expect(tagApi.getTags).toHaveBeenCalledWith(TEST_TAG.accountId);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.FORBIDDEN);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.FORBIDDEN));
    });

    it("create tag (normal case)", async () => {
        tagApi.addTag.mockResolvedValueOnce(STATUS_CODE.OK);
        const mRequest = createMockRequest({name: TEST_TAG.name, color: TEST_TAG.color, accountId: TEST_TAG.accountId});
        await TagProcessor.createTag(mRequest, MOCK_RESPONSE);
        expect(tagApi.addTag).toHaveBeenCalledTimes(1);
        expect(tagApi.addTag).toHaveBeenCalledWith(TEST_TAG.accountId, TEST_TAG.name, TEST_TAG.color);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(STATUS_CODE.OK);
    });

    it("create tag (error case)", async () => {
        tagApi.addTag.mockResolvedValueOnce(STATUS_CODE.CONFLICT);
        const mRequest = createMockRequest({name: TEST_TAG.name, color: TEST_TAG.color, accountId: TEST_TAG.accountId});
        await TagProcessor.createTag(mRequest, MOCK_RESPONSE);
        expect(tagApi.addTag).toHaveBeenCalledTimes(1);
        expect(tagApi.addTag).toHaveBeenCalledWith(TEST_TAG.accountId, TEST_TAG.name, TEST_TAG.color);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.CONFLICT);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.CONFLICT));
    });

    it("delete tag (normal case)", async () => {
        tagApi.deleteTag.mockResolvedValueOnce(STATUS_CODE.OK);
        const mRequest = createMockRequest({}, {id: TEST_TAG.id});
        await TagProcessor.deleteTag(mRequest, MOCK_RESPONSE);
        expect(tagApi.deleteTag).toHaveBeenCalledTimes(1);
        expect(tagApi.deleteTag).toHaveBeenCalledWith(TEST_TAG.id);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(STATUS_CODE.OK);
    });

    it("delete tag (error case)", async () => {
        tagApi.deleteTag.mockResolvedValueOnce(STATUS_CODE.FORBIDDEN);
        const mRequest = createMockRequest({}, {id: TEST_TAG.id});
        await TagProcessor.deleteTag(mRequest, MOCK_RESPONSE);
        expect(tagApi.deleteTag).toHaveBeenCalledTimes(1);
        expect(tagApi.deleteTag).toHaveBeenCalledWith(TEST_TAG.id);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.FORBIDDEN);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.FORBIDDEN));
    });
});
