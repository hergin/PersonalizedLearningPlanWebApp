import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { ApiClient } from "../../hooks/ApiClient";
import profilePicture from "../../resources/Default_Profile_Picture.jpg";
import "./profile.css";
import useProfile from "../../hooks/useProfile";

function Profile() {
  const [id, setID] = useState<number>();
  // TODO: Move into useReducer
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [bio, setBio] = useState("");
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  const { user, removeUser } = useUser();
  const { get, put, del } = ApiClient();
  const { data: profileData, isLoading, error } = useProfile();
  console.log(profileData);

  useEffect(() => {
    async function getProfile() {
      console.log(`User received in profile: ${user.email}`);
      try {
        const response = await get(`profile/get/${user.email}`);
        console.log(response);
        setID(response.profile_id);
        setUsername(response.username);
        setFirstName(response.first_name);
        setLastName(response.last_name);
        setJobTitle(response.job_title);
        setBio(response.bio);
      } catch (error: any) {
        console.error(error);
        alert(error.message ? error.message : error);
      }
    }
    getProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function saveChanges() {
    try {
      await put(`/profile/edit/${id}`, {
        username,
        firstName,
        lastName,
        profilePicture: "",
        jobTitle,
        bio,
      });
      setEditMode(false);
    } catch (error: any) {
      console.error(error);
      alert(error.message ? error.message : error);
    }
  }

  async function deleteAccount() {
    try {
      await del(`/profile/delete/${id}`);
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
            value={username}
            defaultValue={username}
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
        ) : (
          <p className="username-display">{username}</p>
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
              value={firstName}
              defaultValue={firstName}
              onChange={(event) => {
                setFirstName(event.target.value);
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
              value={lastName}
              defaultValue={lastName}
              onChange={(event) => {
                setLastName(event.target.value);
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
              value={jobTitle}
              defaultValue={jobTitle}
              onChange={(event) => {
                setJobTitle(event.target.value);
              }}
            />
          </div>
          <p>About Me:</p>
          <input
            id="bio"
            name="profile"
            type="textarea"
            placeholder="bio"
            value={bio}
            defaultValue={bio}
            onChange={(event) => {
              setBio(event.target.value);
            }}
            className="bigTextBox"
          />
        </div>
      ) : (
        <div className="information-container">
          <p>First name: {firstName ? firstName : ""}</p>
          <p>Last name: {lastName ? lastName : ""}</p>
          <p>Job title: {jobTitle ? jobTitle : ""}</p>
          <p>About Me:</p>
          <br />
          <div className="about-me">
            <p>{bio ? bio : ""}</p>
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

export default Profile;
