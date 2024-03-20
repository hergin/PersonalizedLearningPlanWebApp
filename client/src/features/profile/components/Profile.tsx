import React, { useState, useEffect, useMemo, ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { useDeletionService } from "../../login/hooks/useAccountServices";
import { useProfile } from "../hooks/useProfile";
import { emptyProfile, Profile } from "../../../types";
import { startCase } from "lodash";
import ProfilePicture from "../../../components/ProfilePicture";
import { useAuth } from "../../../context/AuthContext";
import ProfileEditor from "./ProfileEditor";

const STYLE = {
  containerHeight: "h-[50vh]",
  containerWidth: "w-[30vw]",
  aboutMeSize: "h-[25vh] w-[28vw]",
  borderValues: "border-[0.8px] border-solid border-[rgb(219, 219, 219)]",
  defaultGap: "gap-[5px]",
  flexColumn: "flex flex-col",
};

const INFORMATION_CONTAINER_STYLE = `${STYLE.containerHeight} ${STYLE.containerWidth} ${STYLE.borderValues} ${STYLE.flexColumn} justify-around content-normal p-[10px] mx-[40px] mt-[24px] ${STYLE.defaultGap} text-[24px]`;
const BUTTON_STYLE = `h-[40px] ${STYLE.borderValues} rounded px-[8px] text-[16px] bg-[#8C1515] text-white`;

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
    <div
      className={`h-[90vh] ${STYLE.flexColumn} justify-center items-center py-[10px] my-[20px] mx-[10px] ${STYLE.defaultGap}`}
    >
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
        className={`h-[calc(${STYLE.containerHeight} - 15)] ${STYLE.containerWidth} ${STYLE.borderValues} ${STYLE.flexColumn} items-center m-[10px] py-[25px] px-[10px] ${STYLE.defaultGap}`}
      >
        <ProfilePicture style="size-16" />
        <p className="text-[30px] mb-[0px]">{profile.username}</p>
      </div>
      <div className={INFORMATION_CONTAINER_STYLE}>
        {defaultDisplayElements}
        <p>About Me:</p>
        <br />
        <div className={`${STYLE.aboutMeSize}`}>
          <p>{profile.bio ? profile.bio : ""}</p>
        </div>
      </div>
      <div className={`${STYLE.flexColumn} ${STYLE.defaultGap}`}>
            <button className={BUTTON_STYLE} onClick={() => setEditMode(true)}>
          Edit Profile
        </button>
        <button className={BUTTON_STYLE} onClick={onDeletion}>
          Delete Account
        </button>
      </div>
    </div>
  );
}
