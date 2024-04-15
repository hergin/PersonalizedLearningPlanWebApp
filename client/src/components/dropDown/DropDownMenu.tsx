import React, {PropsWithChildren} from "react";

const STATIC_STYLE = "border-[0.8px] border-solid border-[rgb(219, 219, 219)] p-[1rem] bg-element-base overflow-hidden font-headlineFont";

interface DropDownMenuProps extends PropsWithChildren {
    style?: string
}

export default function DropDownMenu({style, children}: DropDownMenuProps) {
    return (
        <div
            data-testid="menuContainer"
            className={`${STATIC_STYLE} ${style ?? ""}`}
        >
            {children}
        </div>
    );
}
