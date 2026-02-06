// Quick verification - Run this to check which controller version you're using
// node checkController.js

const fs = require('fs');
const path = require('path');

const controllerPath = path.join(__dirname, 'controllers', 'notesController.js');

console.log('Checking notesController.js...\n');

if (!fs.existsSync(controllerPath)) {
    console.error('❌ notesController.js not found at:', controllerPath);
    process.exit(1);
}

const content = fs.readFileSync(controllerPath, 'utf8');

// Check for optimized version markers
const isOptimized = content.includes('OPTIMIZED APPROACH') || 
                   content.includes('Generate EVERYTHING in ONE API call');
const usesCorrectModel = content.includes('gemini-2.0-flash');
const hasOldApproach = content.includes('Processing topic') && 
                       content.includes('bulletPrompt') && 
                       content.includes('detailPrompt');

console.log('Controller Analysis:');
console.log('===================');
console.log(`Using optimized single-call approach: ${isOptimized ? '✅ YES' : '❌ NO'}`);
console.log(`Using gemini-2.0-flash model: ${usesCorrectModel ? '✅ YES' : '❌ NO'}`);
console.log(`Still using old multi-call approach: ${hasOldApproach ? '⚠️  YES (NEEDS REPLACEMENT)' : '✅ NO'}`);

console.log('\n');

if (!isOptimized || hasOldApproach) {
    console.log('🚨 YOU NEED TO REPLACE YOUR CONTROLLER! 🚨');
    console.log('\nYour controller is still using the OLD inefficient code.');
    console.log('This causes:');
    console.log('  - 16+ API calls per syllabus');
    console.log('  - Hitting quota limits immediately');
    console.log('  - Slow processing');
    console.log('\nAction required:');
    console.log('  1. Download the new notesController.js');
    console.log('  2. Replace your current file at:', controllerPath);
    console.log('  3. Restart the server');
} else if (!usesCorrectModel) {
    console.log('⚠️  Controller is optimized but using wrong model');
    console.log('\nAction required:');
    console.log('  - Update model from gemini-2.5-flash to gemini-2.0-flash');
    console.log('  - This will use a fresh quota pool');
} else {
    console.log('✅ Perfect! Your controller is using the optimized version!');
    console.log('\nYou should be able to process syllabi with just 1 API call each.');
}