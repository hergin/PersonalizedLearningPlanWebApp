import React from "react";
import ModuleCreator from "../ModuleCreator/ModuleCreator";
import { useModuleData } from "../../context/ModuleContext";
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
    <button className="bg-transparent block h-full w-full no-underline items-center justify-center">
      <div className="flex flex-wrap w-full h-full justify-start gap-[5%]">
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
    <div className="flex flex-col transition-transform rounded border border-solid border-black w-[300px] h-[500px] duration-300 shadow-md hover:scale-110 hover:shadow-lg">
      <div className="flex">
        <div className="flex items-center justify-between w-full">
          <div className="h-full w-[14%]"></div>
          <h1 className="text-3xl font-extrabold">{module.name}</h1>
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
      <Link to={`/goals/${module.id}`} className="flex flex-col justify-start w-full h-full text-left no-underline text-black gap-[5%] p-[5%] hover:underline">
        <p className="text-2xl">
          <span className="text-2xl font-bold">Progress: </span>
          {module.completion === 100 ? "Completed" : "In progress"}
        </p>
        <p className="text-2xl">{module.description}</p>
      </Link>
    </div>
  );
};

export default ModuleComponent;
