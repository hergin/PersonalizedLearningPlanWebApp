import React, { useState } from "react";
import { Link } from "react-router-dom";
import ModuleLongMenu from "./ModuleLongMenu";
import { Module } from "../../../types";
import { Tooltip } from "@mui/material";
import EditModuleModal from "./EditModuleModal";
import WarningDialogue from "../../../components/WarningDialogue";

interface ModuleItemProps {
  module: Module;
  editModule: (updatedModule: Module) => void;
  deleteModule: (id: number) => void;
}

export default function ModuleItem({ module, editModule, deleteModule }: ModuleItemProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isWarningOpen, setIsWarningOpen] = useState<boolean>(false);
  
  return (
    <>
      <EditModuleModal
        module={module}
        isOpen={isEditModalOpen}
        editModule={editModule}
        onClose={() => {setIsEditModalOpen(false)}}
      />
      <WarningDialogue 
        open={isWarningOpen} 
        onConfirm={() => {deleteModule(module.id)}} 
        onCancel={() => setIsWarningOpen(false)}
      >
          {`Are you sure you want to delete ${module.name}?`}
      </WarningDialogue>
      <Tooltip
        key={Symbol().toString()} 
        title="View Goal Set" 
        placement="bottom"
      >
        <div className="flex flex-col transition-transform rounded border border-solid border-black w-[300px] h-5/6 duration-300 shadow-md hover:scale-105 hover:shadow-lg bg-white">
            <div className="flex">
              <div className="flex items-center justify-between w-full bg-[#8C1515]">
                <div className="h-full w-[14%]"></div>
                <h1 className="text-3xl text-white truncate">{module.name}</h1>
                <ModuleLongMenu
                  onEditPress={() => setIsEditModalOpen(true)}
                  onDeletionPress={() => setIsWarningOpen(true)}
                />
              </div>
            </div>
            <hr />
            <Link
              to={`/goals/${module.id}`}
              className="flex flex-col justify-start w-full h-full text-left no-underline text-black gap-[5%] p-[5%] hover:underline"
            >
              <div className="p-3">
                <p className="text-2xl line-clamp-2">
                  <span className="text-2xl font-bold">Progress: </span>
                  {module.completion === 100 ? "Completed" : "In progress"}
                </p>
                <br />
                <p className="text-2xl line-clamp-5">{module.description}</p>
              </div>
            </Link>
        </div>
      </Tooltip>
    </>
  );
}
