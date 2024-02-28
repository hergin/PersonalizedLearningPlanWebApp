export const mockGetGoals = jest.fn();
export const mockCreateGoal = jest.fn();
export const mockUpdateGoal = jest.fn();
export const mockUpdateGoalFeedback = jest.fn();
export const mockDeleteGoal = jest.fn();
export const mockGetGoalVariable = jest.fn();
export const mockAddSubGoal = jest.fn();

const mock = jest.fn().mockImplementation(() => {
    return {
        getGoals: mockGetGoals,
        createGoal: mockCreateGoal,
        updateGoal: mockUpdateGoal,
        updateGoalFeedback: mockUpdateGoalFeedback,
        deleteGoal: mockDeleteGoal,
        getGoalVariable: mockGetGoalVariable,
        addSubGoal: mockAddSubGoal
    };
});

export default mock;
