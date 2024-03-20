import React, { PropsWithChildren } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Button } from "@mui/material";
import { HiCheck, HiBackspace } from "react-icons/hi";

interface WarningDialogueProps extends PropsWithChildren {
    open: boolean,
    onConfirm: () => void,
    onCancel: () => void,
}

export default function WarningDialogue({open, onConfirm, onCancel, children, ...other}: WarningDialogueProps) {
    return (
        <Dialog open={open} onClose={onCancel} {...other}>
            <DialogTitle>
                Warning
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {children}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onConfirm} size="large" startIcon={<HiCheck />}>Confirm</Button>
                <Button onClick={onCancel} size="large" startIcon={<HiBackspace />}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}
