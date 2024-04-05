import MessagingApi from "../api/messaging-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreatedMessage } from "../../../types";

export function useMessages(userId: number, recipientId: number) {
    const { getMessagesBetween } = MessagingApi();
    return useQuery({
        queryFn: () => getMessagesBetween(userId, recipientId),
        queryKey: ["message"],
    });
}

export function useMessageCreator() {
    const queryClient = useQueryClient();
    const { sendMessage } = MessagingApi();
    return useMutation({
        mutationFn: async (message: CreatedMessage) => sendMessage(message),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["message"]});
        }
    });
}

export function useMessageEditor() {
    const queryClient = useQueryClient();
    const { editMessage } = MessagingApi();
    return useMutation({
        mutationFn: async ({id, content}: {id: number, content: string}) => await editMessage(id, content),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["message"]});
        }
    });
}

export function useMessageRemover() {
    const queryClient = useQueryClient();
    const { deleteMessage } = MessagingApi();
    return useMutation({
        mutationFn: async (id: number) => await deleteMessage(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["message"]});
        }
    });
}
