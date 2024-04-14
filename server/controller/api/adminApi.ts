import DatabaseParser from "../../parser/databaseParser";
import { UserData, StatusCode, STATUS_CODE, Role } from "../../types";
import { convertDatabaseErrorToStatusCode } from "../../utils/errorHandlers";
import { DatabaseError } from "pg";

export default class AdminApi {
    readonly parser: DatabaseParser;

    constructor() {
        this.parser = new DatabaseParser();
    }

    async getAllUserData(): Promise<UserData[] | StatusCode> {
        try {
            return await this.parser.parseDatabase("SELECT * FROM USER_DATA");
        } catch(error: unknown) {
            const actualError = error as DatabaseError;
            return convertDatabaseErrorToStatusCode(actualError);
        }
    }

    async getUserData(id: number): Promise<UserData[] | StatusCode> {
        try {
            return await this.parser.parseDatabase({
                text: "SELECT * FROM USER_DATA WHERE id = $1",
                values: [id]
            });
        } catch(error: unknown) {
            const actualError = error as DatabaseError;
            return convertDatabaseErrorToStatusCode(actualError);
        }
    }

    async setAccountToRole(id: number, role: Role): Promise<StatusCode> {
        try {
            await this.parser.updateDatabase({
                text: "UPDATE ACCOUNT SET site_role = $1 WHERE id = $2",
                values: [role, id]
            });
            return STATUS_CODE.OK;
        } catch(error: unknown) {
            const actualError = error as DatabaseError;
            return convertDatabaseErrorToStatusCode(actualError);
        }
    }
}
