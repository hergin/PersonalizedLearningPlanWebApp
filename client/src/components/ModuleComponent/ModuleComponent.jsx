import React, { useState, useEffect } from "react";
import axios from "axios";
import ModuleCreator from "../ModuleCreator";
import { useUser } from "../../hooks/useUser";
import "./ModuleComponent.css";

const ModuleComponent = () => {
  const [modules, setModules] = useState([]);
  const { user } = useUser();
  
  useEffect(() => {
    async function getModules() {
      console.log(`User: ${user.email} ${user.accessToken} ${user.refreshToken}`);
      const result = await axios.post(
        "http://localhost:4000/api/module/get",
        {email: user.email}
      );
      console.log(`Resulting data: ${result.data} ${result.data.module_name} ${result.data.description} ${result.data.completion_percent}`);
      var newModules = [];
      for(var module of result.data) {
        console.log(`Adding ${module.module_name}`)
        newModules.push(module);
      }
      setModules(newModules);
    }
    
    getModules();
  }, [user]);
  
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
