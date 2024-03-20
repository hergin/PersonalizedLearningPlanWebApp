import InvitationParser from "../invitationParser";
import { StatusCode } from "../../types";

const TEST_DATA = {
    email: ["example@gmail.com", "example2377@outlook.com"],
    password: "adsfadsf",
    username: ["johncena", "pokemonLover42"],
    first_name: ["john", "eric"],
    last_name: ["cena", "johnson"]
};

describe("Invitation Parser unit test", () => {
    const parser = new InvitationParser();
    var client: any;
    var accountIds: number[];

    beforeEach(async () => {
        client = await parser.pool.connect();
        await createTestAccounts();
        accountIds = await getAccountIds();
        console.log(`Account Ids: ${JSON.stringify(accountIds)}`);
        await createTestProfiles();
    });

    async function createTestAccounts() {
        const query = {
            text: "INSERT INTO ACCOUNT(email, account_password) VALUES ($1, $2), ($3, $2)",
            values: [TEST_DATA.email[0], TEST_DATA.password, TEST_DATA.email[1]]
        };
        await client.query(query);
    }

    async function getAccountIds(): Promise<number[]> {
        const query = {
            text: "SELECT id FROM ACCOUNT WHERE email = $1",
            values: [TEST_DATA.email[0]]
        };
        const query2 = {
            text: "SELECT id FROM ACCOUNT WHERE email = $1",
            values: [TEST_DATA.email[1]]
        };
        const result = await client.query(query);
        const result2 = await client.query(query2);
        console.log(`${JSON.stringify(result.rows[0].id)}`);
        return [result.rows[0].id, result2.rows[0].id];
    }

    async function createTestProfiles(): Promise<void> {
        const query = {
            text: "INSERT INTO PROFILE(username, first_name, last_name, account_id) VALUES ($1, $2, $3, $4), ($5, $6, $7, $8)",
            values: [TEST_DATA.username[0], TEST_DATA.first_name[0], TEST_DATA.last_name[0], accountIds[0], TEST_DATA.username[1], TEST_DATA.first_name[1], TEST_DATA.last_name[1], accountIds[1]]
        };
        await client.query(query);
    }

    afterEach(async () => {
        await client.query("DELETE FROM ACCOUNT WHERE email = $1 OR email = $2", [TEST_DATA.email[0], TEST_DATA.email[1]]);
        await client.release();
    });

    afterAll(async () => {
        await parser.pool.end();
    });

    it("get invites", async () => {
        await client.query({
            text: "INSERT INTO INVITATION(sender_id, recipient_id) VALUES ($1, $2)",
            values: [accountIds[0], accountIds[1]]
        });
        const result = await parser.getInvites(accountIds[1]);
        expect(result).toEqual([
            {
                id: expect.any(Number),
                sender_id: accountIds[0],
                recipient_id: accountIds[1],
                recipient_email: TEST_DATA.email[1],
                recipient_username: TEST_DATA.username[1],
                sender_email: TEST_DATA.email[0],
                sender_username: TEST_DATA.username[0]
            }
        ]);
    });

    it("get pending invites", async () => {
        await client.query({
            text: "INSERT INTO INVITATION(sender_id, recipient_id) VALUES ($1, $2)",
            values: [accountIds[0], accountIds[1]]
        });
        const result = await parser.getPendingInvites(accountIds[0]);
        expect(result).toEqual([
            {
                id: expect.any(Number),
                sender_id: accountIds[0],
                recipient_id: accountIds[1],
                recipient_email: TEST_DATA.email[1],
                recipient_username: TEST_DATA.username[1],
                sender_email: TEST_DATA.email[0],
                sender_username: TEST_DATA.username[0]
            }
        ]);
    });

    it("create invite", async () => {
        await parser.createInvite(accountIds[0], accountIds[1]);
        const actual = await client.query({
            text: "SELECT * FROM INVITATION WHERE sender_id = $1 AND recipient_id = $2",
            values: [accountIds[0], accountIds[1]]
        });
        expect(actual.rows).toEqual([
            {
                id: expect.any(Number),
                sender_id: accountIds[0],
                recipient_id: accountIds[1]
            }
        ]);
    });

    it("delete invite", async () => {
        await client.query({
            text: "INSERT INTO INVITATION(sender_id, recipient_id) VALUES ($1, $2)",
            values: [accountIds[0], accountIds[1]]
        });
        const inviteId = await getInviteId();
        await parser.deleteInvite(inviteId);
        const actual = await client.query("SELECT * FROM INVITATION WHERE id = $1", [inviteId]);
        expect(actual.rows).toEqual([]);
    });

    async function getInviteId(): Promise<number> {
        const query = {
            text: "SELECT id FROM INVITATION WHERE sender_id = $1 AND recipient_id = $2",
            values: [accountIds[0], accountIds[1]]
        };
        const result = await client.query(query);
        return result.rows[0].id;
    }

    it("accept invite", async () => {
        await client.query({
            text: "INSERT INTO INVITATION(sender_id, recipient_id) VALUES ($1, $2)",
            values: [accountIds[0], accountIds[1]]
        });
        const inviteId = await getInviteId();
        await parser.acceptInvite(inviteId, accountIds[0], accountIds[1]);
        const actual = await client.query({
            text: "SELECT coach_id FROM ACCOUNT WHERE id = $1",
            values: [accountIds[0]]
        });
        expect(actual.rows).toEqual([
            {
                coach_id: accountIds[1]
            }
        ]);
    });
});
