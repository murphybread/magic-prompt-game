ALTER TABLE users
ADD COLUMN IF NOT EXISTS twitter_id TEXT UNIQUE;
