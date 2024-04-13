import React, { useState } from "react";
import GoalEditor from "./GoalEditor";
import { Goal } from "../../../types";
import { SubGoalsCollapsable } from "./SubGoalsCollapsable";
import { useCollapse } from "react-collapsed";
import dayjs from "dayjs";
import { Checkbox } from "@mui/material";
import SubGoalCreator from "./SubGoalCreator";
import GoalDescriptionModal from "./GoalDescriptionModal";
import { useGoalUpdater } from "../hooks/useGoals";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

interface GoalItemProps {
  id: number;
  goal: Goal;
}

export default function GoalItem({ id, goal }: GoalItemProps) {
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();
  const [openDescription, setOpenDescription] = useState(false);
  const { mutateAsync: updateGoal } = useGoalUpdater(goal.module_id);

  return (
    <div>
      <>
        <div
          key={goal.goal_id}
          className="flex flex-row transition-transform rounded  w-full h-[100px] border-2 border-solid border-black divide-x"
        >
          <div className="flex flex-col w-2/5 h-full justify-center p-3 ">
            <button
              onClick={() => setOpenDescription(true)}
              className="text-black text-lg font-bodyFont"
            >
              {goal.name}
            </button>
          </div>
          <div className="flex flex-col transition-transform w-[15%] h-full justify-center p-3 items-center">
            {goal.due_date ? (
              <p className="text-black font-bodyFont">
                {dayjs(goal.due_date).format("MM/DD/YYYY")}
              </p>
            ) : (
              <p className="text-black font-bodyFont"></p>
            )}
          </div>
          <div className="flex flex-col transition-transform w-[15%] h-full justify-center p-3 items-center">
              {goal.tag_name}
          </div>
          <div className="flex flex-col transition-transform w-[15%] h-full justify-center p-3 items-center">
            <button {...getToggleProps()} className="text-black">
              {isExpanded ? <RemoveIcon /> : <AddIcon />}
            </button>
          </div>
          <div className="flex flex-col transition-transform w-[15%] h-full justify-center p-3 items-center">
            <Checkbox
              checked={goal.is_complete}
              onChange={(checked) =>
                updateGoal({ ...goal, is_complete: checked.target.checked })
              }
            />
          </div>
          <GoalEditor goal={goal} />
        </div>
        {goal.sub_goals?.map((subGoal: Goal) => (
          <SubGoalsCollapsable
            key={subGoal.goal_id}
            getCollapseProps={getCollapseProps}
            sub_goal={subGoal}
            updateGoal={async (goal: Goal) => {
              await updateGoal(goal);
            }}
          />
        ))}
        <SubGoalCreator moduleID={id} parentId={goal.goal_id} />
        <GoalDescriptionModal
          goal={goal}
          open={openDescription}
          onClose={() => setOpenDescription(false)}
        />
      </>
    </div>
  );
}
