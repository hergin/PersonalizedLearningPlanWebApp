import { Router } from "express";
import { authenticateToken } from '../authentication/tokenAuth';
import * as DashboardProcessor from "../controller/processors/dashboardProcessor";

const dashboardRoutes = Router();
dashboardRoutes.get('/get/:id', authenticateToken, DashboardProcessor.getDashboard);
dashboardRoutes.delete('/delete/:id', authenticateToken, DashboardProcessor.deleteDashboard);

export default dashboardRoutes;
