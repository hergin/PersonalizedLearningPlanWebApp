import { AccountSettings } from "../types";
import DatabaseParser from "./databaseParser";


export default class SettingsParser extends DatabaseParser {
    constructor() {
        super();
    }

    async getAccountSettings(accountId: number) {
        console.log("Getting this account's settings...");
        const query = {
            text: "SELECT * FROM ACCOUNT_SETTINGS WHERE account_id = $1",
            values: [accountId]
        };
        return await this.parseDatabase(query);
    }

    async updateAccountSettings(accountId: number, settings: AccountSettings) {
        console.log(`Updating account ${accountId}'s settings...`);
        const query = {
            text: "UPDATE ACCOUNT_SETTINGS SET receive_emails = $1, allow_coach_invitations = $2 WHERE account_id = $3",
            values: [settings.receiveEmails, settings.allowCoachInvitations, accountId]
        };
        await this.updateDatabase(query);
    }
}
