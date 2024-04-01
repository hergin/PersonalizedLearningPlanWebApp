import { join } from "path";
import dotenv from "dotenv";
import { sign } from "jsonwebtoken";

dotenv.config({
    path: join(__dirname, ".env")
});

export function generateAccessToken(email : string): string {
    return sign({email}, process.env.ACCESS_TOKEN_SECRET!, {expiresIn: '24h'});
}

export function generateRefreshToken(email : string): string {
    return sign({email}, process.env.REFRESH_TOKEN_SECRET!);
}
