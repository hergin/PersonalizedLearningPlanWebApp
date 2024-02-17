import { Router, Response, Request } from "express";
import { authenticateToken } from "../utils/token";
import SettingsApi from "../controller/settingsProcessor";
import { StatusCode } from "../types";
import { initializeErrorMap } from "../utils/errorMessages";

const settingsRoute = Router();
const settingsApi = new SettingsApi();
const errorMessageMap = initializeErrorMap();

settingsRoute.get("/get/:id", authenticateToken, async (req: Request, res: Response) => {
    console.log(`Id received in get account settings: ${req.params.id}`);
    const settingQuery = await settingsApi.getSettings(Number(req.params.id));
    if(typeof settingQuery === typeof StatusCode) {
        console.log(`Something went wrong while parsing settings for account ${req.params.id}`);
        res.status(settingQuery as StatusCode).json(errorMessageMap.get(settingQuery));
        return;
    }
    res.status(StatusCode.OK).json(settingQuery);
});

settingsRoute.put("/update/:id", authenticateToken, async (req: Request, res: Response) => {
    console.log(`Id received in update account settings: ${req.params.id}`);
    const resultingStatusCode : StatusCode = await settingsApi.updateSettings(Number(req.params.id), req.body);
    if(resultingStatusCode !== StatusCode.OK) {
        console.log(`Something went wrong when updating settings for account ${req.params.id}`);
        res.status(resultingStatusCode).json(errorMessageMap.get(resultingStatusCode));
        return;
    }
    res.sendStatus(StatusCode.OK);
});

export default settingsRoute;
