import React from "react";
import ModuleCreator from "../ModuleCreator";
import "./GoalModule.css";

const GoalModule = () => {
  const [goal, setGoal] = React.useState([
    {
      name: "Goal 1",
      description: "This is a goal",
      completion: 0,
      id: 1,
    },
    {
      name: "Goal 2",
      description: "This is a goal",
      completion: 100,
      id: 2,
    },
    {
      name: "Goal 3",
      description: "This is a goal",
      completion: 66,
      id: 3,
    },
  ]);

  return (
    <div className="module-container"
      style={{

      }}
    >
      {goal.map((goal) => (
        <Module
          key={goal.id}
          goalName={goal.name}
          goalDescription={goal.description}
          completion={goal.completion}
        />
      ))}
      <ModuleCreator />
    </div>
  );
};

const Module = ({ goalName, goalDescription, completion }) => {
  return (
    <div className="module-div">
      <div className="module-header">
        <h1>{goalName}</h1>
      </div>
      <hr />
      <div className="module-body">
        <p>Progress: {completion === 100 ? "Completed" : "In progress"}</p>
        <p>Description:</p>
        <p>{goalDescription}</p>
      </div>
    </div>
  );
};

export default GoalModule;
