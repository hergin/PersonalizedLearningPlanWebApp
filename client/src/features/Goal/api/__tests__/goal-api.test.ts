import { GoalApi } from "../goal-api";
import { useApiConnection } from "../../../../hooks/useApiConnection";
import { throwServerError } from "../../../../utils/errorHandlers";
import { CreateGoalProps, GoalType } from "../../../../types";

jest.mock("../../../../hooks/useApiConnection");
jest.mock("../../../../utils/errorHandlers");

const mockModuleId = 0;
const mockGoalId = 2;
const mockGoal: CreateGoalProps = {
    name: "Goal",
    goalType: GoalType.TASK,
    description: "Mock Goal is used for testing.",
    isComplete: false,
    moduleId: mockModuleId,
};
const mockError = {message: "Error Message"};

describe("Goal Api Unit Tests", () => {
    var mockConnection: any;
    var mockThrow: jest.Mock;

    beforeEach(() => {
        mockConnection = useApiConnection();
        mockThrow = throwServerError as jest.Mock;
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Fetch Goals (normal case)", async () => {
        const mockGet = mockConnection.get as jest.Mock;
        mockGet.mockResolvedValueOnce([mockGoal]);
        const { fetchGoals } = GoalApi();
        const result = await fetchGoals(mockModuleId);
        expect(mockThrow).toHaveBeenCalledTimes(0);
        expect(mockGet).toHaveBeenCalledTimes(1);
        expect(mockGet).toHaveBeenCalledWith(`/goal/get/module/${mockModuleId}`);
        expect(result).toEqual([mockGoal]);
    });

    it("Fetch Goals (error case)", async () => {
        const mockGet = mockConnection.get as jest.Mock;
        mockGet.mockRejectedValue(mockError);
        const { fetchGoals } = GoalApi();
        const result = await fetchGoals(mockModuleId);
        expect(mockGet).toHaveBeenCalledTimes(1);
        expect(mockGet).toHaveBeenCalledWith(`/goal/get/module/${mockModuleId}`);
        expect(mockThrow).toHaveBeenCalledTimes(1);
        expect(mockThrow).toHaveBeenCalledWith(mockError);
        expect(result).toBeUndefined();
    });

    it("Create Goal (normal case)", async () => {
        const mockPost = mockConnection.post as jest.Mock;
        mockPost.mockResolvedValueOnce({});
        const { createGoal } = GoalApi();
        await createGoal(mockGoal);
        expect(mockThrow).toHaveBeenCalledTimes(0);
        expect(mockPost).toHaveBeenCalledTimes(1);
        expect(mockPost).toHaveBeenCalledWith("/goal/add", mockGoal);
    });

    it("Create Goal (sub goal case)", async () => {
        const mockPost = mockConnection.post as jest.Mock;
        mockPost.mockResolvedValueOnce({});
        const { createGoal } = GoalApi();
        const mockParentId = 2;
        await createGoal({...mockGoal, parentId: mockParentId});
        expect(mockThrow).toHaveBeenCalledTimes(0);
        expect(mockPost).toHaveBeenCalledTimes(1);
        expect(mockPost).toHaveBeenCalledWith(`/goal/add/${mockParentId}`, {...mockGoal, parentId: mockParentId});
    });

    it("Create Goal (error case)", async () => {
        const mockPost = mockConnection.post as jest.Mock;
        mockPost.mockRejectedValue(mockError);
        const { createGoal } = GoalApi();
        await createGoal(mockGoal);
        expect(mockPost).toHaveBeenCalledTimes(1);
        expect(mockPost).toHaveBeenCalledWith("/goal/add", mockGoal);
        expect(mockThrow).toHaveBeenCalledTimes(1);
        expect(mockThrow).toHaveBeenCalledWith(mockError);
    });

    it("Update Goal (normal case)", async () => {
        const mockPut = mockConnection.put as jest.Mock;
        mockPut.mockResolvedValueOnce({});
        const { updateGoal } = GoalApi();
        const mockGoalId = 3;
        const testGoal = {
            ...mockGoal, 
            goal_id: mockGoalId, 
            goal_type: mockGoal.goalType, 
            is_complete: mockGoal.isComplete,
            module_id: mockModuleId 
        };
        await updateGoal(testGoal);
        expect(mockThrow).toHaveBeenCalledTimes(0);
        expect(mockPut).toHaveBeenCalledTimes(1);
        expect(mockPut).toHaveBeenCalledWith(`/goal/update/${mockGoalId}`, testGoal);
    });

    it("Update Goal (error case)", async () => {
        const mockPut = mockConnection.put as jest.Mock;
        mockPut.mockRejectedValue(mockError);
        const { updateGoal } = GoalApi();
        const testGoal = {
            ...mockGoal, 
            goal_id: mockGoalId, 
            goal_type: mockGoal.goalType, 
            is_complete: mockGoal.isComplete,
            module_id: mockModuleId 
        };
        await updateGoal(testGoal);
        expect(mockPut).toHaveBeenCalledTimes(1);
        expect(mockPut).toHaveBeenCalledWith(`/goal/update/${mockGoalId}`, testGoal);
        expect(mockThrow).toHaveBeenCalledTimes(1);
        expect(mockThrow).toHaveBeenCalledWith(mockError);
    });

    it("Update Goal Feedback (normal case)", async () => {
        const mockFeedback = "Feedback!";
        const mockPut = mockConnection.put as jest.Mock;
        mockPut.mockResolvedValueOnce({});
        const { updateGoalFeedback } = GoalApi();
        await updateGoalFeedback(mockGoalId, mockFeedback);
        expect(mockThrow).toHaveBeenCalledTimes(0);
        expect(mockPut).toHaveBeenCalledTimes(1);
        expect(mockPut).toHaveBeenCalledWith(`/goal/update/feedback/${mockGoalId}`, {feedback: mockFeedback});
    });

    it("Update Goal Feedback (error case)", async () => {
        const mockFeedback = "Feedback!";
        const mockPut = mockConnection.put as jest.Mock;
        mockPut.mockRejectedValue(mockError);
        const { updateGoalFeedback } = GoalApi();
        await updateGoalFeedback(mockGoalId, mockFeedback);
        expect(mockPut).toHaveBeenCalledTimes(1);
        expect(mockPut).toHaveBeenCalledWith(`/goal/update/feedback/${mockGoalId}`, {feedback: mockFeedback});
        expect(mockThrow).toHaveBeenCalledTimes(1);
        expect(mockThrow).toHaveBeenCalledWith(mockError);
    });

    it("Delete Goal (normal case)", async () => {
        const mockDel = mockConnection.del as jest.Mock;
        mockDel.mockResolvedValueOnce({});
        const { deleteGoal } = GoalApi();
        await deleteGoal(mockGoalId);
        expect(mockThrow).toHaveBeenCalledTimes(0);
        expect(mockDel).toHaveBeenCalledTimes(1);
        expect(mockDel).toHaveBeenCalledWith(`/goal/delete/${mockGoalId}`); 
    });

    it("Delete Goal (error case)", async () => {
        const mockDel = mockConnection.del as jest.Mock;
        mockDel.mockRejectedValue(mockError);
        const { deleteGoal } = GoalApi();
        await deleteGoal(mockGoalId);
        expect(mockDel).toHaveBeenCalledTimes(1);
        expect(mockDel).toHaveBeenCalledWith(`/goal/delete/${mockGoalId}`);
        expect(mockThrow).toHaveBeenCalledTimes(1);
        expect(mockThrow).toHaveBeenCalledWith(mockError); 
    });
});
