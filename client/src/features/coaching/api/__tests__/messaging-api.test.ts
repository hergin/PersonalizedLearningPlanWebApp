import MessagingApi from "../messaging-api";
import { useApiConnection } from "../../../../hooks/useApiConnection";
import { Message } from "../../../../types";
import { AxiosError } from "axios";

jest.mock("../../../../hooks/useApiConnection");

const mockMessageId = -1;
const mockSenderId = 0;
const mockRecipientId = 1;
const TEST_MESSAGE: Message[] = [
    {
        content: "Hello! How are you?",
        senderId: mockSenderId,
        recipientId: mockRecipientId,
    },
    {
        content: "Good! And you?",
        senderId: mockRecipientId,
        recipientId: mockSenderId
    }
];
const mockError: AxiosError = {message: "I'm in your walls."} as AxiosError;

describe("Message Api Unit Tests", () => {
    const { getMessagesBetween, sendMessage, editMessage, deleteMessage } = MessagingApi();
    var apiClient: any;
    var mockErrorConsole: any;
    var mockAlert: any;

    beforeEach(() => {
        apiClient = useApiConnection();
        mockErrorConsole = jest.spyOn(global.console, 'error');
        mockAlert = jest.spyOn(window, 'alert');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Get Messages Between (normal case)", async () => {
        apiClient.get.mockResolvedValueOnce({sentMessages: [TEST_MESSAGE[0]], receivedMessages: [TEST_MESSAGE[1]]});
        const result = await getMessagesBetween(mockSenderId, mockRecipientId);
        expect(mockErrorConsole).toHaveBeenCalledTimes(0);
        expect(mockAlert).toHaveBeenCalledTimes(0);
        expect(apiClient.get).toHaveBeenCalledTimes(1);
        expect(apiClient.get).toHaveBeenCalledWith(`/message/${mockSenderId}/${mockRecipientId}`);
        expect(result).toEqual({sentMessages: [TEST_MESSAGE[0]], receivedMessages: [TEST_MESSAGE[1]]});
    });

    it("Get Messages Between (error case)", async () => {
        apiClient.get.mockRejectedValue(mockError);
        const result = await getMessagesBetween(mockSenderId, mockRecipientId);
        expect(apiClient.get).toHaveBeenCalledTimes(1);
        expect(apiClient.get).toHaveBeenCalledWith(`/message/${mockSenderId}/${mockRecipientId}`);
        expect(mockErrorConsole).toHaveBeenCalledTimes(1);
        expect(mockErrorConsole).toHaveBeenCalledWith(mockError);
        expect(mockAlert).toHaveBeenCalledTimes(1);
        expect(mockAlert).toHaveBeenCalledWith(mockError.message);
        expect(result).toBeUndefined();
    });

    it("Send Message (normal case)", async () => {
        apiClient.post.mockResolvedValueOnce({});
        await sendMessage(TEST_MESSAGE[0]);
        expect(apiClient.post).toHaveBeenCalledTimes(1);
        expect(apiClient.post).toHaveBeenCalledWith("/message/send", TEST_MESSAGE[0]);
        expect(mockErrorConsole).toHaveBeenCalledTimes(0);
        expect(mockAlert).toHaveBeenCalledTimes(0);
    });

    it("Send Message (error case)", async () => {
        apiClient.post.mockRejectedValue(mockError);
        await sendMessage(TEST_MESSAGE[0]);
        expect(apiClient.post).toHaveBeenCalledTimes(1);
        expect(apiClient.post).toHaveBeenCalledWith("/message/send", TEST_MESSAGE[0]);
        expect(mockErrorConsole).toHaveBeenCalledTimes(1);
        expect(mockErrorConsole).toHaveBeenCalledWith(mockError);
        expect(mockAlert).toHaveBeenCalledTimes(1);
        expect(mockAlert).toHaveBeenCalledWith(mockError.message);
    });

    it("Edit Message (normal case)", async () => {
        const mockContent = "Updated message!";
        apiClient.put.mockResolvedValueOnce({});
        await editMessage(mockMessageId, mockContent);
        expect(apiClient.put).toHaveBeenCalledTimes(1);
        expect(apiClient.put).toHaveBeenCalledWith(`/message/edit/${mockMessageId}`, {content: mockContent});
        expect(mockErrorConsole).toHaveBeenCalledTimes(0);
        expect(mockAlert).toHaveBeenCalledTimes(0);
    });

    it("Edit Message (error case)", async () => {
        const mockContent = "Updated message!";
        apiClient.put.mockRejectedValue(mockError);
        await editMessage(mockMessageId, mockContent);
        expect(apiClient.put).toHaveBeenCalledTimes(1);
        expect(apiClient.put).toHaveBeenCalledWith(`/message/edit/${mockMessageId}`, {content: mockContent});
        expect(mockErrorConsole).toHaveBeenCalledTimes(1);
        expect(mockErrorConsole).toHaveBeenCalledWith(mockError);
        expect(mockAlert).toHaveBeenCalledTimes(1);
        expect(mockAlert).toHaveBeenCalledWith(mockError.message);
    });

    it("Delete Message (normal case)", async () => {
        apiClient.del.mockResolvedValueOnce({});
        await deleteMessage(mockMessageId);
        expect(apiClient.del).toHaveBeenCalledTimes(1);
        expect(apiClient.del).toHaveBeenCalledWith(`/message/delete/${mockMessageId}`);
        expect(mockErrorConsole).toHaveBeenCalledTimes(0);
        expect(mockAlert).toHaveBeenCalledTimes(0);
    });

    it("Delete Message (error case)", async () => {
        apiClient.del.mockRejectedValue(mockError);
        await deleteMessage(mockMessageId);
        expect(apiClient.del).toHaveBeenCalledTimes(1);
        expect(apiClient.del).toHaveBeenCalledWith(`/message/delete/${mockMessageId}`);
        expect(mockErrorConsole).toHaveBeenCalledTimes(1);
        expect(mockErrorConsole).toHaveBeenCalledWith(mockError);
        expect(mockAlert).toHaveBeenCalledTimes(1);
        expect(mockAlert).toHaveBeenCalledWith(mockError.message);
    });
});
