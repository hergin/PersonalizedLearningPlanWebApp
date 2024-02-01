import { GoalListHeader } from "./GoalListHeader";
import React from "react";
import GoalEditor from "./GoalEditor";
import { Goal } from "../types";
import { SubGoalsCollapsable } from "./SubGoalsCollapsable";
import { useCollapse } from "react-collapsed";
import dayjs from "dayjs";

export default function GoalStepper( {name, due_date, goal_id, description, goalType } : Goal) {
  const date = due_date !== null ? dayjs(due_date).format("MM/DD/YYYY") : undefined;
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();
  console.log(`ID in GoalStepper: ${goal_id}`);

  // async function updateDatabase(goal: Goal) {
  //   try {
  //     console.log(`${goal.goal_id}`);
  //     await put(`/goal/update/${goal.goal_id}`, {
  //       name: goal.name,
  //       description: goal.description,
  //       is_complete: goal.isComplete,
  //       moduleId: goal.moduleId,
  //     });
  //   } catch (error: any) {
  //     console.error(error);
  //     alert(error.response ? error.response.data : error);
  //   }
  // }


  return (
    <div>
      <GoalListHeader />
      <div className="flex flex-row transition-transform rounded  w-full h-[100px] border-2 border-solid border-black divide-x">
        <div className="flex flex-col w-2/5 h-full justify-center p-3 ">
          <p className="text-black text-lg font-bodyFont">{name}</p>
        </div>
        <div className="flex flex-col transition-transform w-[15%] h-full justify-center p-3 items-center">
          <p className="text-black font-bodyFont">{date}</p>
        </div>
        <div className="flex flex-col transition-transform w-[15%] h-full justify-center p-3 items-center">
          <p className="text-black"></p>
        </div>
        <div className="flex flex-col transition-transform w-[15%] h-full justify-center p-3 items-center">
          <p className="text-black">0/1</p>
        </div>
        <div className="flex flex-col transition-transform w-[15%] h-full justify-center p-3 items-center">
          <button {...getToggleProps()} className="text-black">
            {isExpanded ? "-" : "+"}
          </button>
        </div>
        <GoalEditor id={goal_id} goalType={goalType } dataName={name} dataDescription={description} dueDate={due_date}  />
      </div>
      <SubGoalsCollapsable getCollapseProps={getCollapseProps} />
    </div>
  );
}
