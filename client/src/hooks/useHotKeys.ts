export const useHotKeys = () => {
  const handleEnterPress = (
    event: any,
    action: () => void,
    submissionDisabled?: boolean
  ) => {
    `Key detected: ${event.key}`;
    if (event.key === "Enter" && !submissionDisabled) {
      action();
    }
  };

  return { handleEnterPress };
};
