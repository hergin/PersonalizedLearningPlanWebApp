import { Router } from "express";
import * as MessageProcessor from "../controller/processors/messageProcessor";
import { authenticateToken } from "../authentication/tokenAuth";

const messageRoutes = Router();
messageRoutes.get("/:id", authenticateToken, MessageProcessor.getAllSentMessages);
messageRoutes.get("/:id/:receivedId", authenticateToken, MessageProcessor.getMessagesBetween);
messageRoutes.post("/send", authenticateToken, MessageProcessor.postMessage);
messageRoutes.put("/edit/:id", authenticateToken, MessageProcessor.putMessage);
messageRoutes.delete("/delete", authenticateToken, MessageProcessor.deleteMessage);

export default messageRoutes;
