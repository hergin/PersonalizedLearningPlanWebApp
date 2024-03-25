import MessageParser from "../../parser/messageParser";
import { ErrorCodeInterpreter } from "./errorCodeInterpreter";
import { DatabaseError } from "pg";
import { Message, Chat, StatusCode } from "../../types";

export default class MessageApi {
    parser: MessageParser;
    errorCodeInterpreter: ErrorCodeInterpreter;

    constructor() {
        this.parser = new MessageParser();
        this.errorCodeInterpreter = new ErrorCodeInterpreter();
    }

    async getAllSentMessages(id: number): Promise<Message[] | StatusCode> {
        try {
            return await this.parser.parseAllMessagesFrom(id);
        } catch(error: unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError);
        }
    }

    async getChatMessages(accountId: number, recipientId: number): Promise<Chat | StatusCode> {
        try {
            return await this.parser.parseChat(accountId, recipientId);
        } catch (error: unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError);
        }
    }

    async sendMessage(message: Message): Promise<StatusCode> {
        try {
            await this.parser.storeMessage(message);
            return StatusCode.OK;
        } catch(error: unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError);
        }
    }

    async deleteMessage(id: number): Promise<StatusCode> {
        try {
            await this.parser.deleteMessage(id);
            return StatusCode.OK;
        } catch(error: unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError);
        }
    }
}
