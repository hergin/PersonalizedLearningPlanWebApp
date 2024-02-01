import React from "react";
import { useParams } from "react-router-dom";
import Goals from "../screens/Goals";
import GoalItem from "./GoalItem";

const GoalParentContainer = () => {
  const { id } = useParams();

  return (
    <div className="relative flex h-screen">
      <Goals id={id} >
        <GoalItem />
      </Goals>
    </div>
  );
};

export default GoalParentContainer;
