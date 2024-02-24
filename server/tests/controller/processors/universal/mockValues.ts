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
}

export const TEST_PROFILE = {
    id: 12,
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
    profileId: TEST_PROFILE.id
}

export const TEST_MODULE = {
    id: 2377,
    name: "School",
    description: "Get better grades in school.",
    completionPercent: 0,
    accountId: TEST_ACCOUNT.id,
    coachId: 12
}
