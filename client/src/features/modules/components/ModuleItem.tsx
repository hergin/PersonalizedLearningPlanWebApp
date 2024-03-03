import React from "react";
import { Link } from "react-router-dom";
import LongMenu from "./ModuleEditor";
import { Module } from "../../../types";

interface ModuleProps {
  module: Module;
  editModule: (updatedModule: Module) => void;
  deleteModule: (id: number) => void;
}

const ModuleItem = ({ module, editModule, deleteModule }: ModuleProps) => {
  console.log(module);
  return (
    <div className="flex flex-col transition-transform rounded border border-solid border-black w-[300px] h-[500px] duration-300 shadow-md hover:scale-105 hover:shadow-lg bg-white">
      <div className="flex">
        <div className="flex items-center justify-between w-full bg-[#8C1515]">
          <div className="h-full w-[14%]"></div>
          <h1 className="text-3xl text-white">{module.name}</h1>
          <LongMenu
            moduleName={module.name}
            moduleDescription={module.description}
            id={module.id}
            moduleCompletion={module.completion}
            editFunction={editModule}
            deleteFunction={deleteModule}
          />
        </div>
      </div>
      <hr />
      <Link
        to={`/goals/${module.id}`}
        className="flex flex-col justify-start w-full h-full text-left no-underline text-black gap-[5%] p-[5%] hover:underline"
      >
        <p className="text-2xl">
          <span className="text-2xl font-bold">Progress: </span>
          {module.completion === 100 ? "Completed" : "In progress"}
        </p>
        <p className="text-2xl">{module.description}</p>
        <p className="text-2xl">{module.description}</p>
      </Link>
    </div>
  );
};

export default ModuleItem;
