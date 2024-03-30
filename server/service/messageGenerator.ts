import { Subject, InviteData } from "../types";

const RECIPIENT_IDENTIFIER = "$~recipient~$";
const SENDER_IDENTIFIER = "$~sender~$";
// These messages are placeholders, we'll make proper emails later on.
const PREMADE_MESSAGES = [
    `
        <p>Dear ${RECIPIENT_IDENTIFIER},</p>
        <p>${SENDER_IDENTIFIER} has sent you an invitation to become their coach</p>
        <p>Login to accept or reject this invitation. :)</p>
    `,
    `
        <p>Dear ${RECIPIENT_IDENTIFIER},</p>
        <p>${SENDER_IDENTIFIER} has accepted your offer to become your coach!</p>
    `,
    `
        <p>Dear ${RECIPIENT_IDENTIFIER},</p>
        <p>${SENDER_IDENTIFIER} has rejected your offer to become your coach!</p>
    `
];

export default class MessageGenerator {
    messageMap : Map<Subject, string>;
    
    constructor() {
        this.messageMap = this.generateMessageMap();
    }

    private generateMessageMap(): Map<Subject, string> {
        const map = new Map<Subject, string>();
        map.set(Subject.INVITATION, PREMADE_MESSAGES[0]);
        map.set(Subject.ACCEPTED, PREMADE_MESSAGES[1]);
        map.set(Subject.REJECTED, PREMADE_MESSAGES[2]);
        return map;
    }

    getMessage(subject: Subject, data: InviteData): string {
        const messageTemplate = this.messageMap.get(subject);
        if(!messageTemplate) {
            throw new Error("The given subject has no unknown premade message.");
        }
        return this.insertValues(messageTemplate, data);
    }

    private insertValues(template: string, data?: InviteData): string {
        if(data) {
            template = template.replace(RECIPIENT_IDENTIFIER, data.recipient_username);
            template = template.replace(SENDER_IDENTIFIER, data.sender_username);
        }
        return template;
    }
}
