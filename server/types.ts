type ObjectValues<T> = T[keyof T];

export const STATUS_CODE = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    CONNECTION_ERROR: 404,
    NOT_ACCEPTABLE: 406,
    CONFLICT: 409,
    GONE: 410,
    INVALID_TOKEN: 498,
    INTERNAL_SERVER_ERROR: 500
} as const;
export type StatusCode = ObjectValues<typeof STATUS_CODE>;

export const GOAL_TYPE = {
    ONCE: "todo",
    DAILY: "daily",
    WEEKLY: "weekly",
    MONTHLY: "monthly",
} as const;
export type GoalType = ObjectValues<typeof GOAL_TYPE>;

export const SUBJECTS = {
    INVITATION: "Coach Invitation",
    ACCEPTED: "Invitation Accepted!",
    REJECTED: "Invitation Rejected!"
} as const;
export type Subject = ObjectValues<typeof SUBJECTS>;

export const TABLES = {
    GOAL: "GOAL",
    PROFILE: "PROFILE",
    MODULE: "MODULE",
    MESSAGE: "MESSAGE"
} as const;
export type Table = ObjectValues<typeof TABLES>;

export const ROLES = {
    ADMIN: "admin",
    COACH: "coach",
    BASIC: "basic",
} as const;
export type Role = ObjectValues<typeof ROLES>;

export type User = {
    id: number,
    role: Role
};

export type UserData = {
    id: number,
    email: string,
    profile_id: number,
    username: string
};

export type CreateGoalProps = {
    name: string,
    description: string,
    is_complete: boolean,
    goal_type: GoalType,
    module_id: number,
    tag_id?: number,
    due_date?: string,
    parent_goal?: number
};

export type Goal = CreateGoalProps & {
    goal_id: number,
    feedback?: string,
    completion_time?: string,
    expiration?: string,
};

export type ClientGoal = Goal & {
    tag_name?: string
};

export type ParentGoal = ClientGoal & {
    sub_goals: ClientGoal[]
};

export type CreateProfileProps = {
    username: string,
    firstName: string,
    lastName: string,
    accountId: number,
};

export type Profile = CreateProfileProps & {
    profileId: number,
    jobTitle?: string,
    bio?: string
};

export type CreateModuleProps = {
    name: string,
    description: string,
    completion: number,
    accountId: number
};

export type Module = CreateModuleProps & {
    module_id: number,
};

export type Settings = {
    id: number,
    receiveEmails: boolean,
    allowCoachInvitations: boolean
};

export type AccountSettings = Settings & {
    accountId: number
};

export type InviteData = {
    id: number,
    recipient_id: number,
    recipient_email: string,
    recipient_username: string,
    sender_id: number,
    sender_email: string,
    sender_username: string
};

export type CreatedMessage = {
    content: string,
    senderId: number,
    recipientId: number
};

export type Message = CreatedMessage & {
    date: string,
    username: string,
    last_edited?: string,
};

export interface Query {
    text: string,
    values: (string | number | boolean | Date | undefined)[]
};
