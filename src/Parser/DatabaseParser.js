import { Client } from 'pg';
require('dotenv').config();

export class DatabaseParser {
    constructor() {
        this.client  = new Client();
        this.connectToClient(this.client);  
    }

    async connectToClient(client) {
        client.connect({
            host: "localhost",
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DATABASE,
            port: process.env.POSTGRES_PORT,
        });
    }
    
    async retrieveLogin(username, password) {
        return await this.client.query(`SELECT * FROM ACCOUNT WHERE username = ${username}, account_password = ${password}`);  
    }
    
    async storeLogin(username, email, password){
        await this.client.query(`INSERT INTO ACCOUNT(username, account_password, email) VALUES (${username}, ${password}, ${email})`);
    }

    async getProfile(id){
        return await this.client.query(`SELECT * FROM PROFILE WHERE account_id = ${id}`);
    }

    async createProfile(firstName, lastName, account_id) {
        await this.client.query(`INSERT INTO PROFILE(firstName, lastName, account_id) VALUES(${firstName}, ${lastName}, ${account_id})`);
    }

    async insertProfile(firstName, lastName, profilePicture,  jobTitle, bio, account_id) {
        await this.client.query(`INSERT INTO PROFILE(firstName, lastName, profilePicture, jobTitle, bio) VALUES(${firstName}, ${lastName}, ${profilePicture}, ${jobTitle}, ${bio}) WHERE account_id = ${account_id}`);
    }
}
