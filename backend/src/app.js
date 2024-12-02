import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import passport from "./config/passport.js";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import pg from "pg";
const { Pool } = pg;
dotenv.config(); // 환경 변수 로드

// __dirname 설정 (ESM에서는 직접 사용 불가)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const app = express();

console.log("Environment variables check:");

console.log("OpenAI API Key is set:", !!process.env.OPENAI_API_KEY);
console.log("JWT_SECRET is set:", !!process.env.JWT_SECRET);
console.log("GOOGLE_CLIENT_ID is set:", !!process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET is set:", !!process.env.GOOGLE_CLIENT_SECRET);
console.log("TWITTER_CONSUMER_KEY is set:", !!process.env.TWITTER_CONSUMER_KEY);
console.log(
  "TWITTER_CONSUMER_SECRET is set:",
  !!process.env.TWITTER_CONSUMER_SECRET
);
console.log("SESSION_SECRET is set:", !!process.env.SESSION_SECRET);
console.log("FRONTEND_URL is set:", !!process.env.FRONTEND_URL);
console.log("BACKEND_URL is set:", !!process.env.BACKEND_URL);

console.log(
  "Twitter callback URL:",
  `${process.env.BACKEND_URL}/api/auth/twitter/callback`
);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://8db49593-86bc-4024-9db9-f98d410662af-00-19a9705pix41f.picard.replit.dev",
    "https://8db49593-86bc-4024-9db9-f98d410662af-00-19a9705pix41f.picard.replit.dev:8008",
    "https://8db49593-86bc-4024-9db9-f98d410662af-00-19a9705pix41f.picard.replit.dev:3000",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_session_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // 프로덕션에서는 HTTPS 사용 시 true
      httpOnly: true, // 클라이언트 측 스크립트 접근 불가
      maxAge: 1000 * 60 * 60 * 24, // 1일
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // CSRF 방지
    },
  })
);

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

const PORT = process.env.PORT || 8008; // Changed port to 8008

console.log("Attempting to start server on port:", PORT);

const server = app
  .listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  })
  .on("error", (err) => {
    console.error("Error starting server:", err);
  });

// Add static options
app.use(express.static(path.join(__dirname, "../builds")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../builds", "index.html"));
});

// Add static options
app.use(express.static(path.join(__dirname, "../builds")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../builds", "index.html"));
});

export default app;
