import { authenticateToken, authenticateRole, authenticatePermission } from "../authMiddleware";
import { verify, VerifyErrors, JsonWebTokenError } from "jsonwebtoken";
import { Response, Request } from "express";
import { StatusCode } from "../../types";
import { jwtDecode } from "jwt-decode";
import EnvError from "../../utils/envError";
import { resolve } from "path";

jest.mock("jsonwebtoken");
jest.mock("jwt-decode", () => ({
    jwtDecode: jest.fn(),
}));

const mockStatus = jest.fn();
const mockSend = jest.fn();
const mockSendStatus = jest.fn();
const mockResponse = {
    status: mockStatus.mockImplementation(() => { return mockResponse; }),
    send: mockSend.mockImplementation(() => { return mockResponse; }),
    sendStatus: mockSendStatus.mockImplementation(() => { return mockResponse; }),
} as any as Response;

const mockNext = jest.fn();
const mockAuthProps = {
    id: 1,
    role: "basic"
};

describe("Authentication Unit Tests", () => {
    var mockVerify: jest.Mock<any, any, any>;
    var mockJwtDecode: jest.Mock<any, any, any>;

    beforeEach(() => {
        jest.resetModules();
        mockVerify = verify as jest.Mock<any, any, any>;
        mockJwtDecode = jwtDecode as jest.Mock<any, any, any>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Authenticate Token (Missing env case)', () => {
        const mockRequest = {
            headers: {
                'authorization': 'Bearer 4206966'
            }
        } as any as Request;
        expect(() => authenticateToken(mockRequest, mockResponse, mockNext)).toThrow(
            new EnvError('ACCESS_TOKEN_SECRET', resolve("./middleware")));
        expect(mockSendStatus).toHaveBeenCalledTimes(1);
        expect(mockSendStatus).toHaveBeenCalledWith(StatusCode.INTERNAL_SERVER_ERROR);
        expect(mockNext).toHaveBeenCalledTimes(0);
        expect(mockVerify).toHaveBeenCalledTimes(0);
        expect(mockJwtDecode).toHaveBeenCalledTimes(0);
    });
    
    it('Authenticate Token (pass case)', async () => {
        const mockToken = '4206966';
        process.env.ACCESS_TOKEN_SECRET = 'super secret code';
        mockVerify.mockImplementation((token, secretOrPublicKey, options, callback) => {
            return (callback as (any : VerifyErrors | null) => void)(null);
        });
        mockJwtDecode.mockReturnValue(mockAuthProps);
        const mockRequest = {
            headers: {
                'authorization': `Bearer ${mockToken}`
            },
            body: {}
        } as any as Request;
        authenticateToken(mockRequest, mockResponse, mockNext);
        expect(mockVerify).toHaveBeenCalledTimes(1);
        expect(mockVerify).toHaveBeenCalledWith(mockToken, process.env.ACCESS_TOKEN_SECRET, undefined, expect.any(Function));
        expect(mockJwtDecode).toHaveBeenCalledTimes(1);
        expect(mockJwtDecode).toHaveBeenCalledWith(mockToken);
        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockStatus).toHaveBeenCalledTimes(0);
        expect(mockSend).toHaveBeenCalledTimes(0);
    });

    it('Authenticate Token (null case)', () => {
        process.env.ACCESS_TOKEN_SECRET = 'super secret code';
        const mockRequest = {
            headers: {}
        } as any as Request;
        authenticateToken(mockRequest, mockResponse, mockNext);
        expect(mockVerify).toHaveBeenCalledTimes(0);
        expect(mockJwtDecode).toHaveBeenCalledTimes(0);
        expect(mockStatus).toHaveBeenCalledTimes(1);
        expect(mockStatus).toHaveBeenCalledWith(StatusCode.UNAUTHORIZED);
        expect(mockSend).toHaveBeenCalledTimes(1);
        expect(mockSend).toHaveBeenCalledWith("Error: No access token provided in request.");
    });

    it('Authenticate Token (wrong token case)', () => {
        process.env.ACCESS_TOKEN_SECRET = 'super secret code';
        const wrongToken : string = 'this-is-a-wrong-token';
        mockVerify.mockImplementation((token, secretOrPublicKey, options, callback) => {
            return (callback as (any : VerifyErrors | null) => void)(new JsonWebTokenError("Wrong token..."));
        });
        const mockRequest = {
            headers: {
                'authorization': `Bearer: ${wrongToken}`,
            },
            body: {}
        } as any as Request;
        authenticateToken(mockRequest, mockResponse, mockNext);
        expect(mockJwtDecode).toHaveBeenCalledTimes(0);
        expect(mockNext).toHaveBeenCalledTimes(0);
        expect(mockVerify).toHaveBeenCalledTimes(1);
        expect(mockVerify).toHaveBeenCalledWith(wrongToken, process.env.ACCESS_TOKEN_SECRET, undefined, expect.any(Function));
        expect(mockStatus).toHaveBeenCalledTimes(1);
        expect(mockStatus).toHaveBeenCalledWith(StatusCode.FORBIDDEN);
        expect(mockSend).toHaveBeenCalledTimes(1);
        expect(mockSend).toHaveBeenCalledWith("Your token isn't valid!");
    });

    it("Authenticate Role (normal case)", () => {
        const callback = authenticateRole("admin");
        const mockRequest = {
            body: {
                role: "admin",
            }
        } as any as Request;
        callback(mockRequest, mockResponse, mockNext);
        expect(mockSendStatus).toHaveBeenCalledTimes(0);
        expect(mockStatus).toHaveBeenCalledTimes(0);
        expect(mockSend).toHaveBeenCalledTimes(0);
        expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it("Authenticate Role (wrong role case)", () => {
        const callback = authenticateRole("admin");
        const mockRequest = {
            body: {
                role: "basic",
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

    it("Authenticate Permission (normal case)", () => {
        const mockPermission = jest.fn().mockReturnValue(true);
        const mockRequest = {
            body: {
                role: "basic",
            }
        } as any as Request;
        const callback = authenticatePermission({}, mockPermission);
        callback(mockRequest, mockResponse, mockNext);
        expect(mockSendStatus).toHaveBeenCalledTimes(0);
        expect(mockStatus).toHaveBeenCalledTimes(0);
        expect(mockSend).toHaveBeenCalledTimes(0);
        expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it("Authenticate Permission (no permission case)", () => {
        const mockPermission = jest.fn().mockReturnValue(false);
        const mockRequest = {
            body: {
                role: "basic",
            }
        } as any as Request;
        const callback = authenticatePermission({}, mockPermission);
        callback(mockRequest, mockResponse, mockNext);
        expect(mockSendStatus).toHaveBeenCalledTimes(0);
        expect(mockNext).toHaveBeenCalledTimes(0);
        expect(mockStatus).toHaveBeenCalledTimes(1);
        expect(mockStatus).toHaveBeenCalledWith(StatusCode.UNAUTHORIZED);
        expect(mockSend).toHaveBeenCalledTimes(1);
        expect(mockSend).toHaveBeenCalledWith("You aren't authorized to be here.");
    });
});
