const mongoose = require('mongoose');

const noteSchema = mongoose.Schema(
    {
        syllabusId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Syllabus',
            index: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        topicTitle: {
            type: String,
            required: true,
        },
        bulletPoints: [{
            type: String,
        }],
        detailedExplanation: {
            type: String, // Stored as markdown or HTML
        },
        questions: [{
            questionText: String,
            options: [String],
            correctAnswer: String,
            explanation: String,
            difficulty: {
                type: String,
                enum: ['easy', 'medium', 'hard'],
            },
        }],
    },
    {
        timestamps: true,
    }
);

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;
