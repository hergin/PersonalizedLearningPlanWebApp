import "./Goals.css";
import React from "react";
import { useParams } from "react-router-dom";
import GoalHeader from "../../components/GoalHeader/GoalHeader";

const Goals = () => {
  const { id } = useParams();
  
  // -1 is a temporary fix for when the id is null.
  // Probably should come up with a more elegant solution for this later on.
  return (
    <div className="goal-screen">
      <GoalHeader moduleID={id ? parseInt(id) : -1} />
      <h1>{id}</h1>
    </div>
  );
};

export default Goals;
