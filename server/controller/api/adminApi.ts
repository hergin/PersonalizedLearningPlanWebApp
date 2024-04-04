import AdminParser from "../../parser/adminParser";
import { UserData, StatusCode } from "../../types";
import { ErrorCodeInterpreter } from "./errorCodeInterpreter";
import { DatabaseError } from "pg";

export default class AdminApi {
    readonly parser: AdminParser;
    readonly errorCodeInterpreter: ErrorCodeInterpreter;

    constructor() {
        this.parser = new AdminParser();
        this.errorCodeInterpreter = new ErrorCodeInterpreter();
    }

    async getAllUserData(): Promise<UserData[] | StatusCode> {
        try {
            return await this.parser.parseAllUserData();
        } catch(error: unknown) {
            const actualError = error as DatabaseError;
            return this.errorCodeInterpreter.getStatusCode(actualError);
        }
    }

    async getUserData(id: number): Promise<UserData[] | StatusCode> {
        try {
            return await this.parser.parseUserData(id);
        } catch(error: unknown) {
            const actualError = error as DatabaseError;
            return this.errorCodeInterpreter.getStatusCode(actualError);
        }
    }

    async setAccountToCoach(id: number): Promise<StatusCode> {
        try {
            await this.parser.setAccountAsCoach(id);
            return StatusCode.OK;
        } catch(error: unknown) {
            const actualError = error as DatabaseError;
            return this.errorCodeInterpreter.getStatusCode(actualError);
        }
    }
}
