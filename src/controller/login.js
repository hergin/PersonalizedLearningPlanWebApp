import { DatabaseParser } from "../parser/DatabaseParser";

const parser = new DatabaseParser();

export async function getAccountID(username, password) {
    const login = await parser.retrieveLogin(username, password);
    if(login.length === 0) {
        throw new Error("Invalid Login.");
    }
    return login[0].account_id;
}
