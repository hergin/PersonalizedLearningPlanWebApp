import React from "react";
import { Checkbox } from "@mui/material";
import GoalEditor from "./GoalEditor";
import { Goal } from "../../../types";
import dayjs from "dayjs";

interface GoalCreatorProps {
  getCollapseProps: any;
  sub_goal: Goal;
  updateGoal: (goal: Goal) => Promise<void>;
}

export function SubGoalsCollapsable({
  getCollapseProps,
  sub_goal,
  updateGoal,
}: GoalCreatorProps) {
  return (
    <>
      <div
        {...getCollapseProps()}
        className="flex flex-row rounded w-full h-[50px] border-2 border-solid border-[#F4F4F4] divide-x pl-2/5"
      >
        <div className="flex flex-col w-2/5 h-full justify-center p-3">
          <p className="text-black text-lg font-bodyFont">{sub_goal.name}</p>
        </div>
        <div className="flex flex-col w-[15%] h-full justify-center p-3 items-center">
          <p className="text-black font-bodyFont">
            {sub_goal.due_date ? dayjs(sub_goal.due_date).format("MM/DD/YYYY") : ""}
          </p>
        </div>
        <div className="flex flex-col w-[15%] h-full justify-center p-3 items-center">
          <p className="text-black">{sub_goal.tag_name ?? ""}</p>
        </div>
        <div className="flex flex-col w-[15%] h-full justify-center p-3 items-center">
        </div>
        <div className="flex flex-col w-[15%] h-full justify-center p-3 items-center">
          <Checkbox
            checked={sub_goal.is_complete}
            onChange={async (event) => {
              await updateGoal({
                ...sub_goal,
                is_complete: event.target.checked,
              });
            }}
          />
        </div>
        <GoalEditor goal={sub_goal} />
      </div>
    </>
  );
}
