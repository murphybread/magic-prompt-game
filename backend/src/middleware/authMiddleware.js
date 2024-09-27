const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('Received token:', token ? 'Token present' : 'No token');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    console.log('JWT_SECRET used:', process.env.JWT_SECRET ? 'Environment variable' : 'Fallback key');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SomeKey');
    console.log('Token verified successfully');
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
