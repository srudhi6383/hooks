const express = require('express');
const { registerUser, loginUser, logoutUser, refreshToken } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', authMiddleware, logoutUser);
router.post('/refresh', refreshToken);

module.exports = router;
