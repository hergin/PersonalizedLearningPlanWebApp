import MessageApi from "../messageApi";
import MessageParser from "../../../parser/messageParser";
import { CreatedMessage, STATUS_CODE } from "../../../types";
import { FAKE_ERRORS } from "../../global/mockValues";

jest.mock("../../../parser/messageParser");

const mockMessageId = -1;
const mockSenderId = 0;
const mockRecipientId = 1;
const TEST_MESSAGE: CreatedMessage[] = [
    {
        content: "Hello, how are you doing today?",
        senderId: mockSenderId,
        recipientId: mockRecipientId
    },
    {
        content: "Pretty good, how about you?",
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

    it("Get All Sent Messages (normal case)", async () => {
        parser.parseAllMessagesFrom.mockResolvedValueOnce([TEST_MESSAGE[0]]);
        const result = await api.getAllSentMessages(mockSenderId);
        expect(parser.parseAllMessagesFrom).toHaveBeenCalledTimes(1);
        expect(parser.parseAllMessagesFrom).toHaveBeenCalledWith(mockSenderId);
        expect(result).toEqual([TEST_MESSAGE[0]]);
    });

    it("Get All Sent Messages (error case)", async () => {
        parser.parseAllMessagesFrom.mockRejectedValue(FAKE_ERRORS.networkError);
        const result = await api.getAllSentMessages(mockSenderId);
        expect(parser.parseAllMessagesFrom).toHaveBeenCalledTimes(1);
        expect(parser.parseAllMessagesFrom).toHaveBeenCalledWith(mockSenderId);
        expect(result).toEqual(STATUS_CODE.CONNECTION_ERROR);
    });

    it("Get Chat Messages (normal case)", async () => {
        parser.parseChat.mockResolvedValueOnce({sentMessages: [TEST_MESSAGE[0]], receivedMessages: [TEST_MESSAGE[1]]});
        const result = await api.getChatMessages(mockSenderId, mockRecipientId);
        expect(parser.parseChat).toHaveBeenCalledTimes(1);
        expect(parser.parseChat).toHaveBeenCalledWith(mockSenderId, mockRecipientId);
        expect(result).toEqual({sentMessages: [TEST_MESSAGE[0]], receivedMessages: [TEST_MESSAGE[1]]});
    });

    it("Get Chat Messages (error case)", async () => {
        parser.parseChat.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        const result = await api.getChatMessages(mockSenderId, mockRecipientId);
        expect(parser.parseChat).toHaveBeenCalledTimes(1);
        expect(parser.parseChat).toHaveBeenCalledWith(mockSenderId, mockRecipientId);
        expect(result).toEqual(STATUS_CODE.CONFLICT);
    });

    it("Send Message (normal case)", async () => {
        parser.storeMessage.mockResolvedValueOnce(undefined);
        const status = await api.sendMessage(TEST_MESSAGE[0]);
        expect(parser.storeMessage).toHaveBeenCalledTimes(1);
        expect(parser.storeMessage).toHaveBeenCalledWith(TEST_MESSAGE[0]);
        expect(status).toEqual(STATUS_CODE.OK);
    });

    it("Send Message (error case)", async () => {
        parser.storeMessage.mockRejectedValue(FAKE_ERRORS.badRequest);
        const status = await api.sendMessage(TEST_MESSAGE[0]);
        expect(parser.storeMessage).toHaveBeenCalledTimes(1);
        expect(parser.storeMessage).toHaveBeenCalledWith(TEST_MESSAGE[0]);
        expect(status).toEqual(STATUS_CODE.BAD_REQUEST);
    });

    it("Edit Message (normal case)", async () => {
        const mockContent = "Edited."
        parser.editMessage.mockResolvedValueOnce(undefined);
        const status = await api.editMessage(mockMessageId, mockContent);
        expect(parser.editMessage).toHaveBeenCalledTimes(1);
        expect(parser.editMessage).toHaveBeenCalledWith(mockMessageId, mockContent);
        expect(status).toEqual(STATUS_CODE.OK);
    });

    it("Edit Message (error case)", async () => {
        const mockContent = "Edited."
        parser.editMessage.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        const status = await api.editMessage(mockMessageId, mockContent);
        expect(parser.editMessage).toHaveBeenCalledTimes(1);
        expect(parser.editMessage).toHaveBeenCalledWith(mockMessageId, mockContent);
        expect(status).toEqual(STATUS_CODE.INTERNAL_SERVER_ERROR);
    });

    it("Delete Message (normal case)", async () => {
        parser.deleteMessage.mockResolvedValueOnce(undefined);
        const status = await api.deleteMessage(mockMessageId);
        expect(parser.deleteMessage).toHaveBeenCalledTimes(1);
        expect(parser.deleteMessage).toHaveBeenCalledWith(mockMessageId);
        expect(status).toEqual(STATUS_CODE.OK);
    });

    it("Delete Message (error case)", async () => {
        parser.deleteMessage.mockRejectedValue(FAKE_ERRORS.networkError);
        const status = await api.deleteMessage(mockMessageId);
        expect(parser.deleteMessage).toHaveBeenCalledTimes(1);
        expect(parser.deleteMessage).toHaveBeenCalledWith(mockMessageId);
        expect(status).toEqual(STATUS_CODE.CONNECTION_ERROR);
    });
});
