import { useApiConnection } from "../../../hooks/useApiConnection";
import { CreatedMessage } from "../../../types";
import { throwServerError } from "../../../utils/errorHandlers";

const MessagingApi = () => {
    const { get, post, put, del} = useApiConnection();

    async function getMessagesBetween(id: number, recipientId: number) {
        try {
            return await get(`/message/${id}/${recipientId}`);
        } catch(error: unknown) {
            throwServerError(error);
        }
    }

    async function sendMessage(message: CreatedMessage) {
        try {
            return await post("/message/send", message);
        } catch(error: unknown) {
            throwServerError(error);
        }
    }

    async function editMessage(id: number, content: string) {
        try {
            return await put(`/message/edit/${id}`, {content});
        } catch(error: unknown) {
            throwServerError(error);
        }
    }

    async function deleteMessage(id: number) {
        try {
            return await del(`/message/delete/${id}`);
        } catch(error: unknown) {
            throwServerError(error);
        }
    }

    return { getMessagesBetween, sendMessage, editMessage, deleteMessage };
};

export default MessagingApi;
