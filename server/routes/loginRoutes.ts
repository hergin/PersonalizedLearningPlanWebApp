import { Router } from "express";
import * as loginProcessor from "../controller/processors/loginProcessor";
import { authenticateToken } from '../middleware/authentication';

const loginRoutes = Router();
loginRoutes.post('/login', loginProcessor.verifyLogin);
loginRoutes.post('/token', loginProcessor.verifyToken);
loginRoutes.post('/register', loginProcessor.registerAccount);
loginRoutes.post('/logout', loginProcessor.logoutUser);
loginRoutes.delete('/delete/:id', loginProcessor.deleteAccount);
loginRoutes.get('/understudy/:id', authenticateToken, loginProcessor.getUnderstudies);

export default loginRoutes;
