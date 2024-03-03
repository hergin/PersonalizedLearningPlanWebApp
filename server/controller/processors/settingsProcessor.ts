import SettingsApi from "../api/settingsApi";
import { AccountSettings, StatusCode } from "../../types";
import { initializeErrorMap} from "../../utils/errorMessages";
import { Request, Response } from "express";

const settingsApi = new SettingsApi();
const ERROR_MESSAGES = initializeErrorMap();

async function getSettings(req: Request, res: Response) {
    console.log(`Id received in get account settings: ${req.params.id}`);
    const settingQuery = await settingsApi.getSettings(Number(req.params.id));
    if(settingQuery as StatusCode in StatusCode) {
        console.log(`Failed to get settings with status code ${settingQuery}`);
        res.status(settingQuery as StatusCode).send(ERROR_MESSAGES.get(settingQuery as StatusCode));
        return;
    }
    res.status(StatusCode.OK).json(settingQuery as AccountSettings[]);
}

async function updateSettings(req: Request, res: Response) {
    console.log(`Id received in update account settings: ${req.params.id}`);
    const resultingStatusCode : StatusCode = await settingsApi.updateSettings(Number(req.params.id), req.body);
    if(resultingStatusCode !== StatusCode.OK) {
        console.log(`Something went wrong when updating settings for account ${req.params.id}`);
        res.status(resultingStatusCode).send(ERROR_MESSAGES.get(resultingStatusCode));
        return;
    }
    res.sendStatus(StatusCode.OK);
}

export {getSettings, updateSettings};
