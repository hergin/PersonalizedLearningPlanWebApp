import MessageParser from "../../parser/messageParser";
import { convertDatabaseErrorToStatusCode } from "../../utils/errorHandlers";
import { DatabaseError } from "pg";
import { Message, Chat, STATUS_CODE, StatusCode } from "../../types";

export default class MessageApi {
    readonly parser: MessageParser;

    constructor() {
        this.parser = new MessageParser();
    }

    async getAllSentMessages(id: number): Promise<Message[] | StatusCode> {
        try {
            return await this.parser.parseAllMessagesFrom(id);
        } catch(error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async getChatMessages(accountId: number, recipientId: number): Promise<Chat | StatusCode> {
        try {
            return await this.parser.parseChat(accountId, recipientId);
        } catch (error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async sendMessage(message: Message): Promise<StatusCode> {
        try {
            await this.parser.storeMessage(message);
            return STATUS_CODE.OK;
        } catch(error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async editMessage(id: number, content: string): Promise<StatusCode> {
        try {
            await this.parser.editMessage(id, content);
            return STATUS_CODE.OK;
        } catch(error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async deleteMessage(id: number): Promise<StatusCode> {
        try {
            await this.parser.deleteMessage(id);
            return STATUS_CODE.OK;
        } catch(error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }
}
