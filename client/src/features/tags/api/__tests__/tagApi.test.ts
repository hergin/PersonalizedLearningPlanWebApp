import TagApi from "../tagApi";
import { useApiConnection } from "../../../../hooks/useApiConnection";
import { throwServerError } from "../../../../utils/errorHandlers";
import { Tag } from "../../../../types";

jest.mock("../../../../hooks/useApiConnection");
jest.mock("../../../../utils/errorHandlers");

const mockAccountId = 0;
const mockTag: Tag = {
    name: "School",
    color: "#FF0000",
    accountId: mockAccountId,
};
const mockError = {message: "I'm in your walls."};

describe("Tag Api Unit Tests", () => {
    var mockConnection: any;
    var mockThrowServerError: jest.Mock<any, any, any>;

    beforeEach(() => {
        mockConnection = useApiConnection();
        mockThrowServerError = throwServerError as jest.Mock;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Fetch Tags (normal case)", async () => {
        const mockGet = mockConnection.get as jest.Mock;
        mockGet.mockResolvedValueOnce([mockTag]);
        const { fetchTags } = TagApi();
        const result = await fetchTags(mockAccountId);
        expect(mockThrowServerError).toHaveBeenCalledTimes(0);
        expect(mockGet).toHaveBeenCalledTimes(1);
        expect(mockGet).toHaveBeenCalledWith(`/tag/get/${mockAccountId}`);
        expect(result).toEqual([mockTag]);
    });

    it("Fetch Tags (error case)", async () => {
        const mockGet = mockConnection.get as jest.Mock;
        mockGet.mockRejectedValue(mockError);
        const { fetchTags } = TagApi();
        const result = await fetchTags(mockAccountId);
        expect(mockGet).toHaveBeenCalledTimes(1);
        expect(mockGet).toHaveBeenCalledWith(`/tag/get/${mockAccountId}`);
        expect(mockThrowServerError).toHaveBeenCalledTimes(1);
        expect(mockThrowServerError).toHaveBeenCalledWith(mockError);
        expect(result).toBeUndefined();
    });

    it("Create Tag (normal case)", async () => {
        const mockPost = mockConnection.post as jest.Mock;
        mockPost.mockResolvedValueOnce({});
        const { createTag } = TagApi();
        await createTag(mockTag);
        expect(mockThrowServerError).toHaveBeenCalledTimes(0);
        expect(mockPost).toHaveBeenCalledTimes(1);
        expect(mockPost).toHaveBeenCalledWith("/tag/add", mockTag);
    });

    it("Create Tag (error case)", async () => {
        const mockPost = mockConnection.post as jest.Mock;
        mockPost.mockRejectedValue(mockError);
        const { createTag } = TagApi();
        await createTag(mockTag);
        expect(mockPost).toHaveBeenCalledTimes(1);
        expect(mockPost).toHaveBeenCalledWith("/tag/add", mockTag);
        expect(mockThrowServerError).toHaveBeenCalledTimes(1);
        expect(mockThrowServerError).toHaveBeenCalledWith(mockError);
    });

    it("Delete Tag (normal case)", async () => {
        const mockDel = mockConnection.del as jest.Mock;
        mockDel.mockResolvedValueOnce({});
        const { deleteTag } = TagApi();
        const mockTagId = 0;
        await deleteTag(mockTagId);
        expect(mockThrowServerError).toHaveBeenCalledTimes(0);
        expect(mockDel).toHaveBeenCalledTimes(1);
        expect(mockDel).toHaveBeenCalledWith(`/tag/delete/${mockTagId}`);
    });

    it("Delete Tag (error case)", async () => {
        const mockDel = mockConnection.del as jest.Mock;
        mockDel.mockRejectedValue(mockError);
        const { deleteTag } = TagApi();
        const mockTagId = 0;
        await deleteTag(mockTagId);
        expect(mockDel).toHaveBeenCalledTimes(1);
        expect(mockDel).toHaveBeenCalledWith(`/tag/delete/${mockTagId}`);
        expect(mockThrowServerError).toHaveBeenCalledTimes(1);
        expect(mockThrowServerError).toHaveBeenCalledWith(mockError);
    });
});
