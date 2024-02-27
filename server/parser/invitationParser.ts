import DatabaseParser from "./databaseParser";

export default class InvitationParser extends DatabaseParser {
    constructor() {
        super();
    }

    async getInvite(recipientId: number) {
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
        }
        await this.updateDatabase(query);
    }

    async acceptInvite(inviteId: number, senderId: number, recipientId: number) {
        const updateCoachQuery = {
            text: "UPDATE ACCOUNT SET coach_id = $1 WHERE id = $2",
            values: [recipientId, senderId]
        }
        await this.updateDatabase(updateCoachQuery);
        await this.deleteInvite(inviteId);
    }

    async deleteInvite(inviteId: number) {
        const deleteQuery = {
            text: "DELETE FROM INVITATION WHERE id = $1",
            values: [inviteId]
        };
        await this.updateDatabase(deleteQuery);
    }
}
