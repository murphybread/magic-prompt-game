import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { logVars, logSecrets, logErrors } from "../utils/logging.js";


export const register = async (req, res) => {
  logSecrets("Registration attempt:", req.body)
  
  const { username, email, password } = req.body;

  try {
    const userCheck = await req.db.query(
      "SELECT * FROM users WHERE username = $1 OR email = $2",
      [username, email]
    );
    if (userCheck.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await req.db.query(
      "INSERT INTO users (username, email, password, mana, level, experience, max_mana) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      [username, email, hashedPassword, 100, 1, 0, 100]
    );

    const userId = result.rows[0].id;

    const token = jwt.sign(
      { id: userId, username, email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    logSecrets("User registered successfully:", username);
    res.status(201).json({ token });
  } catch (error) {
    logErrors("Error during registration:", error);
    res.status(500).json({ message: "Error registering user" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await req.db.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    const user = result.rows[0];

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
   logErrors ("Error during login:", error);
    res.status(500).json({ message: "Error logging in" });
  }
};

export const guestLogin = async (req, res) => {
  try {
    const guestUsername = `guest_${uuidv4().substring(0, 8)}`;
    const guestPassword = "guest1234";
    const initialMana = 10;

    const hashedPassword = await bcrypt.hash(guestPassword, 10);

    const result = await req.db.query(
      "INSERT INTO users (username, password, mana, level, experience, max_mana) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username",
      [guestUsername, hashedPassword, initialMana, 1, 0, initialMana]
    );

    const guestUser = result.rows[0];

    const token = jwt.sign(
      { id: guestUser.id, username: guestUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, username: guestUser.username });
  } catch (error) {
    logErrors("Error creating guest user:", error);
    res.status(500).json({ message: "Error creating guest user" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await req.db.query(
      "SELECT id, username, email, mana, level, experience, max_mana FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    logErrors("Error fetching user profile:", error);
    res.status(500).json({ message: "Error fetching user profile" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { email } = req.body;

    const result = await req.db.query(
      "UPDATE users SET email = $1 WHERE id = $2 RETURNING id, username, email, mana, level, experience, max_mana",
      [email, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    logErrors("Error updating user profile:", error);
    res.status(500).json({ message: "Error updating user profile" });
  }
};

export const getUserList = async (req, res) => {
  try {
    const result = await req.db.query("SELECT id, username FROM users");
    res.json(result.rows);
  } catch (error) {
    logErrors("Error fetching user list:", error);
    res.status(500).json({ message: "Error fetching user list" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    logSecrets("Delete user request received:", req.body);
    logSecrets("User from token:", req.user);

    const { username } = req.body;
    const userId = req.user.id;

    if (req.user.username !== username) {
      logSecrets("Username mismatch:", req.user.username, username);
      return res
        .status(403)
        .json({ message: "You can only delete your own account" });
    }

    logSecrets("Attempting to delete user with ID:", userId);
    const result = await req.db.query("DELETE FROM users WHERE id = $1", [
      userId,
    ]);

    logSecrets("Delete query result:", result);

    if (result.rowCount === 0) {
      logSecrets("No user found with ID:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    logSecrets("User deleted successfully:", username);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    logErrors("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};

export const socialLoginCallback = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=Authentication failed`);
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}&username=${encodeURIComponent(user.username)}`);
  } catch (error) {
    logErrors("Error in social login callback:", error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=Authentication failed`);
  }
};
