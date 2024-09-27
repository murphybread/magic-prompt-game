import React, { useState, useEffect } from 'react';
import { calculateManaCost, castSpell, getUserMana } from '../services/gameService';

const Game = () => {
  const [spellLevel, setSpellLevel] = useState(1);
  const [modifiers, setModifiers] = useState([]);
  const [manaCost, setManaCost] = useState(null);
  const [castResult, setCastResult] = useState('');
  const [userMana, setUserMana] = useState(null);

  useEffect(() => {
    fetchUserMana();
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
    </div>
  );
};

export default Game;
