const User = require('../models/User');
const BlacklistedToken = require('../models/BlacklistedToken');
const generateTokens = require('../utils/generateTokens');
const jwt = require('jsonwebtoken');

// Register User
const registerUser = async (req, res) => {
  const { email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const user = new User({ email, password });
  await user.save();

  const { accessToken, refreshToken } = generateTokens(user);

  res.json({ accessToken, refreshToken });
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const isPasswordCorrect = await user.matchPassword(password);
  if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });

  const { accessToken, refreshToken } = generateTokens(user);

  res.json({ accessToken, refreshToken });
};

// Logout User
const logoutUser = async (req, res) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  const blacklistedToken = new BlacklistedToken({ token });
  await blacklistedToken.save();

  res.json({ message: 'Logged out successfully' });
};

// Refresh Token
const refreshToken = async (req, res) => {
  const refreshToken = req.header('Authorization')?.replace('Bearer ', '');

  if (!refreshToken) return res.status(401).json({ message: 'No refresh token, authorization denied' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

module.exports = { registerUser, loginUser, logoutUser, refreshToken };
