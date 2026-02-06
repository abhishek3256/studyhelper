const mongoose = require('mongoose');

const syllabusSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
            index: true,
        },
        originalFileName: {
            type: String,
            required: true,
        },
        pdfUrl: {
            type: String,
            // In a real app with cloud storage (S3/Cloudinary), this would be the URL.
            // For this local/MVP version, we might not store the full file or just store the path if using diskStorage.
            // We'll assume we might store base64 or just not persist the file needed for long term if we extract text immediately.
            // Let's make it optional for now or store a flag.
        },
        processingStatus: {
            type: String,
            enum: ['pending', 'processing', 'completed', 'failed'],
            default: 'pending',
        },
        extractedText: {
            type: String,
            required: true,
        },
        totalTopics: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true,
    }
);

const Syllabus = mongoose.model('Syllabus', syllabusSchema);
module.exports = Syllabus;
