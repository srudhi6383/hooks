const jwt = require('jsonwebtoken');
const BlacklistedToken = require('../models/BlacklistedToken');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  const blacklistedToken = await BlacklistedToken.findOne({ token });
  if (blacklistedToken) return res.status(401).json({ message: 'Token is blacklisted' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
