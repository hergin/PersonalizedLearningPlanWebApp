import React from "react";
import { useParams } from "react-router-dom";
import Goals from "./Goals";
import GoalItem from "./GoalItem";
import { useGoals } from "../hooks/useGoals";
import { Goal } from "../../../types";
import { GoalListHeader } from "./GoalListHeader";
import TagCreator from "../../tags/components/TagCreator";
import { useUser } from "../../login/hooks/useUser";
import Load from "../../../components/LoadScreen";
import Error from "../../../components/ErrorScreen";

const GoalParentContainer = () => {
  const { user } = useUser();
  const { id: moduleId } = useParams();
  const { data: goals, isLoading, error } = useGoals(Number(moduleId));
  
  if (isLoading) {
    return <Load/>;
  }

  if (error) {
    return <Error error={error}/>;
  }

  return (
    <div className="relative flex h-screen">
      <Goals id={Number(moduleId)}>
        <div className="w-full flex flex-row-reverse">
          <TagCreator accountId={user.id} />
        </div>
        {goals?.length === 0 ? null : <GoalListHeader />}
        {goals?.map((goal: Goal) => (
          <GoalItem key={goal.goal_id} id={Number(moduleId)} goal={goal} />
        ))}
      </Goals>
    </div>
  );
};

export default GoalParentContainer;
