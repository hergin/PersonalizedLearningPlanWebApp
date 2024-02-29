import React from "react";
import { useParams } from "react-router-dom";
import Goals from "./Goals";
import GoalItem from "./GoalItem";
import useGoals from "../hooks/useGoals";
import { Goal } from "../../../types";
import { GoalListHeader } from "./GoalListHeader";
import TagCreator from "../../tags/components/TagCreator";

const GoalParentContainer = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGoals(id as string);
  console.log(data);

  if (isLoading) {
    return <p className="text-black">Loading...</p>;
  }

  if (error) {
    return <p className="text-black">Error</p>;
  }
  return (
    <div className="relative flex h-screen">
      <Goals id={id}>
        <div className="w-full flex flex-row-reverse"> <TagCreator/></div>
       
        <GoalListHeader />
        {data?.map((goal: Goal) => (
          <GoalItem key={goal.goal_id} id={id as string} goal={goal} />
        ))}
      </Goals>
    </div>
  );
};

export default GoalParentContainer;
