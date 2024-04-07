import React from "react";

interface MessageDisplayProps {
    username: string,
    content: string,
    isAuthor: boolean,
}

export default function MessageDisplay({username, content, isAuthor}: MessageDisplayProps) {
    const style = {
        backgroundColor: isAuthor ? "bg-cyan-500" : "bg-gray-400",
        itemAlignment: isAuthor ? "items-end" : "items-start",
    };
    
    return (
        <div 
            className={`flex flex-col my-4 ${style.itemAlignment} mx-5`}
            data-testid="display-container"
        >
            <p className="">{username}:</p>
            <div 
                className={`${style.backgroundColor} p-3 text-wrap w-1/3`}
                data-testid="content-container"
            >
                <p>{content}</p>
            </div>
        </div>
    );
}
