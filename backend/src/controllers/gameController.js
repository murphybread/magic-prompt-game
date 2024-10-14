const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

exports.calculateManaCost = (req, res) => {
  const { spellLevel, modifiers } = req.body;
  
  // Simple mana cost calculation
  let manaCost = spellLevel * 10;
  
  if (modifiers) {
    manaCost += modifiers.reduce((sum, modifier) => sum + modifier, 0);
  }

  res.json({ manaCost });
};

exports.castSpell = async (req, res) => {
  const { spellName, manaCost } = req.body;
  const userId = req.user.id;

  try {
    // Get user's current mana
    const userResult = await pool.query('SELECT mana FROM users WHERE id = $1', [userId]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentMana = userResult.rows[0].mana;

    // Check if user has enough mana
    if (currentMana < manaCost) {
      return res.status(400).json({ message: "Not enough mana to cast the spell" });
    }

    // Deduct mana cost
    const newMana = currentMana - manaCost;
    await pool.query('UPDATE users SET mana = $1 WHERE id = $2', [newMana, userId]);

    // Here you would typically apply spell effects, update game state, etc.
    
    res.json({ 
      message: `${spellName} cast successfully!`,
      manaCost: manaCost,
      remainingMana: newMana
    });
  } catch (error) {
    console.error('Error casting spell:', error);
    res.status(500).json({ message: "Error casting spell" });
  }
};

exports.getUserMana = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await req.db.query('SELECT mana, username FROM users WHERE id = $1', [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ mana: result.rows[0].mana, username: result.rows[0].username });
  } catch (error) {
    console.error('Error fetching user mana:', error);
    res.status(500).json({ message: "Error fetching user mana" });
  }
};
