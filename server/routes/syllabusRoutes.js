const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const {
    uploadSyllabus,
    getUserSyllabi,
    getSyllabusById
} = require('../controllers/syllabusController');

// Multer config for Memory Storage (keep file in RAM for parsing)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: fileFilter
});

router.post('/upload', protect, upload.single('file'), uploadSyllabus);
router.get('/', protect, getUserSyllabi);
router.get('/:id', protect, getSyllabusById);

module.exports = router;
