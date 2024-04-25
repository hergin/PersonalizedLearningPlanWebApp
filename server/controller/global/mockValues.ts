import { Profile, Goal, GOAL_TYPE, Module, CreateGoalProps, CreateProfileProps, InviteData, AccountSettings, CreateModuleProps } from "../../types";

export const FAKE_ERRORS = {
    badRequest: {code: '23514'},
    networkError: {code: '08000'},
    primaryKeyViolation: {code: '23505'},
    fatalServerError: {code: 'help :('},
};

export const MOCK_RESPONSE : any = {
    sendStatus: jest.fn().mockImplementation((status: number) => {
        console.log(`Status being sent: ${status}`);
        return MOCK_RESPONSE as any;
    }),
    json: jest.fn().mockImplementation((json: object) => {
        console.log(`Json: ${JSON.stringify(json)}`);
        return MOCK_RESPONSE as any;
    }),
    send: jest.fn().mockImplementation((message: string) => {
        console.log(`Sending message: ${message}`);
        return MOCK_RESPONSE as any;
    }),
    status: jest.fn().mockImplementation((status: number) => {
        console.log(`Setting status as: ${status}`);
        return MOCK_RESPONSE as any;
    })
};

export function createMockRequest(body: any, params?: any): any {
    return {
        body: body,
        params: params ?? {id: undefined}
    };
}

export const TEST_ACCOUNT = {
    id: 601,
    email: "example@outlook.com",
    password: "09122001",
    accessToken: "1234567890",
    refreshToken: "refresh please",
    role: "basic",
};

export const TEST_CREATED_PROFILE: CreateProfileProps = {
    username: "Xx_testdummy_xX",
    firstName: "Test",
    lastName: "Dummy",
    accountId: TEST_ACCOUNT.id
}

export const TEST_PROFILE: Profile = {
    ...TEST_CREATED_PROFILE,
    profileId: 12,
    jobTitle: "Construction Dummy",
    bio: "I'm a dummy...",
};

export const TEST_SETTINGS: AccountSettings = {
    id: 42,
    receiveEmails: true,
    allowCoachInvitations: true,
    accountId: TEST_ACCOUNT.id
};

export const TEST_TAG = {
    id: 120,
    name: "school",
    accountId: TEST_ACCOUNT.id
};

export const TEST_CREATED_MODULE: CreateModuleProps = {
    name: "School",
    description: "Get better grades in school.",
    completion: 0,
    accountId: TEST_ACCOUNT.id
}

export const TEST_MODULE: Module = {
    ...TEST_CREATED_MODULE,
    module_id: 54,
};

export const TEST_CREATED_GOAL: CreateGoalProps[] = [
    {
        name: "do Homework",
        description: "spend 3 hours a day on homework",
        is_complete: false,
        goal_type: GOAL_TYPE.DAILY,
        module_id: TEST_MODULE.module_id,
    },
    {
        name: "Sub Goal",
        description: "This is a sub goal",
        is_complete: false,
        goal_type: GOAL_TYPE.DAILY,
        module_id: TEST_MODULE.module_id,
        due_date: "2030-01-23T14:15:00.000Z",
        tag_id: TEST_TAG.id,
        parent_goal: 4324
    }
];

export const TEST_GOAL: Goal[] = [
    {
        goal_id: 5292,
        name: "Study for coding test",
        description: "I need to pass the coding test to graduate!",
        is_complete: false,
        goal_type: GOAL_TYPE.ONCE,
        module_id: TEST_MODULE.module_id,
    },
    {
        goal_id: 4324,
        name: "Do project",
        description: "Finish my project.",
        is_complete: false,
        goal_type: GOAL_TYPE.WEEKLY,
        module_id: TEST_MODULE.module_id,
        tag_id: TEST_TAG.id,
        due_date: "2025-01-01T23:59:59.000Z",
        feedback: "It's important to study!",
    },
    {
        goal_id: 5293,
        name: "Complete this quiz",
        description: "Take this quiz can get all the questions correct",
        is_complete: false,
        goal_type: GOAL_TYPE.DAILY,
        module_id: TEST_MODULE.module_id,
        tag_id: TEST_TAG.id,
        feedback: "I approve this goal!",
        parent_goal: 5292,
    },
    {
        goal_id: 1002,
        name: "Wake me up",
        description: "Wake me up inside",
        is_complete: true,
        goal_type: GOAL_TYPE.WEEKLY,
        module_id: TEST_MODULE.module_id,
        tag_id: TEST_TAG.id,
        parent_goal: 5292
    },
    {
        ...TEST_CREATED_GOAL[0],
        goal_id: 1000
    },
    {
        ...TEST_CREATED_GOAL[1],
        goal_id: 1001
    },

];

export const TEST_INVITE: InviteData = {
    id: 50,
    sender_id: 1,
    recipient_id: 2,
    sender_username: "bobjonesxx",
    recipient_username: "tsnicholas",
    sender_email: "example@outlook.com",
    recipient_email: "foo@gmail.com"
};
