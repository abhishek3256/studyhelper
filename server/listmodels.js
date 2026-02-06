// Script to list all available models for your API key
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listAvailableModels() {
    console.log('Fetching available Gemini models...\n');
    
    try {
        // Using the SDK's list models method
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY}`
        );
        
        const data = await response.json();
        
        if (data.models) {
            console.log('✅ Available models:\n');
            data.models.forEach((model, index) => {
                console.log(`${index + 1}. ${model.name}`);
                console.log(`   Display Name: ${model.displayName || 'N/A'}`);
                console.log(`   Supported Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
                console.log('');
            });
            
            // Find the best model for generateContent
            const contentModels = data.models.filter(m => 
                m.supportedGenerationMethods?.includes('generateContent')
            );
            
            if (contentModels.length > 0) {
                console.log('\n📝 Recommended models for content generation:');
                contentModels.forEach(model => {
                    // Extract just the model name from the full path
                    const modelName = model.name.replace('models/', '');
                    console.log(`   - ${modelName}`);
                });
                
                // Show the one to use
                const recommendedModel = contentModels[0].name.replace('models/', '');
                console.log(`\n✨ Use this model name in your code: "${recommendedModel}"`);
            }
        } else {
            console.error('❌ No models found or error:', data);
        }
        
    } catch (error) {
        console.error('❌ Error fetching models:', error.message);
        console.error(error);
    }
}

listAvailableModels();