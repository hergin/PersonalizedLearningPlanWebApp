import React, { PropsWithChildren } from "react";

interface MessageDisplayProps extends PropsWithChildren {
    username: string,
    isAuthor: boolean,
}

export default function MessageDisplay({username, isAuthor, children, ...other}: MessageDisplayProps) {
    const style = {
        backgroundColor: isAuthor ? "bg-cyan-500" : "bg-gray-400",
        itemAlignment: isAuthor ? "items-end" : "items-start",
    };
    
    return (
        <div 
            className={`flex flex-col my-4 ${style.itemAlignment} mx-5`}
            data-testid="display-container"
            {...other}
        >
            <p className="">{username}:</p>
            <div 
                className={`${style.backgroundColor} p-3 text-wrap w-1/3`}
                data-testid="content-container"
            >
                {children}
            </div>
        </div>
    );
}
