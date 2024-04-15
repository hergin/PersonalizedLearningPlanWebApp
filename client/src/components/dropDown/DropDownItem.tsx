import React, { PropsWithChildren, ReactElement } from "react";

interface DropDownItemProps extends PropsWithChildren {
    onClick?(): void,
    leftIcon?: ReactElement,
    rightIcon?: ReactElement
}

export default function DropDownItem(props: DropDownItemProps) {
    return(
        <div data-testid="itemContainer" onClick={props.onClick} className={"h-[50px] p-[1rem] flex items-center gap-2 hover:bg-[#820000] cursor-pointer duration-500"}>
            {props.leftIcon && <span className="icon-button">{props.leftIcon}</span>}
            {props.children}
            {props.rightIcon && <span className="icon-button">{props.rightIcon}</span>}
        </div>
    );
}
