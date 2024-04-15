import { useApiConnection } from "../../../hooks/useApiConnection";
import { throwServerError } from "../../../utils/errorHandlers";
import { Goal, CreateGoalProps, CreateSubGoalProps } from "../../../types";
import { isCreatedSubGoal } from "../../../utils/typeGuards";

export const GoalApi = () => {
  const { get, post, put, del } = useApiConnection();
  
  async function fetchGoals(moduleId: number) {
    try {
      return await get(`/goal/get/module/${moduleId}`);
    } catch (error: unknown) {
      throwServerError(error);
    }
  }

  async function createGoal(goal: CreateGoalProps | CreateSubGoalProps) {
    const endOfPath = isCreatedSubGoal(goal) ? `/${goal.parentId}` : "";
    try {
      await post(`/goal/add${endOfPath}`, goal)
    } catch (error: unknown) {
      throwServerError(error);
    }
  }

  async function updateGoal(goal: Goal) {
    try {
      await put(`/goal/update/${goal.goal_id}`, goal);
    } catch (error: unknown) {
      throwServerError(error);
    }
  }

  async function updateGoalFeedback(id: number, feedback: string) {
    try {
      await put(`/goal/update/feedback/${id}`, {feedback: feedback});
    } catch (error: unknown) {
      throwServerError(error);
    }
  }

  async function deleteGoal(id: number) {
    try {
      await del(`/goal/delete/${id}`);
    } catch (error: unknown) {
      throwServerError(error);
    }
  }
  
  return { fetchGoals, createGoal, updateGoal, updateGoalFeedback, deleteGoal };
};
