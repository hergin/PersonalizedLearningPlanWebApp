import React, { useState, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../login/hooks/useUser";
import { ApiClient } from "../../../hooks/ApiClient";
import { useProfile, useProfileUpdater } from "../hooks/useProfile";
import { useHotKeys } from "../../../hooks/useHotKeys";
import { emptyProfile, Profile } from "../../../types";
import ProfilePicture from "../../../components/ProfilePicture";
import { ToggleButton } from "@mui/material";
import { useSettings, useSettingsMutation } from "../../../hooks/useSettings";

import DropDownCheckbox from "../../../components/dropDown/DropDownCheckbox";

const STYLE = {
  containerHeight: "h-[50vh]",
  containerWidth: "w-[30vw]",
  aboutMeSize: "h-[25vh] w-[28vw]",
  borderValues: "border-[0.8px] border-solid border-[rgb(219, 219, 219)]",
  defaultGap: "gap-[5px]",
  flexColumn: "flex flex-col",
  flexRow: "flex flex-row"
};

const INFORMATION_CONTAINER_STYLE = `${STYLE.containerHeight} ${STYLE.containerWidth} ${STYLE.flexColumn} justify-around content-normal p-[10px] mx-[40px] mt-[24px] ${STYLE.defaultGap} text-[24px]`;
const TEXT_ENTRY_STYLE = `flex flex-row ${STYLE.defaultGap} justify-between`;
const VARIABLE_DISPLAY_STYLE = `flex flex-row ${STYLE.defaultGap} justify-between text-start`;
const BUTTON_STYLE = `h-[40px] ${STYLE.borderValues} rounded px-[8px] text-[16px] bg-[#8C1515] text-white`;

function ProfileScreen() {
  const [editMode, setEditMode] = useState<boolean>(false);
  const navigate = useNavigate();
  const { user, removeUser } = useUser();
  const { del } = ApiClient();
  const { data: profileData, isLoading, error } = useProfile(user.id);
  const { data } = useSettings(user.id);
  const { mutate: putProfile } = useProfileUpdater(user.id);
  const { mutate: updateSettings } = useSettingsMutation(user.id);
  
  const { handleEnterPress } = useHotKeys();
  const [profile, setProfile] = useState<Profile>(emptyProfile);

  useEffect(() => {
    ("re-rendered...");
    if (isLoading || error) {
      return;
    }
    JSON.stringify(profileData);
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

  async function saveChanges() {
    putProfile(profile);
    setEditMode(false);
  }

  function optToEmail() {
    console.log("No email")
  }

  async function deleteAccount() {
    try {
      await del(`/profile/delete/${profile.id}`);
      await del(`/auth/delete/${user.id}`);
      removeUser();
      navigate("/#");
    } catch (error: any) {
      console.error(error);
      alert(error.response ? error.response : error);
    }
  }
  if (isLoading) {
    return <div>This is loading...</div>;
  }
  if (error) {
    error;
    return <div>This is an error</div>;
  }
  return (
    <div className={` ${STYLE.flexRow} justify-center items-center py-[10px] my-[20px] mx-[10px] ${STYLE.defaultGap}`}
    >
    <div
      className={`h-[90vh] ${STYLE.flexColumn} justify-center items-center py-[10px] my-[20px] mx-[10px] ${STYLE.borderValues} ${STYLE.containerWidth}  ${STYLE.defaultGap}`}
    >
      {/* Profile Picture and email */}
      <div
        className={`h-[calc(${STYLE.containerHeight} - 15)] ${STYLE.containerWidth} ${STYLE.flexColumn} items-center m-[10px] py-[25px] px-[10px] ${STYLE.defaultGap}`}
      >
        <ProfilePicture style="size-20" />
        {editMode ? (
          <input
            id="username"
            name="profile"
            type="text"
            placeholder="username"
            value={profile.username}
            defaultValue={profile.username}
            onKeyUp={(event) => {
              handleEnterPress(event, saveChanges);
            }}
            onChange={(event) => {
              setProfile({
                ...profile,
                username: event.target.value,
              });
            }}
          />
        ) : (
          <p className="text-[30px] mb-[10px]">{profile.username}</p>
        )}
      </div>
      {/* This div is the editing mode of the profile commponent*/}
      {editMode ? (
        <div className={INFORMATION_CONTAINER_STYLE}>
          <div className={TEXT_ENTRY_STYLE}>
            <label htmlFor="firstName">First name:</label>
            <input
              className={`${STYLE.borderValues}`}
              id="firstName"
              name="profile"
              type="text"
              placeholder="First Name"
              value={profile.firstName}
              defaultValue={profile.firstName}
              onKeyUp={(event) => {
                handleEnterPress(event, saveChanges);
              }}
              onChange={(event) => {
                setProfile({
                  ...profile,
                  firstName: event.target.value,
                });
              }}
            />
          </div>
          <div className={TEXT_ENTRY_STYLE}>
            <label htmlFor="lastName">Last name:</label>
            <input
              className={`${STYLE.borderValues}`}
              id="lastName"
              name="profile"
              type="text"
              placeholder="Last Name"
              value={profile.lastName}
              defaultValue={profile.lastName}
              onKeyUp={(event) => {
                handleEnterPress(event, saveChanges);
              }}
              onChange={(event) => {
                setProfile({
                  ...profile,
                  lastName: event.target.value,
                });
              }}
            />
          </div>
          <div className={TEXT_ENTRY_STYLE}>
            <label htmlFor="jobTitle">Job title:</label>
            <input
              className={`${STYLE.borderValues}`}
              id="jobTitle"
              name="profile"
              type="text"
              placeholder="Job Title"
              value={profile.jobTitle}
              defaultValue={profile.jobTitle}
              onKeyUp={(event) => {
                handleEnterPress(event, saveChanges);
              }}
              onChange={(event) => {
                setProfile({
                  ...profile,
                  jobTitle: event.target.value,
                });
              }}
            />
          </div>
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
          {/* This div is the normal mode of the profile commponent*/}

          <div className={VARIABLE_DISPLAY_STYLE}>
            <p>First name:</p>
            <p>{profile.firstName ? profile.firstName : ""}</p>
          </div>
          <div className={VARIABLE_DISPLAY_STYLE}>
            <p>Last name:</p>
            <p>{profile.lastName ? profile.lastName : ""}</p>
          </div>
          <div className={VARIABLE_DISPLAY_STYLE}>
            <p>Job title:</p>
            <p>{profile.jobTitle ? profile.jobTitle : ""}</p>
          </div>
          <p>About Me:</p>
          <br />
          <div className={`${STYLE.aboutMeSize}`}>
            <p>{profile.bio ? profile.bio : ""}</p>
          </div>
        </div>
      )}
    </div>
    <div className={`${STYLE.flexColumn} ${STYLE.defaultGap}`}>
        {editMode ? (
          <button className={BUTTON_STYLE} onClick={saveChanges}>
            Confirm
          </button>
        ) : (
          <button
            className={BUTTON_STYLE}
            onClick={() => {
              setEditMode(true);
            }}
          >
            Edit Profile
          </button>
        )}
        <button className={BUTTON_STYLE} onClick={deleteAccount}>
          Delete Account
        </button>
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
      </div>
    </div>
  );
}

export default ProfileScreen;
