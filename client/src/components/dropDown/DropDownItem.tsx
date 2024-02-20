import React, { PropsWithChildren, ReactElement } from "react";

interface DropDownItemProps extends PropsWithChildren {
    onClick?(): void,
    leftIcon?: ReactElement,
    rightIcon?: ReactElement
}

export default function DropDownItem(props: DropDownItemProps) {
    return(
        <div onClick={props.onClick} className={"h-[50px] p-[0.5rem] flex items-center hover:bg-[#820000] cursor-pointer duration-500"}>
            {props.leftIcon && <span className="icon-button">{props.leftIcon}</span>}
            {props.children}
            {props.rightIcon && <span className="icon-button">{props.rightIcon}</span>}
        </div>
    );
}
