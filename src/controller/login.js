import { DatabaseParser } from "../Parser/DatabaseParser";

const parser = new DatabaseParser();

export function validateLogin(username, password) {
    let login;
    parser.retrieveLogin(username, password).then((query) => {login = query});
    console.log(login);
    if(login === undefined) {
        throw new Error("invalid login");
    }
    return login.rows[0];
}

export function createAccount(username, password) {
    parser.storeLogin(username, password);
}
