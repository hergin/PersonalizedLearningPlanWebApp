import React from "react";

export const useHotKeys = () => {
    const handleEnterPress = (event : React.KeyboardEvent<HTMLInputElement>, action : () => void, submissionDisabled?: boolean) => {
        console.log(`Key detected: ${event.key}`);
        if(event.key === 'Enter' && !submissionDisabled) {
            action();
        }
    }

    return {handleEnterPress};
}
