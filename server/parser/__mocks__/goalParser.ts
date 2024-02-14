export const mockParseParentGoals = jest.fn();
export const mockStoreGoal = jest.fn();
export const mockUpdateGoal = jest.fn();
export const mockUpdateGoalTimestamps = jest.fn();
export const mockDeleteGoal = jest.fn();
export const mockParseGoalVariable = jest.fn();
export const mockStoreSubGoal = jest.fn();
export const mockParseSubGoals = jest.fn();
export const mockParseAllSubGoals = jest.fn();
export const mockParseAllParentGoals = jest.fn();

const mock = jest.fn().mockImplementation(() => {
    return {
        parseParentGoals : mockParseParentGoals,
        storeGoal : mockStoreGoal,
        updateGoal : mockUpdateGoal,
        updateGoalTimestamps : mockUpdateGoalTimestamps,
        deleteGoal : mockDeleteGoal,
        parseGoalVariable : mockParseGoalVariable,
        storeSubGoal : mockStoreSubGoal,
        parseSubGoals : mockParseSubGoals,
        parseAllSubGoals : mockParseAllSubGoals,
        parseAllParentGoals : mockParseAllParentGoals
    }
});

export default mock;
