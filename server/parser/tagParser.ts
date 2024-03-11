import DatabaseParser from "./databaseParser";

export default class TagParser extends DatabaseParser {
    constructor() {
        super();
    }

    async parseTags(accountId: number) {
        console.log(`Getting tags from user ${accountId}`);
        const query = {
            text: "SELECT tag_id AS id, tag_name AS name, color, account_id FROM TAG WHERE account_id = $1",
            values: [accountId]
        }
        return this.parseDatabase(query);
    }

    async storeTag(name: string, color: string, accountId: number) {
        console.log(`Storing tag ${name} for user ${accountId}`);
        const query = {
            text: "INSERT INTO TAG(tag_name, color, account_id) VALUES ($1, $2, $3)",
            values: [name, color, accountId]
        }
        await this.updateDatabase(query);
    }

    async deleteTag(id: number) {
        console.log(`Deleting tag ${id}`);
        const query = {
            text: "DELETE FROM TAG WHERE tag_id = $1",
            values: [id]
        };
        await this.updateDatabase(query);
    }
}
