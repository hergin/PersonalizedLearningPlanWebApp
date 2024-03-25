import React, { PropsWithChildren, ReactElement } from "react";
import { Checkbox } from "@mui/material";

interface DropDownCheckboxProps extends PropsWithChildren {
    handleCheckToggle: (checked: boolean) => void,
    checked: boolean,
    leftIcon?: ReactElement,
    rightIcon?: ReactElement
}

export default function DropDownCheckbox({checked, leftIcon, rightIcon, handleCheckToggle, children}: DropDownCheckboxProps) {
    return (
        <div className={`h-[50px] p-[0.5rem] flex items-center gap-0`}>
            {leftIcon && <span className="icon-button">{leftIcon}</span>}
            <Checkbox
                data-testid="checkbox"
                className="size-10"
                checked={checked}
                onChange={(event) => handleCheckToggle(event.target.checked)}
                color="secondary"
            />
            <p data-testid="text" className={"truncate"}>{children}</p>
            {rightIcon && <span className="icon-button">{rightIcon}</span>}
        </div>
    );
}
