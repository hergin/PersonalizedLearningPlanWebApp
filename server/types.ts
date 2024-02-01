export type GoalType = "todo" | "daily";

export type Goal = {
    name: string,
    description: string,
    isComplete: boolean,
    goalType: GoalType,
    moduleId?: number,
    dueDate?: Date,
    completionTime?: Date,
    expiration?: Date
}

export type Profile = {
    id: number,
    username: string,
    firstName: string,
    lastName: string,
    profilePicture: string,
    jobTitle: string,
    bio: string
}
export type CompleteGoal = {
    goal_id: number,
    name: string,
    description: string,
    isComplete: boolean,
    goalType: GoalType,
    moduleId: number,
    dueDate?: Date,
    subGoals: any[]
}
