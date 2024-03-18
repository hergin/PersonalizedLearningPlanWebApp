import { useApiConnection } from "../../../hooks/useApiConnection";
import { AxiosError } from "axios";
import { Goal, CreateGoalProps, CreateSubGoalProps } from "../../../types";

export const GoalApi = () => {
  const { get, post, put, del } = useApiConnection();
  
  async function fetchGoals(moduleId: number) {
    try {
      return await get(`/goal/get/module/${moduleId}`);
    } catch (error: unknown) {
      console.error(error);
      alert((error as AxiosError).message ? (error as AxiosError).message : error);
    }
  }

  async function createGoal(goal: CreateGoalProps | CreateSubGoalProps) {
    try {
      await post(`/goal/add${(goal as CreateSubGoalProps).parentId ? `/${(goal as CreateSubGoalProps).parentId}`: ""}`, goal)
    } catch (error: unknown) {
      console.error(error);
      alert((error as AxiosError).message ? (error as AxiosError).message : error);
    }
  }

  async function updateGoal(goal: Goal) {
    try {
      await put(`/goal/update/${goal.goal_id}`, goal);
    } catch (error: unknown) {
      console.error(error);
      alert((error as AxiosError).message ? (error as AxiosError).message : error);
    }
  }

  async function updateGoalFeedback(id: number, feedback: string) {
    try {
      await put(`goal/update/feedback/${id}`, {feedback: feedback});
    } catch (error: unknown) {
      console.error(error);
      alert((error as AxiosError).message ? (error as AxiosError).message : error);
    }
  }

  async function deleteGoal(id: number) {
    try {
      await del(`goal/delete/${id}`);
    } catch (error: unknown) {
      console.error(error);
      alert((error as AxiosError).message ? (error as AxiosError).message : error);
    }
  }
  
  return { fetchGoals, createGoal, updateGoal, updateGoalFeedback, deleteGoal };
};
