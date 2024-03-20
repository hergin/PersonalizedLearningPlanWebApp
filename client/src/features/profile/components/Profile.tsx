import React, { useState, useEffect, useMemo, ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { useDeletionService } from "../../login/hooks/useAccountServices";
import { useProfile } from "../hooks/useProfile";
import { emptyProfile, Profile } from "../../../types";
import { startCase } from "lodash";
import ProfilePicture from "../../../components/ProfilePicture";
import { useAuth } from "../../../context/AuthContext";
import ProfileEditor from "./ProfileEditor";
import { Fab, Tooltip } from "@mui/material";
import { HiOutlinePencil, HiTrash } from "react-icons/hi";

const STYLE = {
  containerHeight: "h-[51vh]",
  containerWidth: "w-[40vw]",
  borderValues: "border-[0.8px] border-solid border-[rgb(219, 219, 219)]",
  defaultGap: "gap-1",
  flexColumn: "flex flex-col",
};

export default function ProfileScreen() {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profileData, isLoading, error } = useProfile(user.id);
  const { mutateAsync: deleteAccount } = useDeletionService();

  const defaultDisplayElements = useMemo<ReactElement[]>(() => {
    const result: ReactElement[] = [];
    const nonDefaultElements: string[] = ["username", "profilePicture", "bio"];
    for(const [key, value] of Object.entries(profile)) {
      if(typeof value === "number" || nonDefaultElements.includes(key)) {
        continue;
      }

      result.push(
        <div className={`flex flex-row ${STYLE.defaultGap} justify-between text-start`}>
            <p>{`${startCase(key)}:`}</p>
            <p>{value ? value : ""}</p>
        </div>
      );
    }
    return result;
  }, [profile]);

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

  async function onDeletion() {
    await deleteAccount({accountId: user.id, profileId: profile.id});
    navigate("/#");
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>An error has occurred!</div>;
  }

  return (
    <div className={`h-full ${STYLE.flexColumn} justify-center items-center my-2.5 mx-2.5 ${STYLE.defaultGap}`}>
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
      <div
        className={`h-[calc(${STYLE.containerHeight} - 15)] ${STYLE.containerWidth} ${STYLE.borderValues} ${STYLE.flexColumn} items-center m-2.5 py-2 px-2.5 ${STYLE.defaultGap}`}
      >
        <ProfilePicture style="size-16" />
        <p className="text-[30px] mb-[0px]">{profile.username}</p>
      </div>
      <div className={`${STYLE.containerHeight} ${STYLE.containerWidth} ${STYLE.borderValues} ${STYLE.flexColumn} justify-around content-normal p-[10px] mx-[40px] mt-[24px] ${STYLE.defaultGap} text-2xl`}>
        {defaultDisplayElements}
        <p>About Me:</p>
        <div className={`text-lg ${STYLE.borderValues} p-2 m-2 h-4/5`}>
          <p>{profile.bio ? profile.bio : ""}</p>
        </div>
      </div>
      <div className="w-11/12 flex flex-row flex-wrap justify-end gap-3">
        <Tooltip title="Edit Profile" placement="top">
          <Fab color="primary" onClick={() => setEditMode(true)} size="large">
            <HiOutlinePencil className="size-6" />
          </Fab>
        </Tooltip>
        <Tooltip title="Delete Account" placement="top">
          <Fab color="primary" onClick={onDeletion}>
            <HiTrash className="size-6" />
          </Fab>
        </Tooltip>
      </div>
    </div>
  );
}
