import path from "path";
import dotenv from "dotenv";
import { generateAccessToken, generateRefreshToken } from '../tokenGenerator';
import { sign } from "jsonwebtoken";

dotenv.config({
    path: path.join("../../utils/", ".env"),
});

describe('authenticate token tests', () => {
    var mockSign : jest.Mock<any, any, any>;

    beforeEach(() => {
        mockSign = sign as jest.Mock<any, any, any>;
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('generate access token', async () => {
        mockSign.mockImplementation((data: any, accessTokenSecret : any, options : any) => {
            return `${data.email}${accessTokenSecret}${options.expiresIn}`;
        });
        const result = generateAccessToken("example@gmail.com");
        expect(sign).toHaveBeenCalledTimes(1);
        expect(sign).toHaveBeenCalledWith({email: "example@gmail.com"}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '24h'});
        expect(result).toEqual(`example@gmail.com${process.env.ACCESS_TOKEN_SECRET}24h`);
    });

    it('generate refresh token', async () => {
        mockSign.mockImplementation((data: any, refreshTokenSecret : any) => {
            return `${data.email}${refreshTokenSecret}`;
        });
        const result = generateRefreshToken("example@gmail.com");
        expect(sign).toHaveBeenCalledTimes(1);
        expect(sign).toHaveBeenCalledWith({email: "example@gmail.com"}, process.env.REFRESH_TOKEN_SECRET);
        expect(result).toEqual(`example@gmail.com${process.env.REFRESH_TOKEN_SECRET}`);
    });
});
