import { Router } from "express";
import { authenticateToken } from '../middleware/authMiddleware';
import * as ModuleProcessor from "../controller/processors/moduleProcessor";

const moduleRoutes = Router();
moduleRoutes.get('/get/:id', authenticateToken, ModuleProcessor.getAccountModules);
moduleRoutes.post('/add', authenticateToken, ModuleProcessor.postModule);
moduleRoutes.put('/edit/:id', authenticateToken, ModuleProcessor.putModule);
moduleRoutes.delete('/delete/:id', authenticateToken, ModuleProcessor.deleteModule);
moduleRoutes.get('/get/:id/:variable', authenticateToken, ModuleProcessor.getModuleVariable);

export default moduleRoutes;
