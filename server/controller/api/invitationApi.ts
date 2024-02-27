import { DatabaseError } from "pg";
import InvitationParser from "../../parser/invitationParser";
import { InviteData, StatusCode } from "../../types";
import { ErrorCodeInterpreter } from "./errorCodeInterpreter";

export default class InvitationApi {
    parser: InvitationParser;
    errorCodeInterpreter: ErrorCodeInterpreter;

    constructor() {
        this.parser = new InvitationParser();
        this.errorCodeInterpreter = new ErrorCodeInterpreter();
    }

    async getInvites(recipientId: number) {
        try {
            return await this.parser.getInvites(recipientId); 
        } catch(error: unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError);
        }
    }

    async getPendingInvites(senderId: number) {
        try {
            return await this.parser.getPendingInvites(senderId);
        } catch(error: unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError);
        }
    }

    async createInvite(senderId: number, recipientId: number) {
        try {
            await this.parser.createInvite(senderId, recipientId);
            return this.parser.getInviteWithAccounts(senderId, recipientId);
        } catch(error: unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError);
        }
    }

    async acceptInvite(inviteId: number, senderId: number, recipientId: number): Promise<InviteData[] | StatusCode> {
        try {
            return this.parser.acceptInvite(inviteId, senderId, recipientId);
        } catch(error: unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError);
        }
    }

    async rejectInvite(inviteId: number): Promise<InviteData[] | StatusCode> {
        try {
            return this.parser.deleteInvite(inviteId);
        } catch(error: unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError);
        }
    }
}
