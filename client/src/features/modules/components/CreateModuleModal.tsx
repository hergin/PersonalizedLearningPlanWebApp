import React, { useState, useMemo } from "react";
import Modal from "@mui/material/Modal";
import { useHotKeys } from "../../../hooks/useHotKeys";
import { useModuleCreator } from "../hooks/useModules";
import { Button, TextField } from "@mui/material";

interface CreateModuleModalProps {
  accountId: number;
  isOpen: boolean;
  closeModal: () => void;
}

function CreateModuleModal({accountId, isOpen, closeModal}: CreateModuleModalProps) {
  const [newModule, setNewModule] = useState({name: "", description: ""});
  const { mutateAsync: createModule } = useModuleCreator(); 
  const { handleEnterPress } = useHotKeys();

  const submitDisabled = useMemo<boolean>(() => {
    var result = false;
    for(const value of Object.values(newModule)) {
      result = result || value === "";
    }
    return result;
  }, [newModule]);

  async function handleCreation() {
    await createModule({module_name: newModule.name, description: newModule.description, account_id: accountId});
    closeModal();
  }

  return (
    <Modal
      className="absolute float-left flex items-center justify-center top-2/4 left-2/4 "
      open={isOpen}
      onClose={closeModal}
    >
      <div className="bg-white w-2/4 flex flex-col items-center justify-start border border-black border-solid p-4 gap-5">
        <div className="w-full flex justify-center">
          <h1 className="font-headlineFont text-5xl">Create a new Goal Set</h1>
        </div>
        <div className="w-full h-full flex flex-col items-center justify-center gap-5 px-2">
          <TextField
            label="Name"
            value={newModule}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setNewModule({...newModule, name: event.target.value});
            }}
            onKeyUp={(event: React.KeyboardEvent) => {
              handleEnterPress(event, handleCreation, submitDisabled);
            }}
            inputProps={{"data-testid": "input-name"}}
            fullWidth
            required
          />
          <TextField
            label="Description"
            value={newModule.description}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setNewModule({...newModule, description: event.target.value});
            }}
            onKeyUp={(event: React.KeyboardEvent) => {
              handleEnterPress(event, handleCreation, submitDisabled);
            }}
            inputProps={{"data-testid": "input-description"}}
            fullWidth
            required
          />
          <Button
            variant="contained"
            onClick={async () => {
              await handleCreation()
            }}
            disabled={submitDisabled}
            className="w-2/4"
          >
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default CreateModuleModal;
