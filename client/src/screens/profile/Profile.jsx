import { useState, useEffect } from "react";
import { useUser } from "../../hooks/useUser";
import { ApiClient } from "../../hooks/ApiClient";
import "./profile.css";

function Profile() {
    const [profile, setProfile] = useState();
    const { user } = useUser();
    const { get } = ApiClient();

    useEffect(() => {
        async function getProfile() {  
            console.log(`User received in profile: ${user.email}`)  
            try {
                const response = await get(`profile/get/${user.email}`);
                console.log(response);
                setProfile(response);
            } catch(error) {
                console.error(error);
                alert(error.message ? error.message : error);
            }
        }
        getProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="profile-container">
            <div className="basic-information-container">
                <p>First name: {profile ? profile.firstname : ""}</p>
                <p>Last name: {profile ? profile.lastname : ""}</p>
                <p>Job title: {profile ? profile.jobtitle : ""}</p>
            </div>
            <div className="bio-display-container">
                <div className="bio-header">
                    <img src={profile ? profile.profilepicture : ""} alt="pfp here"/>
                </div>
                <p>Bio:</p>
                <br/>
                <p>{profile ? profile.bio : ""}</p>
            </div>
        </div>
    );
}

export default Profile;
