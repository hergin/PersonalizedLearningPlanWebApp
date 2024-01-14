import React from "react";
import ModuleCreator from "../ModuleCreator/ModuleCreator";
import { useModuleData } from "../../context/ModuleContext";
import "./ModuleComponent.css";
import LongMenu from "../ModuleEditor/ModuleEditor";
import { Link } from "react-router-dom";
import { Module } from "../../custom_typing/types";

const ModuleComponent = () => {
  const { modules, setModules } = useModuleData();

  function addModule(module : Module) {
    if (modules.includes(module)) {
      return;
    }
    let newModules : Module[] = ([] as Module[]).concat(modules);
    newModules.push(module);
    console.log(newModules);
    setModules(newModules);
  }

  function editModule(updatedModule : Module) {
    const newModule = modules.map((module : Module) => {
      if (module.id === updatedModule.id) {
        return {
          ...module,
          name: updatedModule.name,
          description: updatedModule.description,
        };
      }
      return module;
    });
    setModules(newModule);
  }

  const deleteModule = (id : number) => {
    const newModules = modules.filter((module : Module) => module.id !== id);
    setModules(newModules);
  };

  return (
    <button className="fill-div">
      <div className="module-container">
        {modules.map((module : Module) => (
          <ModuleDisplay
            key={`ID-${module.id}`}
            module={module}
            editModule={editModule}
            deleteModule={deleteModule}
          />
        ))}
        <ModuleCreator addModule={addModule} />
      </div>
    </button>
  );
};

interface ModuleProps {
  module: Module,
  editModule: (updatedModule: Module) => void,
  deleteModule: (id: number) => void
}

const ModuleDisplay = ({module, editModule, deleteModule}: ModuleProps) => {
  return (
    <div className="module-div">
      <div className="module-header">
        <div className="header-content">
          <div className="empty-div"></div>
          <h1>{module.name}</h1>
          <LongMenu
            dataName={module.name}
            dataDescription={module.description}
            id={module.id}
            moduleCompletion={module.completion}
            editObject={editModule}
            deleteObject={deleteModule}
          />
        </div>
      </div>
      <hr />
      <Link to={`/goals/${module.id}`} className="module-body">
        <p>
          <span>Progress: </span>
          {module.completion === 100 ? "Completed" : "In progress"}
        </p>
        <p>{module.description}</p>
      </Link>
    </div>
  );
};

export default ModuleComponent;
