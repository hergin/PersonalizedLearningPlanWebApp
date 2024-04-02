import { generateAccessToken, generateRefreshToken } from '../tokenGenerator';
import { sign } from "jsonwebtoken";

jest.mock("dotenv");

describe('authenticate token tests', () => {
    var mockSign : jest.Mock<any, any, any>;

    beforeEach(() => {
        jest.resetModules();
        mockSign = sign as jest.Mock<any, any, any>;
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('generate access token (missing variable case)', async () => {
        expect(() => generateAccessToken("example@gmail.com")).toThrow(new Error("Environment variable access token secret not found."));
        expect(mockSign).toHaveBeenCalledTimes(0);
    });

    it('generate access token (normal case)', async () => {
        process.env.ACCESS_TOKEN_SECRET = 'super secret code';
        mockSign.mockImplementation((data: any, accessTokenSecret : any, options : any) => {
            return `${data.email}${accessTokenSecret}${options.expiresIn}`;
        });
        const result = generateAccessToken("example@gmail.com");
        expect(mockSign).toHaveBeenCalledTimes(1);
        expect(mockSign).toHaveBeenCalledWith({email: "example@gmail.com"}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '24h'});
        expect(result).toEqual(`example@gmail.com${process.env.ACCESS_TOKEN_SECRET}24h`);
    });

    it('generate refresh token (missing variable case)', async () => {
        expect(() => generateRefreshToken("example@gmail.com")).toThrow(new Error("Environment variable refresh token secret not found."));
        expect(mockSign).toHaveBeenCalledTimes(0);
    });

    it('generate refresh token', async () => {
        process.env.REFRESH_TOKEN_SECRET = 'another super secret code';
        mockSign.mockImplementation((data: any, refreshTokenSecret : any) => {
            return `${data.email}${refreshTokenSecret}`;
        });
        const result = generateRefreshToken("example@gmail.com");
        expect(sign).toHaveBeenCalledTimes(1);
        expect(sign).toHaveBeenCalledWith({email: "example@gmail.com"}, process.env.REFRESH_TOKEN_SECRET);
        expect(result).toEqual(`example@gmail.com${process.env.REFRESH_TOKEN_SECRET}`);
    });
});
