const DatabaseParser = require("../parser/databaseParser");

class LoginAPI {
    constructor() {
      this.parser = new DatabaseParser();  
    }

    async getAccountID(username, password) {
        console.log("Getting account id...");
        const login = await this.parser.retrieveLogin(username, password);
        if(login.length === 0) {
            //TODO: Send an invalid login status code
            return "invalid login";
        }
        console.log("Account id found!");
        return login[0].account_id;
    }
    
    async createAccount(username, password, email) {
        this.parser.storeLogin(username, email, password);
    }
    
    async createProfile(firstName, lastName, id) {
        this.parser.createProfile(firstName, lastName, id);
    }
}

module.exports = LoginAPI;