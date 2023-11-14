import React, { useState } from "react";
import ModuleCreator from "../ModuleCreator";
import { genID } from "../../utils/rng";
import "./Goalmodule.css";

const GoalModule = () => {
  const sample = [
    {
      module_id: genID(),
      module_name: "example",
      description: "This is an example module.",
      completion_percent: 100,
      email: "example@Gmail.com"
    }
  ];
  const [modules, setModules] = useState(sample);  
  
  console.log("Re-rendered!");
  
  function addModule(module) {
    var newModules = [].concat(modules);
    newModules.push(module);
    setModules(newModules);
    console.log(modules);
  }

  return (
    <button className="fill-div">
      <div className="module-container" style={{}}>
        {modules.map((module) => (
          <Module
            key={module.module_id}
            goalName={module.module_name}
            goalDescription={module.description}
            completion={module.completion_percent}
          />
        ))}
        <ModuleCreator addModule={addModule}/>
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
