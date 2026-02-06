const mongoose = require('mongoose');

const chatSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
            index: true,
        },
        syllabusId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Syllabus',
            index: true,
        },
        messages: [
            {
                role: {
                    type: String,
                    enum: ['user', 'model', 'system'], // 'model' is Gemini terminology, 'assistant' is OpenAI. Let's use 'model' or map it.
                    required: true,
                },
                content: {
                    type: String,
                    required: true,
                },
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
