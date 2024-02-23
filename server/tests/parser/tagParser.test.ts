import TagParser from "../../parser/tagParser";

const TEST_DATA = {
    email: ["testdummy@yahoo.com", "example@outlook.com"],
    password: "01010101010",
    tagName: ["School", "Social", "Work"],
    tagColor: ["#0000FF", "#00FF00", "#FF0000"]
}

describe("Tag Parser unit tests", () => {
    const parser = new TagParser();
    var client: any;
    var accountId: number;
    
    beforeEach(async () => {
        client = await parser.pool.connect();
        createTestAccount(TEST_DATA.email[0]);
        accountId = await getAccountID(TEST_DATA.email[0]);
    });

    async function createTestAccount(email: string): Promise<void> {
        await client.query({
            text: "INSERT INTO ACCOUNT(email, account_password) VALUES ($1, $2)",
            values: [email, TEST_DATA.password]
        });
    }

    async function getAccountID(email: string): Promise<number> {
        const queryResult = await client.query({
            text: "SELECT id FROM ACCOUNT WHERE email = $1",
            values: [email]
        });
        return queryResult.rows[0].id;
    }

    afterEach(async () => {
        await client.query({
            text: "DELETE FROM ACCOUNT WHERE email = $1 OR email = $2",
            values: [TEST_DATA.email[0], TEST_DATA.email[1]]
        });
        await client.release();
    });

    afterAll(async () => {
        await parser.pool.end();
    });

    it("store tag", async () => {
        await parser.storeTag(TEST_DATA.tagName[0], TEST_DATA.tagColor[0], accountId);
        const result = await client.query({
            text: "SELECT * FROM TAG WHERE account_id = $1",
            values: [accountId]
        });
        expect(result.rows).toEqual([
            {
                tag_id: expect.any(Number),
                tag_name: TEST_DATA.tagName[0],
                color: TEST_DATA.tagColor[0],
                account_id: accountId
            }
        ]);
    });

    it("parse tags", async () => {
        createTestAccount(TEST_DATA.email[1]);
        const altAccountId = await getAccountID(TEST_DATA.email[1]);
        await client.query({
            text: "INSERT INTO TAG(tag_name, color, account_id) VALUES ($1, $2, $3), ($4, $5, $3), ($6, $7, $8)",
            values: [TEST_DATA.tagName[0], TEST_DATA.tagColor[0], accountId, TEST_DATA.tagName[1], TEST_DATA.tagColor[1], TEST_DATA.tagName[2], TEST_DATA.tagColor[2], altAccountId]
        });
        const result = await parser.parseTags(accountId);
        expect(result).toEqual([
            {
                id: expect.any(Number),
                name: TEST_DATA.tagName[0],
                color: TEST_DATA.tagColor[0],
                account_id: accountId
            },
            {
                id: expect.any(Number),
                name: TEST_DATA.tagName[1],
                color: TEST_DATA.tagColor[1],
                account_id: accountId
            }
        ]);
    });

    it("delete tag", async () => {
        await client.query({
            text: "INSERT INTO TAG(tag_name, account_id) VALUES ($1, $2)",
            values: [TEST_DATA.tagName[0], accountId]
        });
        const id = await getTagId(TEST_DATA.tagName[0], accountId);
        await parser.deleteTag(id);
        const result = await client.query({
            text: "SELECT * FROM TAG WHERE tag_id = $1",
            values: [id]
        });
        expect(result.rows).toEqual([]);
    });

    async function getTagId(name: string, accountId: number) {
        const result = await client.query({
            text: "SELECT tag_id FROM TAG WHERE tag_name = $1 AND account_id = $2",
            values: [name, accountId]
        });
        return result.rows[0].id;
    }
});
