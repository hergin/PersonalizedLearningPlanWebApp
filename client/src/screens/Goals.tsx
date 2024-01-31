import React from "react";
import { useParams } from "react-router-dom";
import GoalHeader from "../components/GoalContainer";

const Goals = () => {
  const { id } = useParams();
  
  // -1 is a temporary fix for when the id is null.
  // Probably should come up with a more elegant solution for this later on.
  return (
    <div className="flex flex-col h-screen bg-[#F1F1F1]">
      <GoalHeader moduleID={id} />
      <h1>{id}</h1>
    </div>
  );
};

export default Goals;
