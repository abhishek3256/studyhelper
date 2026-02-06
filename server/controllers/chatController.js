// const Chat = require('../models/Chat');
const Syllabus = require('../models/Syllabus');
const Note = require('../models/Note');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Get chat history or create new
// @route   GET /api/chat/:syllabusId
const getChatHistory = async (req, res) => {
    try {
        let chat = await Chat.findOne({
            userId: req.user._id,
            syllabusId: req.params.syllabusId
        });

        if (!chat) {
            return res.status(200).json({ success: true, messages: [] });
        }

        res.status(200).json({ success: true, messages: chat.messages });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chat history' });
    }
};

// @desc    Send message and get AI response
// @route   POST /api/chat/message
const sendMessage = async (req, res) => {
    const { syllabusId, message } = req.body;

    try {
        // 1. Fetch Syllabus Context
        const syllabus = await Syllabus.findById(syllabusId);
        if (!syllabus) return res.status(404).json({ message: 'Syllabus not found' });

        // 2. Fetch Notes
        const notes = await Note.find({ syllabusId }).select('topicTitle bulletPoints');
        const notesContext = notes.map(n =>
            `Topic: ${n.topicTitle}\nKey Points: ${n.bulletPoints.join('; ')}`
        ).join('\n\n');

        // 3. Get or Create Chat Session
        let chat = await Chat.findOne({ userId: req.user._id, syllabusId });
        if (!chat) {
            chat = await Chat.create({
                userId: req.user._id,
                syllabusId,
                messages: []
            });
        }

        // 4. Prepare History for Gemini
        const history = chat.messages.map(msg => ({
            role: msg.role === 'model' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        // Limit to last 20 messages to avoid token limits
        const recentHistory = history.slice(-20);

        // Use gemini-2.5-flash - the latest and fastest model
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const chatSession = model.startChat({
            history: recentHistory,
            generationConfig: {
                maxOutputTokens: 500,
                temperature: 0.7,
            },
        });

        // 5. Construct Context Prompt
        const contextPrompt = `
Context: You are a helpful AI tutor. You are helping a student study the following syllabus.

Syllabus Extract (First 5000 chars): ${syllabus.extractedText.substring(0, 5000)}...

Generated Notes Summary:
${notesContext.substring(0, 2000)}...

Student Question: ${message}

Answer the question based on the syllabus context provided. Be concise, clear, and encouraging.
        `;

        const result = await chatSession.sendMessage(contextPrompt);
        const response = result.response;
        const aiMessage = response.text();

        // 6. Save to DB
        chat.messages.push({ role: 'user', content: message });
        chat.messages.push({ role: 'model', content: aiMessage });
        await chat.save();

        res.status(200).json({
            success: true,
            userMessage: { role: 'user', content: message },
            aiMessage: { role: 'model', content: aiMessage }
        });

    } catch (error) {
        console.error('Chat Error:', error);
        res.status(500).json({
            message: 'AI Chat Failed',
            error: error.message
        });
    }
};

module.exports = {
    getChatHistory,
    sendMessage
};