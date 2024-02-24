import { StatusCode, Subject, User } from "../../types";
import { Request, Response } from "express";
import EmailService from "../../service/emailService";
import ProfileAPI from "../api/profileApi";
import { initializeErrorMap } from "../../utils/errorMessages";
import MessageGenerator from "../../service/messageGenerator";

const ERROR_MESSAGES = initializeErrorMap();

const messageGenerator = new MessageGenerator();
const emailService = new EmailService();
const profileApi = new ProfileAPI();

/*
    Request body:
    - username of requester as username
    - accountId of recipient as recipientId
*/
async function postCoachRequest(req: Request, res: Response) {
    console.log(`Received in send coach request: ${req.body.username} ${req.body.recipientId}`);
    const recipientQuery = await profileApi.getUserData(req.body.recipientId);
    if(recipientQuery as StatusCode in StatusCode) {
        console.log(`Failed to retrieve data for account ${req.body.recipientId} with status code ${recipientQuery}`);
        res.status(recipientQuery as StatusCode).send(ERROR_MESSAGES.get(recipientQuery as StatusCode));
        return;
    }
    const message = messageGenerator.getMessage(Subject.INVITATION, recipientQuery as User, req.body.username);
    const emailStatus = await emailService.sendEmail((recipientQuery as User).email, Subject.INVITATION, message);
    if(emailStatus !== StatusCode.OK) {
        console.log(`Failed to send send email invitation with status code ${emailStatus}`);
        res.status(emailStatus).send(ERROR_MESSAGES.get(emailStatus));
        return;
    }
    res.sendStatus(StatusCode.OK);
}

export {postCoachRequest};
