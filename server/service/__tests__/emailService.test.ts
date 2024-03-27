export {};

import EmailService from "../emailService";
import MessageGenerator from "../messageGenerator";
import { InviteData, StatusCode, Subject } from "../../types";

const sendMailMock = jest.fn(); 
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockImplementation(() => ({
    sendMail: sendMailMock,
  })),
}));
jest.mock("../messageGenerator");

const TEST_DATA = {
    recipient: "example@gmail.com",
    subject: "this is a subject",
    messageHtml: `
        <h1>Hello World!</h1>
        <p>Isn't Nodemailer useful?</p>
    `,
}

const TEST_INVITE : InviteData = {
    id: 50,
    sender_id: 1,
    recipient_id: 2,
    sender_username: "bobjonesxx",
    recipient_username: "tsnicholas",
    sender_email: "example@outlook.com",
    recipient_email: "foo@gmail.com"
}

describe("service tests", () => {
    var emailService : EmailService
    var messageGenerator : any;

    beforeEach(() => {
        emailService = new EmailService();
        messageGenerator = new MessageGenerator();
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("send mail (normal case)", async () => {
        sendMailMock.mockResolvedValueOnce({messageId: "message"});
        const status = await emailService.sendEmail(TEST_DATA.recipient, TEST_DATA.subject, TEST_DATA.messageHtml);
        expect(sendMailMock).toHaveBeenCalledTimes(1);
        expect(sendMailMock).toHaveBeenCalledWith({
            from: `Learning Plan <${process.env.ACCOUNT_EMAIL}>`,
            to: TEST_DATA.recipient,
            subject: TEST_DATA.subject,
            html: TEST_DATA.messageHtml
        });
        expect(status).toEqual(StatusCode.OK);
    });

    it("send mail (bad request case)", async () => {
        const status = await emailService.sendEmail("not an email >:3", TEST_DATA.subject, TEST_DATA.messageHtml);
        expect(sendMailMock).toHaveBeenCalledTimes(0);
        expect(status).toEqual(StatusCode.BAD_REQUEST);
    });

    it("send mail (internal error)", async () => {
        sendMailMock.mockRejectedValue({error: "I am error."});
        const status = await emailService.sendEmail(TEST_DATA.recipient, TEST_DATA.subject, TEST_DATA.messageHtml);
        expect(sendMailMock).toHaveBeenCalledTimes(1);
        expect(sendMailMock).toHaveBeenCalledWith({
            from: `Learning Plan <${process.env.ACCOUNT_EMAIL}>`,
            to: TEST_DATA.recipient,
            subject: TEST_DATA.subject,
            html: TEST_DATA.messageHtml
        });
        expect(status).toEqual(StatusCode.INTERNAL_SERVER_ERROR);
    });

    it("send invite mail (normal case)", async () => {
        sendMailMock.mockResolvedValueOnce({messageId: "message"});
        messageGenerator.getMessage.mockReturnValue("message");
        const status = await emailService.sendInviteEmail(TEST_INVITE, Subject.INVITATION);
        expect(messageGenerator.getMessage).toHaveBeenCalledTimes(1);
        expect(messageGenerator.getMessage).toHaveBeenCalledWith(Subject.INVITATION, TEST_INVITE);
        expect(sendMailMock).toHaveBeenCalledTimes(1);
        expect(sendMailMock).toHaveBeenCalledWith({
            from: `Learning Plan <${process.env.ACCOUNT_EMAIL}>`,
            to: TEST_INVITE.recipient_email,
            subject: Subject.INVITATION,
            html: "message"
        });
        expect(status).toEqual(StatusCode.OK);
    });

    it("send invite mail (bad request case)", async () => {
        sendMailMock.mockResolvedValueOnce({messageId: "message"});
        messageGenerator.getMessage.mockReturnValue("message");
        const status = await emailService.sendInviteEmail({
            ...TEST_INVITE, recipient_email: "This isn't an email"
        }, Subject.INVITATION);
        expect(messageGenerator.getMessage).toHaveBeenCalledTimes(0);
        expect(sendMailMock).toHaveBeenCalledTimes(0);
        expect(status).toEqual(StatusCode.BAD_REQUEST);
    });
});
