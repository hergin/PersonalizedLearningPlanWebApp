import React, { useMemo, ReactElement } from "react";
import ProfilePicture from "../../../components/ProfilePicture";
import { Profile } from "../../../types";
import { startCase } from "lodash";

const STYLE = {
    containerHeight: "h-[51vh]",
    containerWidth: "w-[40vw]",
    borderValues: "border-[0.8px] border-solid border-[rgb(219, 219, 219)]",
    defaultGap: "gap-1",
    flexColumn: "flex flex-col",
};

interface ProfileDisplayProps {
    profile: Profile,
}

export default function ProfileDisplay({profile}: ProfileDisplayProps) {
    const defaultDisplayElements = useMemo<ReactElement[]>(() => {
        const result: ReactElement[] = [];
        const nonDefaultElements: string[] = ["id", "username", "bio"];
        for(const [key, value] of Object.entries(profile)) {
            if(typeof value === "number" || nonDefaultElements.includes(key)) {
                continue;
            }

            result.push(
                <div
                    key={`ID-${key}`}
                    className={`flex flex-row ${STYLE.defaultGap} justify-between text-start`}
                    data-testid={`${key}-div`}
                >
                    <p>{`${startCase(key)}:`}</p>
                    <p>{value ?? ""}</p>
                </div>
            );
        }
        return result;
      }, [profile]);

    return (
        <>
            <div
                className={`h-[calc(${STYLE.containerHeight} - 15)] ${STYLE.containerWidth} ${STYLE.borderValues} ${STYLE.flexColumn} items-center m-2.5 py-2 px-2.5 ${STYLE.defaultGap}`}
            >
                <ProfilePicture style="size-16" />
                <p className="text-[30px] mb-[0px]">{profile.username}</p>
            </div>
            <div className={`${STYLE.containerHeight} ${STYLE.containerWidth} ${STYLE.borderValues} ${STYLE.flexColumn} justify-around content-normal p-[10px] mx-[40px] mt-[24px] ${STYLE.defaultGap} text-2xl`}>
                {defaultDisplayElements}
                <p>About Me:</p>
                <div className={`text-lg ${STYLE.borderValues} p-2 m-2 h-4/5`}>
                <p>{profile.bio ? profile.bio : ""}</p>
                </div>
            </div>
        </>
    );
}
