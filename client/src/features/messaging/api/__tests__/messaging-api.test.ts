import MessagingApi from "../messaging-api";
import { useApiConnection } from "../../../../hooks/useApiConnection";
import { CreatedMessage } from "../../../../types";
import { throwServerError } from "../../../../utils/errorHandlers";

jest.mock("../../../../hooks/useApiConnection");
jest.mock("../../../../utils/errorHandlers");

const mockMessageId = -1;
const mockSenderId = 0;
const mockRecipientId = 1;
const TEST_MESSAGE: CreatedMessage[] = [
    {
        content: "Hello! How are you?",
        sender_id: mockSenderId,
        recipientId: mockRecipientId,
    },
    {
        content: "Good! And you?",
        sender_id: mockRecipientId,
        recipientId: mockSenderId
    }
];
const mockError = {message: "I'm in your walls."};

describe("Message Api Unit Tests", () => {
    const { getMessagesBetween, sendMessage, editMessage, deleteMessage } = MessagingApi();
    var apiClient: any;
    var mockThrowServerError: jest.Mock;

    beforeEach(() => {
        apiClient = useApiConnection();
        mockThrowServerError = throwServerError as jest.Mock;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Get Messages Between (normal case)", async () => {
        apiClient.get.mockResolvedValueOnce({sentMessages: [TEST_MESSAGE[0]], receivedMessages: [TEST_MESSAGE[1]]});
        const result = await getMessagesBetween(mockSenderId, mockRecipientId);
        expect(mockThrowServerError).toHaveBeenCalledTimes(0);
        expect(apiClient.get).toHaveBeenCalledTimes(1);
        expect(apiClient.get).toHaveBeenCalledWith(`/message/${mockSenderId}/${mockRecipientId}`);
        expect(result).toEqual({sentMessages: [TEST_MESSAGE[0]], receivedMessages: [TEST_MESSAGE[1]]});
    });

    it("Get Messages Between (error case)", async () => {
        apiClient.get.mockRejectedValue(mockError);
        const result = await getMessagesBetween(mockSenderId, mockRecipientId);
        expect(apiClient.get).toHaveBeenCalledTimes(1);
        expect(apiClient.get).toHaveBeenCalledWith(`/message/${mockSenderId}/${mockRecipientId}`);
        expect(mockThrowServerError).toHaveBeenCalledTimes(1);
        expect(mockThrowServerError).toHaveBeenCalledWith(mockError);
        expect(result).toBeUndefined();
    });

    it("Send Message (normal case)", async () => {
        apiClient.post.mockResolvedValueOnce({});
        await sendMessage(TEST_MESSAGE[0]);
        expect(mockThrowServerError).toHaveBeenCalledTimes(0);
        expect(apiClient.post).toHaveBeenCalledTimes(1);
        expect(apiClient.post).toHaveBeenCalledWith("/message/send", TEST_MESSAGE[0]);
    });

    it("Send Message (error case)", async () => {
        apiClient.post.mockRejectedValue(mockError);
        await sendMessage(TEST_MESSAGE[0]);
        expect(apiClient.post).toHaveBeenCalledTimes(1);
        expect(apiClient.post).toHaveBeenCalledWith("/message/send", TEST_MESSAGE[0]);
        expect(mockThrowServerError).toHaveBeenCalledTimes(1);
        expect(mockThrowServerError).toHaveBeenCalledWith(mockError);
    });

    it("Edit Message (normal case)", async () => {
        const mockContent = "Updated message!";
        apiClient.put.mockResolvedValueOnce({});
        await editMessage(mockMessageId, mockContent);
        expect(mockThrowServerError).toHaveBeenCalledTimes(0);
        expect(apiClient.put).toHaveBeenCalledTimes(1);
        expect(apiClient.put).toHaveBeenCalledWith(`/message/edit/${mockMessageId}`, {content: mockContent});
    });

    it("Edit Message (error case)", async () => {
        const mockContent = "Updated message!";
        apiClient.put.mockRejectedValue(mockError);
        await editMessage(mockMessageId, mockContent);
        expect(apiClient.put).toHaveBeenCalledTimes(1);
        expect(apiClient.put).toHaveBeenCalledWith(`/message/edit/${mockMessageId}`, {content: mockContent});
        expect(mockThrowServerError).toHaveBeenCalledTimes(1);
        expect(mockThrowServerError).toHaveBeenCalledWith(mockError);
    });

    it("Delete Message (normal case)", async () => {
        apiClient.del.mockResolvedValueOnce({});
        await deleteMessage(mockMessageId);
        expect(mockThrowServerError).toHaveBeenCalledTimes(0);
        expect(apiClient.del).toHaveBeenCalledTimes(1);
        expect(apiClient.del).toHaveBeenCalledWith(`/message/delete/${mockMessageId}`);
    });

    it("Delete Message (error case)", async () => {
        apiClient.del.mockRejectedValue(mockError);
        await deleteMessage(mockMessageId);
        expect(apiClient.del).toHaveBeenCalledTimes(1);
        expect(apiClient.del).toHaveBeenCalledWith(`/message/delete/${mockMessageId}`);
        expect(mockThrowServerError).toHaveBeenCalledTimes(1);
        expect(mockThrowServerError).toHaveBeenCalledWith(mockError);
    });
});
