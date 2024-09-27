const jwt = require('jsonwebtoken');

exports.generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.REPLIT_JWT_SECRET,
    { expiresIn: '1h' }
  );
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.REPLIT_JWT_SECRET);
  } catch (error) {
    return null;
  }
};
