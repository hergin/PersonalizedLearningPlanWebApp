import { join } from "path";
import dotenv from "dotenv";
import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { InviteData, STATUS_CODE, Subject } from "../types";
import MessageGenerator from "./messageGenerator";

dotenv.config({
    path: join(__dirname, ".env")
});

export default class EmailService {
    transporter : Transporter;
    messageGenerator : MessageGenerator;

    constructor() {
        const transportOptions : SMTPTransport.Options = {
            service: process.env.SERVICE,
            host: process.env.HOST,
            port: Number(process.env.EMAIL_PORT) || 587,
            auth: {
                user: process.env.ACCOUNT_EMAIL,
                pass: process.env.ACCOUNT_PASSWORD
            },
            tls: {
                ciphers: 'SSLv3',
                rejectUnauthorized: false
            }
        }
        this.transporter = createTransport(transportOptions);
        this.messageGenerator = new MessageGenerator();
    }

    async sendEmail(recipient: string, subject: string, message: string) {
        if(!recipient || !recipient.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return STATUS_CODE.BAD_REQUEST;
        }

        try {
            const info = await this.transporter.sendMail({
                from: `Learning Plan <${process.env.ACCOUNT_EMAIL}>`,
                to: recipient,
                subject: subject,
                html: message
            });
            console.log(`Message sent: ${info.messageId}`);
            return STATUS_CODE.OK;
        } catch(error: unknown) {
            console.error(error);
            return STATUS_CODE.INTERNAL_SERVER_ERROR;
        }
    }

    async sendInviteEmail(data: InviteData, subject : Subject) {
        if(!data.recipient_email || !data.recipient_email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return STATUS_CODE.BAD_REQUEST;
        }

        try {
            const message = this.messageGenerator.getMessage(subject, data);
            const info = await this.transporter.sendMail({
                from: `Learning Plan <${process.env.ACCOUNT_EMAIL}>`,
                to: subject === "Coach Invitation" ? data.recipient_email : data.sender_email,
                subject: subject,
                html: message
            });
            console.log(`Message sent: ${info.messageId}`);
            return STATUS_CODE.OK;
        } catch(error: unknown) {
            console.error(error);
            return STATUS_CODE.INTERNAL_SERVER_ERROR;
        }
    }
}
