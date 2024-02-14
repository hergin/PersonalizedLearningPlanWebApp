import { schedule } from 'node-cron';
import GoalParser from '../parser/goalParser';

const EVERYDAY_AT_MIDNIGHT = '0 0 * * *';
const parser = new GoalParser();

export async function updateIsComplete() {
    
}

schedule(EVERYDAY_AT_MIDNIGHT, updateIsComplete);