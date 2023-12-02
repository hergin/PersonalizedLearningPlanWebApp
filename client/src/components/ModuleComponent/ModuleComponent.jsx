import React, { useEffect, useState } from "react";
import ModuleCreator from "../ModuleCreator";
import { ApiClient } from "../../hooks/ApiClient";
import { useUser } from "../../hooks/useUser";
import "./ModuleComponent.css";
import { Link } from "react-router-dom";

const ModuleComponent = () => {
  const [modules, setModules] = useState([]);
  const { user } = useUser();
  const { get } = ApiClient();

  useEffect(() => {
    async function getModules() {
      try {
        console.log(
          `User: ${user.email} ${user.accessToken} ${user.refreshToken}`,
        );
        const result = await get(`/module/get/${user.email}`);
        console.log(`Resulting data: ${result}`);
        var newModules = [];
        for (var module of result) {
          console.log(`Adding ${module.module_name}`);
          newModules.push(module);
        }
        setModules(newModules);
      } catch (error) {
        console.error(error);
        alert(error.message ? error.message : error);
      }
    }

    getModules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addModule(module) {
    if (modules.includes(module)) {
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
            moduleId={module.module_id}
            moduleName={module.module_name}
            moduleDescription={module.description}
            moduleCompletion={module.completion_percent}
          />
        ))}
        <ModuleCreator addModule={addModule} />
      </div>
    </button>
  );
};

const Module = ({
  moduleId,
  moduleName,
  moduleDescription,
  moduleCompletion,
}) => {
  return (
    <Link to={`/goals/${moduleId}`} className="module-div">
      <div className="module-header">
        <h1>{moduleName}</h1>
      </div>
      <div className="module-body">
        <p>
          Progress: {moduleCompletion === 100 ? "Completed" : "In progress"}
        </p>
        <p>Description:</p>
        <p>{moduleDescription}</p>
      </div>
    </Link>
  );
};

export default ModuleComponent;
