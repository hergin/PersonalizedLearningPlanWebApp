export {};

const express = require('express');
const STATUS_CODES = require('../utils/statusCodes');
const initializeErrorMap = require('../utils/errorMessages');
const tokenMethods = require('../utils/token');
const DashboardAPI = require('../controller/dashboardProcessor');

const router = express.Router();
const ERROR_MESSAGES = initializeErrorMap();
const api = new DashboardAPI();

router.get('/get/:id', tokenMethods.authenticateToken, async (req : any, res : any) => {
    console.log(`Received in get dashboard: ${req.params.id}`);
    const dashboardQuery = await api.getDashboard(parseInt(req.params.id));
    if(typeof dashboardQuery !== "object") {
        res.status(dashboardQuery).send(ERROR_MESSAGES.get(dashboardQuery));
        return;
    }
    res.status(STATUS_CODES.OK).json(dashboardQuery);
});

router.post('/create', tokenMethods.authenticateToken, async (req : any, res : any) => {
    console.log(`Received in create dashboard: ${req.body}`);
    const dashboardQuery = await api.createDashboard(req.body.profile_id);
    if(dashboardQuery !== STATUS_CODES.OK) {
        res.status(dashboardQuery).send(ERROR_MESSAGES.get(dashboardQuery));
        return;
    }
    res.sendStatus(STATUS_CODES.OK);
});

router.delete('/delete/:id', tokenMethods.authenticateToken, async (req : any, res : any) => {
    console.log(`Received in delete dashboard: ${req.params.id}`);
    const dashboardQuery = await api.deleteDashboard(parseInt(req.params.id));
    if(dashboardQuery !== STATUS_CODES.OK) {
        res.status(dashboardQuery).send(ERROR_MESSAGES.get(dashboardQuery));
        return;
    }
    res.sendStatus(STATUS_CODES.OK);
});

module.exports = router;
