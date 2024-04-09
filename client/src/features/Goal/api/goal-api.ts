import { useApiConnection } from "../../../hooks/useApiConnection";
import { throwServerError } from "../../../utils/errorHandlers";
import { Goal, CreateGoalProps, CreateSubGoalProps } from "../../../types";

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
    try {
      await post(`/goal/add${isSubGoal(goal) ? `/${goal.parentId}` : ""}`, goal)
    } catch (error: unknown) {
      throwServerError(error);
    }
  }

  function isSubGoal<T extends CreateGoalProps>(goal: T | CreateSubGoalProps): goal is CreateSubGoalProps {
    return "parentId" in goal;
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
