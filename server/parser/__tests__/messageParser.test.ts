import MessageParser from "../messageParser";
import { Pool } from "pg";

jest.mock("pg");

const TEST_SENDER = {
    id: 0,
    username: "Xx_BobJones_xX",
    profilePicture: ""
};

const TEST_RECIPIENT = {
    id: 1,
    username: "SillyCat666",
    profilePicture: ""
}

const TEST_MESSAGE = {
    content: "Funny Message",
    date: "2025-01-01T23:59:59.000Z",
    senderId: TEST_SENDER.id,
    recipientId: TEST_RECIPIENT.id,
};

describe("Message Parser Unit Tests", () => {
    const parser = new MessageParser();
    var mockQuery: jest.Mock<any, any, any>;

    beforeEach(() => {
        mockQuery = new Pool().query as jest.Mock<any, any, any>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Parse All Sent Messages From", async () => {
        mockQuery.mockResolvedValueOnce({rows: [TEST_MESSAGE]});
        const result = await parser.parseAllMessagesFrom(TEST_SENDER.id);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "SELECT * FROM MESSAGE WHERE sender_id = $1",
            values: [TEST_SENDER.id]
        });
        expect(result).toEqual([TEST_MESSAGE]);
    });

    it("Parse Chat", async () => {
        const mockResultOne = {rows: [{
            ...TEST_MESSAGE,
            username: TEST_SENDER.username,
            profilePicture: TEST_SENDER.profilePicture
        }]};
        const mockResultTwo = {rows: [{
            ...TEST_MESSAGE,
            username: TEST_RECIPIENT.username,
            profilePicture: TEST_RECIPIENT.profilePicture
        }]};
        mockQuery.mockResolvedValueOnce(mockResultOne);
        mockQuery.mockResolvedValueOnce(mockResultTwo);
        const result = await parser.parseChat(TEST_SENDER.id, TEST_RECIPIENT.id);
        expect(mockQuery).toHaveBeenCalledTimes(2);
        expect(mockQuery).toHaveBeenNthCalledWith(1, {
            text: "SELECT * FROM MESSAGE_DATA WHERE sender_id = $1 AND recipient_id = $2",
            values: [TEST_SENDER.id, TEST_RECIPIENT.id]
        });
        expect(mockQuery).toHaveBeenNthCalledWith(2, {
            text: "SELECT * FROM MESSAGE_DATA WHERE sender_id = $1 AND recipient_id = $2",
            values: [TEST_RECIPIENT.id, TEST_SENDER.id]
        });
        expect(result).toEqual({
            sentMessages: mockResultOne.rows,
            receivedMessages: mockResultTwo.rows,
        });
    });

    it("Store Message", async () => {
        const messageId = [{id: 1}];
        mockQuery.mockResolvedValueOnce(undefined);
        mockQuery.mockResolvedValueOnce({rows: messageId});
        await parser.storeMessage(TEST_MESSAGE);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "INSERT INTO MESSAGE(content, sender_id, recipient_id) VALUES ($1, $2, $3)",
            values: [TEST_MESSAGE.content, TEST_MESSAGE.senderId, TEST_MESSAGE.recipientId]
        });
    });

    it("Edit Message", async () => {
        const mockMessageId = 1;
        const mockContent = "Edited Message";
        mockQuery.mockResolvedValueOnce(undefined);
        await parser.editMessage(mockMessageId, mockContent);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "UPDATE MESSAGE SET content = $1 WHERE id = $2",
            values: [mockContent, mockMessageId]
        });
    });

    it("Delete Message", async () => {
        const messageId = 1;
        mockQuery.mockResolvedValueOnce(undefined);
        await parser.deleteMessage(messageId);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "DELETE FROM MESSAGE WHERE ID = $1",
            values: [messageId]
        });
    });
});
