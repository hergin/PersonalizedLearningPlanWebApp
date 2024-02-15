import { schedule } from "node-cron";
import ModuleParser from "../parser/moduleParser";

const EVERYDAY_AT_MIDNIGHT = "0 0 * * *";
const parser = new ModuleParser();

const updateCompletionPercent = schedule(EVERYDAY_AT_MIDNIGHT, () => {
    
});
