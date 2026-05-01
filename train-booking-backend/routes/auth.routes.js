const express = require('express');
const router = express.Router();
const { register, login, verifyToken, logout } = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validate = require('../middleware/validation.middleware');
const { registerValidator, loginValidator } = require('../utils/validators');

// Public routes
router.post('/register', validate(registerValidator), register);
router.post('/login', validate(loginValidator), login);

// Protected routes
router.get('/verify', authMiddleware, verifyToken);
router.post('/logout', authMiddleware, logout);

module.exports = router;