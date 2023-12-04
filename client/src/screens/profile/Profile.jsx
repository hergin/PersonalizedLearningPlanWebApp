import { useState, useEffect } from "react";
import { Link } from "react-router-dom"
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
        <div className="parent-div">    
            <div className="profile-container">
                <div className="information-container">
                    <p>First name: {profile ? profile.firstname : ""}</p>
                    <p>Last name: {profile ? profile.lastname : ""}</p>
                    <p>Job title: {profile ? profile.jobtitle : ""}</p>
                </div>
                <div className="information-container">
                    <div className="bio-header">
                        <img src={profile ? profile.profilepicture : ""} alt="pfp here"/>
                    </div>
                    <p>Bio:</p>
                    <br/>
                    <p>{profile ? profile.bio : ""}</p>
                </div>
            </div>
            <div className="profile-footer">
                <Link to={{pathname: `/profile/edit/${profile?.profile_id}`}}>
                    <button className="edit-btn">Edit Profile</button>
                </Link>
            </div>
        </div>    
    );
}

export default Profile;
