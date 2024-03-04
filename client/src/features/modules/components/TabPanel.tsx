import React, { PropsWithChildren } from "react";

interface TabPanelProps extends PropsWithChildren {
    index: number;
    value: number;
}

export default function TabPanel({children, value, index, ...other}: TabPanelProps) {
    return  (
        <div role="tabpanel" hidden={value !== index} id={`vertical-tabpanel-${index}`} {...other}>
            {value === index && (
                <div className="p-[2%] h-screen bg-[#F1F1F1]">
                    {children}
                </div>
            )}
        </div>
    );
}
