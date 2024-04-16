import React, { useEffect, useState } from "react";
import { useProfile } from "../hooks/useProfile";
import { useAuth } from "../../../context/AuthContext";
import { Fab, Tooltip, CircularProgress } from "@mui/material";
import { HiOutlinePencil, HiTrash } from "react-icons/hi";
import ProfileEditor from "./ProfileEditor";
import AccountDeletionWarning from "./AccountDeletionWarning";
import ProfileDisplay from "./ProfileDisplay";
import useDocumentTitle from "../../../hooks/useTitle"
import Load from "../../../components/LoadScreen";
import Error from "../../../components/ErrorScreen";

export default function ProfileScreen() {
  const [isWarningOpen, setIsWarningOpen] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const { user } = useAuth();
  const { data: profileData, isLoading, error } = useProfile(user.id);

  useDocumentTitle("Personalized Learning Plan | Profile");

  if (isLoading) {
    return <Load/>;
  }

  if (error) {
    return <Error error={error}/>;
  }

  console.log(JSON.stringify(profileData));

  return (
    <div className="flex flex-col h-full justify-center items-center my-2.5 mx-2.5 gap-1">
      <ProfileEditor
        open={editMode}
        accountId={user.id}
        profile={{
          id: profileData[0].profile_id,
          username: profileData[0].username,
          firstName: profileData[0].first_name,
          lastName: profileData[0].last_name,
          jobTitle: profileData[0].job_title,
          bio: profileData[0].bio
        }}
        onSave={() => {setEditMode(false);}}
        onCancel={() => {setEditMode(false)}}
      />
      <AccountDeletionWarning
        open={isWarningOpen}
        accountId={user.id}
        onClose={() => setIsWarningOpen(false)}
      />
      <ProfileDisplay profile={{
        id: profileData[0].profile_id,
        username: profileData[0].username,
        firstName: profileData[0].first_name,
        lastName: profileData[0].last_name,
        jobTitle: profileData[0].job_title,
        bio: profileData[0].bio
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
