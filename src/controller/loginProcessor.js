import { DatabaseParser } from "../parser/DatabaseParser";

export class LoginAPI {
    constructor() {
      this.parser = new DatabaseParser();  
    }

    async getAccountID(username, password) {
        const login = await this.parser.retrieveLogin(username, password);
        if(login.length === 0) {
            throw new Error("Invalid Login.");
        }
        return login[0].account_id;
    }
    
    async createAccount(username, password, email) {
        this.parser.storeLogin(username, email, password);
    }
    
    async createProfile(firstName, lastName, id) {
        this.parser.createProfile(firstName, lastName, id);
    }
}
