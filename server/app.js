const express = require("express");
const app = express();
app.use(express.json());

app.get('/api', (req, res) => {
    res.send('Okay');
});

app.post('/api/login', (req, res) => {
    console.log(req.body);
    
});

//TODO: Register function here

//TODO: Create a routes folder

app.listen(4000, () => {
    console.log("Server running!");
});
