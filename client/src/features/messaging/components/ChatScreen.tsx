import React, { ReactElement, useMemo } from "react";
import MessageInput from "./MessageInput";
import MessageDisplay from "./MessageDisplay";
import { useAuth } from "../../../context/AuthContext";
import { useMessages } from "../hooks/useMessages";
import { Message } from "../../../types";
import { useParams } from "react-router-dom";

export default function ChatScreen() {
    const { user } = useAuth();
    const { id: recipientId } = useParams();
    const { data, isLoading, error } = useMessages(user.id, Number(recipientId));

    const messageElements = useMemo<ReactElement[]>(() => {
        const elements: ReactElement[] = [];
        if(!isLoading && !error) {
            let messages: Message[] = [];
            messages = messages.concat(data.sentMessages);
            messages = messages.concat(data.receivedMessages);
            messages.sort((msg1, msg2) => {
                return Date.parse(msg1.date) - Date.parse(msg2.date);
            });
            messages.forEach(message => {
                elements.push(
                    <MessageDisplay
                        key={message.id}
                        username={message.username}
                        isAuthor={user.id === message.sender_id}
                    >
                        {message.content}
                    </MessageDisplay>
                );
            });
        }
        return elements;
    }, [data, user.id, isLoading, error]  );
    
    if(isLoading) {
        return (<div>Loading, please wait...</div>);
    }

    if(error) {
        return (<div>An error occurred! Please try again!</div>);
    }

    return (
        <div className="flex flex-col my-5 px-5 gap-5">
            <div className="overflow-y-auto w-11/12 h-[545px] self-center bg-[#F1F1F1]">
                {messageElements}
            </div>
            <div>
                <MessageInput userId={user.id} recipientId={Number(recipientId)} />
            </div>
        </div>
    );
}