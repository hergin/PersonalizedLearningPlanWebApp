import DatabaseParser from "./databaseParser";
import { Message, Chat } from "../types";

export default class MessageParser extends DatabaseParser {
    constructor() {
        super();
    }

    async parseAllMessagesFrom(id: number): Promise<Message[]> {
        const query = {
            text: "SELECT * FROM MESSAGE WHERE sender_id = $1",
            values: [id]
        };
        return await this.parseDatabase(query);
    }

    async parseChat(accountId: number, recipientId: number): Promise<Chat> {
        const sentMessages = await this.parseSentMessages(accountId, recipientId);
        const receivedMessages = await this.parseSentMessages(recipientId, accountId);
        return {sentMessages, receivedMessages};
    }

    async parseSentMessages(senderId: number, recipientId: number): Promise<Message[]> {
        const query = {
            text: "SELECT * FROM MESSAGE_DATA WHERE sender_id = $1 AND recipient_id = $2",
            values: [senderId, recipientId]
        };
        return await this.parseDatabase(query);
    }

    async storeMessage(message: Message): Promise<void> {
        const query = {
            text: "INSERT INTO MESSAGE(content, sender_id, recipient_id) VALUES ($1, $2, $3)",
            values: [message.content, message.senderId, message.recipientId]
        };
        await this.updateDatabase(query);
    }

    async editMessage(id: number, content: string) {
        const query = {
            text: "UPDATE MESSAGE SET content = $1 WHERE id = $2",
            values: [content, id]
        };
        await this.updateDatabase(query);
    }

    async deleteMessage(id: number): Promise<void> {
        const query = {
            text: "DELETE FROM MESSAGE WHERE ID = $1",
            values: [id]
        };
        await this.updateDatabase(query);
    }
}
