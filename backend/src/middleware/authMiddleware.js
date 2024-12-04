import jwt from 'jsonwebtoken';
import { logVars, logSecrets, logErrors } from "../utils/logging.js";


export default (req, res, next) => {
  logVars("Auth middleware triggered");
  const token = req.header('Authorization')?.replace('Bearer ', '');
  logSecrets('Received token:', token ? 'Token present' : 'No token');

  if (!token) {
    logVars('No token provided');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    logSecrets('JWT_SECRET used:', process.env.JWT_SECRET ? 'Environment variable' : 'Fallback key');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SomeKey');
    ('Token verified successfully');
    logSecrets('Decoded token:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    logErrors('Token verification failed:', error.message);
    logErrors('Error details:', error);
    res.status(401).json({ message: 'Token is not valid', error: error.message });
  }
};
