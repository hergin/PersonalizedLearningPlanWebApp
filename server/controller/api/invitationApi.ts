import { DatabaseError } from "pg";
import InvitationParser from "../../parser/invitationParser";
import { InviteData, StatusCode } from "../../types";
import { convertDatabaseErrorToStatusCode } from "../../utils/errorHandlers";

export default class InvitationApi {
    readonly parser: InvitationParser;

    constructor() {
        this.parser = new InvitationParser();
    }

    async getInvites(recipientId: number) {
        try {
            return await this.parser.getInvites(recipientId); 
        } catch(error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async getPendingInvites(senderId: number) {
        try {
            return await this.parser.getPendingInvites(senderId);
        } catch(error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async createInvite(senderId: number, recipientId: number) {
        try {
            await this.parser.createInvite(senderId, recipientId);
            return await this.parser.getInviteWithAccounts(senderId, recipientId);
        } catch(error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async acceptInvite(inviteId: number, senderId: number, recipientId: number): Promise<InviteData[] | StatusCode> {
        try {
            return await this.parser.acceptInvite(inviteId, senderId, recipientId);
        } catch(error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async rejectInvite(inviteId: number): Promise<InviteData[] | StatusCode> {
        try {
            return await this.parser.deleteInvite(inviteId);
        } catch(error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }
}
