import DatabaseParser from "../../parser/databaseParser";
import { convertDatabaseErrorToStatusCode } from "../../utils/errorHandlers";
import { STATUS_CODE } from "../../types";
import { DatabaseError } from "pg";

export default class TagApi {
    readonly parser: DatabaseParser;

    constructor() {
        this.parser = new DatabaseParser();
    }

    async getTags(accountId: number) {
        try {
            const tags = await this.parser.parseDatabase({
                text: "SELECT tag_id AS id, tag_name AS name, account_id FROM TAG WHERE account_id = $1",
                values: [accountId]
            });
            return tags;
        } catch(error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async addTag(accountId: number, name: string) {
        try {
            await this.parser.updateDatabase({
                text: "INSERT INTO TAG(tag_name, account_id) VALUES ($1, $2)",
                values: [name, accountId]
            });
            return STATUS_CODE.OK;
        } catch(error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async deleteTag(id: number) {
        try {
            await this.parser.updateDatabase({
                text: "DELETE FROM TAG WHERE tag_id = $1",
                values: [id]
            });
            return STATUS_CODE.OK;
        } catch(error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }
}
