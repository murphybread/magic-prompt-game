-- Add new columns to the users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS experience INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS max_mana INTEGER DEFAULT 100;

-- Update existing users to have max_mana equal to their current mana
UPDATE users SET max_mana = mana WHERE max_mana IS NULL;
