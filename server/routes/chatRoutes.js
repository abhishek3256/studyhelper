const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getChatHistory, sendMessage } = require('../controllers/chatController');

router.get('/:syllabusId', protect, getChatHistory);
router.post('/message', protect, sendMessage);

module.exports = router;
