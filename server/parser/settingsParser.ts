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
        const result = await this.parseDatabase(query);
        console.log(`Parsed in get account settings: ${JSON.stringify(result)}`);
        return result;
    }

    async updateAccountSettings(accountId: number, settings: AccountSettings) {
        console.log(`Updating account ${accountId}'s settings...`);
        const query = {
            text: "UPDATE ACCOUNT_SETTINGS SET receive_emails = $1 WHERE account_id = $2",
            values: [settings.receiveEmails, accountId]
        }
        await this.updateDatabase(query);
    }
}
