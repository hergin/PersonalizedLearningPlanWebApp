const authenticateToken = require('../../utils/authenticateToken');
const jwt = require("jsonwebtoken");
const STATUS_CODES = require("../../utils/statusCodes");
 
describe('authenticate token tests', () => {
    it('authenticateToken pass case', () => {
        const verify = jest.spyOn(jwt, 'verify');
        verify.mockImplementation((token, secretOrPublicKey, callback) => {
            return callback(null, {verified: 'true'});
        });
        const next = jest.fn();
        const sendStatus = jest.fn();
        const mockRequest = {
            headers: {
                'authorization': 'Bearer 4206966'
            }
        };
        const mockResponse = {
            sendStatus: sendStatus
        };
        authenticateToken(mockRequest, mockResponse, next);
        expect(next).toBeCalledTimes(1);
        expect(sendStatus).toBeCalledTimes(0);
    });

    it('authenticateToken null case', () => {
        const next = jest.fn();
        const sendStatus = jest.fn();
        const mockRequest = {
            headers: {}
        };
        const mockResponse = {
            sendStatus: sendStatus
        };
        authenticateToken(mockRequest, mockResponse, next);
        expect(sendStatus).toBeCalledTimes(1);
        expect(sendStatus).toHaveBeenCalledWith(STATUS_CODES.UNAUTHORIZED);
    });

    it('authenticateToken wrong token case', () => {
        const verify = jest.spyOn(jwt, 'verify');
        verify.mockImplementation((token, secretOrPublicKey, callback) => {
            return callback(new Error("Wrong Token."), null);
        });
        const sendStatus = jest.fn();
        const next = jest.fn();
        const mockRequest = {
            headers: {
                'authorization': 'Bearer this is a wrong token'
            }
        };
        const mockResponse = {
            sendStatus: sendStatus
        };
        authenticateToken(mockRequest, mockResponse, next);
        expect(sendStatus).toBeCalledTimes(1);
        expect(sendStatus).toHaveBeenCalledWith(STATUS_CODES.FORBIDDEN);
        expect(next).toBeCalledTimes(0);
    });
});
