import React, {useState} from "react";
import { ApiClient } from "../../../hooks/ApiClient";

interface FeedbackCollapsableProps{
    getCollapsableProps: any;
    feedback?: string;
    id: number;
}

export default function FeedbackCollapsable({getCollapsableProps, feedback, id}: FeedbackCollapsableProps){
    const [newFeedback, setFeedback] = useState <string>(feedback ? feedback : "");
    const {put} = ApiClient();

    async function HandleSubmit(){
        try{
            await put(`/goal/update/feedback/${id}`, {feedback: newFeedback})
            setFeedback(newFeedback);
        }catch(error: any){
            console.error(error);
            alert(error.message ? error.message : error);
        }
    }
    
    return (
        <div {...getCollapsableProps()}>
            <textarea className="flex w-full relative text-black border" value={newFeedback} onChange={(input) => setFeedback(input.target.value)}>

            </textarea>
            <button onClick={HandleSubmit} className="flex w-full text-align-center bg-element-base text-text-color h-[20px] pl-[48%]">
                Submit
            </button>
        </div>
    );
}
