import { Router, Response, Request } from "express";
import { authenticateToken } from "../utils/token";
import { StatusCode } from "../types";
import { initializeErrorMap } from "../utils/errorMessages";
import TagApi from "../controller/api/tagApi";

const tagRoute = Router();
const errorMessageMap = initializeErrorMap();
const tagApi = new TagApi();

tagRoute.get("/get/:id", authenticateToken, async (req: Request, res: Response) => {
    console.log(`Received in get tag: ${req.params.id}`);
    const tagQuery = await tagApi.getTags(Number(req.params.id));
    if(tagQuery as StatusCode in StatusCode) {
        console.log(`Something went wrong while parsing tags for account ${req.params.id}.`);
        res.status(tagQuery as StatusCode).json(errorMessageMap.get(tagQuery));
        return;
    }
    res.status(StatusCode.OK).json(tagQuery as any[]);
});

tagRoute.post("/add", async (req: Request, res: Response) => {
    console.log(`Received in add tag: ${req.body.accountId}`);
    const resultingStatusCode = await tagApi.addTag(Number(req.body.accountId), req.body.name, req.body.color);
    if(resultingStatusCode !== StatusCode.OK) {
        console.log(`Something went wrong while adding tag for account ${req.body.accountId}.`);
        res.status(resultingStatusCode).json(errorMessageMap.get(resultingStatusCode));
        return;
    }
    res.sendStatus(resultingStatusCode);
});

tagRoute.delete("/delete/:id", async (req: Request, res: Response) => {
    console.log(`Received in delete tag: ${req.params.id}`);
    const resultingStatusCode = await tagApi.deleteTag(Number(req.params.id));
    if(resultingStatusCode !== StatusCode.OK) {
        console.log(`Something went wrong while deleting tag ${req.params.id}.`);
        res.status(resultingStatusCode).json(errorMessageMap.get(resultingStatusCode));
        return;
    }
    res.sendStatus(resultingStatusCode);
});

export default tagRoute;
