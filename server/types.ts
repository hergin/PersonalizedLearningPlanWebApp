export enum StatusCode {
    OK = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    CONNECTION_ERROR = 404,
    CONFLICT = 409,
    GONE = 410,
    INTERNAL_SERVER_ERROR = 500
}

export enum GoalType {
    TASK = "todo",
    REPEATABLE = "daily"
}

export type Goal = {
    id?: number,
    name: string,
    description: string,
    isComplete: boolean,
    goalType: GoalType,
    moduleId?: number,
    tagId?: number,
    dueDate?: string,
    completionTime?: string,
    expiration?: string,
    feedback?: string,
    subGoals?: Goal[]
}

export type Profile = {
    id: number,
    username: string,
    firstName: string,
    lastName: string,
    profilePicture?: string,
    jobTitle?: string,
    bio?: string
}

export type AccountSettings = {
    id?: number,
    receiveEmails: boolean,
    accountId?: number
}
