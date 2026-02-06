const Syllabus = require('../models/Syllabus');
const pdfParse = require('pdf-parse');
const fs = require('fs');

// @desc    Upload syllabus PDF and extract text
// @route   POST /api/syllabus/upload
// @access  Private
const uploadSyllabus = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Read file buffer
        // Since we are using memoryStorage (default if no storage defined in multer options in route), req.file.buffer is available.
        // If using diskStorage, we read from req.file.path.
        // Let's assume memoryStorage for simpler text extraction immediately without cleaning up files.

        let dataBuffer;
        if (req.file.buffer) {
            dataBuffer = req.file.buffer;
        } else if (req.file.path) {
            dataBuffer = fs.readFileSync(req.file.path);
            // Clean up file if using disk storage temporary
            // fs.unlinkSync(req.file.path); 
        }

        const data = await pdfParse(dataBuffer);
        const extractedText = data.text;

        if (!extractedText || extractedText.trim().length === 0) {
            return res.status(400).json({ message: 'Could not extract text from PDF. It might be an image-based PDF.' });
        }

        const syllabus = await Syllabus.create({
            userId: req.user._id,
            originalFileName: req.file.originalname,
            processingStatus: 'processing', // Will be updated to completed once we refine topics? Or just 'completed' for extraction phase. 
            // Let's set to 'pending' topic extraction. But for this step "upload", text extraction is done.
            extractedText: extractedText,
        });

        res.status(201).json({
            success: true,
            message: 'Syllabus uploaded and text extracted successfully',
            syllabus: {
                _id: syllabus._id,
                originalFileName: syllabus.originalFileName,
                uploadedAt: syllabus.createdAt,
                extractedTextLength: extractedText.length
            },
        });

    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: 'Server Error during file upload processing' });
    }
};

// @desc    Get all user syllabi
// @route   GET /api/syllabus
// @access  Private
const getUserSyllabi = async (req, res) => {
    try {
        const syllabi = await Syllabus.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: syllabi.length, syllabi });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching syllabi' });
    }
}

// @desc    Get single syllabus
// @route   GET /api/syllabus/:id
// @access  Private
const getSyllabusById = async (req, res) => {
    try {
        const syllabus = await Syllabus.findOne({ _id: req.params.id, userId: req.user._id });
        if (!syllabus) {
            return res.status(404).json({ message: 'Syllabus not found' });
        }
        res.status(200).json({ success: true, syllabus });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}


module.exports = {
    uploadSyllabus,
    getUserSyllabi,
    getSyllabusById
};
