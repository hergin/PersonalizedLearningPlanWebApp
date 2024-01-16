import express from 'express';
import { STATUS_CODES } from '../utils/statusCodes';
import { initializeErrorMap } from '../utils/errorMessages';
import { authenticateToken } from '../utils/authenticateToken';
import DashboardAPI from '../controller/dashboardProcessor';

const router = express.Router();
const ERROR_MESSAGES = initializeErrorMap();
const api = new DashboardAPI();

router.get('/get/:id', authenticateToken, async (req, res) => {
    console.log(`Received in get dashboard: ${req.params.id}`);
    const dashboardQuery = await api.getDashboard(parseInt(req.params.id));
    if(typeof dashboardQuery !== "object") {
        res.status(dashboardQuery).send(ERROR_MESSAGES.get(dashboardQuery));
        return;
    }
    res.status(STATUS_CODES.OK).json(dashboardQuery);
});

router.post('/create', authenticateToken, async (req, res) => {
    console.log(`Received in create dashboard: ${req.body}`);
    const dashboardQuery = await api.createDashboard(req.body.profile_id);
    if(dashboardQuery !== STATUS_CODES.OK) {
        res.status(dashboardQuery).send(ERROR_MESSAGES.get(dashboardQuery));
        return;
    }
    res.sendStatus(STATUS_CODES.OK);
});

router.delete('/delete/:id', authenticateToken, async (req, res) => {
    console.log(`Received in delete dashboard: ${req.params.id}`);
    const dashboardQuery = await api.deleteDashboard(parseInt(req.params.id));
    if(dashboardQuery !== STATUS_CODES.OK) {
        res.status(dashboardQuery).send(ERROR_MESSAGES.get(dashboardQuery));
        return;
    }
    res.sendStatus(STATUS_CODES.OK);
});

export default router;
