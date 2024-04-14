import { Router } from "express";
import { authenticateToken } from '../middleware/authMiddleware';
import * as GoalProcessor from "../controller/processors/goalProcessor";

const goalRoutes = Router();
goalRoutes.get("/get/module/:id", authenticateToken, GoalProcessor.getModuleGoals);
goalRoutes.post("/add/:id?", authenticateToken, GoalProcessor.postGoal);
goalRoutes.put("/update/:id", authenticateToken, GoalProcessor.putGoal);
goalRoutes.put('/update/feedback/:id', authenticateToken, GoalProcessor.putGoalFeedback);
goalRoutes.delete("/delete/:id", authenticateToken, GoalProcessor.deleteGoal);
goalRoutes.get("/get/:id/:variable", authenticateToken, GoalProcessor.getGoalVariable);

export default goalRoutes;
