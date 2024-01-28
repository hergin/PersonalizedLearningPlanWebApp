const express = require("express");
const cors = require('cors');

const userLoginRoutes = require("./routes/loginRoutes");
const moduleRoutes = require("./routes/moduleRoutes");
const profileRoutes = require("./routes/profileRoutes");
const goalRoutes = require("./routes/goalRoutes");
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", userLoginRoutes);
app.use("/api/module", moduleRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/goal", goalRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api', (req : any, res : any) => {
    console.log(req.body);
    res.send('Okay');
});

app.listen(4001, () => {
    console.log("Server running!");
});
