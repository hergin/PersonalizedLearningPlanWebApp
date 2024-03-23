import MessageGenerator from "../messageGenerator";
import { Subject, InviteData } from "../../types";

const TEST_INVITE : InviteData = {
    id: 50,
    sender_id: 1,
    recipient_id: 2,
    sender_username: "bobjonesxx",
    recipient_username: "tsnicholas",
    sender_email: "example@outlook.com",
    recipient_email: "foo@gmail.com"
}

describe("Message Generator Unit Tests", () => {
    const messageGenerator = new MessageGenerator();
    
    it("get message (normal case)", () => {
        const actual = messageGenerator.getMessage(Subject.INVITATION, TEST_INVITE);
        expect(actual).toEqual(`
        <p>Dear ${TEST_INVITE.recipient_username},</p>
        <p>${TEST_INVITE.sender_username} has sent you an invitation to become their coach</p>
        <p>Login to accept or reject this invitation. :)</p>
    `)
    });

    it("get message (error case)", () => {
        expect(() => {
            messageGenerator.getMessage("Fake Subject" as Subject, TEST_INVITE)
        }).toThrow(new Error("The given subject has no unknown premade message."));
    });
});
