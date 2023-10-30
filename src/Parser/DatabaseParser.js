import { Client } from 'pg';
const config = require("./config.json");

export class DatabaseParser {
    constructor() {
        this.client  = new Client();
        this.connectToClient(this.client);
    }

    async connectToClient(client) {
        client.connect({
            host: "localhost",
            user: config.USERNAME,
            password: config.PASSWORD,
            config: config.DATABASE,
            port: config.PORT,
        });
    }
    
    async retrieveLogin(username, password) {
        return await this.client.query(`SELECT * FROM ACCOUNT WHERE username = ${username}, account_password = ${password}`);  
    }
    
    async storeLogin(username, email, password){
        await this.client.query(`INSERT INTO ACCOUNT(username, account_password, email) VALUES (${username}, ${password}, ${email})`);
    }

    
}
