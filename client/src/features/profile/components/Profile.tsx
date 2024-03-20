import React, { useState, useEffect } from "react";
import { useProfile } from "../hooks/useProfile";
import { emptyProfile, Profile } from "../../../types";
import { useAuth } from "../../../context/AuthContext";
import { Fab, Tooltip } from "@mui/material";
import { HiOutlinePencil, HiTrash } from "react-icons/hi";
import ProfileEditor from "./ProfileEditor";
import AccountDeletionWarning from "./AccountDeletionWarning";
import ProfileDisplay from "./ProfileDisplay";

export default function ProfileScreen() {
  const [isWarningOpen, setIsWarningOpen] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const { user } = useAuth();
  const { data: profileData, isLoading, error } = useProfile(user.id);

  useEffect(() => {
    if (isLoading || error) {
      return;
    }

    setProfile({
      id: profileData.profile_id,
      username: profileData.username,
      firstName: profileData.first_name,
      lastName: profileData.last_name,
      profilePicture: profileData.profile_picture,
      jobTitle: profileData.job_title,
      bio: profileData.bio,
    });
  }, [profileData, isLoading, error]);

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
        profile={profile}
        onSave={(newProfile: Profile) => {
          setProfile(newProfile);
          setEditMode(false);
        }}
        onCancel={() => {setEditMode(false)}}
      />
      <AccountDeletionWarning 
        open={isWarningOpen} 
        accountId={user.id} 
        onClose={() => setIsWarningOpen(false)}
      />
      <ProfileDisplay profile={profile} />
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
