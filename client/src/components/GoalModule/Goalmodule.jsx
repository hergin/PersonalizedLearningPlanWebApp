import React from "react";
import ModuleCreator from "../ModuleCreator";

const GoalModule = () => {
  const [goal, setGoal] = React.useState([
    {
      name: "Goal 1",
      description: "This is a goal",
      completion: 0,
    },
    {
      name: "Goal 2",
      description: "This is a goal",
      completion: 100,
    },
    {
      name: "Goal 3",
      description: "This is a goal",
      completion: 66,
    },
  ]);

  return (
    <div
      style={{
        display: "flex",
        gap: "5%",
        flexWrap: "wrap",
        width: "100%",
        height: "100%",
        justifyContent: "flex-start",
      }}
    >
      {goal.map((goal) => 
        <Module goalName={goal.name} goalDescription={goal.description} completion={goal.completion} />
      )}
      <ModuleCreator/>
    </div>
  );
};

const Module = ({ goalName, goalDescription, completion }) => {
  return (
    <div style={{
      border: "1px solid black", width: "300px", height: "500px", display: "flex", flexDirection: "column" }}>
      <h1>{goalName}</h1>
      <text>{goalDescription}</text>
      <progress value={completion} max="100"></progress>
    </div>
  );
};

export default GoalModule;
