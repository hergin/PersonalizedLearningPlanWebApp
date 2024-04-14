import MessageApi from "../api/messageApi";
import { getLoginError } from "../../utils/errorHandlers";
import { Request, Response } from "express";
import { STATUS_CODE } from "../../types";
import { Server } from "socket.io";
import { isStatusCode } from "../../utils/typePredicates";

const messageApi = new MessageApi();

export async function getAllSentMessages(req: Request, res: Response) {
    console.log(`Id received in get all sent messages: ${req.params.id}`);
    const query = await messageApi.getAllSentMessages(Number(req.params.id));
    if(isStatusCode(query)) {
        console.log(`Failed to get all sent messages for user with account id ${req.params.id}`);
        res.status(query).send(getLoginError(query));
        return;
    }
    res.status(STATUS_CODE.OK).json(query);
}

export async function getMessagesBetween(req: Request, res: Response) {
    console.log(`Data received in getMessagesBetween: ${req.params.id} ${req.params.receivedId}`);
    const query = await messageApi.getChatMessages(Number(req.params.id), Number(req.params.receivedId));
    if(isStatusCode(query)) {
        console.log(`Failed to get messages between users ${req.params.id} ${req.params.recipientId}!`);
        res.status(query).send(getLoginError(query));
        return;
    }
    res.status(STATUS_CODE.OK).json(query);
}

export async function postMessage(req: Request, res: Response) {
    console.log(`Data received in post message: ${req.body.sender_id} ${req.body.recipient_id}`);
    const query = await messageApi.sendMessage({
        content: req.body.content,
        senderId: req.body.sender_id,
        recipientId: req.body.recipient_id
    });
    if(query !== STATUS_CODE.OK) {
        console.log(`Failed to post message with content "${req.body.content}"!`);
        res.status(query).send(getLoginError(query));
        return;
    }
    res.sendStatus(STATUS_CODE.OK);
    const io = req.app.get("io") as Server;
    io.emit("send-message", {recipientId: req.body.recipientId});
}

export async function putMessage(req: Request, res: Response) {
    console.log(`Data received in put message: ${req.params.id} ${JSON.stringify(req.body)}`);
    const query = await messageApi.editMessage(Number(req.params.id), req.body.content);
    if(query !== STATUS_CODE.OK) {
        console.log(`Failed to edit message with id ${req.params.id}`);
        res.status(query).send(getLoginError(query));
        return;
    }
    res.sendStatus(STATUS_CODE.OK);
}

export async function deleteMessage(req: Request, res: Response) {
    console.log(`Id received in delete message: ${req.params.id}`);
    const query = await messageApi.deleteMessage(Number(req.params.id));
    if(query !== STATUS_CODE.OK) {
        console.log(`Failed to delete message with id ${req.params.id}!`);
        res.status(query).send(getLoginError(query));
        return;
    }
    res.sendStatus(STATUS_CODE.OK);
}
