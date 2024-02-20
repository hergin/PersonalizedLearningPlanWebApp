import React, {useState} from "react";
import { ApiClient } from "../../../hooks/ApiClient";

interface FeedbackCollapsableProps{
    getCollapsableProps: any;
    feedback?: string;
}

export default function FeedbackCollapsable({getCollapsableProps, feedback}: FeedbackCollapsableProps){
    const [newFeedback, setFeedback] = useState <string>(feedback ? feedback : "");
    const {put} = ApiClient();


    function HandleSubmit(){

    }
    
    return (
        <div {...getCollapsableProps()}>
            <textarea className="text-black" value={newFeedback} onChange={(input) => setFeedback(input.target.value)}>

            </textarea>
            <button onClick={HandleSubmit} className="text-black">
                Submit
            </button>
        </div>
    );
}
