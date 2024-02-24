import { Router } from "express";
import { authenticateToken } from '../utils/token';
import * as DashboardProcessor from "../controller/processors/dashboardProcessor";

const dashboardRoutes = Router();
dashboardRoutes.get('/get/:id', authenticateToken, DashboardProcessor.getDashboard);
dashboardRoutes.post('/create', authenticateToken, DashboardProcessor.postDashboard);
dashboardRoutes.delete('/delete/:id', authenticateToken, DashboardProcessor.deleteDashboard);

export default dashboardRoutes;
