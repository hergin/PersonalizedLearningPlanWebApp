import DatabaseParser from "./databaseParser";

export default class InvitationParser extends DatabaseParser {
    constructor() {
        super();
    }

    async getInviteWithId(inviteId: number) {
        const query = {
            text: "SELECT * FROM INVITE_DATA WHERE id = $1",
            values: [inviteId]
        };
        return this.parseDatabase(query);
    }

    async getInviteWithAccounts(senderId: number, recipientId: number) {
        const query = {
            text: "SELECT * FROM INVITE_DATA WHERE sender_id = $1 AND recipient_id = $2",
            values: [senderId, recipientId]
        };
        return this.parseDatabase(query);
    }

    async getInvites(recipientId: number) {
        const query = {
            text: "SELECT * FROM INVITE_DATA WHERE recipient_id = $1",
            values: [recipientId]
        };
        return this.parseDatabase(query);
    }

    async getPendingInvites(senderId: number) {
        const query = {
            text: "SELECT * FROM INVITE_DATA WHERE sender_id = $1",
            values: [senderId]
        };
        return this.parseDatabase(query);
    }

    async createInvite(senderId: number, recipientId: number) {
        const query = {
            text: "INSERT INTO INVITATION(sender_id, recipient_id) VALUES($1, $2)",
            values: [senderId, recipientId]
        };
        await this.updateDatabase(query);
    }

    async acceptInvite(inviteId: number, senderId: number, recipientId: number) {
        await this.updateDatabase({
            text: "UPDATE ACCOUNT SET coach_id = $1 WHERE id = $2",
            values: [recipientId, senderId]
        });
        return await this.deleteInvite(inviteId);
    }

    async deleteInvite(inviteId: number) {
        const inviteData = await this.getInviteWithId(inviteId);
        await this.updateDatabase({
            text: "DELETE FROM INVITATION WHERE id = $1",
            values: [inviteId]
        });
        return inviteData;
    }
}
