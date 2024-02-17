import React, { PropsWithChildren } from "react";
import { Checkbox } from "@mui/material";

interface DropDownCheckboxProps extends PropsWithChildren {
    handleCheckToggle: (checked: boolean) => void,
    checked: boolean
}

export default function DropDownCheckbox(props: DropDownCheckboxProps) {
    return (
        <div className={`h-[50px] p-[0.5rem] flex items-center`}>
            <Checkbox
                checked={props.checked}
                onChange={(event) => props.handleCheckToggle(event.target.checked)}
            />
            <p>{props.children}</p>
        </div>
    );
}
