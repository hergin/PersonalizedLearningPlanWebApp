import SettingsParser from "../parser/settingsParser";
import { ErrorCodeInterpreter } from "./errorCodeInterpreter";
import { DatabaseError } from "pg";
import { AccountSettings, StatusCode } from "../types";

export default class SettingsApi {
    parser : SettingsParser;
    errorCodeInterpreter : ErrorCodeInterpreter;
    
    constructor() {
        this.parser = new SettingsParser();
        this.errorCodeInterpreter = new ErrorCodeInterpreter();
    }

    async getSettings(accountId: number): Promise<AccountSettings[] | StatusCode> {
        return await this.parser.getAccountSettings(accountId).catch(error => this.#onApiError(error));
    }

    async updateSettings(accountId: number, settings: AccountSettings): Promise<StatusCode> {
        try {
            await this.parser.updateAccountSettings(accountId, settings);
            return StatusCode.OK;
        } catch(error: unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError);
        }
    }

    async #onApiError(error: unknown) {
        console.error(error);
        return this.errorCodeInterpreter.getStatusCode(error as DatabaseError);
    }
}
