import React, { useState, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { ApiClient } from "../../hooks/ApiClient";
import profilePicture from "../../resources/Default_Profile_Picture.jpg";
import "./profile.css";
import useProfile from "../../hooks/useProfile";
import { useHotKeys } from "../../hooks/useHotKeys";
import { emptyProfile, Profile } from "../../types";

interface ProfileActionProps {
  variable: string,
  input: string | number,
}

const PROFILE_VARIABLES = {
  username: "username",
  firstName: "first_name",
  lastName: "last_name",
  profilePicture: "profile_picture",
  jobTitle: "job_title",
  bio: "bio"
}

const PROFILE_ACTIONS = new Map();
PROFILE_ACTIONS.set(PROFILE_VARIABLES.username, (profile : Profile, input : string) => {return {...profile, username: input}});
PROFILE_ACTIONS.set(PROFILE_VARIABLES.firstName, (profile : Profile, input : string) => {return {...profile, firstName: input}});
PROFILE_ACTIONS.set(PROFILE_VARIABLES.lastName, (profile : Profile, input : string) => {return {...profile, lastName: input}});
PROFILE_ACTIONS.set(PROFILE_VARIABLES.profilePicture, (profile: Profile, input : string) => {return {...profile, profilePicture: input}});
PROFILE_ACTIONS.set(PROFILE_VARIABLES.jobTitle, (profile : Profile, input : string) => {return {...profile, jobTitle: input}});
PROFILE_ACTIONS.set(PROFILE_VARIABLES.bio, (profile : Profile, input : string) => {return {...profile, bio: input}});


function updateProfile(profile : Profile, action : ProfileActionProps): Profile {
  if(typeof action.input === "number") {
    return {
      ...profile,
      id: action.input
    };
  }
  
  const actionFunction = PROFILE_ACTIONS.get(action.variable);
  if(typeof actionFunction === "function") {
    return actionFunction(profile, action.input);
  }
  return profile;
}

function ProfileScreen() {
  const [profileState, dispatch] = useReducer(updateProfile, emptyProfile);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  const { user, removeUser } = useUser();
  const { put, del } = ApiClient();
  const { data: profileData, isLoading, error } = useProfile();
  const { handleEnterPress } = useHotKeys();

  useEffect(() => {
    console.log("re-rendered...");
    if(isLoading || error) {
      return;
    }

    for(const [key, value] of Object.entries(profileData)) {
      console.log(`Profile data: ${value}`);
      if(typeof value !== "number" && typeof value !== "string") {
        break;
      }  
      dispatch({variable: key, input: value});
    }
  }, [isLoading, error]);

  async function saveChanges() {
    try {
      await put(`/profile/edit/${profileState.id}`, {
        username: profileState.username,
        firstName: profileState.firstName,
        lastName: profileState.lastName,
        profilePicture: profileState.profilePicture,
        jobTitle: profileState.jobTitle,
        bio: profileState.bio,
      });
      setEditMode(false);
    } catch (error: any) {
      console.error(error);
      alert(error.message ? error.message : error);
    }
  }

  async function deleteAccount() {
    try {
      await del(`/profile/delete/${profileState.id}`);
      await del(`/auth/delete/${user.email}`);
      removeUser();
      navigate("/#");
    } catch (error: any) {
      console.error(error);
      alert(error.response ? error.response : error);
    }
  }
  if (isLoading) {
    return <div>This is loading...</div>
  }
  if (error) {
    console.log(error)
    return <div>This is an error</div>
  }
  return (
    <div className="parent-div">
      <div className="profile-header">
        <img src={profilePicture} alt="pfp here" />
        {editMode ? (
          <input
            id="username"
            name="profile"
            type="text"
            placeholder="username"
            value={profileState.username}
            defaultValue={profileState.username}
            onKeyUp={(event) => {handleEnterPress(event, saveChanges)}}
            onChange={(event) => {
              dispatch({variable: PROFILE_VARIABLES.username, input: event.target.value});
            }}
          />
        ) : (
          <p className="username-display">{profileState.username}</p>
        )}
      </div>
      {editMode ? (
        <div className="information-container">
          <div className="text-entry">
            <label htmlFor="firstName">First name:</label>
            <input
              id="firstName"
              name="profile"
              type="text"
              placeholder="First Name"
              value={profileState.firstName}
              defaultValue={profileState.firstName}
              onKeyUp={(event) => {handleEnterPress(event, saveChanges)}}
              onChange={(event) => {
                dispatch({variable: PROFILE_VARIABLES.firstName, input: event.target.value});
              }}
            />
          </div>
          <div className="text-entry">
            <label htmlFor="lastName">Last name:</label>
            <input
              id="lastName"
              name="profile"
              type="text"
              placeholder="Last Name"
              value={profileState.lastName}
              defaultValue={profileState.lastName}
              onKeyUp={(event) => {handleEnterPress(event, saveChanges)}}
              onChange={(event) => {
                dispatch({variable: PROFILE_VARIABLES.lastName, input: event.target.value});
              }}
            />
          </div>
          <div className="text-entry">
            <label htmlFor="jobTitle">Job title:</label>
            <input
              id="jobTitle"
              name="profile"
              type="text"
              placeholder="Job Title"
              value={profileState.jobTitle}
              defaultValue={profileState.jobTitle}
              onKeyUp={(event) => {handleEnterPress(event, saveChanges)}}
              onChange={(event) => {
                dispatch({variable: PROFILE_VARIABLES.jobTitle, input: event.target.value});
              }}
            />
          </div>
          <p>About Me:</p>
          <input
            id="bio"
            name="profile"
            type="textarea"
            placeholder="bio"
            value={profileState.bio}
            defaultValue={profileState.bio}
            onKeyUp={(event) => {handleEnterPress(event, saveChanges)}}
            onChange={(event) => {
              dispatch({variable: PROFILE_VARIABLES.bio, input: event.target.value});
            }}
            className="bigTextBox"
          />
        </div>
      ) : (
        <div className="information-container">
          <p>First name: {profileState.firstName ? profileState.firstName : ""}</p>
          <p>Last name: {profileState.lastName ? profileState.lastName : ""}</p>
          <p>Job title: {profileState.jobTitle ? profileState.jobTitle : ""}</p>
          <p>About Me:</p>
          <br />
          <div className="about-me">
            <p>{profileState.bio ? profileState.bio : ""}</p>
          </div>
        </div>
      )}
      <div className="profile-footer">
        {editMode ? (
          <button className="button" onClick={saveChanges}>
            Confirm
          </button>
        ) : (
          <button
            className="button"
            onClick={() => {
              setEditMode(true);
            }}
          >
            Edit Profile
          </button>
        )}
        <button className="button" onClick={deleteAccount}>
          Delete Account
        </button>
      </div>
    </div>
  );
}

export default ProfileScreen;
