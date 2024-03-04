import React, {useState} from "react";
import { useFeedbackUpdater } from "../hooks/useGoals";

interface FeedbackCollapsableProps {
    getCollapsableProps: any;
    feedback?: string;
    id: number;
}

export default function FeedbackCollapsable({getCollapsableProps, feedback, id}: FeedbackCollapsableProps) {
    const [newFeedback, setFeedback] = useState<string>(feedback ? feedback : "");
    const {mutateAsync: updateFeedback} = useFeedbackUpdater(id);  
    
    return (
        <div {...getCollapsableProps()}>
            <textarea title="Feedback Input" className="flex w-full relative text-black border" value={newFeedback} onChange={(input) => setFeedback(input.target.value)}>
                
            </textarea>
            <button 
                onClick={async () => {await updateFeedback({goal_id: id, feedback: newFeedback})}} 
                className="flex w-full text-align-center bg-element-base text-text-color h-[20px] pl-[48%]"
            >
                Submit
            </button>
        </div>
    );
}
