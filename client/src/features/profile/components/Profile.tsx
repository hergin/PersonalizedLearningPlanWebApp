import React, { useState } from "react";
import { useProfile } from "../hooks/useProfile";
import { useAuth } from "../../../context/AuthContext";
import { Fab, Tooltip } from "@mui/material";
import { HiOutlinePencil, HiTrash } from "react-icons/hi";
import ProfileEditor from "./ProfileEditor";
import AccountDeletionWarning from "./AccountDeletionWarning";
import ProfileDisplay from "./ProfileDisplay";
import DropDownCheckbox from "../../../components/dropDown/DropDownCheckbox";
import { useSettings, useSettingsMutation } from "../../../hooks/useSettings";

export default function ProfileScreen() {
  const [isWarningOpen, setIsWarningOpen] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const { user } = useAuth();
  const { mutate: updateSettings } = useSettingsMutation(user.id);
  const { data: profileData, isLoading, error } = useProfile(user.id);
  const { data } = useSettings(user.id);


  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>An error has occurred!</div>;
  }

  return (
    <div className="flex flex-col h-full justify-center items-center my-2.5 mx-2.5 gap-1">
      <ProfileEditor
        open={editMode} 
        accountId={user.id}
        profile={{
          id: profileData.profile_id,
          username: profileData.username,
          firstName: profileData.first_name,
          lastName: profileData.last_name,
          profilePicture: profileData.profile_picture,
          jobTitle: profileData.job_title,
          bio: profileData.bio
        }}
        onSave={() => {setEditMode(false);}}
        onCancel={() => {setEditMode(false)}}
      />
      <DropDownCheckbox 
          handleCheckToggle={(checked) => updateSettings({allowCoachInvitations: data[0].allow_coach_invitations, receiveEmails: checked})} 
          checked={data[0].receive_emails}
        >
          Recieve Emails
        </DropDownCheckbox>
        <DropDownCheckbox 
          handleCheckToggle={(checked) => updateSettings({receiveEmails: data[0].receive_emails, allowCoachInvitations: checked})} 
          checked={data[0].allow_coach_invitations}
        >
          Participate In Coaching
        </DropDownCheckbox>
      <AccountDeletionWarning 
        open={isWarningOpen} 
        accountId={user.id} 
        onClose={() => setIsWarningOpen(false)}
      />
      <ProfileDisplay profile={{
        id: profileData.profile_id,
        username: profileData.username,
        firstName: profileData.first_name,
        lastName: profileData.last_name,
        profilePicture: profileData.profile_picture,
        jobTitle: profileData.job_title,
        bio: profileData.bio
      }} />
      <div className="w-11/12 flex flex-row flex-wrap justify-end gap-3">
        <Tooltip title="Edit Profile" placement="top">
            <Fab color="primary" onClick={() => setEditMode(true)} size="large">
                <HiOutlinePencil className="size-6" />
            </Fab>
        </Tooltip>
        <Tooltip title="Delete Account" placement="top">
            <Fab color="primary" onClick={() => setIsWarningOpen(true)} size="large">
                <HiTrash className="size-6" />
            </Fab>
        </Tooltip>
      </div>
    </div>
  );
}
