import React, { useState, useMemo, useCallback, ReactElement } from "react";
import { Button, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { Profile } from "../../../types";
import { useHotKeys } from "../../../hooks/useHotKeys";
import { useProfileUpdater } from "../hooks/useProfile";
import TextBox from "./TextBox";

interface ProfileEditorProps {
    accountId: number,
    profile: Profile,
    open: boolean,
    onSave: (newProfile: Profile) => void,
    onCancel: () => void
}

const DEFAULT_BORDER = "border-[0.8px] border-solid border-[rgb(219, 219, 219)]";

export default function ProfileEditor({accountId, profile, open, onSave, onCancel}: ProfileEditorProps) {
    const [newProfile, setNewProfile] = useState<Profile>({...profile});
    const { mutateAsync: updateProfile } = useProfileUpdater(accountId);
    const { handleEnterPress } = useHotKeys();

    const saveChanges = useCallback(async () => {
        await updateProfile(newProfile);
        onSave(newProfile);
    }, [newProfile, updateProfile, onSave]);

    const textBoxes = useMemo<ReactElement[]>(() => {
        const requiredFields: string[] = ["username", "firstName", "lastName"];
        const noTextInput: string[] = ["profilePicture", "bio"];
        const result: ReactElement[] = [];
        for(const [key, value] of Object.entries(newProfile)) {
            if(typeof value === "number" || noTextInput.includes(key)) {
                continue;
            }
            
            result.push(
                <TextBox
                    name={key} 
                    value={value}
                    onEnterPress={(event: React.KeyboardEvent) => handleEnterPress(event, saveChanges)}
                    onChange={(event: React.ChangeEvent) => {
                        const editedProfile: Profile = {...newProfile};
                        editedProfile[key] = (event.target as HTMLInputElement).value;
                        setNewProfile(editedProfile);
                    }}
                    required={requiredFields.includes(key)}
                />
            );
        }
        return result;
    }, [newProfile, setNewProfile, saveChanges, handleEnterPress]);    

    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogContent>
                <div className="gap-[5px]">
                    <div className={`flex flex-col h-[50vh] w-[30vw] ${DEFAULT_BORDER} justify-around content-normal p-[10px] mx-[40px] my-[24px] text-[24px] gap-[10px]`}>
                        {textBoxes}
                        <p>About Me:</p>
                        <input
                            id="bio"
                            name="profile"
                            type="textarea"
                            placeholder="bio"
                            value={newProfile.bio}
                            defaultValue={newProfile.bio}
                            onKeyUp={(event) => {
                                handleEnterPress(event, saveChanges);
                            }}
                            onChange={(event) => {
                                setNewProfile({
                                    ...newProfile,
                                    bio: event.target.value,
                                });
                            }}
                            className={`h-[25vh] w-[28vw] px-[8px] text-[16px] ${DEFAULT_BORDER}`}
                        />
                    </div>
                    <div className={"flex flex-row gap-[5px] justify-center"}> 
                        <Button variant="contained" onClick={saveChanges}>Confirm</Button>
                        <Button variant="contained" onClick={onCancel}>Cancel</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
