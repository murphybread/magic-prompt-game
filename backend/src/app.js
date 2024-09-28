const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const passport = require('./config/passport');
const session = require('express-session');

const app = express();

console.log('Environment variables check:');
console.log('JWT_SECRET is set:', !!process.env.JWT_SECRET);
console.log('GOOGLE_CLIENT_ID is set:', !!process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET is set:', !!process.env.GOOGLE_CLIENT_SECRET);
console.log('TWITTER_CONSUMER_KEY is set:', !!process.env.TWITTER_CONSUMER_KEY);
console.log('TWITTER_CONSUMER_SECRET is set:', !!process.env.TWITTER_CONSUMER_SECRET);
console.log('SESSION_SECRET is set:', !!process.env.SESSION_SECRET);
console.log('FRONTEND_URL is set:', !!process.env.FRONTEND_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const corsOptions = {
  origin: [
    process.env.FRONTEND_URL,
    "http://localhost:3000",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Pass the database pool to the routes
app.use((req, res, next) => {
  req.db = pool;
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Magic Game API!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/game", gameRoutes);

const PORT = process.env.PORT || 8008;

console.log('Attempting to start server on port:', PORT);

const server = app
  .listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  })
  .on("error", (err) => {
    console.error("Error starting server:", err);
  });

module.exports = app;
