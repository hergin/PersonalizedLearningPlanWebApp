import React from "react";
import { CircularProgress } from "@mui/material";

export default function Load(){
    return (
        <div className="h-screen w-full flex flex-col justify-center items-center">
            <CircularProgress/>
        </div>
    );
}