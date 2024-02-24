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

export const TEST_DATA = {
    accountId: 601,
    email: "example@outlook.com",
    password: "09122001",
    accessToken: "1234567890",
    refreshToken: "refresh please",
    profileId: 12,
    username: "Xx_testdummy_xX",
    firstName: "Test",
    lastName: "Dummy",
    profilePicture: "",
    jobTitle: "Construction Dummy",
    bio: "I'm a dummy...",
    settingsId: 42,
    receiveEmails: true,
    tagId: 120,
    tagName: "school",
    color: "#0000FF"
}
