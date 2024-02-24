import TagApi from "../api/tagApi";
import { StatusCode } from "../../types";
import { initializeErrorMap } from "../../utils/errorMessages";
import { Request, Response} from "express";

const tagApi = new TagApi();
const ERROR_MESSAGES = initializeErrorMap();

async function getTags(req: Request, res: Response) {
    console.log(`Received in get tag: ${req.params.id}`);
    const tagQuery = await tagApi.getTags(Number(req.params.id));
    if(tagQuery as StatusCode in StatusCode) {
        console.log(`Something went wrong while parsing tags for account ${req.params.id}.`);
        res.status(tagQuery as StatusCode).send(ERROR_MESSAGES.get(tagQuery));
        return;
    }
    res.status(StatusCode.OK).json(tagQuery as any[]);
}

async function createTag(req: Request, res: Response) {
    console.log(`Received in add tag: ${req.body.accountId}`);
    const resultingStatusCode = await tagApi.addTag(Number(req.body.accountId), req.body.name, req.body.color);
    if(resultingStatusCode !== StatusCode.OK) {
        console.log(`Something went wrong while adding tag for account ${req.body.accountId}.`);
        res.status(resultingStatusCode).send(ERROR_MESSAGES.get(resultingStatusCode));
        return;
    }
    res.sendStatus(resultingStatusCode);
}

async function deleteTag(req: Request, res: Response) {
    console.log(`Received in delete tag: ${req.params.id}`);
    const resultingStatusCode = await tagApi.deleteTag(Number(req.params.id));
    if(resultingStatusCode !== StatusCode.OK) {
        console.log(`Something went wrong while deleting tag ${req.params.id}.`);
        res.status(resultingStatusCode).send(ERROR_MESSAGES.get(resultingStatusCode));
        return;
    }
    res.sendStatus(resultingStatusCode);
}

export {getTags, createTag, deleteTag};
