import DashboardAPI from "../api/dashboardApi";
import { StatusCode } from "../../types";
import { initializeErrorMap } from "../../utils/errorMessages";
import { Request, Response } from "express";

const dashboardApi = new DashboardAPI();
const ERROR_MESSAGES = initializeErrorMap();

async function getDashboard(req : Request, res : Response) {
    console.log(`Received in get dashboard: ${req.params.id}`);
    const dashboardQuery = await dashboardApi.getDashboard(parseInt(req.params.id));
    if(typeof dashboardQuery !== "object") {
        res.status(dashboardQuery).send(ERROR_MESSAGES.get(dashboardQuery));
        return;
    }
    res.status(StatusCode.OK).json(dashboardQuery);
}

async function deleteDashboard(req: Request, res: Response) {
    console.log(`Received in delete dashboard: ${req.params.id}`);
    const dashboardQuery = await dashboardApi.deleteDashboard(parseInt(req.params.id));
    if(dashboardQuery !== StatusCode.OK) {
        res.status(dashboardQuery).send(ERROR_MESSAGES.get(dashboardQuery));
        return;
    }
    res.sendStatus(StatusCode.OK);
}

export {getDashboard, deleteDashboard};
