import { Router } from "express";
import * as loginProcessor from "../controller/processors/loginProcessor";

const loginRoutes = Router();
loginRoutes.post('/login', loginProcessor.verifyLogin);
loginRoutes.post('/token', loginProcessor.verifyToken);
loginRoutes.post('/register', loginProcessor.registerAccount);
loginRoutes.post('/logout', loginProcessor.logoutUser);
loginRoutes.delete('/delete/:id', loginProcessor.deleteAccount);

export default loginRoutes;
