import React, { useState, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../hooks/useUser";
import { ApiClient } from "../../../hooks/ApiClient";
import profilePicture from "../../../assets/Default_Profile_Picture.jpg";
import { useProfile, useUpdateProfile } from "../hooks/useProfile";
import { useHotKeys } from "../../../hooks/useHotKeys";
import { emptyProfile, Profile } from "../../../types";

const STYLE = {
  containerHeight: "h-[50vh]",
  containerWidth: "w-[30vw]",
  aboutMeSize: "h-[25vh] w-[28vw]",
  borderValues: "border-[0.8px] border-solid border-[rgb(219, 219, 219)]",
  defaultGap: "gap-[5px]",
  flexColumn: "flex flex-col",
};

const INFORMATION_CONTAINER_STYLE = `${STYLE.containerHeight} ${STYLE.containerWidth} ${STYLE.borderValues} ${STYLE.flexColumn} justify-around content-normal p-[10px] mx-[40px] mt-[24px] ${STYLE.defaultGap} text-[24px]`;
const TEXT_ENTRY_STYLE = `flex flex-row ${STYLE.defaultGap} justify-between`;
const VARIABLE_DISPLAY_STYLE = `flex flex-row ${STYLE.defaultGap} justify-between text-start`;
const BUTTON_STYLE = `h-[40px] ${STYLE.borderValues} rounded px-[8px] text-[16px] bg-[#8C1515] text-white`;

function ProfileScreen() {
  const [editMode, setEditMode] = useState<boolean>(false);
  const navigate = useNavigate();
  const { user, removeUser } = useUser();
  const { del } = ApiClient();
  const { data: profileData, isLoading, error } = useProfile(user.id);
  const { mutate: putProfile } = useUpdateProfile(user.id);
  const { handleEnterPress } = useHotKeys();
  const [ profile, setProfile ] = useState<Profile>(emptyProfile);

  useEffect(() => {
    console.log("re-rendered...");
    if (isLoading || error) {
      return;
    }
    console.log(JSON.stringify(profileData));
    setProfile({
      id: profileData.profile_id,
      username: profileData.username,
      firstName: profileData.first_name,
      lastName: profileData.last_name,
      profilePicture: profileData.profile_picture,
      jobTitle: profileData.job_title,
      bio: profileData.bio
    });
  }, [profileData, isLoading, error]);

  async function saveChanges() {
    putProfile(profile);
    setEditMode(false);
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
    console.log(error);
    return <div>This is an error</div>;
  }
  return (
    <div
      className={`h-[90vh] ${STYLE.flexColumn} justify-center items-center py-[10px] my-[20px] mx-[10px] ${STYLE.defaultGap}`}
    >
      <div
        className={`h-[calc(${STYLE.containerHeight} - 15)] ${STYLE.containerWidth} ${STYLE.borderValues} ${STYLE.flexColumn} items-center m-[10px] py-[25px] px-[10px] ${STYLE.defaultGap}`}
      >
        <img
          src={profilePicture}
          alt="pfp here"
          className="h-[10vh] w-[5vw] rounded-full"
        />
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
                  firstName: event.target.value
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
      </div>
    </div>
  );
}

export default ProfileScreen;
