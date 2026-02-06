// Test script to verify Gemini API key and available models
// Run with: node testGemini.js

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testGeminiAPI() {
    console.log('Testing Gemini API...\n');
    
    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
        console.error('❌ GEMINI_API_KEY not found in .env file');
        console.log('\nPlease:');
        console.log('1. Create a .env file in your server directory');
        console.log('2. Add: GEMINI_API_KEY=your_api_key_here');
        console.log('3. Get your API key from: https://makersuite.google.com/app/apikey');
        return;
    }

    console.log('✓ API Key found in .env');
    console.log(`Key preview: ${process.env.GEMINI_API_KEY.substring(0, 10)}...`);
    
    try {
        // Test with gemini-2.5-flash (the correct model for your API key)
        console.log('\n--- Testing gemini-2.5-flash model ---');
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        const result = await model.generateContent("Say 'Hello, I am working!' if you receive this.");
        const response = await result.response;
        const text = response.text();
        
        console.log('✅ gemini-2.5-flash is working perfectly!');
        console.log('Response:', text);
        
        console.log('\n✅ Gemini API is properly configured!');
        console.log('You can now use the application.');
        
        // Test with a more complex prompt
        console.log('\n--- Testing AI generation capabilities ---');
        const testPrompt = `Create 3 bullet points about Node.js. Return as JSON array.`;
        const testResult = await model.generateContent(testPrompt);
        const testResponse = await testResult.response;
        console.log('Complex prompt test:', testResponse.text().substring(0, 200) + '...');
        
        console.log('\n🎉 All tests passed! Your setup is ready.');
        
    } catch (error) {
        console.error('\n❌ Error testing Gemini API:');
        console.error('Error message:', error.message);
        
        if (error.message.includes('API_KEY_INVALID')) {
            console.log('\n⚠️  Your API key is invalid.');
            console.log('Please get a new one from: https://makersuite.google.com/app/apikey');
        } else if (error.message.includes('404')) {
            console.log('\n⚠️  Model not found error.');
            console.log('This usually means:');
            console.log('1. Your API key doesn\'t have access to the Gemini API');
            console.log('2. You need to enable the Generative Language API');
            console.log('3. Visit: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com');
        } else if (error.message.includes('403')) {
            console.log('\n⚠️  Access denied.');
            console.log('Make sure the Gemini API is enabled for your project.');
        }
        
        console.log('\nFull error:', error);
    }
}

testGeminiAPI();