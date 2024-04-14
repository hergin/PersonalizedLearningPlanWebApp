import { schedule } from "node-cron";
import DatabaseParser from "../parser/databaseParser";

const EVERYDAY_AT_MIDNIGHT = "0 0 * * *";
const parser = new DatabaseParser();

const updateCompletionPercent = schedule(EVERYDAY_AT_MIDNIGHT, () => parser.updateDatabase("CALL update_module_completion()"));

export {updateCompletionPercent};
