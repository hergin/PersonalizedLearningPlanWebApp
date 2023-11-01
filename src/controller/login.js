import { DatabaseParser } from "../Parser/DatabaseParser";

const parser = new DatabaseParser();

export function validateLogin(username, password) {
    let login;
    parser.retrieveLogin(username, password).then((query) => {login = query});
    if(login.rows.length !== 1) {
        throw new Error("invalid login");
    }
    return login.rows[0].id;
}
