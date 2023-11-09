const express = require("express");
const app = express();

app.get('/api', (req, res) => {
    res.send('Okay');
});

app.listen(3000, () => {
    console.log("Server running!");
});
