const express = require("express");
const app = express();
app.use(express.json());

const LoginAPI = require("./controller/loginProcessor");
const api = new LoginAPI();
const STATUS_CODES = require("./statusCodes");
const ERROR_MESSAGES = initializeErrorMap();

function initializeErrorMap() {
    const errorMessageMap = new Map();
    errorMessageMap.set(STATUS_CODES.BAD_REQUEST, "An account with that email doesn't exist.");
    errorMessageMap.set(STATUS_CODES.UNAUTHORIZED, "Invalid Login.");
    errorMessageMap.set(STATUS_CODES.CONNECTION_ERROR, "Failed to connect to database.");
    errorMessageMap.set(STATUS_CODES.CONFLICT, "An account with that email already exists.");
    errorMessageMap.set(STATUS_CODES.INTERNAL_SERVER_ERROR, "A fatal error has occurred.");
    return errorMessageMap;
}

app.get('/api', (req, res) => {
    res.send('Okay');
});

app.post('/api/login', async (req, res) => {
    console.log(req.body);
    const loginQuery = await api.verifyLogin(req.body.email, req.body.password);
    if(loginQuery !== STATUS_CODES.OK) {
        console.log("Login verification failed.");
        res.status(loginQuery).send(ERROR_MESSAGES.get(loginQuery));
        return;
    }
    const profileQuery = await api.getProfile(req.body.email);
    if(typeof profileQuery !== "object") {
        console.error("There was a problem retrieving profile.");
        res.status(profileQuery).send(ERROR_MESSAGES.get(profileQuery));
        return;
    }
    res.status(STATUS_CODES.OK).json(profileQuery);
});

app.post('/api/register', async(req, res) => {
    console.log(req.body);
    const accountStatusCode = await api.createAccount(req.body.username, req.body.password, req.body.email);
    if(accountStatusCode !== STATUS_CODES.OK) {
        res.status(accountStatusCode).send(ERROR_MESSAGES.get(accountStatusCode));
        return;
    }
    const profileStatusCode = await api.createProfile(req.body.firstName, req.body.lastName, req.body.email);
    if(profileStatusCode !== STATUS_CODES.OK) {
        res.status(profileStatusCode).send(ERROR_MESSAGES.get(profileStatusCode));
        return;
    }
    res.sendStatus(200);
});

//TODO: Create a routes folder

app.listen(4000, () => {
    console.log("Server running!");
});
