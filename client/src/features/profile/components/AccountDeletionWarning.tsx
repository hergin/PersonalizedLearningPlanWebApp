import React from "react";
import WarningDialogue from "../../../components/WarningDialogue";
import { useDeletionService } from "../../login/hooks/useAccountServices";
import { useNavigate } from "react-router-dom";

interface AccountDeletionWarningProps {
    open: boolean,
    accountId: number,
    onClose: () => void,
}

export default function AccountDeletionWarning({open, accountId, onClose, ...other}: AccountDeletionWarningProps) {
    const { mutateAsync: deleteAccount } = useDeletionService();
    const navigate = useNavigate();

    async function handleDelete() {
        await deleteAccount(accountId);
        navigate("/#");
    }

    return (
        <WarningDialogue open={open} onConfirm={handleDelete} onCancel={onClose} {...other}>
            Are you sure you want to delete your account?
        </WarningDialogue>
    )
}
