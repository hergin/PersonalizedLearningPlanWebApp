import React, { PropsWithChildren } from "react";

interface TabPanelProps extends PropsWithChildren {
    index: number,
    selectedValue: number,
    style?: string
}

export default function TabPanel({children, selectedValue: value, index, style, ...other}: TabPanelProps) {
    return  (
        <div data-testid="container" role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} {...other}>
            {value === index && (
                <div data-testid="tabContent" className={style}>
                    {children}
                </div>
            )}
        </div>
    );
}
