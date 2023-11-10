const DatabaseParser = require("../parser/databaseParser");

class LoginAPI {
    constructor() {
      this.parser = new DatabaseParser();  
    }

    async getAccount(username, password) {
        console.log("Getting account...");
        const login = await this.parser.retrieveLogin(username, password);
        if(login.length === 0) {
            //TODO: Send an invalid login status code
            return "invalid login";
        }
        console.log("Account found!");
        return login[0].email;
    }
    
    async createAccount(username, password, email) {
        this.parser.storeLogin(username, email, password);
    }
    
    async createProfile(firstName, lastName, id) {
        this.parser.createProfile(firstName, lastName, id);
    }
}

module.exports = LoginAPI;