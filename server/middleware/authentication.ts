import { Request, Response, NextFunction } from "express";
import { verify, VerifyErrors } from "jsonwebtoken";
import { StatusCode, Role } from "../types";
import dotenv from "dotenv";

dotenv.config({ path: "../utils/.env" });

export function authenticateToken(req : Request, res : Response, next : NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) {
        console.error("Token was null!");
        return res.sendStatus(StatusCode.UNAUTHORIZED);
    }    
    verify(token, process.env.ACCESS_TOKEN_SECRET!, undefined, (err : VerifyErrors | null) => {
        if(err) {
            console.error("Your token isn't valid.", err);
            return res.sendStatus(StatusCode.FORBIDDEN);
        }
        next();
    });
}

export function authenticateRole(role : Role) {
    return (req: Request, res: Response, next: NextFunction) => {
        if(req.body.role !== role) {
            return res.status(StatusCode.UNAUTHORIZED).send("You aren't authorized to be here.");
        }
        next();
    }
}
