import { join } from "path";
import dotenv from "dotenv";
import { sign } from "jsonwebtoken";
import { AuthProps } from "../types";

dotenv.config({
    path: join(__dirname, ".env")
});

export function generateAccessToken(authProps: AuthProps): string {
    if(!process.env.ACCESS_TOKEN_SECRET) {
        throw new Error(".env value 'ACCESS_TOKEN_SECRET' not found.");
    }
    return sign(authProps, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '24h'});
}

export function generateRefreshToken(authProps: AuthProps): string {
    if(!process.env.REFRESH_TOKEN_SECRET) {
        throw new Error(".env value 'REFRESH_TOKEN_SECRET' not found.");
    }
    return sign(authProps, process.env.REFRESH_TOKEN_SECRET);
}
