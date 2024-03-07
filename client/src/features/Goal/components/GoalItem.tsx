import React, { useEffect, useState } from "react";
import GoalEditor from "./GoalEditor";
import { Goal } from "../../../types";
import { SubGoalsCollapsable } from "./SubGoalsCollapsable";
import { useCollapse } from "react-collapsed";
import dayjs from "dayjs";
import { Checkbox } from "@mui/material";
import SubGoalCreator from "./SubGoalCreator";
import GoalDescriptionModal from "./GoalDescriptionModal";
import FeedbackCollapsable from "./FeedbackCollapsable";
import { useGoalUpdater } from "../hooks/useGoals";

interface GoalItemProps {
  id: number;
  goal: Goal;
}

export default function GoalItem({ id, goal }: GoalItemProps) {
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();
  const {
    getCollapseProps: getFeedbackCollapsable,
    getToggleProps: getFeedbackToggle,
    isExpanded: isFeedbackExpanded,
  } = useCollapse();
  const [progress, setProgress] = useState(0);
  const [openDescription, setOpenDescription] = useState(false);
  const { mutateAsync: updateGoal} = useGoalUpdater(goal.module_id);

  useEffect(() => {
    // action on update of movies
    if (goal.is_complete) {
      console.log(goal.is_complete);
      setProgress(1);
      console.log(progress + "Is this");
    } else {
      console.log(goal.is_complete);
      setProgress(0);
      console.log(progress + "Is this");
    }
  }, [goal.is_complete, progress]);

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
              <p className="text-black font-bodyFont">No Due Date</p>
            )}
          </div>
          <div className="flex flex-col transition-transform w-[15%] h-full justify-center p-3 items-center">
            <p className={`text-black`}>{goal.tag_name}</p>
          </div>
          <div className="flex flex-col transition-transform w-[15%] h-full justify-center p-3 items-center">
            <button {...getFeedbackToggle()} className="text-black">
              {isFeedbackExpanded ? "-" : "+"}
            </button>
          </div>
          <div className="flex flex-col transition-transform w-[15%] h-full justify-center p-3 items-center">
            {goal.sub_goals?.length !== 0 ? (
              <button {...getToggleProps()} className="text-black">
                {isExpanded ? "-" : "+"}
              </button>
            ) : (
              <Checkbox
                checked={goal.is_complete}
                onChange={(checked) => updateGoal({...goal, is_complete: checked.target.checked})}
              />
            )}
          </div>
          <GoalEditor goal={goal} />
        </div>
        <FeedbackCollapsable
          getCollapsableProps={getFeedbackCollapsable}
          feedback={goal.feedback}
          id={goal.goal_id}
        />
        {goal.sub_goals?.map((subGoal: Goal) => (
          <SubGoalsCollapsable
            key={subGoal.goal_id}
            getCollapseProps={getCollapseProps}
            sub_goal={subGoal}
            updateGoal={async (goal: Goal) => {await updateGoal(goal)}}
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
