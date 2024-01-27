export type GoalType = "todo" | "daily";

export type Goal = {
    name: string,
    description: string,
    isComplete: boolean,
    goalType: GoalType,
    moduleId: number,
    dueDate?: Date,
}

export type Profile = {
    id : number, 
    username : string, 
    firstName : string, 
    lastName : string, 
    profilePicture : string, 
    jobTitle : string, 
    bio : string
}
