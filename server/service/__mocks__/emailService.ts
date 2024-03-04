const mockSendEmail = jest.fn();
const mockSendInviteEmail = jest.fn();

const mock = jest.fn().mockImplementation(() => {
    return {
        sendEmail: mockSendEmail,
        sendInviteEmail: mockSendInviteEmail
    } 
});

export default mock;
