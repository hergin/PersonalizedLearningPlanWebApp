import { Router } from "express";
import { authenticateToken } from "../utils/token";
import * as EmailServiceProcessor from "../controller/processors/emailServiceProcessor";

const emailServiceRoutes = Router();
emailServiceRoutes.post("/request/:id", authenticateToken, EmailServiceProcessor.postCoachRequest);

export default emailServiceRoutes;