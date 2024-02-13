import express from "express";
import { authenticateToken } from "../utils/token";
import { initializeErrorMap } from "../utils/errorMessages";
import { ProfileAPI } from "../controller/profileProcessor";
import { StatusCode } from "../types";

const profileRoutes = express.Router();
const ERROR_MESSAGES = initializeErrorMap();
const profileAPI = new ProfileAPI();

profileRoutes.get('/get/:id', authenticateToken, async(req : any, res : any) => {
    console.log(`Data received in get profile: ${req.params.id}`);
    const profileQuery = await profileAPI.getProfile(req.params.id);
    if(typeof profileQuery !== "object") {
        console.error("There was a problem retrieving profile.");
        res.status(profileQuery).send(ERROR_MESSAGES.get(profileQuery));
        return;
    }
    res.status(StatusCode.OK).json(profileQuery);
});

profileRoutes.post('/create', async(req : any, res : any) => {
    console.log(`Data received in create profile: ${req.body.account_id}`);
    const profileQuery = await profileAPI.createProfile(req.body.username, req.body.firstName, req.body.lastName, req.body.account_id);
    if(profileQuery !== StatusCode.OK) {
        console.error("There was a problem creating profile.");
        res.status(profileQuery).send(ERROR_MESSAGES.get(profileQuery));
        return;
    }
    res.sendStatus(StatusCode.OK);
});

profileRoutes.put('/edit/:id', authenticateToken, async(req : any, res : any) => {
    console.log(`Data received in update profile: ${req.params.id}`);
    const profileQuery = await profileAPI.updateProfile({
        id: parseInt(req.params.id), 
        username: req.body.username, 
        firstName: req.body.firstName, 
        lastName: req.body.lastName, 
        profilePicture: req.body.profilePicture, 
        jobTitle: req.body.jobTitle, 
        bio: req.body.bio
    });
    if(profileQuery !== StatusCode.OK) {
        console.error("There was a problem updating profile.");
        res.status(profileQuery).send(ERROR_MESSAGES.get(profileQuery));
        return;
    }
    res.sendStatus(StatusCode.OK);
});

profileRoutes.delete('/delete/:id', authenticateToken, async(req : any, res : any) => {
    console.log(`Data received in delete profile: ${req.params.id}`);
    const profileQuery = await profileAPI.deleteProfile(parseInt(req.params.id));
    if(typeof profileQuery !== "object") {
        console.error("There was a problem deleting profile.");
        res.status(profileQuery).send(ERROR_MESSAGES.get(profileQuery));
        return;
    }
    res.sendStatus(StatusCode.OK);
});

export default profileRoutes;
