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
    // Get user's current mana and level
    const userResult = await pool.query('SELECT mana, level, experience, max_mana FROM users WHERE id = $1', [userId]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const { mana, level, experience, max_mana } = userResult.rows[0];

    // Check if user has enough mana
    if (mana < manaCost) {
      return res.status(400).json({ message: "Not enough mana to cast the spell" });
    }

    // Deduct mana cost
    const newMana = Math.max(mana - manaCost, 0);
    
    // Calculate experience gained (for simplicity, let's say it's equal to the mana cost)
    const experienceGained = manaCost;
    const newExperience = experience + experienceGained;
    
    // Check if user levels up (for simplicity, let's say 100 exp per level)
    const newLevel = Math.floor(newExperience / 100) + 1;
    const leveledUp = newLevel > level;

    // If leveled up, increase max_mana by 10
    const newMaxMana = leveledUp ? max_mana + 10 : max_mana;

    // Update user data
    await pool.query(
      'UPDATE users SET mana = $1, level = $2, experience = $3, max_mana = $4 WHERE id = $5',
      [newMana, newLevel, newExperience % 100, newMaxMana, userId]
    );

    // Here you would typically apply spell effects, update game state, etc.
    
    res.json({ 
      message: `${spellName} cast successfully!`,
      manaCost: manaCost,
      remainingMana: newMana,
      experienceGained: experienceGained,
      newLevel: newLevel,
      leveledUp: leveledUp,
      newMaxMana: newMaxMana
    });
  } catch (error) {
    console.error('Error casting spell:', error);
    res.status(500).json({ message: "Error casting spell" });
  }
};

exports.getUserMana = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query('SELECT mana, max_mana, level, experience, username FROM users WHERE id = $1', [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user mana:', error);
    res.status(500).json({ message: "Error fetching user mana" });
  }
};

exports.regenerateMana = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query('SELECT mana, max_mana FROM users WHERE id = $1', [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const { mana, max_mana } = result.rows[0];
    const regenerationAmount = 5; // Amount of mana to regenerate
    const newMana = Math.min(mana + regenerationAmount, max_mana);

    await pool.query('UPDATE users SET mana = $1 WHERE id = $2', [newMana, userId]);

    res.json({ mana: newMana, max_mana });
  } catch (error) {
    console.error('Error regenerating mana:', error);
    res.status(500).json({ message: "Error regenerating mana" });
  }
};
