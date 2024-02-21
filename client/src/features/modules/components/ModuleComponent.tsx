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
