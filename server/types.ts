type ObjectValues<T> = T[keyof T];

export const STATUS_CODE = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    CONNECTION_ERROR: 404,
    CONFLICT: 409,
    GONE: 410,
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

const TABLES = {
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

export type Goal = {
    goal_id?: number,
    name: string,
    description: string,
    is_complete: boolean,
    goal_type: GoalType,
    module_id?: number,
    tag_id?: number,
    due_date?: string,
    completion_time?: string,
    expiration?: string,
    feedback?: string,
    subGoals?: Goal[]
}

export type Profile = {
    profileId?: number,
    username: string,
    firstName: string,
    lastName: string,
    accountId?: number,
    jobTitle?: string,
    bio?: string
}

export type Module = {
    id?: number,
    name: string,
    description: string,
    completion: number
    accountId?: number
}

export type AccountSettings = {
    id?: number,
    receiveEmails: boolean,
    allowCoachInvitations: boolean,
    accountId?: number
}

export type InviteData = {
    id: number,
    recipient_id: number,
    recipient_email: string,
    recipient_username: string,
    sender_id: number,
    sender_email: string,
    sender_username: string
}

export type Message = {
    content: string,
    senderId: number,
    recipientId: number
}

export type Chat = {
    sentMessages: Message[],
    receivedMessages: Message[]
}

export interface Query {
    text: string,
    values: (string | number | boolean | Date | undefined)[]
}
