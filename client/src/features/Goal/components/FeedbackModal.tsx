import { Modal } from "@mui/material";
import React, { useState } from "react";
import { useFeedbackUpdater } from "../hooks/useGoals";

interface FeedbackModalProps {
  goal_id: number;
  open: boolean;
  feedbackGoal?: string;
  onClose: () => void;
}

const FeedbackModal = ({ onClose, open, goal_id, feedbackGoal }: FeedbackModalProps) => {
  const [feedback, setFeedback] = useState(feedbackGoal ? feedbackGoal : "");
  const { mutateAsync: updateFeedback } = useFeedbackUpdater(goal_id);
  async function handleFeedbackSubmit() {
    console.log(feedback);
    await updateFeedback({ goal_id: goal_id, feedback: feedback });
    onClose();
  }
  return (
    <Modal
      open={open}
      onClose={onClose}
      className="absolute float-left flex items-center justify-center top-2/4 left-2/4 "
    >
      <div className="bg-white w-2/4 flex flex-col items-center justify-start border border-black border-solid p-4 gap-5">
        <div className="flex flex-col w-full h-full overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">Feedback</h2>
            <button onClick={onClose} className="text-sm font-semibold">
              Close
            </button>
          </div>
          <textarea
            className="h-40 rounded text-base w-full border border-solid border-gray-300 p-2 resize-none"
            name="feedback"
            placeholder="Enter your feedback"
            value={feedback}
            onChange={(event) => {
              setFeedback(event.target.value);
            }}
            required
          />
          <button
            className="bg-element-base text-text-color h-10"
            onClick={handleFeedbackSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default FeedbackModal;
