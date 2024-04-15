import SettingsApi from "../api/settingsApi";
import { Settings, STATUS_CODE } from "../../types";
import { getLoginError } from "../../utils/errorHandlers";
import { Request, Response } from "express";
import { isStatusCode } from "../../utils/typeGuards";

const settingsApi = new SettingsApi();

async function getSettings(req: Request, res: Response) {
    console.log(`Id received in get account settings: ${req.params.id}`);
    const settingQuery = await settingsApi.getSettings(Number(req.params.id));
    if(isStatusCode(settingQuery)) {
        console.log(`Failed to get settings with status code ${settingQuery}`);
        res.status(settingQuery).send(getLoginError(settingQuery));
        return;
    }
    res.status(STATUS_CODE.OK).json(settingQuery as Settings[]);
}

async function updateSettings(req: Request, res: Response) {
    console.log(`Id received in update account settings: ${req.params.id}`);
    const resultingStatusCode = await settingsApi.updateSettings(Number(req.params.id), {...req.body});
    if(resultingStatusCode !== STATUS_CODE.OK) {
        console.log(`Something went wrong when updating settings for account ${req.params.id}`);
        res.status(resultingStatusCode).send(getLoginError(resultingStatusCode));
        return;
    }
    res.sendStatus(STATUS_CODE.OK);
}

export {getSettings, updateSettings};
