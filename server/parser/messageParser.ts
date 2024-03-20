import { Message } from "../types";
import DatabaseParser from "./databaseParser";

export default class MessageParser extends DatabaseParser {
    constructor() {
        super();
    }

    async parseChat(accountId: number, recipientId: number) {
        const sentMessages = await this.parseMessages(accountId, recipientId);
        const receivedMessages = await this.parseMessages(recipientId, accountId);
        return {sentMessages, receivedMessages};
    }

    async parseMessages(senderId: number, recipientId: number) {
        const query = {
            text: "SELECT * FROM MESSAGE_DATA WHERE sender_id = $1 AND recipient_id = $2",
            values: [senderId, recipientId]
        };
        return await this.parseDatabase(query);
    }

    async storeMessage(message: Message) {
        const query = {
            text: "INSERT INTO MESSAGE(content, date, sender_id, recipient_id) VALUES ($1, $2, $3, $4, $5)",
            values: [message.content, message.date, message.senderId, message.recipientId]
        };
        await this.updateDatabase(query);
        return this.getMessageId(message);
    }

    private async getMessageId(message: Message) {
        const query = {
            text: "SELECT id FROM MESSAGE WHERE content = $1 AND date = $2 AND sender_id = $3 AND recipient_id = $4",
            values: [message.content, message.date, message.senderId, message.recipientId]
        };
        return this.parseDatabase(query);
    }

    async deleteMessage(id: number) {
        const query = {
            text: "DELETE FROM MESSAGE WHERE ID = $1",
            values: [id]
        };
        await this.updateDatabase(query);
    }
}
