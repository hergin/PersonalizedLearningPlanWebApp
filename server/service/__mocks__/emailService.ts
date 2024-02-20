const mockSendEmail = jest.fn();

const mock = jest.fn().mockImplementation(() => {
    return {
        sendEmail: mockSendEmail
    } 
});

export default mock;
