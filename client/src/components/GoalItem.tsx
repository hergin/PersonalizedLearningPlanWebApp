import React, { useState } from "react";
import GoalEditor from "./GoalEditor";
import { Goal } from "../types";
import { SubGoalsCollapsable } from "./SubGoalsCollapsable";
import { useCollapse } from "react-collapsed";
import dayjs from "dayjs";
import { Checkbox } from "@mui/material";
import { ApiClient } from "../hooks/ApiClient";
import { useQueryClient } from "@tanstack/react-query";
import SubGoalCreator from "./SubGoalCreator";

interface GoalItemProps {
  id: string;
  goal: Goal;
}

export default function GoalItem({ id, goal }: GoalItemProps) {
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();
  const queryClient = useQueryClient();
  const [isComplete, setIsComplete] = useState(goal.is_complete);
  console.log(isComplete + "isComplete");
  console.log(id + "id");
  console.log(goal.sub_goals?.length);
  const { put } = ApiClient();

  function handleToggle(checked: boolean) {
    setIsComplete(checked);
    updateDatabase(goal);
  }

  async function updateDatabase(goal: Goal) {
    try {
      console.log(`${goal.goal_id}`);
      await put(`/goal/update/${goal.goal_id}`, {
        name: goal.name,
        description: goal.description,
        goalType: goal.goal_type,
        isComplete: isComplete,
        moduleId: goal.moduleId,
      });
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      console.log("Database updated");
      console.log();
    } catch (error: any) {
      console.error(error);
      alert(error.response ? error.response.data : error);
    }
  }

  return (
    <div>
      <>
        <div
          key={goal.goal_id}
          className="flex flex-row transition-transform rounded  w-full h-[100px] border-2 border-solid border-black divide-x"
        >
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
            {goal.sub_goals?.length !== 0 ? (
              <button {...getToggleProps()} className="text-black">
                {isExpanded ? "-" : "+"}
              </button>
            ) : (
              <Checkbox
                checked={isComplete}
                onChange={(checked) => handleToggle(checked.target.checked)}
              />
            )}
          </div>
          <GoalEditor
            id={goal.goal_id}
            goalType={goal.goal_type}
            dataName={goal.name}
            dataDescription={goal.description}
            dueDate={goal.due_date}
          />
        </div>
        {goal.sub_goals?.map((subGoal: Goal) => (
          <SubGoalsCollapsable
            key={subGoal.goal_id}
            getCollapseProps={getCollapseProps}
            sub_goal={subGoal}
            updateGoal={updateDatabase}
          />
        ))}
        <SubGoalCreator moduleID={id} parent_id={goal.goal_id.toString()} />
      </>
    </div>
  );
}
