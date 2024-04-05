import React, { ReactElement, useMemo } from "react";
import MessageInput from "./MessageInput";
import MessageDisplay from "./MessageDisplay";
import { useAuth } from "../../../context/AuthContext";
import { useMessages } from "../hooks/useMessages";
import { Message } from "../../../types";
import { useParams } from "react-router-dom";

export default function Chat() {
    const { user } = useAuth();
    const { id: recipientId } = useParams();
    const { data, isLoading, isError } = useMessages(user.id, Number(recipientId));

    const messageElements = useMemo<ReactElement[]>(() => {
        const elements: ReactElement[] = [];
        if(!isLoading && !isError) {
            let messages: Message[] = [];
            messages = messages.concat(data.sentMessages);
            messages = messages.concat(data.receivedMessages);
            messages.sort((msg1, msg2) => {
                return Date.parse(msg1.date) - Date.parse(msg2.date);
            });
            messages.forEach(message => {
                console.log(`User Id: ${user.id}`);
                console.log(`message Sender Id: ${message.sender_id}`);
                elements.push(
                    <MessageDisplay
                        key={message.id}
                        username={message.username}
                        content={message.content}
                        isAuthor={user.id === message.sender_id}
                    />
                );
            });
        }
        return elements;
    }, [data, user.id, isLoading, isError]  );
    
    if(isLoading) {
        return (<div>Loading, please wait...</div>);
    }

    if(isError) {
        return (<div>An error occurred! Please try again!</div>);
    }

    return (
        <div className="flex flex-col size-full p-5 gap-5">
            <div className="overflow-y-auto w-11/12 min-h-96 mt-5 self-center">
                {messageElements}
            </div>
            <div>
                <MessageInput userId={user.id} recipientId={Number(recipientId)} />
            </div>
        </div>
    );
}
