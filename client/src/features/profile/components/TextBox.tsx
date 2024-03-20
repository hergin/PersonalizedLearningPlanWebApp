import React, { useMemo } from "react"
import { TextField } from "@mui/material";
import { startCase } from "lodash";

interface TextBoxProps {
    name: string,
    value: string,
    onEnterPress: React.KeyboardEventHandler,
    onChange: React.ChangeEventHandler,
    required?: boolean
}

export default function TextBox({name, value, onEnterPress, onChange, required, ...other}: TextBoxProps) {
    const displayName = useMemo<string>(() => {
        return startCase(name);
    }, [name]);
    
    const error = useMemo<boolean>(() => {
        return value === "";
    }, [value]);

    return (
        <div data-testid="textBoxContainer" className="flex flex-row mx-5 my-1" {...other}>
            <TextField
                id={`ID-${name}`}
                name="profile"
                defaultValue={value}
                label={displayName}
                variant="outlined"
                onKeyUp={onEnterPress}
                onChange={onChange}
                fullWidth
                required={required}
                error={required ? error : false}
                helperText={error && required ? `Please enter your ${displayName.toLowerCase()}.` : ""}
            />
        </div>
    );
}
