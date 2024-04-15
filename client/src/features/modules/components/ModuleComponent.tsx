import React, { useState } from "react";
import CreateModuleModal from "./CreateModuleModal";
import ModuleItem from "./ModuleItem";
import { useModules, useModuleUpdater, useModuleRemover } from "../hooks/useModules";
import { Module } from "../../../types";
import { Fab } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

interface ModuleComponentProps {
  accountId: number
}

const ModuleComponent = ({accountId}: ModuleComponentProps) => {
  const { data: modules, isLoading, error } = useModules(accountId);
  const { mutateAsync: updateModule } = useModuleUpdater();
  const { mutateAsync: deleteModule } = useModuleRemover();
  const [ isCreateModalOpen, setIsCreateModalOpen ] = useState<boolean>(false);

  if (isLoading) {
    return <div>Loading, please wait...</div>;
  }

  if (error) {
    return <div>An error has occurred. Please refresh the page and try again.</div>;
  }

  return (
    <div className="flex flex-wrap w-full h-full justify-start mb-2">
      <CreateModuleModal
        accountId={accountId}
        isOpen={isCreateModalOpen}
        closeModal={() => setIsCreateModalOpen(false)}
      />
      <div className="flex flex-wrap gap-3 h-5/6 w-full overflow-y-auto px-5 py-10 bg-[#F1F1F1]">
        {modules?.map((module: any) => (
          <ModuleItem
            key={module.module_id}
            module={{...module, id: module.module_id, name: module.module_name, completion: module.completion_percent}}
            editModule={async (module: Module) => {await updateModule(module)}}
            deleteModule={async (id: number) => {await deleteModule(id)}}
          />
        ))}
      </div>
      <div className="flex flex-row flex-wrap justify-center items-end pt-5 mb-5 w-full h-1/6">
        <Fab variant="extended" size="medium" color="primary" onClick={() => {setIsCreateModalOpen(true)}}>
          <AddIcon />
          Create Goal Set
        </Fab>
      </div>
    </div>
  );
};

export default ModuleComponent;
