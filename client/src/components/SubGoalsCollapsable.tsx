import { Checkbox } from "@mui/material";
import GoalEditor from "./GoalEditor";
import React, { useState } from "react";
import SubGoalCreator from "./SubGoalCreator";
import Goals from "../screens/Goals";
import { Goal } from "../types";
import dayjs from "dayjs";

interface GoalCreatorProps {
  getCollapseProps: any;
  sub_goal: Goal;
  updateGoal: (goal: Goal) => void;
}
export function SubGoalsCollapsable({
  getCollapseProps,
  sub_goal,
  updateGoal,
}: GoalCreatorProps) {
  const [isComplete, setIsComplete] = useState(sub_goal.is_complete);
  function handleToggle(checked: boolean) {
    setIsComplete(checked);
    updateGoal(sub_goal);
  }
  return (
    <>
      <div
        {...getCollapseProps()}
        className="flex flex-row rounded w-full h-[50px] border-2 border-solid border-[#F4F4F4] divide-x pl-2/5"
      >
        <div className="flex flex-col w-2/5 h-full justify-center p-3 ">
          <p className="text-black text-lg font-bodyFont">{sub_goal.name}</p>
        </div>
        <div className="flex flex-col w-[15%] h-full justify-center p-3 items-center">
          <p className="text-black font-bodyFont">
            {sub_goal.due_date ? dayjs(sub_goal.due_date).format("MM/DD/YYYY") : ""}
          </p>
        </div>
        <div className="flex flex-col w-[15%] h-full justify-center p-3 items-center">
          <p className="text-black">-</p>
        </div>
        <div className="flex flex-col w-[15%] h-full justify-center p-3 items-center">
          <p className="text-black">0/1</p>
        </div>
        <div className="flex flex-col w-[15%] h-full justify-center p-3 items-center">
        <Checkbox
                checked={isComplete}
                onChange={(checked) => handleToggle(checked.target.checked)}
              />
        </div>
        <GoalEditor
          id={sub_goal.goal_id}
          goalType={sub_goal.goal_type}
          dataName={sub_goal.name}
          dataDescription={sub_goal.description}
          dueDate={typeof sub_goal.due_date === "string" ? new Date(sub_goal.due_date) : sub_goal.due_date}
        />
      </div>
    </>
  );
}
