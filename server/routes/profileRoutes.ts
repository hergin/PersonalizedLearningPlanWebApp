import { Router } from "express";
import { authenticateToken } from '../middleware/authMiddleware';
import * as ProfileProcessor from "../controller/processors/profileProcessor";

const profileRoutes = Router();
profileRoutes.get('/get', authenticateToken, ProfileProcessor.getAllProfiles);
profileRoutes.get('/get/:id', authenticateToken, ProfileProcessor.sendProfile);
profileRoutes.post('/create', ProfileProcessor.postProfile);
profileRoutes.put('/edit/:id', authenticateToken, ProfileProcessor.putProfile);
profileRoutes.delete('/delete/:id', authenticateToken, ProfileProcessor.deleteProfile);

export default profileRoutes;
