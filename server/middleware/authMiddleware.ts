import { join } from "path";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { verify, VerifyErrors } from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import { StatusCode, Role, User } from "../types";
import EnvError from "../utils/envError";

dotenv.config({ 
    path: join(__dirname, ".env") 
});

const unauthorizedMessage: string = "You aren't authorized to be here.";

export function authenticateToken(req : Request, res : Response, next : NextFunction) {
    const tokenSecret = process.env.ACCESS_TOKEN_SECRET;
    if(!tokenSecret) {
        res.sendStatus(StatusCode.INTERNAL_SERVER_ERROR);
        throw new EnvError("ACCESS_TOKEN_SECRET", __dirname);
    }
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(!token) {
        return res.status(StatusCode.UNAUTHORIZED).send("Error: No access token provided in request.");
    }
    verify(token, tokenSecret, undefined, (error: VerifyErrors | null) => {
        if(error) { 
            console.error(error);
            return res.status(StatusCode.FORBIDDEN).send("Your token isn't valid!");
        }
        decodeToken(token, req);
        next();
    });
}

function decodeToken(token: string, req: Request): void {
    const payload: User = jwtDecode<User>(token);
    req.body.role = payload.role;
    req.body.userId = payload.id;
}

export function authenticateRole(role : Role) {
    return (req: Request, res: Response, next: NextFunction) => {
        if(req.body.role !== role) {
            return res.status(StatusCode.UNAUTHORIZED).send(unauthorizedMessage)
        }
        next();
    };
}
