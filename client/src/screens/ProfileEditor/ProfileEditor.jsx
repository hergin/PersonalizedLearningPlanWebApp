import { useState } from "react";
import { useParams } from "react-router-dom";
import { ApiClient } from "../../hooks/ApiClient";

function ProfileEditor() {
    const { id } = useParams();
    console.log(`Profile id: ${id}`);
    const {firstName, setFirstName} = useState("");
    const {lastName, setLastName} = useState("");
    const {jobTitle, setJobTitle} = useState("");
    const {bio, setBio} = useState("");
    const disabled = firstName === "" || lastName === "";
    const { post } = ApiClient();

    async function handleChanges() {
        try {
            const response = await post(`profile/${id}`, {firstName, lastName, jobTitle, bio});
            
        } catch(error) {
            console.error(error);
            alert(error.message ? error.message : error);
        }
    }

    return (
        <div className="profile-editor-container">
            <h1>Edit your profile:</h1>
            <br/>
            <div className="edit-body">
                <input
                    id="profile"
                    name="profile"
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    defaultValue={firstName}
                    onChange={(event) => {setFirstName(event.target.value)}}
                />
                <input
                    id="profile"
                    name="profile"
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    defaultValue={lastName}
                    onChange={(event) => {setLastName(event.target.value)}}
                />
                <input
                    id="profile"
                    name="profile"
                    type="text"
                    placeholder="Job Title"
                    value={jobTitle}
                    defaultValue={jobTitle}
                    onChange={(event) => {setJobTitle(event.target.value)}}
                />
                <input
                    id="profile"
                    name="profile"
                    type="text"
                    placeholder="bio"
                    value={bio}
                    defaultValue={bio}
                    onChange={(event) => {setBio(event.target.value)}}
                />        
            </div>
            <button onClick={handleChanges} disabled={disabled} className="submit-btn">Confirm Changes</button>
        </div>
    );
}

export default ProfileEditor;
