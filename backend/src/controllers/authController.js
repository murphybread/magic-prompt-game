const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  console.log('Registration attempt:', req.body);
  const { username, password } = req.body;

  try {
    // Check if user already exists
    const userCheck = await req.db.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await req.db.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
      [username, hashedPassword]
    );

    const userId = result.rows[0].id;

    // Generate JWT
    const token = jwt.sign(
      { id: userId, username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    console.log('User registered successfully:', username);
    res.status(201).json({ token });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: "Error registering user" });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const result = await req.db.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: "Error logging in" });
  }
};

exports.guestLogin = (req, res) => {
  const guestUser = { id: 0, username: "guest" };
  const token = jwt.sign(guestUser, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
};

exports.getUserList = async (req, res) => {
  try {
    const result = await req.db.query('SELECT id, username FROM users');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching user list:', error);
    res.status(500).json({ message: "Error fetching user list" });
  }
};
