import { join } from "path";
import dotenv from "dotenv";
import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { StatusCode } from "../types";

dotenv.config({
    path: join(__dirname, ".env")
});

export default class EmailService {
    transporter : Transporter;
    
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
    }

    async sendEmail(recipient : string, subject : string, messageHtml : string) {
        if(!recipient || !recipient.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return StatusCode.BAD_REQUEST;
        }

        try {
            const info = await this.transporter.sendMail({
                from: `Learning Plan <${process.env.ACCOUNT_EMAIL}>`,
                to: recipient,
                subject: subject,
                html: messageHtml
            });
            console.log(`Message sent: ${info.messageId}`);
            return StatusCode.OK;
        } catch(error: unknown) {
            return StatusCode.INTERNAL_SERVER_ERROR;
        }
    }
}
