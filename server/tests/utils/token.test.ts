export {};

import path from "path";
require("dotenv").config({
    path: path.join("../../utils/", ".env"),
});
import { authenticateToken, generateAccessToken, generateRefreshToken } from '../../utils/token';
import jwt from "jsonwebtoken";
import { STATUS_CODES } from "../../utils/statusCodes";


describe('authenticate token tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

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

    it('generate access token', async () => {
        const sign = jest.spyOn(jwt, 'sign');
        sign.mockImplementation((data: any, accessTokenSecret : any, options : any) => {
            return `${data.email}${accessTokenSecret}${options.expiresIn}`;
        });
        const result = generateAccessToken("example@gmail.com");
        expect(sign).toHaveBeenCalledTimes(1);
        expect(sign).toHaveBeenCalledWith({email: "example@gmail.com"}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '24h'});
        expect(result).toEqual(`example@gmail.com${process.env.ACCESS_TOKEN_SECRET}24h`);
    });

    it('generate refresh token', async () => {
        const sign = jest.spyOn(jwt, 'sign');
        sign.mockImplementation((data: any, refreshTokenSecret : any) => {
            return `${data.email}${refreshTokenSecret}`;
        });
        const result = generateRefreshToken("example@gmail.com");
        expect(sign).toHaveBeenCalledTimes(1);
        expect(sign).toHaveBeenCalledWith({email: "example@gmail.com"}, process.env.REFRESH_TOKEN_SECRET);
        expect(result).toEqual(`example@gmail.com${process.env.REFRESH_TOKEN_SECRET}`);
    });
});
