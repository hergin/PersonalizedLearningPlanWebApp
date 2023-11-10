const express = require("express");
const app = express();
app.use(express.json());

const LoginAPI = require("./controller/loginProcessor");

app.get('/api', (req, res) => {
    res.send('Okay');
});

app.post('/api/login', async (req, res) => {
    console.log(req.body);
    const api = new LoginAPI();
    const email = await api.getAccount(req.body.username, req.body.password);
    console.log(email);
    res.json({profile_id: 1234, firstName: "bob", lastName: "jones", profilePicture: "", bio: "", email});
});

app.post('/api/register', async(req, res) => {
    console.log(req.body);
    const api = new LoginAPI();
    api.createAccount(req.body.username, req.body.password, req.body.email);
    const account_id = await api.getAccount(req.body.username, req.body.password);
    api.createProfile(req.body.firstName, req.body.lastName, account_id);
});

//TODO: Create a routes folder

app.listen(4000, () => {
    console.log("Server running!");
});
