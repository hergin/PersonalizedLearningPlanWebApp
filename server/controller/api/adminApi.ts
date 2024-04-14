import AdminParser from "../../parser/adminParser";
import { UserData, StatusCode, STATUS_CODE, Role } from "../../types";
import { convertDatabaseErrorToStatusCode } from "../../utils/errorHandlers";
import { DatabaseError } from "pg";

export default class AdminApi {
    readonly parser: AdminParser;

    constructor() {
        this.parser = new AdminParser();
    }

    async getAllUserData(): Promise<UserData[] | StatusCode> {
        try {
            return await this.parser.parseAllUserData();
        } catch(error: unknown) {
            const actualError = error as DatabaseError;
            return convertDatabaseErrorToStatusCode(actualError);
        }
    }

    async getUserData(id: number): Promise<UserData[] | StatusCode> {
        try {
            return await this.parser.parseUserData(id);
        } catch(error: unknown) {
            const actualError = error as DatabaseError;
            return convertDatabaseErrorToStatusCode(actualError);
        }
    }

    async setAccountToRole(id: number, role: Role): Promise<StatusCode> {
        try {
            await this.parser.setAccountAsRole(id, role);
            return STATUS_CODE.OK;
        } catch(error: unknown) {
            const actualError = error as DatabaseError;
            return convertDatabaseErrorToStatusCode(actualError);
        }
    }
}
