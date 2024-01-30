import React, { useState } from "react";
import { useModuleData } from "../context/ModuleContext";
import { Module } from "../types";
import CreationModal from "./CreationModal";
import ModuleItem from "./ModuleItem";

const ModuleComponent = () => {
  const { modules, setModules } = useModuleData();
  const [open, setOpen] = useState(false);

  function openModal(){
    setOpen(true)
  }

  function closeModal(){
    setOpen(false)
  }

  function addModule(module: Module) {
    if (modules.includes(module)) {
      return;
    }
    let newModules: Module[] = ([] as Module[]).concat(modules);
    newModules.push(module);
    console.log(newModules);
    setModules(newModules);
  }

  function editModule(updatedModule: Module) {
    const newModule = modules.map((module: Module) => {
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

  const deleteModule = (id: number) => {
    const newModules = modules.filter((module: Module) => module.id !== id);
    setModules(newModules);
  };

  return (
      <div className="flex flex-wrap w-full h-full justify-start gap-[5%]">
        {modules.map((module: Module) => (
          <ModuleItem
            key={`ID-${module.id}`}
            module={module}
            editModule={editModule}
            deleteModule={deleteModule}
          />
        ))}
        <div className="flex flex-col transition-transform rounded border border-solid border-black w-[300px] h-[500px] duration-300 shadow-md hover:scale-110 hover:shadow-lg">
          {" "}
          <button
            onClick={openModal}
            className="bg-transparent block h-full w-full no-underline items-center justify-center bg-white"
          >
            <h1>+</h1>
          </button>
          <CreationModal addModule={addModule} modalTitle="Create a new module" open={open} closeModal={closeModal}/>
        </div>
      </div>

  );
};



export default ModuleComponent;
