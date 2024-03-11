import React, { PropsWithChildren } from "react";

interface TabPanelProps extends PropsWithChildren {
    index: number,
    value: number,
    style?: string
}

export default function TabPanel({children, value, index, style, ...other}: TabPanelProps) {
    return  (
        <div role="tabpanel" hidden={value !== index} id={`vertical-tabpanel-${index}`} {...other}>
            {value === index && (
                <div className={style}>
                    {children}
                </div>
            )}
        </div>
    );
}
