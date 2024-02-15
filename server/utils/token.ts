import { join } from "path";
require("dotenv").config({
    path: join(__dirname, ".env")
});
import { verify, sign } from "jsonwebtoken";
import { StatusCode } from "../types";

export function authenticateToken(req : any, res : any, next : any) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) {
        console.log("Token was null!");
        return res.sendStatus(StatusCode.UNAUTHORIZED);
    }    
    verify(token, process.env.ACCESS_TOKEN_SECRET!, (err : any, user : any) => {
        if(err) {
            console.error("An error has occurred authenticating token!", err);    
            return res.sendStatus(StatusCode.FORBIDDEN);
        }
        req.user = user;
        next();
    });
}

export const generateAccessToken = function(email : string) {
    return sign({email}, process.env.ACCESS_TOKEN_SECRET!, {expiresIn: '24h'});
}

export const generateRefreshToken = function(email : string) {
    return sign({email}, process.env.REFRESH_TOKEN_SECRET!);
}
