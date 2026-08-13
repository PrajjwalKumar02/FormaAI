const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    getMe,
    updateProfile,
    updateSettings,
    refreshToken,
    checkTokenStatus
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshToken);
router.post('/check-token', checkTokenStatus);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/settings', protect, updateSettings);

module.exports = router;
