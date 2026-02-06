const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    logoutUser,
    verifyUser,
    updateUserProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/verify', protect, verifyUser);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
