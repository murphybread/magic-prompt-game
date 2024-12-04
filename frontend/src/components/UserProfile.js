import React, { useState } from 'react';
import { updateUserProfile } from '../services/authService';
import './UserProfile.css';
import { logErrors } from "../utils/logging.js";

const UserProfile = ({ profile, onProfileUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState(profile.email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProfile = await updateUserProfile({ email });
      onProfileUpdate(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      logErrors('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="user-profile">
      <h3>User Profile</h3>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <div>
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Level:</strong> {profile.level}</p>
          <p><strong>Experience:</strong> {profile.experience}</p>
          <p><strong>Mana:</strong> {profile.mana} / {profile.max_mana}</p>
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
