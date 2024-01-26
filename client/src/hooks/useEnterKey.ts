export const useEnterKey = () => {
    const handleKeyPress = (event : any, action : () => void) => {
        console.log(`Key detected: ${event.key}`);
        if(event.key === 'Enter') {
            action();
        }
    }

    return {handleKeyPress};
}
