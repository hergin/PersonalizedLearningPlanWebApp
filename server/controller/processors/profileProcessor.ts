import ProfileAPI from "../api/profileApi";
import { STATUS_CODE } from "../../types";
import { getLoginError } from "../../utils/errorHandlers";
import { Request, Response } from "express";
import { isStatusCode } from "../../utils/typeGuards";

const profileAPI = new ProfileAPI();

async function getAllCoachProfiles(req: Request, res: Response) {
    console.log("Get all profiles has been called!");
    const profileQuery = await profileAPI.getAllCoachProfiles();
    if(isStatusCode(profileQuery)) {
        console.error("There was a problem retrieving profile.");
        res.status(profileQuery).send(getLoginError(profileQuery));
        return;
    }
    res.status(STATUS_CODE.OK).json(profileQuery);
}

async function sendProfile(req : Request, res : Response) {
    console.log(`Data received in get profile: ${req.params.id}`);
    const profileQuery = await profileAPI.getProfile(Number(req.params.id));
    if(isStatusCode(profileQuery)) {
        console.error("There was a problem retrieving profile.");
        res.status(profileQuery).send(getLoginError(profileQuery));
        return;
    }
    res.status(STATUS_CODE.OK).json(profileQuery);
}

async function postProfile(req : Request, res : Response) {
    console.log(`Data received in create profile: ${req.body.account_id}`);
    const profileQuery = await profileAPI.createProfile({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        accountId: req.body.account_id
    });
    if(profileQuery !== STATUS_CODE.OK) {
        console.error("There was a problem creating profile.");
        res.status(profileQuery).send(getLoginError(profileQuery));
        return;
    }
    res.sendStatus(STATUS_CODE.OK);
}

async function putProfile(req : Request, res : Response) {
    console.log(`Data received in update profile: ${req.params.id} ${JSON.stringify(req.body)}`);
    const profileQuery = await profileAPI.updateProfile({
        profileId: parseInt(req.params.id),
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        accountId: req.body.accountId,
        jobTitle: req.body.jobTitle,
        bio: req.body.bio
    });
    if(profileQuery !== STATUS_CODE.OK) {
        console.error("There was a problem updating profile.");
        res.status(profileQuery).send(getLoginError(profileQuery));
        return;
    }
    res.sendStatus(STATUS_CODE.OK);
}

async function deleteProfile(req : Request, res : Response) {
    console.log(`Data received in delete profile: ${req.params.id}`);
    const profileQuery = await profileAPI.deleteProfile(parseInt(req.params.id));
    if(profileQuery !== STATUS_CODE.OK) {
        console.error("There was a problem deleting profile.");
        res.status(profileQuery).send(getLoginError(profileQuery));
        return;
    }
    res.sendStatus(STATUS_CODE.OK);
}

export { getAllCoachProfiles, sendProfile, postProfile, putProfile, deleteProfile };
