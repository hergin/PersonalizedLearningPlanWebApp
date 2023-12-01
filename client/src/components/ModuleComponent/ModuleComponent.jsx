import React, { useState, useEffect } from "react";
import ModuleCreator from "../ModuleCreator";
import { ApiClient } from "../../hooks/ApiClient";
import { useUser } from "../../hooks/useUser";
import "./ModuleComponent.css";

const ModuleComponent = () => {
  const [modules, setModules] = useState([]);
  const { user } = useUser();
  const { get } = ApiClient();
  
  useEffect(() => {
    async function getModules() {
      try {
        console.log(`User: ${user.email} ${user.accessToken} ${user.refreshToken}`);
        const result = await get(`/module/${user.email}`);
        console.log(`Resulting data: ${result}`);
        var newModules = [];
        for(var module of result) {
          console.log(`Adding ${module.module_name}`)
          newModules.push(module);
        }
        setModules(newModules);
      } catch(error) {
        console.error(error);
        alert((error.message) ? error.message : error);
      }
    }
    
    getModules();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  function addModule(module) {
    if(modules.includes(module)) {
      return;
    }
    var newModules = [].concat(modules);
    newModules.push(module);
    console.log(newModules);
    setModules(newModules);
  }

  return (
    <button className="fill-div">
      <div className="module-container" style={{}}>
        {modules.map((module) => (
          <Module
            key={`ID-${module.module_id}`}
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

export default ModuleComponent;
