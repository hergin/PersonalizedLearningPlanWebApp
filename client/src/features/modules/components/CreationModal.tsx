import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import { useUser } from "../../../hooks/useUser";
import { useHotKeys } from "../../../hooks/useHotKeys";
import { ModuleCreatorProps } from "../../../types";
import { useModuleCreator } from "../hooks/useModules";

function CreationModal({
  modalTitle,
  open,
  closeModal,
}: ModuleCreatorProps) {
  const [moduleName, setModuleName] = useState("");
  const [description, setDescription] = useState("");
  const submitDisabled = moduleName === "" || description === "";
  const { user } = useUser();
  const { mutateAsync: createModule } = useModuleCreator(); 
  const { handleEnterPress } = useHotKeys();

  return (
    <Modal
      className="absolute float-left flex items-center justify-center top-2/4 left-2/4 "
      open={open}
      onClose={closeModal}
    >
      <div className="bg-white w-2/4 flex flex-col items-center justify-start border border-black border-solid p-4 gap-5">
        <div className="w-full flex justify-center">
          <h1 className="font-headlineFont text-5xl">{modalTitle}</h1>
        </div>
        <div className="w-full h-full flex flex-col items-center justify-center gap-5">
          <input
            className="h-10 rounded text-base w-full border border-solid border-gray-300 px-2"
            name="module"
            type="text"
            placeholder="Module Name"
            value={moduleName}
            onChange={(event) => {
              setModuleName(event.target.value);
            }}
            onKeyUp={(event) => {
              handleEnterPress(event, async () => {
                await createModule({module_name: moduleName, description, account_id: user.id})
              }, submitDisabled);
            }}
            required
          />
          <input
            className="h-10 rounded text-base w-full border border-solid border-gray-300 px-2"
            name="module"
            type="text"
            placeholder="Module Description"
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
            }}
            onKeyUp={(event) => {
              if (submitDisabled) {
                return;
              }
              handleEnterPress(event, async () => {
                await createModule({module_name: moduleName, description, account_id: user.id})
              }, submitDisabled);
            }}
            required
          />
          <button
            onClick={async () => {
              await createModule({module_name: moduleName, description, account_id: user.id})
            }}
            disabled={submitDisabled}
            className="w-6/12 h-10 border-1 border-solid border-gray-300 rounded px-2 text-base bg-element-base text-text-color hover:bg-[#820000] hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-element-base"
          >
            Submit
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default CreationModal;
