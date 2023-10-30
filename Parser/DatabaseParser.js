import { Client } from 'pg';

export class DatabaseParser {
    constructor() {
        const client  = new Client();
        this.connectToClient(client);
    }

    async connectToClient(client) {
        client.connect();
    }

    retrieveLogin() {
        
    }
}
