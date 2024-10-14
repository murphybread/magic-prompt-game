const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    const user = result.rows[0];
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const result = await pool.query('SELECT * FROM users WHERE google_id = $1', [profile.id]);
      let user = result.rows[0];

      if (!user) {
        const newUser = await pool.query(
          'INSERT INTO users (username, email, google_id, mana) VALUES ($1, $2, $3, $4) RETURNING *',
          [profile.displayName, profile.emails[0].value, profile.id, 100]
        );
        user = newUser.rows[0];
      }

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
));

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/api/auth/twitter/callback`,
    includeEmail: true
  },
  async (token, tokenSecret, profile, done) => {
    try {
      let user = await pool.query('SELECT * FROM users WHERE twitter_id = $1', [profile.id]);
      
      if (user.rows.length === 0) {
        const newUser = await pool.query(
          'INSERT INTO users (username, email, twitter_id, mana) VALUES ($1, $2, $3, $4) RETURNING *',
          [profile.username, profile.emails[0].value, profile.id, 100]
        );
        user = newUser.rows[0];
      } else {
        user = user.rows[0];
      }

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
));

module.exports = passport;
