export {};

const authenticateToken = require('../../utils/authenticateToken');
const jwt = require("jsonwebtoken");
const STATUS_CODES = require("../../utils/statusCodes");

describe('authenticate token tests', () => {
    test('authenticateToken pass case', () => {
        const verify = jest.spyOn(jwt, 'verify');
        verify.mockImplementation((token, secretOrPublicKey, callback) => {
            return (callback as (any : any, result : object) => void)(null, {verified: 'true'});
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
        expect(next).toHaveBeenCalledTimes(1);
        expect(sendStatus).toHaveBeenCalledTimes(0);
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
        expect(sendStatus).toHaveBeenCalledTimes(1);
        expect(sendStatus).toHaveBeenCalledWith(STATUS_CODES.UNAUTHORIZED);
    });

    it('authenticateToken wrong token case', () => {
        const verify = jest.spyOn(jwt, 'verify');
        verify.mockImplementation((token, secretOrPublicKey, callback ) => {
            return (callback as (error: Error, any : any) => void)(new Error("Wrong Token."), null);
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
        expect(sendStatus).toHaveBeenCalledTimes(1);
        expect(sendStatus).toHaveBeenCalledWith(STATUS_CODES.FORBIDDEN);
        expect(next).toHaveBeenCalledTimes(0);
    });
});