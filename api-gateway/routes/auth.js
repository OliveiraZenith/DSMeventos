// Auth Routes
// Handles authentication-related endpoints by proxying to Auth Service

const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const { authMiddleware } = require('../middleware/auth');

// POST /api/auth/register - Register new user
router.post('/register', async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
});

// POST /api/auth/login - Login
router.post('/login', async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Login failed'
    });
  }
});

// GET /api/auth/me - Get current user profile (protected)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const result = await authService.getProfile(req.token);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to fetch profile'
    });
  }
});

// PUT /api/auth/me - Update user profile (protected)
router.put('/me', authMiddleware, async (req, res) => {
  try {
    const result = await authService.updateProfile(req.token, req.body);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to update profile'
    });
  }
});

module.exports = router;
