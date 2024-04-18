import React from "react";
import { CircularProgress } from "@mui/material";

interface ErrorProps{
    error : Error;
}

export default function Error({error} : ErrorProps){
    return(
        <div className="h-screen w-full flex flex-col gap-1 justify-center items-center">
            <div className="text-9xl font-headlineFont">
                Error!
            </div>
            <div className="text-2xl font-bodyFont">
                {error.message}
            </div>
        </div>
    )
}
