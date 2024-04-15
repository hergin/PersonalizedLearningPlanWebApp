import InvitationParser from "../invitationParser";
import { Pool } from "pg";

jest.mock("pg");

const TEST_INVITE = {
    id: 0,
    sender_id: 1,
    recipient_id: 2,
}

const TEST_INVITE_DATA = {
    ...TEST_INVITE,
    recipient_email: "testdummy@outlook.com",
    recipient_username: "Xx_TestDummy_xX",
    sender_email: "bobjones666@yahoo.com",
    sender_username: "WaifuMaster1"
};

describe("Invitation Parser unit test", () => {
    const parser = new InvitationParser();
    var mockQuery: jest.Mock<any, any, any>;

    beforeEach(async () => {
        mockQuery = new Pool().query as jest.Mock<any, any, any>;
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it("get invites", async () => {
        mockQuery.mockResolvedValueOnce({rows: [TEST_INVITE_DATA]});
        const result = await parser.getInvites(TEST_INVITE.recipient_id);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "SELECT * FROM INVITE_DATA WHERE recipient_id = $1",
            values: [TEST_INVITE.recipient_id]
        });
        expect(result).toEqual([TEST_INVITE_DATA]);
    });

    it("get pending invites", async () => {
        mockQuery.mockResolvedValueOnce({rows: [TEST_INVITE_DATA]});
        const result = await parser.getPendingInvites(TEST_INVITE.sender_id);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "SELECT * FROM INVITE_DATA WHERE sender_id = $1",
            values: [TEST_INVITE.sender_id]
        });
        expect(result).toEqual([TEST_INVITE_DATA]);
    });

    it("create invite", async () => {
        mockQuery.mockResolvedValueOnce(undefined);
        await parser.createInvite(TEST_INVITE.sender_id, TEST_INVITE.recipient_id);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "INSERT INTO INVITATION(sender_id, recipient_id) VALUES($1, $2)",
            values: [TEST_INVITE.sender_id, TEST_INVITE.recipient_id]
        });
    });

    it("delete invite", async () => {
        mockQuery.mockResolvedValueOnce({rows: [TEST_INVITE_DATA]});
        mockQuery.mockResolvedValueOnce(undefined);
        const result = await parser.deleteInvite(TEST_INVITE.id);
        expect(mockQuery).toHaveBeenCalledTimes(2);
        expect(mockQuery).toHaveBeenNthCalledWith(1, {
            text: "SELECT * FROM INVITE_DATA WHERE id = $1",
            values: [TEST_INVITE.id]
        });
        expect(mockQuery).toHaveBeenNthCalledWith(2, {
            text: "DELETE FROM INVITATION WHERE id = $1",
            values: [TEST_INVITE.id]
        });
        expect(result).toEqual([TEST_INVITE_DATA]);
    });

    it("accept invite", async () => {
        mockQuery.mockResolvedValueOnce(undefined);
        mockQuery.mockResolvedValueOnce({rows: [TEST_INVITE_DATA]});
        mockQuery.mockResolvedValueOnce(undefined);
        const result = await parser.acceptInvite(TEST_INVITE.id, TEST_INVITE.sender_id, TEST_INVITE.recipient_id);
        expect(mockQuery).toHaveBeenCalledTimes(3);
        expect(mockQuery).toHaveBeenNthCalledWith(1, {
            text: "UPDATE ACCOUNT SET coach_id = $1 WHERE id = $2",
            values: [TEST_INVITE.recipient_id, TEST_INVITE.sender_id]
        });
        expect(mockQuery).toHaveBeenNthCalledWith(2, {
            text: "SELECT * FROM INVITE_DATA WHERE id = $1",
            values: [TEST_INVITE.id]
        });
        expect(mockQuery).toHaveBeenNthCalledWith(3, {
            text: "DELETE FROM INVITATION WHERE id = $1",
            values: [TEST_INVITE.id]
        });
        expect(result).toEqual([TEST_INVITE_DATA]);
    });
});
