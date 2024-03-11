import { Router } from "express";
import { authenticateToken } from "../utils/token";
import * as TagProcessor from "../controller/processors/tagProcessor";

const tagRoute = Router();
tagRoute.get("/get/:id", authenticateToken, TagProcessor.getTags);
tagRoute.post("/add", authenticateToken, TagProcessor.createTag);
tagRoute.delete("/delete/:id", authenticateToken, TagProcessor.deleteTag);

export default tagRoute;
