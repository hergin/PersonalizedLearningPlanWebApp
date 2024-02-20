import React, {PropsWithChildren} from "react";

interface DropDownMenuProps extends PropsWithChildren {
    absolutePosition: string
}

export default function DropDownMenu(props: DropDownMenuProps) {
    return (  
        <div className={`${props.absolutePosition} border-[0.8px] border-solid border-[rgb(219, 219, 219)] p-[1rem] bg-element-base overflow-hidden font-headlineFont`}>
            {props.children}
        </div>
    );
}
