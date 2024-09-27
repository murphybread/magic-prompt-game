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
      alert('Error fetching user mana');
    }
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
      await deleteUser(deleteUsername);
      alert('Your account has been deleted successfully.');
      // Redirect to login page or handle logout
      window.location.href = '/';
    } catch (error) {
      alert('Error deleting account: ' + error.message);
    }
  };

  return (
    <div>
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
      <div>
        <button onClick={() => setShowDeleteConfirmation(true)}>Delete ID</button>
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
      </div>
    </div>
  );
};

export default Game;
