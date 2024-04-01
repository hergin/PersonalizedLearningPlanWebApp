import { authenticateToken, authenticateRole } from "../authentication";
import { verify, VerifyErrors, Jwt, JwtPayload, JsonWebTokenError } from "jsonwebtoken";
import { Response, Request } from "express";
import { Role, StatusCode } from "../../types";
import dotenv from "dotenv";

// These unit tests shouldn't depend on this, but for now, they do.
dotenv.config({ path: "../../utils/.env" });

const mockNext = jest.fn();
const mockSendStatus = jest.fn();
const mockStatus = jest.fn();
const mockSend = jest.fn();
const mockResponse = {
    status: mockStatus.mockImplementation(() => { return mockResponse; }),
    send: mockSend.mockImplementation(() => { return mockResponse; }),
    sendStatus: mockSendStatus.mockImplementation(() => { return mockResponse; }),
} as any as Response;

describe("Authentication Unit Tests", () => {
    var mockVerify: jest.Mock<any, any, any>;

    beforeEach(() => {
        mockVerify = verify as jest.Mock<any, any, any>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    
    it('Authenticate Token (pass case)', async () => {
        mockVerify.mockImplementation((token, secretOrPublicKey, options, callback) => {
            return (callback as (any : VerifyErrors | null, result : Jwt | JwtPayload | string | null) => void)(null, {verified: 'true'});
        });
        const mockRequest = {
            headers: {
                'authorization': 'Bearer 4206966'
            }
        } as any as Request;
        authenticateToken(mockRequest, mockResponse, mockNext);
        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockSendStatus).toHaveBeenCalledTimes(0);
    });

    it('Authenticate Token (null case)', () => {
        const mockRequest = {
            headers: {}
        } as any as Request;
        authenticateToken(mockRequest, mockResponse, mockNext);
        expect(mockSendStatus).toHaveBeenCalledTimes(1);
        expect(mockSendStatus).toHaveBeenCalledWith(StatusCode.UNAUTHORIZED);
    });

    it('Authenticate Token (wrong token case)', () => {
        const wrongToken : string = 'Bearer this is a wrong token';
        mockVerify.mockImplementation((token, secretOrPublicKey, options, callback) => {
            return (callback as (any : VerifyErrors | null, result : Jwt | JwtPayload | string | null) => void)(new JsonWebTokenError("Wrong token..."), null);
        });
        const mockRequest = {
            headers: {
                'authorization': wrongToken,
            }
        } as any as Request;
        authenticateToken(mockRequest, mockResponse, mockNext);
        expect(mockVerify).toHaveBeenCalledTimes(1);
        expect(mockVerify).toHaveBeenCalledWith(wrongToken, process.env.ACCESS_TOKEN_SECRET!, undefined);
        expect(mockSendStatus).toHaveBeenCalledTimes(1);
        expect(mockSendStatus).toHaveBeenCalledWith(StatusCode.FORBIDDEN);
        expect(mockNext).toHaveBeenCalledTimes(0);
    });

    it("Authenticate Role (normal case)", () => {
        const callback = authenticateRole(Role.ADMIN);
        const mockRequest = {
            body: {
                role: Role.ADMIN,
            }
        } as any as Request;
        callback(mockRequest, mockResponse, mockNext);
        expect(mockSendStatus).toHaveBeenCalledTimes(0);
        expect(mockStatus).toHaveBeenCalledTimes(0);
        expect(mockSend).toHaveBeenCalledTimes(0);
        expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it("Authenticate Role (normal case)", () => {
        const callback = authenticateRole(Role.ADMIN);
        const mockRequest = {
            body: {
                role: Role.BASIC,
            }
        } as any as Request;
        callback(mockRequest, mockResponse, mockNext);
        expect(mockSendStatus).toHaveBeenCalledTimes(0);
        expect(mockNext).toHaveBeenCalledTimes(0);
        expect(mockStatus).toHaveBeenCalledTimes(1);
        expect(mockStatus).toHaveBeenCalledWith(StatusCode.UNAUTHORIZED);
        expect(mockSend).toHaveBeenCalledTimes(1);
        expect(mockSend).toHaveBeenCalledWith("You aren't authorized to be here.");
    });
});


