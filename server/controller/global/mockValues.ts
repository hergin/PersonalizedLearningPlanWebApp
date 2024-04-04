import { Profile, GoalType, Module, Goal, Role } from "../../types";

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
        params: params
    };
}

export const TEST_ACCOUNT = {
    id: 601,
    email: "example@outlook.com",
    password: "09122001",
    accessToken: "1234567890",
    refreshToken: "refresh please",
    role: "basic",
}

export const TEST_PROFILE: Profile = {
    profileId: 12,
    username: "Xx_testdummy_xX",
    firstName: "Test",
    lastName: "Dummy",
    profilePicture: "",
    jobTitle: "Construction Dummy",
    bio: "I'm a dummy..."
}

export const TEST_SETTINGS = {
    id: 42,
    receiveEmails: true,
    allowCoachInvitations: true,
    accountId: TEST_ACCOUNT.id
}

export const TEST_TAG = {
    id: 120,
    name: "school",
    color: "#0000FF",
    accountId: TEST_ACCOUNT.id
}

export const TEST_DASHBOARD = {
    id: 541,
    profileId: TEST_PROFILE.profileId
}

export const TEST_MODULE: Module = {
    id: 2377,
    name: "School",
    description: "Get better grades in school.",
    completion: 0,
    accountId: TEST_ACCOUNT.id
}

export const TEST_GOAL = {
    id: [5292, 7869, 4324],
    name: ["Study for coding test", "do Homework", "Do project"],
    description: ["I need to pass the coding test to graduate!", "spend 3 hours a day on homework", "Finish my project."],
    isComplete: false,
    goalType: GoalType.ONCE,
    moduleId: TEST_MODULE.id,
    tagId: TEST_TAG.id,
    dueDate: "2025-01-01T23:59:59.000Z",
    completionTime: null,
    expiration: null,
    feedback: "It's important to study!",
}

export const TEST_SUB_GOAL = {
    id: [5293, 7870, 4325],
    name: ["Complete this quiz", "Sub Goal", "Another Sub Goal"],
    description: ["Take this quiz can get all the questions correct", "This is a sub goal", "This is another sub goal."],
    isComplete: false,
    goalType: GoalType.DAILY,
    moduleId: TEST_MODULE.id,
    tagId: TEST_TAG.id,
    dueDate: new Date(Date.now() + (24 * 3600)).toISOString(),
    completionTime: null,
    expiration: null,
    feedback: "I approve this goal!",
    parentGoal: TEST_GOAL.id,
}

export const TEST_INVITE = {
    id: 50,
    senderId: 1,
    recipientId: 2,
    senderUsername: "bobjonesxx",
    recipientUsername: "tsnicholas",
    senderEmail: "example@outlook.com",
    recipientEmail: "foo@gmail.com"
}
