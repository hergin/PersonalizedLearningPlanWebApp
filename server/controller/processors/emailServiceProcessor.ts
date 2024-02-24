import { StatusCode } from "../../types";
import { Request, Response } from "express";
import EmailService from "../../service/emailService";
import ProfileAPI from "../api/profileApi";

const emailService = new EmailService();
const profileApi = new ProfileAPI();

/*
    Request body:
    - accountId of requester as senderId
    - accountId of recipient as recipientId
*/
async function postCoachRequest(req: Request, res: Response) {
    console.log(`Received in send coach request: ${req.body.senderId}`);
    
}

export {postCoachRequest};
