import React, { useState, useEffect } from 'react';
import { calculateManaCost, castSpell, getUserMana } from '../services/gameService';
import { deleteUser } from '../services/authService';

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
    setLoggedInUsername(localStorage.getItem('username'));
  }, []);

  const fetchUserMana = async () => {
    try {
      const result = await getUserMana();
      setUserMana(result.mana);
    } catch (error) {
      console.error('Error fetching user mana:', error);
      if (error.response && error.response.status === 401) {
        // Handle unauthorized error (e.g., redirect to login)
        alert('Your session has expired. Please log in again.');
        // Implement a function to handle logout and redirect
        handleLogout();
      } else {
        alert('Error fetching user mana');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/';
  };

  // ... rest of the component code remains the same

  return (
    <div>
      <h2>Magic Game</h2>
      <p>Your Mana: {userMana !== null ? userMana : 'Loading...'}</p>
      {/* ... rest of the JSX remains the same */}
    </div>
  );
};

export default Game;
