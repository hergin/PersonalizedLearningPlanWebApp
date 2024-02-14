import { schedule } from "node-cron";
import EmailService from "@server/service/emailService";
import GoalParser from "@server/parser/goalParser";

const EVERYDAY_AT_MIDNIGHT : string = "0 0 * * *";
const parser = new GoalParser();
const emailService = new EmailService();

const notifyOfCloseDueDates = schedule(EVERYDAY_AT_MIDNIGHT, async () => {
    const results = await parser.parseAccountsWithUpcomingDueDates();
    for(const user of results) {
        const message = generateMessage(user.goal, user.username, new Date(user.due_date));
        emailService.sendEmail(user.email, "Due Date Coming Soon!", message);
    }
});

function generateMessage(goalName: string, username: string, dueDate: Date):string {
    return `
        <p>Hello ${username},</p>
        <p>Your due date for ${goalName} is coming up at ${dueDate.toDateString()} on ${dueDate.getTime()}.</p>
        <p>Make sure to complete your goals on time!</p>
    `
}
