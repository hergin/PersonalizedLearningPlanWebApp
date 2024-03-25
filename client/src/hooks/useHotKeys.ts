import React from "react";

export const useHotKeys = () => {
  const handleEnterPress = (
    event: React.KeyboardEvent,
    action: () => void,
    submissionDisabled?: boolean
  ) => {
    if (event.key === "Enter" && !submissionDisabled) {
      action();
    }
  };

  return { handleEnterPress };
};
