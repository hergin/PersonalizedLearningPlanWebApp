import { Router, Request, Response } from "express";
import { initializeErrorMap } from '../utils/errorMessages';
import { authenticateToken } from '../utils/token';
import { DashboardAPI } from '../controller/dashboardProcessor';
import { StatusCode } from '../types';

const dashboardRoutes = Router();
const ERROR_MESSAGES = initializeErrorMap();
const dashboardApi = new DashboardAPI();

dashboardRoutes.get('/get/:id', authenticateToken, async (req : Request, res : Response) => {
    console.log(`Received in get dashboard: ${req.params.id}`);
    const dashboardQuery = await dashboardApi.getDashboard(parseInt(req.params.id));
    if(typeof dashboardQuery !== "object") {
        res.status(dashboardQuery).send(ERROR_MESSAGES.get(dashboardQuery));
        return;
    }
    res.status(StatusCode.OK).json(dashboardQuery);
});

dashboardRoutes.post('/create', authenticateToken, async (req : Request, res : Response) => {
    console.log(`Received in create dashboard: ${req.body}`);
    const dashboardQuery = await dashboardApi.createDashboard(req.body.profile_id);
    if(dashboardQuery !== StatusCode.OK) {
        res.status(dashboardQuery).send(ERROR_MESSAGES.get(dashboardQuery));
        return;
    }
    res.sendStatus(StatusCode.OK);
});

dashboardRoutes.delete('/delete/:id', authenticateToken, async (req : Request, res : Response) => {
    console.log(`Received in delete dashboard: ${req.params.id}`);
    const dashboardQuery = await dashboardApi.deleteDashboard(parseInt(req.params.id));
    if(dashboardQuery !== StatusCode.OK) {
        res.status(dashboardQuery).send(ERROR_MESSAGES.get(dashboardQuery));
        return;
    }
    res.sendStatus(StatusCode.OK);
});

export default dashboardRoutes;
