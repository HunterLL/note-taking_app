import React, { useState, useEffect } from 'react';
import { useAuthToken } from "../AuthTokenContext";

const now = new Date(); 
const year = now.getFullYear(); 
const month = now.getMonth() + 1; 
const date = now.getDate(); 

// Create the datetime string in the format "YYYY-MM-DD"
const datetimeString = `${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;

export default function Profile() {
  const { accessToken } = useAuthToken();
  const [profile, setProfile] = useState({
    firstName: " ",
    lastName: " ",
    bio: " ",
    birthdate: datetimeString,
  });


  const [editedProfile, setEditedProfile] = useState({
    firstName: ' ',
    lastName: ' ',
    bio: ' ',
    birthdate: datetimeString,
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchProfile();
  });

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });


      if (response.ok) {
        const data = await response.json();
        if (!data.birthdate) {
          data.birthdate =  datetimeString;
        }
        if (!data.lastName) {
          data.lastName =  '  ';
        }
        if (!data.firstName) {
          data.firstName =  '  ';
        }
        data.birthdate = data.birthdate.substring(0, 10);
        setProfile(data);
      } else {
        console.log("Failed to fetch profile:", response.status);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleEditClick = () => {
    setEditMode(true);
    setEditedProfile({
      firstName: profile.firstName,
      lastName: profile.lastName,
      bio: profile.bio,
      birthdate: profile.birthdate,
    });
  };

  const handleInputChange = (e) => {
    if (e.target.name === 'birthdate') {
      setEditedProfile({
        ...editedProfile,
        birthdate: e.target.value,
      });
    } else {
      setEditedProfile({
        ...editedProfile,
        [e.target.name]: e.target.value,
      });
      

    }
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(editedProfile),
      });
  
      if (response.ok) {
        setProfile(editedProfile);
        setEditMode(false);
      } else {
        console.log("Failed to update profile:", response.status);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  
  const handleCancelClick = () => {
    setEditMode(false);
  };

  return (
    <>
      {editMode ? (
      <form className="profile-editor">
        <h2>Edit Profile</h2>
        <div className="input-container">
          <label className="input-label" htmlFor="bio">
            Bio: 
          </label>
          <textarea
            id="bio"
            name="bio"
            value={editedProfile.bio}
            onChange={handleInputChange}
            aria-describedby="bio-instructions"
          />
          <small id="bio-instructions">Enter a brief description about yourself.</small>
        </div>
        <div className="input-container">
          <label className="input-label" htmlFor="firstName">
            First Name: 
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={editedProfile.firstName}
            onChange={handleInputChange}
            aria-describedby="firstName-instructions"
          />
        </div>
        <div className="input-container">
          <label className="input-label" htmlFor="lastName">
            Last Name: 
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={editedProfile.lastName}
            onChange={handleInputChange}
            aria-describedby="lastName-instructions"
          />
        </div>
        <div className="input-container">
          <label className="input-label" htmlFor="birthdate">
            Birthday: 
          </label>
          <input
            type="date"
            id="birthdate"
            name="birthdate"
            value={editedProfile.birthdate}
            onChange={handleInputChange}
            aria-describedby="birthdate-instructions"
          ></input>
        </div>
        <button onClick={handleSaveClick} type="button" aria-label="Save Changes">Save</button>
        <button onClick={handleCancelClick} type="button" aria-label="Cancel Editing">Cancel</button>
      </form>
      ) : (
        <div className="profile-info">
          <h2>Profile</h2>
          <p>Bio: {profile.bio || 'No bio available'}</p>
          <p>First name: {profile.firstName || ' '}</p>
          <p>Last name: {profile.lastName || ' '}</p>
          <p>Birthday: {profile.birthdate || ' '} </p>
          <button className='edit-profile-button' onClick={handleEditClick}>🖊️ Edit</button>
        </div>
      )}

    </>
  );
}
