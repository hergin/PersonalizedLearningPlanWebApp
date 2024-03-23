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

    it("parseChat", async () => {
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

    it("storeMessage", async () => {
        const messageId = [{id: 1}];
        mockQuery.mockResolvedValueOnce(undefined);
        mockQuery.mockResolvedValueOnce({rows: messageId});
        const result = await parser.storeMessage(TEST_MESSAGE);
        expect(mockQuery).toHaveBeenCalledTimes(2);
        expect(mockQuery).toHaveBeenNthCalledWith(1, {
            text: "INSERT INTO MESSAGE(content, date, sender_id, recipient_id) VALUES ($1, $2, $3, $4, $5)",
            values: [TEST_MESSAGE.content, TEST_MESSAGE.date, TEST_MESSAGE.senderId, TEST_MESSAGE.recipientId]
        });
        expect(mockQuery).toHaveBeenNthCalledWith(2, {
            text: "SELECT id FROM MESSAGE WHERE content = $1 AND date = $2 AND sender_id = $3 AND recipient_id = $4",
            values: [TEST_MESSAGE.content, TEST_MESSAGE.date, TEST_MESSAGE.senderId, TEST_MESSAGE.recipientId]
        });
        expect(result).toEqual(messageId);
    });

    it("deleteMessage", async () => {
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
