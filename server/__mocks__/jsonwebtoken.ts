export const sign = jest.fn();
export const verify = jest.fn();

export const JsonWebTokenError = jest.fn().mockImplementation(() => {
    return {};
});

const mock = () => ({
    ...jest.requireActual,
    sign, 
    verify,
    JsonWebTokenError,
});

export default mock;
