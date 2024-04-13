import { GoalType, CreateGoalProps, CreateSubGoalProps } from "../types";

export function isGoalType<T extends string>(value: T | GoalType): value is GoalType {
    return value == "todo" || value == "daily" || value == "weekly" || value == "monthly";
}

export function isCreatedSubGoal<T extends CreateGoalProps>(goal: T | CreateSubGoalProps): goal is CreateSubGoalProps {
    return "parentId" in goal && goal.parentId !== undefined;
}
