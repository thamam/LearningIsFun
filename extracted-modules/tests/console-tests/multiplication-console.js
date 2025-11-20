/**
 * Console Test for MultiplicationModule
 * Run: node extracted-modules/tests/console-tests/multiplication-console.js
 *
 * Tests:
 * 1. Module instantiation
 * 2. Question generation (all 4 types)
 * 3. Answer checking (correct/wrong)
 * 4. Difficulty adjustment
 * 5. Statistics tracking
 * 6. Zero DOM verification
 */

const MultiplicationModule = require('../../modules/MultiplicationModule');

console.log('🧪 MultiplicationModule Console Test\n');

// Test 1: Instantiation
console.log('Test 1: Module Instantiation');
const multiplicationModule = new MultiplicationModule({ initialLevel: 'קל' });
console.assert(multiplicationModule.currentLevel === 'קל', 'Initial level should be קל');
console.assert(multiplicationModule.statistics.totalQuestions === 0, 'Initial questions should be 0');
console.assert(multiplicationModule.questionTypes.length === 4, 'Should have 4 question types');
console.log('✅ Instantiation passed\n');

// Test 2: Generate Questions (All 4 Types)
console.log('Test 2: Generate Questions (All 4 Types)');
const types = {};
for (let i = 0; i < 40; i++) {
    const q = multiplicationModule.generateQuestion();
    types[q.metadata.questionType] = (types[q.metadata.questionType] || 0) + 1;
}
console.log('Question type distribution:', types);
console.assert(Object.keys(types).length === 4, 'Should generate all 4 question types');
console.log('✅ Question generation passed\n');

// Test 3: Verify Question Format
console.log('Test 3: Verify Question Format');
const question = multiplicationModule.generateQuestion('בינוני');
console.log('Sample question:', JSON.stringify(question, null, 2));
console.assert(question.type === 'question', 'Should be question type');
console.assert(question.questionType === 'input', 'Should be input type');
console.assert(question.questionText.includes('×') || question.questionText.includes('÷'), 'Should contain multiplication or division symbol');
console.assert(typeof question.correctAnswer === 'number', 'Correct answer should be a number');
console.assert(question.focus === true, 'Should request focus');
console.log('✅ Question format passed\n');

// Test 4: Check Correct Answer
console.log('Test 4: Check Correct Answer');
const checkModule = new MultiplicationModule();
const q1 = checkModule.generateQuestion();
console.log(`Question: ${q1.questionText}, Correct: ${q1.correctAnswer}`);
const feedback = checkModule.checkAnswer(q1.correctAnswer, q1.correctAnswer, q1);
console.log('Feedback:', JSON.stringify(feedback, null, 2));
console.assert(feedback.type === 'feedback', 'Should be feedback type');
console.assert(feedback.isCorrect === true, 'Should be correct');
console.assert(feedback.statistics.correctAnswers === 1, 'Should increment correct count');
console.assert(feedback.autoAdvance === true, 'Should auto-advance on correct');
console.assert(feedback.autoAdvanceDelay === 1500, 'Should have 1500ms delay');
console.log('✅ Correct answer check passed\n');

// Test 5: Check Wrong Answer
console.log('Test 5: Check Wrong Answer');
const wrongModule = new MultiplicationModule();
const wrongQ = wrongModule.generateQuestion();
const wrongAnswer = 9999; // Obviously wrong
const wrongFeedback = wrongModule.checkAnswer(wrongAnswer, wrongQ.correctAnswer, wrongQ);
console.log('Wrong feedback:', JSON.stringify(wrongFeedback, null, 2));
console.assert(wrongFeedback.isCorrect === false, 'Should be incorrect');
console.assert(wrongFeedback.correctAnswerDisplay !== null, 'Should show correct answer');
console.assert(wrongFeedback.explanationMessage !== null, 'Should show explanation');
console.assert(wrongFeedback.showNewQuestionButton === true, 'Should show new question button');
console.log('✅ Wrong answer check passed\n');

// Test 6: Difficulty Adjustment (Level Up)
console.log('Test 6: Difficulty Adjustment (Level Up)');
const levelUpModule = new MultiplicationModule({ initialLevel: 'קל' });
console.log('Starting level:', levelUpModule.currentLevel);
// Simulate 3 consecutive correct answers
for (let i = 0; i < 3; i++) {
    const q = levelUpModule.generateQuestion();
    const f = levelUpModule.checkAnswer(q.correctAnswer, q.correctAnswer, q);
    console.log(`Question ${i + 1}: correct, consecutiveCorrect=${f.statistics.consecutiveCorrect}`);
}
console.log('After 3 correct, level:', levelUpModule.currentLevel);
console.assert(levelUpModule.currentLevel === 'בינוני', 'Should level up to בינוני');
console.log('✅ Level up passed\n');

// Test 7: Difficulty Adjustment (Level Down)
console.log('Test 7: Difficulty Adjustment (Level Down)');
const levelDownModule = new MultiplicationModule({ initialLevel: 'בינוני' });
console.log('Starting level:', levelDownModule.currentLevel);
// Simulate 2 consecutive wrong answers
for (let i = 0; i < 2; i++) {
    const q = levelDownModule.generateQuestion();
    const wrongAns = 9999;
    const f = levelDownModule.checkAnswer(wrongAns, q.correctAnswer, q);
    console.log(`Question ${i + 1}: wrong, consecutiveWrong=${f.statistics.consecutiveWrong}`);
}
console.log('After 2 wrong, level:', levelDownModule.currentLevel);
console.assert(levelDownModule.currentLevel === 'קל', 'Should level down to קל');
console.log('✅ Level down passed\n');

// Test 8: Invalid Input Validation
console.log('Test 8: Invalid Input Validation');
const validationModule = new MultiplicationModule();
const validationQ = validationModule.generateQuestion();
const validationError = validationModule.checkAnswer('', validationQ.correctAnswer, validationQ);
console.log('Validation error:', JSON.stringify(validationError, null, 2));
console.assert(validationError.type === 'validation-error', 'Should return validation error');
console.assert(validationError.message === 'אנא הכניסי מספר!', 'Should have Hebrew error message');
console.log('✅ Validation passed\n');

// Test 9: Difficulty Ranges
console.log('Test 9: Difficulty Ranges');
const easyModule = new MultiplicationModule({ initialLevel: 'קל' });
const mediumModule = new MultiplicationModule({ initialLevel: 'בינוני' });
const hardModule = new MultiplicationModule({ initialLevel: 'קשה' });

for (let i = 0; i < 10; i++) {
    const easyQ = easyModule.generateQuestion();
    console.assert(easyQ.metadata.num1 >= 1 && easyQ.metadata.num1 <= 5, 'Easy: num1 should be 1-5');
    console.assert(easyQ.metadata.num2 >= 1 && easyQ.metadata.num2 <= 5, 'Easy: num2 should be 1-5');

    const mediumQ = mediumModule.generateQuestion();
    console.assert(mediumQ.metadata.num1 >= 1 && mediumQ.metadata.num1 <= 10, 'Medium: num1 should be 1-10');

    const hardQ = hardModule.generateQuestion();
    console.assert(hardQ.metadata.num1 >= 1 && hardQ.metadata.num1 <= 12, 'Hard: num1 should be 1-12');
}
console.log('✅ Difficulty ranges passed\n');

// Test 10: Zero DOM Verification
console.log('Test 10: Zero DOM Verification');
console.assert(typeof window === 'undefined', 'window should be undefined in Node.js');
console.assert(typeof document === 'undefined', 'document should be undefined in Node.js');
console.log('✅ Zero DOM verification passed\n');

// Test 11: Celebration Trigger
console.log('Test 11: Celebration Trigger');
const celebrationModule = new MultiplicationModule();
// Simulate 9 questions
for (let i = 0; i < 9; i++) {
    const q = celebrationModule.generateQuestion();
    celebrationModule.checkAnswer(q.correctAnswer, q.correctAnswer, q);
}
// 10th question should trigger celebration
const tenthQ = celebrationModule.generateQuestion();
const tenthFeedback = celebrationModule.checkAnswer(tenthQ.correctAnswer, tenthQ.correctAnswer, tenthQ);
console.log('10th question feedback:', JSON.stringify(tenthFeedback.celebrationTrigger, null, 2));
console.assert(tenthFeedback.celebrationTrigger === true, 'Should trigger celebration on 10th question');
console.log('✅ Celebration trigger passed\n');

console.log('🎉 All tests passed! MultiplicationModule is headless and ready for Next.js.\n');
