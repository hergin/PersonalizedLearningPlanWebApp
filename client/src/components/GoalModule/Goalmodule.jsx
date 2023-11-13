import React from "react";
import ModuleCreator from "../ModuleCreator";
import "./Goalmodule.css";

const GoalModule = () => {
  const goal = [
    {
      name: "Goal 1",
      description: "This is a goal",
      completion: 0,
      id: 1,
      goals: [
        {
          description: "This is a goal",
          completion: false,
        },
        {
          description: "This is a goal2",
          completion: true,
        },
      ],
    },
    {
      name: "Goal 2",
      description: "This is a goal",
      completion: 100,
      id: 2,
      goals: [
        {
          description: "This is a goal",
          completion: false,
        },
        {
          description: "This is a goal2",
          completion: true,
        },
      ],
    },
    {
      name: "Goal 3",
      description: "This is a goal",
      completion: 66,
      id: 3,
      goals: [
        {
          description: "This is a goal",
          completion: false,
        },
        {
          description: "This is a goal2",
          completion: true,
        },
      ],
    },
  ];

  return (
    <button className="fill-div">
      <div className="module-container" style={{}}>
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
    </button>
  );
};

const Goal = ({ goalName, completion }) => {
  return (
    <div className="module-div">
      <div className="module-header">
        <h1>{goalName}</h1>
      </div>
      <div className="module-body">
        <p>Progress: {completion === 100 ? "Completed" : "In progress"}</p>
      </div>
    </div>
  );
};

const Module = ({ goalName, goalDescription, completion }) => {
  return (
    <div className="module-div">
      <div className="module-header">
        <h1>{goalName}</h1>
      </div>
      <div className="module-body">
        <p>Progress: {completion === 100 ? "Completed" : "In progress"}</p>
        <p>Description:</p>
        <p>{goalDescription}</p>
      </div>
    </div>
  );
};

export default GoalModule;
