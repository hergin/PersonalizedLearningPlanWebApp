import DatabaseParser from "./databaseParser";
import { Role } from "../types";

export default class AdminParser extends DatabaseParser {
    constructor() {
        super();
    }

    async parseAllUserData() {
        console.log("Getting all user data...");
        return await this.parseDatabase("SELECT * FROM USER_DATA");
    }

    async parseUserData(accountId: number) {
        console.log("Getting user data...");
        return await this.parseDatabase({
            text: "SELECT * FROM USER_DATA WHERE id = $1",
            values: [accountId]
        });
    }

    async setAccountAsRole(accountId: number, role: Role) {
        console.log("Setting account as coach...");
        return await this.parseDatabase({
            text: "UPDATE ACCOUNT SET role = $1 WHERE id = $2",
            values: [role, accountId]
        });
    }
}
