import React, { PropsWithChildren, ReactElement } from "react";
import { Checkbox } from "@mui/material";

interface DropDownCheckboxProps extends PropsWithChildren {
    handleCheckToggle: (checked: boolean) => void,
    checked: boolean,
    leftIcon?: ReactElement,
    rightIcon?: ReactElement
}

export default function DropDownCheckbox(props: DropDownCheckboxProps) {
    return (
        <div className={`h-[50px] p-[0.5rem] flex items-center gap-0`}>
            {props.leftIcon && <span className="icon-button">{props.leftIcon}</span>}
            <Checkbox
                className="size-10"
                checked={props.checked}
                onChange={(event) => props.handleCheckToggle(event.target.checked)}
            />
            <p className={"truncate"}>{props.children}</p>
            {props.rightIcon && <span className="icon-button">{props.rightIcon}</span>}
        </div>
    );
}
