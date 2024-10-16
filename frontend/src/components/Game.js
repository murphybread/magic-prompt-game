import React, { useState, useEffect } from 'react';
import { calculateManaCost, castSpell, getUserMana } from '../services/gameService';
import { deleteUser } from '../services/authService';
import ChatBox from './ChatBox';
import './Game.css';

const Game = () => {
  const [spellLevel, setSpellLevel] = useState(1);
  const [modifiers, setModifiers] = useState([]);
  const [manaCost, setManaCost] = useState(null);
  const [castResult, setCastResult] = useState('');
  const [userMana, setUserMana] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteUsername, setDeleteUsername] = useState('');
  const [loggedInUsername, setLoggedInUsername] = useState('');

  useEffect(() => {
    fetchUserMana();
  }, []);

  const fetchUserMana = async () => {
    try {
      console.log('Fetching user mana...');
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token ? 'Token present' : 'No token');
      const result = await getUserMana();
      console.log('User mana result:', result);
      setUserMana(result.mana);
      setLoggedInUsername(result.username);
    } catch (error) {
      console.error('Error fetching user mana:', error);
      if (error.response && error.response.status === 401) {
        console.log('Unauthorized error when fetching mana');
        alert('Your session has expired. Please log in again.');
        handleLogout();
      } else {
        alert('Error fetching user mana');
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

    try {
      const result = await castSpell('Fireball', manaCost);
      setCastResult(result.message);
      setUserMana(result.remainingMana);
    } catch (error) {
      alert(error.response ? error.response.data.message : 'Error casting spell');
    }
  };

  const handleDeleteUser = async () => {
    if (deleteUsername !== loggedInUsername) {
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
        <span className="username-display">Username: {loggedInUsername}</span>
      </div>
      <h2>Magic Game</h2>
      <p>Your Mana: {userMana !== null ? userMana : 'Loading...'}</p>
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
          <button onClick={handleCastSpell}>Cast Fireball</button>
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
            disabled={deleteUsername !== loggedInUsername}
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
