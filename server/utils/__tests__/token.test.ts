export {};
import path from "path";
require("dotenv").config({
    path: path.join("../../utils/", ".env"),
});
import { authenticateToken, generateAccessToken, generateRefreshToken } from '../token';
import jwt, { VerifyErrors, Jwt, JwtPayload, JsonWebTokenError } from "jsonwebtoken";
import { StatusCode } from "../../types";
import { Request, Response } from "express";

describe('authenticate token tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('authenticateToken pass case', () => {
        const verify = jest.spyOn(jwt, 'verify');
        verify.mockImplementation((token, secretOrPublicKey, options, callback) => {
            return (callback as (any : VerifyErrors | null, result : Jwt | JwtPayload | string | null) => void)(null, {verified: 'true'});
        });
        const next = jest.fn();
        const sendStatus = jest.fn();
        const mockRequest = {
            headers: {
                'authorization': 'Bearer 4206966'
            }
        } as any as Request;
        const mockResponse = {
            sendStatus: sendStatus
        } as any as Response;
        authenticateToken(mockRequest, mockResponse, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(sendStatus).toHaveBeenCalledTimes(0);
    });

    it('authenticateToken null case', () => {
        const next = jest.fn();
        const sendStatus = jest.fn();
        const mockRequest = {
            headers: {}
        } as any as Request;
        const mockResponse = {
            sendStatus: sendStatus
        } as any as Response;
        authenticateToken(mockRequest, mockResponse, next);
        expect(sendStatus).toHaveBeenCalledTimes(1);
        expect(sendStatus).toHaveBeenCalledWith(StatusCode.UNAUTHORIZED);
    });

    it('authenticateToken wrong token case', () => {
        const verify = jest.spyOn(jwt, 'verify');
        verify.mockImplementation((token, secretOrPublicKey, options, callback) => {
            return (callback as (any : VerifyErrors | null, result : Jwt | JwtPayload | string | null) => void)(new JsonWebTokenError("Wrong token..."), null);
        });
        const sendStatus = jest.fn();
        const next = jest.fn();
        const mockRequest = {
            headers: {
                'authorization': 'Bearer this is a wrong token'
            }
        } as any as Request;
        const mockResponse = {
            sendStatus: sendStatus
        } as any as Response;
        authenticateToken(mockRequest, mockResponse, next);
        expect(sendStatus).toHaveBeenCalledTimes(1);
        expect(sendStatus).toHaveBeenCalledWith(StatusCode.FORBIDDEN);
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
