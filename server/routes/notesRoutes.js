const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { generateContent, getNotesBySyllabus } = require('../controllers/notesController');

router.post('/generate', protect, generateContent);
router.get('/syllabus/:syllabusId', protect, getNotesBySyllabus);

module.exports = router;
