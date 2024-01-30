import { Link } from "react-router-dom";
import LongMenu from "./ModuleEditor";
import React from "react";
import { Module } from "../types";

interface ModuleProps {
    module: Module;
    editModule: (updatedModule: Module) => void;
    deleteModule: (id: number) => void;
  }

const ModuleItem = ({ module, editModule, deleteModule }: ModuleProps) => {
  console.log(module);
    return (
      <div className="flex flex-col transition-transform rounded border border-solid border-black w-[300px] h-[500px] duration-300 shadow-md hover:scale-110 hover:shadow-lg">
        <div className="flex">
          <div className="flex items-center justify-between w-full">
            <div className="h-full w-[14%]"></div>
            <h1 className="text-3xl font-extrabold">{module.module_name}</h1>
            <LongMenu
              dataName={module.module_name}
              dataDescription={module.description}
              id={module.module_id}
              moduleCompletion={module.completion_percent}
              editObject={editModule}
              deleteObject={deleteModule}
            />
          </div>
        </div>
        <hr />
        <Link
          to={`/goals/${module.module_id}`}
          className="flex flex-col justify-start w-full h-full text-left no-underline text-black gap-[5%] p-[5%] hover:underline"
        >
          <p className="text-2xl">
            <span className="text-2xl font-bold">Progress: </span>
            {module.completion_percent === 100 ? "Completed" : "In progress"}
          </p>
          <p className="text-2xl">{module.description}</p>
          <p className="text-2xl">{module.description}</p>
        </Link>
      </div>
    );
};
  
export default ModuleItem;