import { AxiosError } from "axios";
import { useApiConnection } from "../../../hooks/useApiConnection";
import { Message } from "../../../types";

const MessagingApi = () => {
    const { get, post, put, del} = useApiConnection();

    async function getMessagesBetween(id: number, recipientId: number) {
        try {
            return await get(`/message/${id}/${recipientId}`);
        } catch(error: unknown) {
            console.error(error);
            alert(
                (error as AxiosError).message ? (error as AxiosError).message : error
            );
        }
    }

    async function sendMessage(message: Message) {
        try {
            return await post("/message/send", message);
        } catch(error: unknown) {
            console.error(error);
            alert(
                (error as AxiosError).message ? (error as AxiosError).message : error
            );
        }
    }

    async function editMessage(id: number, content: string) {
        try {
            return await put(`/message/edit/${id}`, {content});
        } catch(error: unknown) {
            console.error(error);
            alert(
                (error as AxiosError).message ? (error as AxiosError).message : error
            );
        }
    }

    async function deleteMessage(id: number) {
        try {
            return await del(`/message/delete/${id}`);
        } catch(error: unknown) {
            console.error(error);
            alert(
                (error as AxiosError).message ? (error as AxiosError).message : error
            );
        }
    }

    return { getMessagesBetween, sendMessage, editMessage, deleteMessage };
};

export default MessagingApi;
