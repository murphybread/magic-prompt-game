const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// In-memory user storage (replace with database in production)
const users = [];

exports.register = async (req, res) => {
  console.log('Registration attempt:', req.body);
  try {
    const { username, password } = req.body;

    if (users.find((u) => u.username === username)) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: users.length + 1,
      username,
      password: hashedPassword,
    };
    users.push(newUser);

    const token = jwt.sign(
      { id: newUser.id, username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    console.log('User registered successfully:', newUser.username);
    res.status(201).json({ token });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: "Error registering user" });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
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

exports.getUserList = (req, res) => {
  // Remove sensitive information like passwords before sending
  const userList = users.map((user) => ({
    id: user.id,
    username: user.username,
  }));
  res.json(userList);
};
