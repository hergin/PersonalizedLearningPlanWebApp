import TagParser from "../../parser/tagParser";
import { convertDatabaseErrorToStatusCode } from "../../utils/errorHandlers";
import { STATUS_CODE } from "../../types";
import { DatabaseError } from "pg";

export default class TagApi {
    readonly parser: TagParser;

    constructor() {
        this.parser = new TagParser();
    }

    async getTags(accountId: number) {
        try {
            const tags = await this.parser.parseTags(accountId);
            return tags;
        } catch(error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async addTag(accountId: number, name: string, color: string) {
        try {
            await this.parser.storeTag(name, color, accountId);
            return STATUS_CODE.OK;
        } catch(error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async deleteTag(id: number) {
        try {
            await this.parser.deleteTag(id);
            return STATUS_CODE.OK;
        } catch(error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }
}
