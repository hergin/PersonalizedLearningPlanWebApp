import React, { useState, useEffect, useMemo, useCallback, ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../login/hooks/useUser";
import { useDeletionService } from "../../login/hooks/useAccountServices";
import { useProfile, useProfileUpdater } from "../hooks/useProfile";
import { useHotKeys } from "../../../hooks/useHotKeys";
import { emptyProfile, Profile } from "../../../types";
import { startCase } from "lodash";
import ProfilePicture from "../../../components/ProfilePicture";
import TextBox from "./TextBox";

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
  const { user } = useUser();
  const { data: profileData, isLoading, error } = useProfile(user.id);
  const { mutateAsync: putProfile } = useProfileUpdater(user.id);
  const { mutateAsync: deleteAccount } = useDeletionService();
  const { handleEnterPress } = useHotKeys();

  const saveChanges = useCallback(async () => {
    await putProfile(profile);
    setEditMode(false);
  }, [profile, putProfile]);
  
  const textBoxes = useMemo<ReactElement[]>(() => {
    const noTextInput: string[] = ["profilePicture", "bio"];
    const result: ReactElement[] = [];
    for(const [key, value] of Object.entries(profile)) {
      if(typeof value === "number" || noTextInput.includes(key)) {
        continue;
      }
      
      result.push(
        <TextBox
          name={key} 
          value={value}
          hasLabel={key !== "username"}
          onEnterPress={(event: React.KeyboardEvent) => handleEnterPress(event, saveChanges)}
          onChange={(event: React.ChangeEvent) => {
            const newProfile: Profile = {...profile};
            newProfile[key] = (event.target as HTMLInputElement).value;
            setProfile(newProfile);
          }}
        />
      );
    }
    return result;
  }, [profile, setProfile, saveChanges, handleEnterPress]);

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
      <div
        className={`h-[calc(${STYLE.containerHeight} - 15)] ${STYLE.containerWidth} ${STYLE.borderValues} ${STYLE.flexColumn} items-center m-[10px] py-[25px] px-[10px] ${STYLE.defaultGap}`}
      >
        <ProfilePicture style="size-16" />
        {editMode ? (
          textBoxes[0]
        ) : (
          <p className="text-[30px] mb-[0px]">{profile.username}</p>
        )}
      </div>
      {editMode ? (
        <div className={INFORMATION_CONTAINER_STYLE}>
          {textBoxes.slice(1, textBoxes.length)}
          <p>About Me:</p>
          <input
            id="bio"
            name="profile"
            type="textarea"
            placeholder="bio"
            value={profile.bio}
            defaultValue={profile.bio}
            onKeyUp={(event) => {
              handleEnterPress(event, saveChanges);
            }}
            onChange={(event) => {
              setProfile({
                ...profile,
                bio: event.target.value,
              });
            }}
            className={`${STYLE.aboutMeSize} px-[8px] text-[16px] ${STYLE.borderValues}`}
          />
        </div>
      ) : (
        <div className={INFORMATION_CONTAINER_STYLE}>
          {defaultDisplayElements}
          <p>About Me:</p>
          <br />
          <div className={`${STYLE.aboutMeSize}`}>
            <p>{profile.bio ? profile.bio : ""}</p>
          </div>
        </div>
      )}
      <div className={`${STYLE.flexColumn} ${STYLE.defaultGap}`}>
        {editMode ? (
          <button className={BUTTON_STYLE} onClick={saveChanges}>
            Confirm
          </button>
        ) : (
          <button className={BUTTON_STYLE} onClick={() => setEditMode(true)}>
            Edit Profile
          </button>
        )}
        <button className={BUTTON_STYLE} onClick={onDeletion}>
          Delete Account
        </button>
      </div>
    </div>
  );
}
