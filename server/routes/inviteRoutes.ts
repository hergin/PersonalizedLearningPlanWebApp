import { Router } from "express";
import { authenticateToken } from "../authentication/tokenAuth";
import * as InvitationProcessor from "../controller/processors/invitationProcessor";

const inviteRoutes = Router();
inviteRoutes.get("/:id", authenticateToken, InvitationProcessor.getInvites);
inviteRoutes.get("/pending/:id", authenticateToken, InvitationProcessor.getPendingInvites);
inviteRoutes.post("/create", authenticateToken, InvitationProcessor.postInvite);
inviteRoutes.post("/accept/:id", authenticateToken, InvitationProcessor.acceptInvite);
inviteRoutes.post("/reject/:id", authenticateToken, InvitationProcessor.rejectInvite);

export default inviteRoutes;
