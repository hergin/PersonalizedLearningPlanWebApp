import React, { useMemo } from "react";
import { Switch, Dialog, DialogTitle, DialogContent, DialogActions, Button, FormGroup, FormControlLabel } from "@mui/material";
import { useSettings, useSettingsMutation } from "../hooks/useSettings";
import { Settings, defaultSettings, User } from "../types";

interface SettingsModalProps {
    user: User,
    isOpen: boolean,
    onClose: () => void
}

export default function SettingsModal({user, isOpen, onClose, ...other}: SettingsModalProps) {
    const { data, isLoading, error } = useSettings(user.id);
    const { mutate: updateSettings } = useSettingsMutation(user.id);
    const settings = useMemo<Settings>(() => {
        return isLoading || error ? defaultSettings : {
            receiveEmails: data[0].receive_emails,
            allowCoachInvitations: data[0].allow_coach_invitations
        };
    }, [data, isLoading, error]);

    if(isLoading) {
        return <p data-testid="loadingText">Loading...</p>;
    }
    
    if(error) {
        return <p data-testid="errorText">An error has occurred!</p>;
    }

    return (
        <Dialog open={isOpen} onClose={onClose} {...other}>
            <DialogTitle className="text-center">
                <h1 className="font-headlineFont text-4xl">Settings</h1>
            </DialogTitle>
            <DialogContent dividers className="flex flex-col self-start w-full">
                <FormGroup className="gap-5">
                    <FormControlLabel 
                        control={
                            <Switch
                                checked={settings.receiveEmails} 
                                onChange={(event) => {
                                    updateSettings({...settings, receiveEmails: event.target.checked})
                                }}
                            />
                        }
                        label={<p className="font-bodyFont text-xl">Receive Emails</p>}
                        className="p-1"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.allowCoachInvitations}
                                onChange={(event) => {
                                    updateSettings({...settings, allowCoachInvitations: event.target.checked})
                                }}
                            />
                        }
                        label={<p className="font-bodyFont text-xl">Allow Coach Invitations</p>}
                        className="p-1"
                    />
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                    size="large"
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}
