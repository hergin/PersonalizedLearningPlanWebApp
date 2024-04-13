import TagParser from "../../parser/tagParser";
import { ErrorCodeInterpreter } from "./errorCodeInterpreter";
import { STATUS_CODE } from "../../types";
import { DatabaseError } from "pg";

export default class TagApi {
    parser: TagParser;
    errorCodeInterpreter: ErrorCodeInterpreter;

    constructor() {
        this.parser = new TagParser();
        this.errorCodeInterpreter = new ErrorCodeInterpreter();
    }

    async getTags(accountId: number) {
        try {
            const tags = await this.parser.parseTags(accountId);
            return tags;
        } catch(error: unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError);
        }
    }

    async addTag(accountId: number, name: string, color: string) {
        try {
            await this.parser.storeTag(name, color, accountId);
            return STATUS_CODE.OK;
        } catch(error: unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError);
        }
    }

    async deleteTag(id: number) {
        try {
            await this.parser.deleteTag(id);
            return STATUS_CODE.OK;
        } catch(error: unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError);
        }
    }
}
