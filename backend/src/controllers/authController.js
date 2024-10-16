const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');

exports.register = async (req, res) => {
  console.log("Registration attempt:", req.body);
  const { username, email, password } = req.body;

  try {
    const userCheck = await req.db.query(
      "SELECT * FROM users WHERE username = $1 OR email = $2",
      [username, email],
    );
    if (userCheck.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await req.db.query(
      "INSERT INTO users (username, email, password, mana) VALUES ($1, $2, $3, $4) RETURNING id",
      [username, email, hashedPassword, 100],
    );

    const userId = result.rows[0].id;

    const token = jwt.sign(
      { id: userId, username, email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    console.log("User registered successfully:", username);
    res.status(201).json({ token });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Error registering user" });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await req.db.query(
      "SELECT * FROM users WHERE username = $1",
      [username],
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
    console.error("Error during login:", error);
    res.status(500).json({ message: "Error logging in" });
  }
};

exports.guestLogin = async (req, res) => {
  try {
    const guestUsername = `guest_${uuidv4().substring(0, 8)}`;
    const guestPassword = 'guest1234';
    const initialMana = 10;

    const hashedPassword = await bcrypt.hash(guestPassword, 10);

    const result = await req.db.query(
      'INSERT INTO users (username, password, mana) VALUES ($1, $2, $3) RETURNING id, username',
      [guestUsername, hashedPassword, initialMana]
    );

    const guestUser = result.rows[0];

    const token = jwt.sign(
      { id: guestUser.id, username: guestUser.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, username: guestUser.username });
  } catch (error) {
    console.error('Error creating guest user:', error);
    res.status(500).json({ message: 'Error creating guest user' });
  }
};

exports.getUserList = async (req, res) => {
  try {
    const result = await req.db.query("SELECT id, username FROM users");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching user list:", error);
    res.status(500).json({ message: "Error fetching user list" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    console.log("Delete user request received:", req.body);
    console.log("User from token:", req.user);

    const { username } = req.body;
    const userId = req.user.id;

    if (req.user.username !== username) {
      console.log("Username mismatch:", req.user.username, username);
      return res
        .status(403)
        .json({ message: "You can only delete your own account" });
    }

    console.log("Attempting to delete user with ID:", userId);
    const result = await req.db.query("DELETE FROM users WHERE id = $1", [
      userId,
    ]);

    console.log("Delete query result:", result);

    if (result.rowCount === 0) {
      console.log("No user found with ID:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User deleted successfully:", username);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};

exports.socialLoginCallback = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=Authentication failed`);
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Include both token and username in the redirect URL
    res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}&username=${encodeURIComponent(user.username)}`);
  } catch (error) {
    console.error("Error in social login callback:", error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=Authentication failed`);
  }
};

module.exports = exports;
