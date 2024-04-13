import InvitationApi from "../api/invitationApi";
import EmailService from "../../service/emailService";
import { InviteData, STATUS_CODE, SUBJECTS } from "../../types";
import { initializeErrorMap } from "../../utils/errorMessages";
import { Request, Response } from "express";
import isStatusCode from "../../utils/isStatusCode";

const ERROR_MESSAGES = initializeErrorMap();
const invitationApi = new InvitationApi();
const emailService = new EmailService();

async function getInvites(req: Request, res: Response) {
    console.log(`Received in get invites: ${req.params.id}`);
    const query = await invitationApi.getInvites(Number(req.params.id));
    if(isStatusCode(query)) {
        console.log(`Failed to get invites for user ${req.params.id}`);
        res.status(query).send(ERROR_MESSAGES.get(query));
        return;
    }
    res.status(STATUS_CODE.OK).json(query);
}

async function getPendingInvites(req: Request, res: Response) {
    console.log(`Received in pending invites: ${req.params.id}`);
    const query = await invitationApi.getPendingInvites(Number(req.params.id));
    if(isStatusCode(query)) {
        console.log(`Failed to get pending invites for user ${req.params.id}`);
        res.status(query).send(ERROR_MESSAGES.get(query));
        return;
    }
    res.status(STATUS_CODE.OK).json(query);
}

async function postInvite(req: Request, res: Response) {
    console.log(`Received in post invite: ${req.body.senderId} ${req.body.recipientId}`);
    const query = await invitationApi.createInvite(req.body.senderId, req.body.recipientId);
    if(isStatusCode(query)) {
        console.log(`Failed to create invite between users ${req.body.senderId} ${req.body.recipientId}`);
        res.status(query).send(ERROR_MESSAGES.get(query));
        return;
    }
    res.sendStatus(STATUS_CODE.OK);
    emailService.sendInviteEmail((query as InviteData[])[0], SUBJECTS.INVITATION);
}

async function acceptInvite(req: Request, res: Response) {
    console.log(`Received in accept invite: ${req.params.id}`);
    const query = await invitationApi.acceptInvite(Number(req.params.id), req.body.senderId, req.body.recipientId);
    if(isStatusCode(query)) {
        console.log(`Failed to create invite between users ${req.body.senderId} ${req.body.recipientId}`);
        res.status(query).send(ERROR_MESSAGES.get(query));
        return;
    }
    res.sendStatus(STATUS_CODE.OK);
    emailService.sendInviteEmail((query as InviteData[])[0], SUBJECTS.ACCEPTED);
}

async function rejectInvite(req: Request, res: Response) {
    console.log(`Received in accept invite: ${req.params.id}`);
    const query = await invitationApi.rejectInvite(Number(req.params.id));
    if(isStatusCode(query)) {
        console.log(`Failed to create invite between users ${req.body.senderId} ${req.body.recipientId}`);
        res.status(query).send(ERROR_MESSAGES.get(query));
        return;
    }
    res.sendStatus(STATUS_CODE.OK);
    emailService.sendInviteEmail((query as InviteData[])[0], SUBJECTS.REJECTED);
}

export {getInvites, getPendingInvites, postInvite, acceptInvite, rejectInvite};
