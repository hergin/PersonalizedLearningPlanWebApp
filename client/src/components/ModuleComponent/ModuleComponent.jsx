import React from "react";
import ModuleCreator from "../ModuleCreator";
import { useModuleData } from "../../context/ModuleContext";
import "./ModuleComponent.css";
import LongMenu from "../ModuleEditor/ModuleEditor";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const ModuleComponent = () => {
  const {modules, setModules} = useModuleData();

  function addModule(module) {
    if (modules.includes(module)) {
      return;
    }
    let newModules = [].concat(modules);
    newModules.push(module);
    console.log(newModules);
    setModules(newModules);
  }

  function editModule(updatedModule) {
    const newModule = modules.map((module) => {
      if (module.module_id === updatedModule.id) {
        return {
          ...module,
          module_name: updatedModule.module_name,
          description: updatedModule.description,
        };
      }
      return module;
    });
    setModules(newModule);
  }

  const deleteModule = (id) => {
    const newModules = modules.filter((module) => module.module_id !== id);
    setModules(newModules);
  };

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
            editModule={editModule}
            deleteModule={deleteModule}
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
  editModule,
  deleteModule,
}) => {
  Module.propTypes = {
    moduleId: PropTypes.number,
    moduleName: PropTypes.string,
    moduleDescription: PropTypes.string,
    moduleCompletion: PropTypes.number,
    editModule: PropTypes.func,
    deleteModule: PropTypes.func,
  };
  return (
    <div className="module-div">
      <div className="module-header">
        <div className="header-content">
          <div className="empty-div"></div>
          <h1>{moduleName}</h1>
          <LongMenu
            editObject={editModule}
            dataName={moduleName}
            dataDescription={moduleDescription}
            id={moduleId}
            moduleCompletion={moduleCompletion}
            deleteObject={deleteModule}
          />
        </div>
      </div>
      <hr />
      <Link to={`/goals/${moduleId}`} className="module-body">
        <p>
          Progress: {moduleCompletion === 100 ? "Completed" : "In progress"}
        </p>
        <p>Description:</p>
        <p>{moduleDescription}</p>
      </Link>
    </div>
  );
};

export default ModuleComponent;
