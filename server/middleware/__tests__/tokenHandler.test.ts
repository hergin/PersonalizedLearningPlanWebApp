import { generateAccessToken, generateRefreshToken } from '../tokenHandler';
import { sign } from "jsonwebtoken";
import { AuthProps } from '../../types';

jest.mock("dotenv");

const mockAuthProps: AuthProps = {
    id: 1,
    role: "basic"
};
const mockToken = "token";

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
        
        expect(() => generateAccessToken(mockAuthProps)).toThrow(new Error(".env value 'ACCESS_TOKEN_SECRET' not found."));
        expect(mockSign).toHaveBeenCalledTimes(0);
    });

    it('generate access token (normal case)', async () => {
        process.env.ACCESS_TOKEN_SECRET = 'super secret code';
        mockSign.mockReturnValue(mockToken);
        const result = generateAccessToken(mockAuthProps);
        expect(mockSign).toHaveBeenCalledTimes(1);
        expect(mockSign).toHaveBeenCalledWith(mockAuthProps, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '24h'});
        expect(result).toEqual(mockToken);
    });

    it('generate refresh token (missing variable case)', async () => {
        expect(() => generateRefreshToken(mockAuthProps)).toThrow(new Error(".env value 'REFRESH_TOKEN_SECRET' not found."));
        expect(mockSign).toHaveBeenCalledTimes(0);
    });

    it('generate refresh token (normal case)', async () => {
        process.env.REFRESH_TOKEN_SECRET = 'another super secret code';
        mockSign.mockReturnValue(mockToken);
        const result = generateRefreshToken(mockAuthProps);
        expect(sign).toHaveBeenCalledTimes(1);
        expect(sign).toHaveBeenCalledWith(mockAuthProps, process.env.REFRESH_TOKEN_SECRET);
        expect(result).toEqual(mockToken);
    });
});
