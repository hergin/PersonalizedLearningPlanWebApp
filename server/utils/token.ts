import { Request, Response, NextFunction } from "express";
import { join } from "path";
import dotenv from "dotenv";
import { verify, sign, VerifyErrors, Jwt, JwtPayload } from "jsonwebtoken";
import { StatusCode } from "../types";

dotenv.config({
    path: join(__dirname, ".env")
});

export function authenticateToken(req : Request, res : Response, next : NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) {
        console.log("Token was null!");
        return res.sendStatus(StatusCode.UNAUTHORIZED);
    }    
    verify(token, process.env.ACCESS_TOKEN_SECRET!, undefined, 
        <T = Jwt | JwtPayload | string>(err : VerifyErrors | null, decoded : T | undefined) => {
        if(err) {
            console.error("An error has occurred authenticating token!", err);    
            return res.sendStatus(StatusCode.FORBIDDEN);
        }
        console.log(`${decoded}`);
        next();
    });
}

export const generateAccessToken = function(email : string) {
    return sign({email}, process.env.ACCESS_TOKEN_SECRET!, {expiresIn: '24h'});
}

export const generateRefreshToken = function(email : string) {
    return sign({email}, process.env.REFRESH_TOKEN_SECRET!);
}
