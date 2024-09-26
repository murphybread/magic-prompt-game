const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const gameRoutes = require("./routes/gameRoutes");

const app = express();

const corsOptions = {
  origin: ['https://8db49593-86bc-4024-9db9-f98d410662af-00-19a9705pix41f.picard.replit.dev', 'http://localhost:3000'],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Magic Game API!" });
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
