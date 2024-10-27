CREATE TABLE cards (
    id SERIAL PRIMARY KEY,                  -- Unique ID, auto-increment
    name VARCHAR(255) NOT NULL,             -- Card name
    cost VARCHAR(50) NOT NULL,              -- Card cost
    damage VARCHAR(50),                     -- Card damage
    effect TEXT,                            -- Card effect
    type VARCHAR(50),                       -- Card type
    description TEXT,                       -- Card description
    link TEXT,                              -- Link attribute (additional link or related URL)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Creation date
    owner_user_id INT REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE, -- Owner user ID (foreign key linked to the users table)
    group_name VARCHAR(255)                 -- Group or organization the card belongs to
);