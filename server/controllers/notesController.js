// const Note = require('../models/Note');
// const Syllabus = require('../models/Syllabus');
// const { GoogleGenerativeAI } = require('@google/generative-ai');

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// const generateContent = async (req, res) => {
//     const { syllabusId } = req.body;

//     try {
//         const syllabus = await Syllabus.findById(syllabusId);
//         if (!syllabus) {
//             return res.status(404).json({ message: 'Syllabus not found' });
//         }

//         if (syllabus.userId.toString() !== req.user._id.toString()) {
//             return res.status(401).json({ message: 'Not authorized' });
//         }

//         // Check if notes already exist
//         const existingNotes = await Note.find({ syllabusId });
//         if (existingNotes.length > 0) {
//             return res.status(200).json({ success: true, message: 'Notes already generated', notes: existingNotes });
//         }

//         // Update status
//         syllabus.processingStatus = 'processing';
//         await syllabus.save();

//         const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//         // 1. Extract Topics
//         const topicPrompt = `Analyze the following educational syllabus text and identify all distinct topics. For each topic, provide a clear title. Return the response as a JSON array of topic titles.
        
//         Syllabus Text:
//         ${syllabus.extractedText.substring(0, 30000)} 
        
//         Format: ["Topic 1 Title", "Topic 2 Title", ...]`;
//         // Truncate text if too long, Gemini has limit. 30k chars is safe for simple text.

//         const topicResult = await model.generateContent(topicPrompt);
//         const topicResponse = topicResult.response;
//         let topicsText = topicResponse.text();

//         // Clean markdown code blocks if present
//         topicsText = topicsText.replace(/```json/g, '').replace(/```/g, '').trim();

//         let topics = [];
//         try {
//             topics = JSON.parse(topicsText);
//         } catch (e) {
//             console.error("Failed to parse topics JSON", e);
//             // Fallback: try split by newlines if array parse fails
//             topics = topicsText.split('\n').filter(t => t.length > 5);
//         }

//         syllabus.totalTopics = topics.length;
//         await syllabus.save();

//         // 2. Process each topic (Sequential for now to avoid rate limits, or Promise.all with concurrency limit)
//         // For MVP, lets do first 3-5 topics to be fast, or all if small.
//         const limitedTopics = topics.slice(0, 5);

//         const generatedNotes = [];

//         for (const topic of limitedTopics) {
//             // A. Bullet Points
//             const bulletPrompt = `Create 5-8 concise bullet points summarizing the key concepts for the topic: '${topic}' from this syllabus context. Return as JSON array of strings.`;
//             const bulletResult = await model.generateContent([bulletPrompt, syllabus.extractedText.substring(0, 10000)]);
//             let bulletText = bulletResult.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
//             let bulletPoints = [];
//             try {
//                 bulletPoints = JSON.parse(bulletText);
//             } catch (e) {
//                 bulletPoints = bulletText.split('\n').map(l => l.replace(/^[•-]\s*/, ''));
//             }

//             // B. Detailed Explanation
//             const detailPrompt = `Generate comprehensive study notes (300-500 words) for the topic: '${topic}'. Include definitions, key principles, and examples. Write in clear markdown format.`;
//             const detailResult = await model.generateContent([detailPrompt, syllabus.extractedText.substring(0, 10000)]);
//             const detailedExplanation = detailResult.response.text();

//             // C. Questions
//             const quizPrompt = `Generate 5 multiple-choice questions for the topic: '${topic}'. 
//             Return as JSON array:
//             [{
//               "questionText": "...",
//               "options": ["A", "B", "C", "D"],
//               "correctAnswer": "Option String",
//               "explanation": "...",
//               "difficulty": "medium"
//             }]`;

//             const quizResult = await model.generateContent([quizPrompt, detailedExplanation]);
//             let quizText = quizResult.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
//             let questions = [];
//             try {
//                 questions = JSON.parse(quizText);
//             } catch (e) {
//                 console.error("Failed to parse quiz JSON", e);
//             }

//             const note = await Note.create({
//                 syllabusId: syllabus._id,
//                 userId: req.user._id,
//                 topicTitle: topic,
//                 bulletPoints,
//                 detailedExplanation,
//                 questions
//             });
//             generatedNotes.push(note);
//         }

//         syllabus.processingStatus = 'completed';
//         await syllabus.save();

//         res.status(200).json({ success: true, count: generatedNotes.length, notes: generatedNotes });

//     } catch (error) {
//         console.error('Generation Error:', error);
//         res.status(500).json({ message: 'AI Generation Failed' });
//     }
// };

// const getNotesBySyllabus = async (req, res) => {
//     try {
//         const notes = await Note.find({ syllabusId: req.params.syllabusId, userId: req.user._id });
//         res.status(200).json({ success: true, count: notes.length, notes });
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching notes' });
//     }
// }

// module.exports = {
//     generateContent,
//     getNotesBySyllabus
// };
const Note = require('../models/Note');
const Syllabus = require('../models/Syllabus');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateContent = async (req, res) => {
    const { syllabusId } = req.body;

    try {
        const syllabus = await Syllabus.findById(syllabusId);
        if (!syllabus) {
            return res.status(404).json({ message: 'Syllabus not found' });
        }

        if (syllabus.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Check if notes already exist
        const existingNotes = await Note.find({ syllabusId });
        if (existingNotes.length > 0) {
            return res.status(200).json({ success: true, message: 'Notes already generated', notes: existingNotes });
        }

        // Update status
        syllabus.processingStatus = 'processing';
        await syllabus.save();

        // Use gemini-2.5-flash - the latest and fastest model
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // 1. Extract Topics
        const topicPrompt = `Analyze the following educational syllabus text and identify all distinct topics. For each topic, provide a clear title. Return the response as a JSON array of topic titles.
        
Syllabus Text:
${syllabus.extractedText.substring(0, 30000)} 
        
Format: ["Topic 1 Title", "Topic 2 Title", ...]`;

        const topicResult = await model.generateContent(topicPrompt);
        const topicResponse = topicResult.response;
        let topicsText = topicResponse.text();

        // Clean markdown code blocks if present
        topicsText = topicsText.replace(/```json/g, '').replace(/```/g, '').trim();

        let topics = [];
        try {
            topics = JSON.parse(topicsText);
        } catch (e) {
            console.error("Failed to parse topics JSON", e);
            // Fallback: try split by newlines if array parse fails
            topics = topicsText.split('\n')
                .filter(t => t.trim().length > 5)
                .map(t => t.replace(/^\d+\.\s*/, '').replace(/^[-•]\s*/, '').replace(/["\[\]]/g, '').trim())
                .filter(t => t.length > 0);
        }

        if (topics.length === 0) {
            throw new Error("No topics could be extracted from syllabus");
        }

        syllabus.totalTopics = topics.length;
        await syllabus.save();

        console.log(`Extracted ${topics.length} topics. Processing first 5...`);

        // 2. Process each topic (limiting to first 5 for faster processing)
        const limitedTopics = topics.slice(0, 5);
        const generatedNotes = [];

        for (let i = 0; i < limitedTopics.length; i++) {
            const topic = limitedTopics[i];
            console.log(`Processing topic ${i + 1}/${limitedTopics.length}: ${topic}`);

            try {
                // A. Bullet Points
                const bulletPrompt = `Create 5-8 concise bullet points summarizing the key concepts for the topic: '${topic}' from this syllabus context. Return as JSON array of strings.

Syllabus Context:
${syllabus.extractedText.substring(0, 10000)}`;

                const bulletResult = await model.generateContent(bulletPrompt);
                let bulletText = bulletResult.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
                let bulletPoints = [];
                try {
                    bulletPoints = JSON.parse(bulletText);
                } catch (e) {
                    bulletPoints = bulletText.split('\n')
                        .map(l => l.replace(/^[•-]\s*/, '').replace(/^\d+\.\s*/, '').trim())
                        .filter(l => l.length > 0);
                }

                // B. Detailed Explanation
                const detailPrompt = `Generate comprehensive study notes (300-500 words) for the topic: '${topic}'. Include definitions, key principles, and examples. Write in clear markdown format.

Syllabus Context:
${syllabus.extractedText.substring(0, 10000)}`;

                const detailResult = await model.generateContent(detailPrompt);
                const detailedExplanation = detailResult.response.text();

                // C. Questions
                const quizPrompt = `Generate 5 multiple-choice questions for the topic: '${topic}'. 
Return as JSON array:
[{
  "questionText": "...",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": "Option A",
  "explanation": "...",
  "difficulty": "medium"
}]

Topic Details:
${detailedExplanation.substring(0, 2000)}`;

                const quizResult = await model.generateContent(quizPrompt);
                let quizText = quizResult.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
                let questions = [];
                try {
                    questions = JSON.parse(quizText);
                } catch (e) {
                    console.error("Failed to parse quiz JSON for topic:", topic, e);
                    questions = [];
                }

                const note = await Note.create({
                    syllabusId: syllabus._id,
                    userId: req.user._id,
                    topicTitle: topic,
                    bulletPoints,
                    detailedExplanation,
                    questions
                });
                generatedNotes.push(note);

                console.log(`✓ Completed topic ${i + 1}: ${topic}`);

                // Add delay to avoid rate limiting
                if (i < limitedTopics.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                
            } catch (topicError) {
                console.error(`Error processing topic "${topic}":`, topicError.message);
                // Continue with next topic
                continue;
            }
        }

        syllabus.processingStatus = 'completed';
        await syllabus.save();

        console.log(`✅ Successfully generated ${generatedNotes.length} notes`);

        res.status(200).json({ success: true, count: generatedNotes.length, notes: generatedNotes });

    } catch (error) {
        console.error('Generation Error:', error);
        
        // Update syllabus status to failed
        try {
            const syllabus = await Syllabus.findById(req.body.syllabusId);
            if (syllabus) {
                syllabus.processingStatus = 'failed';
                await syllabus.save();
            }
        } catch (updateError) {
            console.error('Error updating syllabus status:', updateError);
        }

        res.status(500).json({ 
            message: 'AI Generation Failed', 
            error: error.message
        });
    }
};

const getNotesBySyllabus = async (req, res) => {
    try {
        const notes = await Note.find({ syllabusId: req.params.syllabusId, userId: req.user._id });
        res.status(200).json({ success: true, count: notes.length, notes });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notes' });
    }
};

module.exports = {
    generateContent,
    getNotesBySyllabus
};