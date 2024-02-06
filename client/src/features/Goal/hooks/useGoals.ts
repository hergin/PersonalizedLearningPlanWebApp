import { useQuery } from "@tanstack/react-query";
import { GoalApi } from "../api/goal-api";

export default function useGoals(moduleID: string) {
  const { FetchGoals } = GoalApi(moduleID);
  console.log(FetchGoals());
  return useQuery({
    queryFn: () => FetchGoals(),
    queryKey: ["goals", moduleID],
  });
}
