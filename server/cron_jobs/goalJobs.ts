import { schedule } from "node-cron";
import GoalParser from "@server/parser/goalParser";

const EVERYDAY_AT_MIDNIGHT : string = "0 0 * * *";
const parser = new GoalParser();

const updateDatabase = schedule(EVERYDAY_AT_MIDNIGHT, () => {
    
});
