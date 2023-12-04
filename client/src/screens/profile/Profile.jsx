import { useState, useEffect } from "react";
import { useUser } from "../../hooks/useUser";
import { ApiClient } from "../../hooks/ApiClient";
import profilePicture from "../../resources/Default_Profile_Picture.jpg";
import "./profile.css";

function Profile() {
    const [id, setID] = useState();
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [jobTitle, setJobTitle] = useState();
    const [bio, setBio] = useState();
    const [editMode, setEditMode] = useState(false);
    const { user } = useUser();
    const { get, put } = ApiClient();

    useEffect(() => {
        async function getProfile() {  
            console.log(`User received in profile: ${user.email}`)  
            try {
                const response = await get(`profile/get/${user.email}`);
                console.log(response);
                setID(response.profile_id);
                setFirstName(response.firstname);
                setLastName(response.lastname);
                setJobTitle(response.jobtitle);
                setBio(response.bio);
            } catch(error) {
                console.error(error);
                alert(error.message ? error.message : error);
            }
        }
        getProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function saveChanges() {
        try {
            await put(`/profile/edit/${id}`, {firstName, lastName, profilePicture: "", jobTitle, bio});
            setEditMode(false);
        } catch(error) {
            console.error(error);
            alert(error.message ? error.message : error);
        }
    }

    return (
        <div className="parent-div">    
            <div className="profile-container">
                {editMode ?
                    <div className="edit-container">
                        <div className="text-entry">    
                            <label for="firstName">First name:</label>
                            <input
                                id="firstName"
                                name="profile"
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                defaultValue={firstName}
                                onChange={(event) => {setFirstName(event.target.value)}}
                            />
                        </div>
                        <div className="text-entry">    
                            <label for="lastName">Last name:</label>
                            <input
                                id="lastName"
                                name="profile"
                                type="text"
                                placeholder="Last Name"
                                value={lastName}
                                defaultValue={lastName}
                                onChange={(event) => {setLastName(event.target.value)}}
                            />
                        </div>
                        <div className="text-entry">
                            <label for="jobTitle">Job title:</label>
                            <input
                                id="jobTitle"
                                name="profile"
                                type="text"
                                placeholder="Job Title"
                                value={jobTitle}
                                defaultValue={jobTitle}
                                onChange={(event) => {setJobTitle(event.target.value)}}
                            />
                        </div>
                    </div>    
                    :
                    <div className="information-container">
                        <p>First name: {firstName ? firstName : ""}</p>
                        <p>Last name: {lastName ? lastName : ""}</p>
                        <p>Job title: {jobTitle ? jobTitle : ""}</p>
                    </div>
                }
                <div className="information-container">
                    <div className="bio-header">
                        <img src={profilePicture} alt="pfp here"/>
                    </div>
                    <p>Bio:</p>
                    {
                        editMode ?
                        <input
                            id="profile"
                            name="profile"
                            type="text"
                            placeholder="bio"
                            value={bio}
                            defaultValue={bio}
                            onChange={(event) => {setBio(event.target.value)}}
                            className="bigTextBox"
                        />
                        :
                        <p>{bio ? bio : ""}</p>
                         
                    }

                </div>
            </div>
            <div className="profile-footer">
                {
                    editMode ?
                    <button className="button" onClick={saveChanges}>Confirm</button>
                    :
                    <button className="button" onClick={() => {setEditMode(true)}}>Edit Profile</button>
                }
            </div>
        </div>
    );
}

export default Profile;
