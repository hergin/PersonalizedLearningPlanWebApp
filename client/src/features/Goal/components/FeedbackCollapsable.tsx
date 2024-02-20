import React from "react";

interface FeedbackCollapsableProps{
    getCollapsableProps: any;
    feedback?: string;
}

export default function FeedbackCollapsable({getCollapsableProps, feedback}: FeedbackCollapsableProps){
    return (
        <div {...getCollapsableProps()}>
            <textarea className="text-black">

            </textarea>
        </div>
    );
}
