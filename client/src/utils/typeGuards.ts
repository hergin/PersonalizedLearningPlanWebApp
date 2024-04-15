import { GoalType, CreateGoalProps, CreateSubGoalProps, Message, GOAL_TYPE } from "../types";

export function isGoalType<T extends string>(value: T | GoalType): value is GoalType {
    return value === "todo" || value === "daily" || value === "weekly" || value === "monthly";
}

export function isCreatedSubGoal<T extends CreateGoalProps>(goal: T | CreateSubGoalProps): goal is CreateSubGoalProps {
    return "parentId" in goal && goal.parentId !== undefined;
}

export function isMessageArray<T extends object>(data: T[] | Message[]): data is Message[] {
    let result = true;
    data.forEach(object => {
        result = result && isMessage(object)
    });
    return result;
}

export function isMessage<T extends object>(value: T | Message): value is Message {
    let result = true;
    for(const key of ["content", "sender_id", "recipient_id", "id", "username", "date"]) {
        result &&= key in value;
    }
    return result;
}
