export {};

import EmailService from "../../service/emailService";
import { StatusCode } from "../../types";

const sendMailMock = jest.fn(); 
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockImplementation(() => ({
    sendMail: sendMailMock,
  })),
}));

const TEST_DATA = {
    recipient: "example@gmail.com",
    subject: "this is a subject",
    messageHtml: `
        <h1>Hello World!</h1>
        <p>Isn't Nodemailer useful?</p>
    `,
}

describe("service tests", () => {
    var emailService : EmailService

    beforeEach(() => {
        emailService = new EmailService();
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });
    

    it("send mail (normal case)", async () => {
        sendMailMock.mockResolvedValueOnce({messageId: "message"});
        const status = await emailService.sendInviteEmail(TEST_DATA.recipient, TEST_DATA.subject, TEST_DATA.messageHtml);
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
        const status = await emailService.sendInviteEmail("not an email >:3", TEST_DATA.subject, TEST_DATA.messageHtml);
        expect(sendMailMock).toHaveBeenCalledTimes(0);
        expect(status).toEqual(StatusCode.BAD_REQUEST);
    });

    it("send mail (internal error)", async () => {
        sendMailMock.mockRejectedValue({error: "I am error."});
        const status = await emailService.sendInviteEmail(TEST_DATA.recipient, TEST_DATA.subject, TEST_DATA.messageHtml);
        expect(sendMailMock).toHaveBeenCalledTimes(1);
        expect(sendMailMock).toHaveBeenCalledWith({
            from: `Learning Plan <${process.env.ACCOUNT_EMAIL}>`,
            to: TEST_DATA.recipient,
            subject: TEST_DATA.subject,
            html: TEST_DATA.messageHtml
        });
        expect(status).toEqual(StatusCode.INTERNAL_SERVER_ERROR);
    });
});
