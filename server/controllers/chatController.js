const Chat = require('../models/Chat');
const Syllabus = require('../models/Syllabus');
const Note = require('../models/Note');

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

// @desc    Send message and get AI response using Groq
// @route   POST /api/chat/message
const sendMessage = async (req, res) => {
    const { syllabusId, message } = req.body;

    try {
        // 1. Fetch Syllabus Context
        const syllabus = await Syllabus.findById(syllabusId);
        if (!syllabus) return res.status(404).json({ message: 'Syllabus not found' });

        // 2. Fetch Notes for context
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

        // 4. Prepare History for Groq (limit to last 10 turns to save tokens)
        const history = chat.messages.slice(-20).map(msg => ({
            role: msg.role === 'model' ? 'assistant' : 'user',
            content: msg.content
        }));

        // 5. Construct System Prompt
        const systemPrompt = `You are a helpful AI tutor assisting a student with their syllabus.
        
SYLLABUS CONTEXT:
${syllabus.extractedText.substring(0, 15000)}

NOTES SUMMARY:
${notesContext.substring(0, 5000)}

INSTRUCTIONS:
- Answer based ONLY on the provided syllabus and notes.
- Be concise, encouraging, and clear.
- If the answer isn't in the context, say so politely.`;

        // 6. Call Groq API
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...history,
                    { role: 'user', content: message }
                ],
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            throw new Error(`Groq API Error: ${response.statusText}`);
        }

        const data = await response.json();
        const aiMessage = data.choices[0].message.content;

        // 7. Save to DB
        chat.messages.push({ role: 'user', content: message });
        chat.messages.push({ role: 'model', content: aiMessage }); // Save as 'model' for DB consistency
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