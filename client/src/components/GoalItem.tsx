import { GoalListHeader } from "./GoalListHeader";
import React from "react";
import GoalEditor from "./GoalEditor";
import { Goal } from "../types";
import { SubGoalsCollapsable } from "./SubGoalsCollapsable";
import { useCollapse } from "react-collapsed";
import dayjs from "dayjs";
import useGoals from "../hooks/useGoals";

export default function GoalItem({ id }: any) {
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();
  const { data, isLoading, error } = useGoals(id);
  console.log(id + "id");
  console.log(data);

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
  if (isLoading) {
    return <p className="text-black">Loading...</p>;
  }

  if (error) {
    return <p className="text-black">Error</p>;
  }

  return (
    <div>
      {data?.map((goal: Goal) => (
        <>
          <GoalListHeader />
          <div className="flex flex-row transition-transform rounded  w-full h-[100px] border-2 border-solid border-black divide-x">
            <div className="flex flex-col w-2/5 h-full justify-center p-3 ">
              <p className="text-black text-lg font-bodyFont">{goal.name}</p>
            </div>
            <div className="flex flex-col transition-transform w-[15%] h-full justify-center p-3 items-center">
              {goal.due_date ? (
                <p className="text-black font-bodyFont">
                  {dayjs(goal.due_date).format("MM/DD/YYYY")}
                </p>
              ) : (
                <p className="text-black font-bodyFont">No Due Date</p>
              )}
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
            <GoalEditor
              id={goal.goal_id}
              goalType={goal.goalType}
              dataName={goal.name}
              dataDescription={goal.description}
              dueDate={goal.due_date}
            />
          </div>
          <SubGoalsCollapsable getCollapseProps={getCollapseProps} />
        </>
      ))}
    </div>
  );
}
