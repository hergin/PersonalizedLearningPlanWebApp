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
    const account_id = await api.getAccountID(req.body.username, req.body.password);
    console.log(account_id);
    res.json({profile_id: 1234, firstName: "bob", lastName: "jones", profilePicture: "", bio: "", account_id});
});

//TODO: Register function here

//TODO: Create a routes folder

app.listen(4000, () => {
    console.log("Server running!");
});
