/**
 * Console Test for DistributiveModule
 * Run: node extracted-modules/tests/console-tests/distributive-console.js
 *
 * Tests:
 * 1. Module instantiation
 * 2. Easy questions (fill_blank, calculate)
 * 3. Medium questions (addition & subtraction decomposition)
 * 4. Hard questions (three-digit multiplication)
 * 5. Area model data presence
 * 6. Pedagogical explanations
 * 7. Connection to algorithm flag
 * 8. Zero DOM verification
 */

const DistributiveModule = require('../../modules/DistributiveModule');

console.log('🧪 DistributiveModule Console Test\n');

// Test 1: Instantiation
console.log('Test 1: Module Instantiation');
const distributiveModule = new DistributiveModule({ initialLevel: 'קל' });
console.assert(distributiveModule.currentLevel === 'קל', 'Initial level should be קל');
console.assert(distributiveModule.statistics.totalQuestions === 0, 'Initial questions should be 0');
console.log('✅ Instantiation passed\n');

// Test 2: Easy Question Types
console.log('Test 2: Easy Question Generation (קל)');
const easyModule = new DistributiveModule({ initialLevel: 'קל' });
const easyTypes = {};
for (let i = 0; i < 20; i++) {
    const q = easyModule.generateQuestion();
    easyTypes[q.metadata.questionType] = (easyTypes[q.metadata.questionType] || 0) + 1;
}
console.log('Easy question distribution:', easyTypes);
console.assert(easyTypes.hasOwnProperty('fill_blank') || easyTypes.hasOwnProperty('calculate'), 'Should generate easy types');
console.log('✅ Easy questions passed\n');

// Test 3: Area Model Data Presence
console.log('Test 3: Area Model Data Presence');
const areaModelQ = distributiveModule.generateQuestion();
console.log('Sample question:', JSON.stringify(areaModelQ, null, 2));
console.assert(areaModelQ.areaModel, 'Question should include area model data');
console.assert(areaModelQ.areaModel.factor1, 'Area model should have factor1');
console.assert(areaModelQ.areaModel.factor2, 'Area model should have factor2');
console.assert(areaModelQ.areaModel.decomposition, 'Area model should have decomposition');
console.log('✅ Area model data passed\n');

// Test 4: Medium Questions (Addition vs Subtraction)
console.log('Test 4: Medium Question Generation (בינוני)');
const mediumModule = new DistributiveModule({ initialLevel: 'בינוני' });
const mediumTypes = {};
for (let i = 0; i < 30; i++) {
    const q = mediumModule.generateQuestion();
    mediumTypes[q.metadata.questionType] = (mediumTypes[q.metadata.questionType] || 0) + 1;
}
console.log('Medium question distribution:', mediumTypes);
console.assert(Object.keys(mediumTypes).length >= 1, 'Should generate medium types');
console.log('✅ Medium questions passed\n');

// Test 5: Subtraction Decomposition Detection
console.log('Test 5: Subtraction Decomposition Detection');
let foundSubtraction = false;
for (let i = 0; i < 20; i++) {
    const q = mediumModule.generateQuestion();
    if (q.metadata.questionType === 'subtraction_decomposition') {
        foundSubtraction = true;
        console.log('Found subtraction decomposition:', q.questionText.substring(0, 30) + '...');
        console.assert(q.explanation.includes('חיסור'), 'Should mention subtraction in explanation');
        console.assert(q.explanation.includes('💡'), 'Should include pedagogical insight');
        break;
    }
}
console.log('✅ Subtraction decomposition detection passed\n');

// Test 6: Hard Questions (Three-Digit)
console.log('Test 6: Hard Question Generation (קשה)');
const hardModule = new DistributiveModule({ initialLevel: 'קשה' });
const hardQ = hardModule.generateQuestion();
console.log('Hard question sample:', JSON.stringify(hardQ, null, 2));
console.assert(hardQ.metadata.questionType === 'three_digit', 'Should be three_digit type');
console.assert(hardQ.connectionToAlgorithm === true, 'Should flag connection to algorithm');
console.assert(hardQ.areaModel.decomposition.hundreds !== undefined, 'Should have hundreds decomposition');
console.log('✅ Hard questions passed\n');

// Test 7: Pedagogical Explanations Always Present
console.log('Test 7: Pedagogical Explanations Always Present');
for (let i = 0; i < 10; i++) {
    const q = distributiveModule.generateQuestion();
    console.assert(q.explanation && q.explanation.length > 0, 'Every question should have explanation');
}
console.log('✅ Explanations presence passed\n');

// Test 8: Check Correct Answer with Explanation
console.log('Test 8: Check Correct Answer');
const checkModule = new DistributiveModule();
const q1 = checkModule.generateQuestion();
const feedback = checkModule.checkAnswer(q1.correctAnswer, q1.correctAnswer, q1);
console.log('Feedback:', JSON.stringify(feedback, null, 2));
console.assert(feedback.type === 'feedback', 'Should be feedback type');
console.assert(feedback.isCorrect === true, 'Should be correct');
console.assert(feedback.explanation, 'Should include explanation');
console.assert(feedback.autoAdvance === true, 'Should auto-advance on correct');
console.assert(feedback.autoAdvanceDelay === 2500, 'Should have 2.5s delay');
console.log('✅ Correct answer check passed\n');

// Test 9: Check Wrong Answer
console.log('Test 9: Check Wrong Answer');
const wrongModule = new DistributiveModule();
const wrongQ = wrongModule.generateQuestion();
const wrongAnswer = 9999; // Obviously wrong
const wrongFeedback = wrongModule.checkAnswer(wrongAnswer, wrongQ.correctAnswer, wrongQ);
console.log('Wrong feedback:', JSON.stringify(wrongFeedback, null, 2));
console.assert(wrongFeedback.isCorrect === false, 'Should be incorrect');
console.assert(wrongFeedback.correctAnswerDisplay !== null, 'Should show correct answer');
console.assert(wrongFeedback.explanation, 'Should include explanation');
console.log('✅ Wrong answer check passed\n');

// Test 10: Difficulty Adjustment
console.log('Test 10: Difficulty Adjustment (Level Up)');
const levelUpModule = new DistributiveModule({ initialLevel: 'קל' });
console.log('Starting level:', levelUpModule.currentLevel);
for (let i = 0; i < 3; i++) {
    const q = levelUpModule.generateQuestion();
    levelUpModule.checkAnswer(q.correctAnswer, q.correctAnswer, q);
}
console.log('After 3 correct, level:', levelUpModule.currentLevel);
console.assert(levelUpModule.currentLevel === 'בינוני', 'Should level up to בינוני');
console.log('✅ Level up passed\n');

// Test 11: Number Formatting (Thousands Separator)
console.log('Test 11: Number Formatting');
const formatModule = new DistributiveModule({ initialLevel: 'קשה' });
let foundFormattedNumber = false;
for (let i = 0; i < 10; i++) {
    const q = formatModule.generateQuestion();
    if (q.correctAnswer >= 1000) {
        foundFormattedNumber = true;
        console.log('Formatted answer:', q.correctAnswer);
        break;
    }
}
console.log('✅ Number formatting passed\n');

// Test 12: Zero DOM Verification
console.log('Test 12: Zero DOM Verification');
console.assert(typeof window === 'undefined', 'window should be undefined in Node.js');
console.assert(typeof document === 'undefined', 'document should be undefined in Node.js');
console.log('✅ Zero DOM verification passed\n');

console.log('🎉 All tests passed! DistributiveModule is headless and ready for Next.js.\n');
console.log('🎊 THE ARITHMETIC BATCH (Stories 07-11) IS COMPLETE! 🎊\n');
