import React, { useState } from "react";
import { useMessageCreator } from "../hooks/useMessages";
import { useHotKeys } from "../../../hooks/useHotKeys";
import { TextField, Button } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';

interface MessageInputProps {
    recipientId: number;
    userId: number;
}

export default function MessageInput({userId, recipientId}: MessageInputProps) {
    const [content, setContent] = useState<string>("");
    const { mutateAsync: sendMessage } = useMessageCreator();
    const { handleEnterPress } = useHotKeys();

    return (
        <div className="flex flex-row w-full justify-center align-bottom">
            <TextField
                value={content} 
                label="Message" 
                variant="outlined"
                onChange={(event) => {
                    setContent(event.target.value)
                }}
                onKeyUp={(event: React.KeyboardEvent) => {
                    handleEnterPress(event, async () => {
                        await sendMessage({
                            content: content,
                            sender_id: userId,
                            recipient_id: recipientId
                        });
                        setContent("");
                    });
                }}
                className="w-10/12"
            />
            <Button 
                variant="contained" 
                endIcon={<SendIcon />} 
                onClick={async () => {
                    await sendMessage({
                        content: content,
                        sender_id: userId,
                        recipient_id: recipientId
                    });
                    setContent("");
                }}
            >
                Send
            </Button>
        </div>
    );
}
