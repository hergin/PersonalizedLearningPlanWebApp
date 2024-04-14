import SettingsParser from "../../parser/settingsParser";
import { convertDatabaseErrorToStatusCode } from "../../utils/errorHandlers";
import { DatabaseError } from "pg";
import { AccountSettings, STATUS_CODE, StatusCode } from "../../types";

export default class SettingsApi {
    readonly parser : SettingsParser;
    
    constructor() {
        this.parser = new SettingsParser();
    }

    async getSettings(accountId: number): Promise<AccountSettings[] | StatusCode> {
        return await this.parser.getAccountSettings(accountId).catch(error => this.#onApiError(error));
    }

    async updateSettings(accountId: number, settings: AccountSettings): Promise<StatusCode> {
        try {
            await this.parser.updateAccountSettings(accountId, settings);
            return STATUS_CODE.OK;
        } catch(error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async #onApiError(error: unknown) {
        console.error(error);
        return convertDatabaseErrorToStatusCode(error as DatabaseError);
    }
}
