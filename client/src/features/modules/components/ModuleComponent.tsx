import React, { useState } from "react";
import CreationModal from "./CreationModal";
import ModuleItem from "./ModuleItem";
import { useModules } from "../hooks/useModules";

const ModuleComponent = () => {
  const { data: modules, isLoading, isError } = useModules();
  console.log(modules);
  const [open, setOpen] = useState(false);

  function openModal() {
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  /*   function addModule(module: Module) {
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
  }; */

  return (
    <div className="flex flex-wrap w-full h-full justify-start gap-[5%]">
      {modules?.map((module: any) => (
        <ModuleItem
          key={module.module_id}
          module={module}
          editModule={() => console.log("edit")}
          deleteModule={() => console.log("delete")}
        />
      ))}
      <div className="flex flex-col transition-transform rounded border border-solid border-black w-[300px] h-[500px] duration-300 shadow-md hover:scale-105 hover:shadow-lg">
        <button
          onClick={openModal}
          className="bg-transparent block h-full w-full no-underline items-center justify-center bg-white"
        >
          <h1>+</h1>
        </button>
        <CreationModal
          addModule={() => console.log("add")}
          modalTitle="Create a new module"
          open={open}
          closeModal={closeModal}
        />
      </div>
    </div>
  );
};

export default ModuleComponent;
