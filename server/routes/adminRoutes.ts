import { Router } from "express";
import { authenticateToken, authenticateRole } from "../middleware/authMiddleware";
import * as AdminProcessor from "../controller/processors/adminProcessor";

const adminRoutes = Router();
adminRoutes.get("/admin/account", authenticateToken, authenticateRole("admin"), AdminProcessor.getAllAccounts);
adminRoutes.get("/admin/account/:id", authenticateToken, authenticateRole("admin"), AdminProcessor.getAccount);
adminRoutes.post("/admin/account/:id/role", authenticateToken, authenticateRole("admin"), AdminProcessor.postAccountRole);

export default adminRoutes;
