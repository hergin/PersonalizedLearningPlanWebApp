import { Router } from "express";
import { authenticateToken, authenticateRole } from "../middleware/authMiddleware";
import * as AdminProcessor from "../controller/processors/adminProcessor";

const adminRoutes = Router();
adminRoutes.get("/account", authenticateToken, authenticateRole("admin"), AdminProcessor.getAllAccounts);
adminRoutes.get("/account/:id", authenticateToken, authenticateRole("admin"), AdminProcessor.getAccount);
adminRoutes.put("/account/:id/role", authenticateToken, authenticateRole("admin"), AdminProcessor.postAccountRole);

export default adminRoutes;
