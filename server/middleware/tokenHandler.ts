import { join } from "path";
import dotenv from "dotenv";
import { sign } from "jsonwebtoken";
import { User } from "../types";
import EnvError from "../utils/envError";

dotenv.config({
    path: join(__dirname, ".env")
});

export function generateAccessToken(authProps: User): string {
    if(!process.env.ACCESS_TOKEN_SECRET) {
        throw new EnvError('ACCESS_TOKEN_SECRET', __dirname);
    }
    return sign(authProps, process.env.ACCESS_TOKEN_SECRET);
}

export function generateRefreshToken(authProps: User): string {
    if(!process.env.REFRESH_TOKEN_SECRET) {
        throw new EnvError('REFRESH_TOKEN_SECRET', __dirname);
    }
    return sign(authProps, process.env.REFRESH_TOKEN_SECRET);
}
