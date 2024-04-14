import DatabaseParser from "../../parser/databaseParser";
import { convertDatabaseErrorToStatusCode } from "../../utils/errorHandlers";
import { DatabaseError } from "pg";
import { Settings, STATUS_CODE, StatusCode } from "../../types";

export default class SettingsApi {
    readonly parser : DatabaseParser;

    constructor() {
        this.parser = new DatabaseParser();
    }

    async getSettings(accountId: number): Promise<Settings[] | StatusCode> {
        try {
            return await this.parser.parseDatabase({
                text: "SELECT * FROM ACCOUNT_SETTINGS WHERE account_id = $1",
                values: [accountId]
            });
        } catch (error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async updateSettings(accountId: number, settings: Settings): Promise<StatusCode> {
        try {
            await this.parser.updateDatabase({
                text: "UPDATE ACCOUNT_SETTINGS SET receive_emails = $1, allow_coach_invitations = $2 WHERE account_id = $3",
                values: [settings.receiveEmails, settings.allowCoachInvitations, accountId]
            });
            return STATUS_CODE.OK;
        } catch(error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }
}
