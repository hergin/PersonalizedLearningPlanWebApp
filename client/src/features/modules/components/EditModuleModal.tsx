import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button
} from "@mui/material";
import { useHotKeys } from "../../../hooks/useHotKeys";
import { Module } from "../../../types"

interface EditModuleModalProps {
    module: Module,
    isOpen: boolean,
    editModule: (module: Module) => void,
    onClose: () => void,
}

export default function EditModuleModal({module, isOpen, editModule, onClose}: EditModuleModalProps) {
    const [newModule, setNewModule] = useState<Module>({...module});
    const { handleEnterPress } = useHotKeys();

    async function handleModuleEdit() {
        editModule(newModule);
        onClose();
    }

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle>
                Edit Goal Set
            </DialogTitle>
            <DialogContent>
                <TextField
                    value={newModule.name}
                    label="Name"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewModule({
                        ...newModule, 
                        name: e.target.value
                    })}
                    onKeyUp={(event) => {
                        handleEnterPress(event, handleModuleEdit);
                    }}
                    fullWidth
                    margin="normal"
                    inputProps={{"data-testid": "edit-name"}}
                />
                <TextField
                    value={newModule.description}
                    label="Description"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewModule({
                        ...newModule,
                        description: e.target.value
                    })}
                    onKeyUp={(event) => {
                        handleEnterPress(event, handleModuleEdit);
                    }}
                    fullWidth
                    margin="normal"
                    inputProps={{"data-testid": "edit-description"}}
                />
                <Button variant="contained" onClick={handleModuleEdit}>
                    Save Changes
                </Button>
            </DialogContent>
      </Dialog>
    );
}
