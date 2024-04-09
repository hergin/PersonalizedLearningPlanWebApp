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
            <DialogTitle>Edit Module</DialogTitle>
            <DialogContent>
            <TextField
                value={newModule.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewModule({
                    ...newModule, 
                    name: e.target.value
                })}
                onKeyDown={(event) => {
                    handleEnterPress(event, handleModuleEdit);
                }}
                fullWidth
                margin="normal"
            />
            <TextField
                value={newModule.description}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewModule({
                    ...newModule,
                    description: e.target.value
                })}
                onKeyDown={(event) => {
                    handleEnterPress(event, handleModuleEdit);
                }}
                fullWidth
                margin="normal"
            />
            <Button variant="contained" onClick={handleModuleEdit}>
                Save Changes
            </Button>
            </DialogContent>
      </Dialog>
    );
}
