import React from "react"
import { TextField } from "@mui/material";
import { startCase } from "lodash";

interface TextBoxProps {
    name: string,
    value: string,
    hasLabel?: boolean,
    containerStyle?: string,
    onEnterPress: React.KeyboardEventHandler,
    onChange: React.ChangeEventHandler,
}

export default function TextBox({name, value, hasLabel, containerStyle, onEnterPress, onChange}: TextBoxProps) {
    return (
        <div 
            data-testid="textBoxContainer" 
            className={`flex flex-row justify-between gap-[5px]${containerStyle ? ` ${containerStyle}` : ""}`}
        >
            {hasLabel && (
                <label htmlFor={`ID-${name}`}>
                    {`${startCase(name)}:`}
                </label>
            )}
            <TextField
                hiddenLabel
                id={`ID-${name}`}
                name="profile"
                placeholder={startCase(name)}
                value={value}
                onKeyUp={onEnterPress}
                onChange={onChange}
            />
        </div>
    );
}
