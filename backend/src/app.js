require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');

const app = express();

console.log('Environment variables:', process.env);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const corsOptions = {
  origin: [
    "https://8db49593-86bc-4024-9db9-f98d410662af-00-19a9705pix41f.picard.replit.dev",
    "http://localhost:3000",
    "https://8db49593-86bc-4024-9db9-f98d410662af-00-19a9705pix41f.picard.replit.dev:3000",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

// Pass the database pool to the routes
app.use((req, res, next) => {
  req.db = pool;
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Magic Game API!" });
});

app.get("/api/db-test", async (req, res) => {
  try {
    const connectionResult = await req.db.query("SELECT NOW()");
    const tablesResult = await req.db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

    const tables = tablesResult.rows.map((row) => row.table_name);

    res.json({
      message: "Database connected successfully",
      timestamp: connectionResult.rows[0].now,
      tables: tables,
    });
  } catch (error) {
    console.error("Database connection error:", error);
    res
      .status(500)
      .json({ message: "Error connecting to database", error: error.message });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/game", gameRoutes);

const PORT = process.env.PORT || 8008;

const server = app
  .listen(PORT, "0.0.0.0", () => {
    const actualPort = server.address().port;
    console.log(`Server running on port ${actualPort}`);
    console.log(`Environment PORT: ${process.env.PORT}`);
    console.log(`Actual PORT used: ${actualPort}`);
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${PORT} is busy, trying the next available port.`);
      server.listen(0, "0.0.0.0", () => {
        const newPort = server.address().port;
        console.log(`Server is now running on port ${newPort}`);
        console.log(`Environment PORT: ${process.env.PORT}`);
        console.log(`Actual PORT used: ${newPort}`);
      });
    } else {
      console.error("Failed to start server:", err);
    }
  });

module.exports = app;
