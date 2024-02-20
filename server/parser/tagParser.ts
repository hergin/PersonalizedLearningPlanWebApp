import DatabaseParser from "./databaseParser";

export default class TagParser extends DatabaseParser {
    constructor() {
        super();
    }

    async parseTags(user_id: number) {
        console.log(`Getting tags from user ${user_id}`);
        const query = {
            text: "SELECT id, name FROM TAG WHERE user_id = $1",
            values: [user_id]
        }
        return this.parseDatabase(query);
    }

    async storeTag(name: string, user_id: number) {
        console.log(`Storing tag ${name} for user ${user_id}`);
        const query = {
            text: "INSERT INTO TAG(name, user_id) VALUES ($1, $2)",
            values: [name, user_id]
        }
        await this.updateDatabase(query);
    }

    async deleteTag(id: number) {
        console.log(`Deleting tag ${id}`);
        const query = {
            text: "DELETE FROM TAG WHERE id = $1",
            values: [id]
        };
        await this.updateDatabase(query);
    }
}
