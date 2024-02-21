export {};

import EmailService from "../../service/emailService";
const sendMailMock = jest.fn(); 
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockImplementation(() => ({
    sendMail: sendMailMock,
  })),
}));
import nodemailer from "nodemailer";

const TEST_DATA = {
    recipient: "example@gmail.com",
    subject: "this is a subject",
    messageHtml: `
        <h1>Hello World!</h1>
        <p>Isn't Nodemailer useful?</p>
    `,
}

describe("service tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("constructor", async () => {
        const emailService = new EmailService();
        expect(nodemailer.createTransport).toHaveBeenCalledTimes(1);
        expect(emailService).toBeTruthy();
    });

    it("send mail", async () => {
        const emailService = new EmailService();
        sendMailMock.mockResolvedValueOnce({messageId: "message"});
        await emailService.sendEmail(TEST_DATA.recipient, TEST_DATA.subject, TEST_DATA.messageHtml);
        expect(sendMailMock).toHaveBeenCalledTimes(1);
        expect(sendMailMock).toHaveBeenCalledWith({
            from: `Learning Plan <${process.env.ACCOUNT_EMAIL}>`,
            to: TEST_DATA.recipient,
            subject: TEST_DATA.subject,
            html: TEST_DATA.messageHtml
        });
    });
});
