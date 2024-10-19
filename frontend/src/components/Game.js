import React, { useState, useEffect } from 'react';
import { calculateManaCost, castSpell, getUserMana } from '../services/gameService';
import { deleteUser } from '../services/authService';
import ChatBox from './ChatBox';
import UserProfile from './UserProfile';
import './Game.css';

const Game = () => {
  const [spellLevel, setSpellLevel] = useState(1);
  const [modifiers, setModifiers] = useState([]);
  const [manaCost, setManaCost] = useState(null);
  const [castResult, setCastResult] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteUsername, setDeleteUsername] = useState('');

  useEffect(() => {
    fetchUserProfile();
    const manaRegenInterval = setInterval(regenerateMana, 5000); // Regenerate mana every 5 seconds
    return () => clearInterval(manaRegenInterval);
  }, []);

  const fetchUserProfile = async () => {
    try {
      console.log('Fetching user profile...');
      const result = await getUserMana();
      console.log('User profile result:', result);
      setUserProfile(result);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      if (error.response && error.response.status === 401) {
        console.log('Unauthorized error when fetching profile');
        alert('Your session has expired. Please log in again.');
        handleLogout();
      } else {
        alert('Error fetching user profile');
      }
    }
  };

  const regenerateMana = async () => {
    if (userProfile) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/game/regenerate-mana`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to regenerate mana');
        }
        const data = await response.json();
        setUserProfile(prevProfile => ({
          ...prevProfile,
          mana: data.mana,
          max_mana: data.max_mana
        }));
      } catch (error) {
        console.error('Error regenerating mana:', error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handleCalculateManaCost = async () => {
    try {
      const result = await calculateManaCost(spellLevel, modifiers);
      setManaCost(result.manaCost);
    } catch (error) {
      alert('Error calculating mana cost');
    }
  };

  const handleCastSpell = async () => {
    if (manaCost === null) {
      alert('Please calculate mana cost first');
      return;
    }

    if (userProfile.mana < manaCost) {
      alert('Not enough mana to cast the spell');
      return;
    }

    try {
      const result = await castSpell('Fireball', manaCost);
      setCastResult(result.message);
      setUserProfile(prevProfile => ({
        ...prevProfile,
        mana: result.remainingMana,
        level: result.newLevel,
        experience: result.newExperience,
        max_mana: result.newMaxMana
      }));
      if (result.leveledUp) {
        alert(`Congratulations! You've leveled up to level ${result.newLevel}!`);
      }
    } catch (error) {
      alert(error.response ? error.response.data.message : 'Error casting spell');
    }
  };

  const handleDeleteUser = async () => {
    if (deleteUsername !== userProfile.username) {
      alert('The entered username does not match your logged-in username.');
      return;
    }
    try {
      console.log('Attempting to delete user:', deleteUsername);
      const token = localStorage.getItem('token');
      console.log('Token for delete request:', token ? 'Token present' : 'No token');
      await deleteUser(deleteUsername, token);
      console.log('User deleted successfully');
      alert('Your account has been deleted successfully.');
      handleLogout();
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Error deleting account: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <div className="top-left-button">
        <button onClick={() => setShowDeleteConfirmation(true)} className="delete-id-button">
          Delete ID
        </button>
        {userProfile && <span className="username-display">Username: {userProfile.username}</span>}
      </div>
      <h2>Magic Game</h2>
      {userProfile && (
        <div>
          <UserProfile
            profile={userProfile}
            onProfileUpdate={setUserProfile}
          />
          <div className="mana-display">
            <p>Current Mana: {userProfile.mana} / {userProfile.max_mana}</p>
            <p>Level: {userProfile.level}</p>
            <p>Experience: {userProfile.experience} / 100</p>
          </div>
        </div>
      )}
      <div>
        <label>
          Spell Level:
          <input
            type="number"
            value={spellLevel}
            onChange={(e) => setSpellLevel(Number(e.target.value))}
            min="1"
          />
        </label>
      </div>
      <div>
        <button onClick={handleCalculateManaCost}>Calculate Mana Cost</button>
      </div>
      {manaCost !== null && (
        <div>
          <p>Mana Cost: {manaCost}</p>
          <button onClick={handleCastSpell} disabled={userProfile && userProfile.mana < manaCost}>Cast Fireball</button>
        </div>
      )}
      {castResult && <p>{castResult}</p>}
      {showDeleteConfirmation && (
        <div className="delete-confirmation">
          <h3>Are you sure you want to delete your account?</h3>
          <p>This action cannot be undone. Please enter your username to confirm:</p>
          <input
            type="text"
            value={deleteUsername}
            onChange={(e) => setDeleteUsername(e.target.value)}
            placeholder="Enter your username"
          />
          <button 
            onClick={handleDeleteUser}
            disabled={deleteUsername !== userProfile?.username}
          >
            Confirm Delete
          </button>
          <button onClick={() => setShowDeleteConfirmation(false)}>Cancel</button>
        </div>
      )}
      <ChatBox />
    </div>
  );
};

export default Game;
