import { join } from "path";
import dotenv from "dotenv";
import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { InviteData, StatusCode, Subject } from "../types";
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

    async sendInviteEmail(data: InviteData, subject : Subject) {
        if(!data.recipient_email || !data.recipient_email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return StatusCode.BAD_REQUEST;
        }

        try {
            const message = this.messageGenerator.getMessage(subject, data);
            const info = await this.transporter.sendMail({
                from: `Learning Plan <${process.env.ACCOUNT_EMAIL}>`,
                to: data.recipient_email,
                subject: subject,
                html: message
            });
            console.log(`Message sent: ${info.messageId}`);
            return StatusCode.OK;
        } catch(error: unknown) {
            return StatusCode.INTERNAL_SERVER_ERROR;
        }
    }
}
