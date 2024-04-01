const mockSign = jest.fn();
const mockVerify = jest.fn();

export const sign = mockSign;
export const verify = mockVerify;

export const JsonWebTokenError = jest.fn().mockImplementation(() => {
    return {};
});

const mock = () => ({
    ...jest.requireActual,
    sign, 
    verify
});

export default mock;
