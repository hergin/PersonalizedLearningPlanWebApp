import express from "express";
const app = express();
import cors from 'cors';

import userLoginRoutes from "./routes/loginRoutes";
import moduleRoutes from "./routes/moduleRoutes";
import profileRoutes from "./routes/profileRoutes";
import goalRoutes from "./routes/goalRoutes";
import dashboardRoutes from './routes/dashboardRoutes';

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

app.listen(4000, () => {
    console.log("Server running!");
});
