import MessageApi from "../messageApi";
import MessageParser from "../../../parser/messageParser";
import { Message, StatusCode } from "../../../types";
import { FAKE_ERRORS } from "../../global/mockValues";

jest.mock("../../../parser/messageParser");

const mockMessageId = -1;
const mockSenderId = 0;
const mockRecipientId = 1;
const TEST_MESSAGE: Message[] = [
    {
        content: "Hello, how are you doing today?",
        date: "",
        senderId: mockSenderId,
        recipientId: mockRecipientId
    },
    {
        content: "Pretty good, how about you?",
        date: "",
        senderId: mockRecipientId,
        recipientId: mockSenderId
    }
];

describe("Message Api Unit Tests", () => {
    var api = new MessageApi();
    var parser: any;

    beforeEach(() => {
        parser = new MessageParser();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Get Chat Messages (normal case)", async () => {
        parser.parseChat.mockResolvedValueOnce({sentMessages: [TEST_MESSAGE[0]], receivedMessages: [TEST_MESSAGE[1]]});
        const result = await api.getChatMessages(mockSenderId, mockRecipientId);
        expect(parser.parseChat).toHaveBeenCalledTimes(1);
        expect(parser.parseChat).toHaveBeenCalledWith(mockSenderId, mockRecipientId);
        expect(result).toEqual({sentMessages: [TEST_MESSAGE[0]], receivedMessages: [TEST_MESSAGE[1]]});
    });

    it("Get Chat Messages (database error case)", async () => {
        parser.parseChat.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        const result = await api.getChatMessages(mockSenderId, mockRecipientId);
        expect(parser.parseChat).toHaveBeenCalledTimes(1);
        expect(parser.parseChat).toHaveBeenCalledWith(mockSenderId, mockRecipientId);
        expect(result).toEqual(StatusCode.CONFLICT);
    });

    it("Send Message (normal case)", async () => {
        parser.storeMessage.mockResolvedValueOnce(undefined);
        const status = await api.sendMessage(TEST_MESSAGE[0]);
        expect(parser.storeMessage).toHaveBeenCalledTimes(1);
        expect(parser.storeMessage).toHaveBeenCalledWith(TEST_MESSAGE[0]);
        expect(status).toEqual(StatusCode.OK);
    });

    it("Send Message (error case)", async () => {
        parser.storeMessage.mockRejectedValue(FAKE_ERRORS.badRequest);
        const status = await api.sendMessage(TEST_MESSAGE[0]);
        expect(parser.storeMessage).toHaveBeenCalledTimes(1);
        expect(parser.storeMessage).toHaveBeenCalledWith(TEST_MESSAGE[0]);
        expect(status).toEqual(StatusCode.BAD_REQUEST);
    });

    it("Delete Message (normal case)", async () => {
        parser.deleteMessage.mockResolvedValueOnce(undefined);
        const status = await api.deleteMessage(mockMessageId);
        expect(parser.deleteMessage).toHaveBeenCalledTimes(1);
        expect(parser.deleteMessage).toHaveBeenCalledWith(mockMessageId);
        expect(status).toEqual(StatusCode.OK);
    });

    it("Delete Message (error case)", async () => {
        parser.deleteMessage.mockRejectedValue(FAKE_ERRORS.networkError);
        const status = await api.deleteMessage(mockMessageId);
        expect(parser.deleteMessage).toHaveBeenCalledTimes(1);
        expect(parser.deleteMessage).toHaveBeenCalledWith(mockMessageId);
        expect(status).toEqual(StatusCode.CONNECTION_ERROR);
    });
});
