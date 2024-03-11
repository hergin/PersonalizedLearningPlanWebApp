import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GoalApi } from "../api/goal-api";
import { CreateGoalProps, CreateSubGoalProps, Goal, UpdateFeedbackProps } from "../../../types";

export function useGoals(moduleId: number) {
  const { fetchGoals } = GoalApi();
  
  return useQuery({
    queryFn: async () => await fetchGoals(moduleId),
    queryKey: ["goals", moduleId],
  });
}

export function useGoalCreator(moduleId: number) {
  const queryClient = useQueryClient();
  const { createGoal } = GoalApi();

  return useMutation({
    mutationFn: async (goal: CreateGoalProps | CreateSubGoalProps) => {await createGoal(goal)},
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["goals", moduleId]});
    }
  });
}

export function useGoalUpdater(moduleId: number) {
  const queryClient = useQueryClient();
  const { updateGoal } = GoalApi();

  return useMutation({
    mutationFn: async (goal: Goal) => {await updateGoal(goal)},
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["goals", moduleId]});
    }
  });
}

export function useFeedbackUpdater(moduleId: number) {
  const queryClient = useQueryClient();
  const { updateGoalFeedback } = GoalApi();

  return useMutation({
    mutationFn: async ({goal_id, feedback}: UpdateFeedbackProps) => {await updateGoalFeedback(goal_id, feedback);},
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["goals", moduleId]});
    }
  })
}

export function useGoalRemover(moduleId: number) {
  const queryClient = useQueryClient();
  const { deleteGoal } = GoalApi();

  return useMutation({
    mutationFn: async (id: number) => {await deleteGoal(id)},
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["goals", moduleId]});
    }
  });
}
