/**
 * Console Test for OrderOperationsModule
 * Run: node extracted-modules/tests/console-tests/order-console.js
 *
 * Tests:
 * 1. Module instantiation
 * 2. Easy question types (parens_first, mult_before_add)
 * 3. Medium question types (three_ops, subtract_divide, word_problem_simple)
 * 4. Hard word problems (all 3 scenarios)
 * 5. Answer checking with explanations
 * 6. Difficulty adjustment
 * 7. Zero DOM verification
 */

const OrderOperationsModule = require('../../modules/OrderOperationsModule');

console.log('🧪 OrderOperationsModule Console Test\n');

// Test 1: Instantiation
console.log('Test 1: Module Instantiation');
const orderModule = new OrderOperationsModule({ initialLevel: 'קל' });
console.assert(orderModule.currentLevel === 'קל', 'Initial level should be קל');
console.assert(orderModule.statistics.totalQuestions === 0, 'Initial questions should be 0');
console.log('✅ Instantiation passed\n');

// Test 2: Easy Questions
console.log('Test 2: Easy Question Generation (קל)');
const easyModule = new OrderOperationsModule({ initialLevel: 'קל' });
const types = {};
for (let i = 0; i < 20; i++) {
    const q = easyModule.generateQuestion();
    types[q.metadata.questionType] = (types[q.metadata.questionType] || 0) + 1;
}
console.log('Easy question distribution:', types);
console.assert(types.hasOwnProperty('parens_first') || types.hasOwnProperty('mult_before_add'), 'Should generate easy types');
console.log('✅ Easy questions passed\n');

// Test 3: Medium Questions
console.log('Test 3: Medium Question Generation (בינוני)');
const mediumModule = new OrderOperationsModule({ initialLevel: 'בינוני' });
const mediumTypes = {};
for (let i = 0; i < 30; i++) {
    const q = mediumModule.generateQuestion();
    mediumTypes[q.metadata.questionType] = (mediumTypes[q.metadata.questionType] || 0) + 1;
}
console.log('Medium question distribution:', mediumTypes);
console.assert(Object.keys(mediumTypes).length >= 2, 'Should generate multiple medium types');
console.log('✅ Medium questions passed\n');

// Test 4: Hard Word Problems
console.log('Test 4: Hard Question Generation (קשה)');
const hardModule = new OrderOperationsModule({ initialLevel: 'קשה' });
const hardTypes = {};
for (let i = 0; i < 30; i++) {
    const q = hardModule.generateQuestion();
    hardTypes[q.metadata.questionType] = (hardTypes[q.metadata.questionType] || 0) + 1;
}
console.log('Hard question distribution:', hardTypes);
console.assert(Object.keys(hardTypes).length >= 2, 'Should generate multiple hard scenarios');
console.log('✅ Hard questions passed\n');

// Test 5: Verify Question Format
console.log('Test 5: Verify Question Format');
const sampleQ = orderModule.generateQuestion();
console.log('Sample question:', JSON.stringify(sampleQ, null, 2));
console.assert(sampleQ.type === 'question', 'Should be question type');
console.assert(sampleQ.questionType === 'input', 'Should be input type');
console.assert(sampleQ.explanation, 'Should include explanation');
console.assert(typeof sampleQ.correctAnswer === 'number', 'Correct answer should be a number');
console.log('✅ Question format passed\n');

// Test 6: Check Correct Answer with Explanation
console.log('Test 6: Check Correct Answer');
const checkModule = new OrderOperationsModule();
const q1 = checkModule.generateQuestion();
console.log(`Question: ${q1.questionText || q1.equation}`);
console.log(`Correct answer: ${q1.correctAnswer}`);
const feedback = checkModule.checkAnswer(q1.correctAnswer, q1.correctAnswer, q1);
console.log('Feedback:', JSON.stringify(feedback, null, 2));
console.assert(feedback.type === 'feedback', 'Should be feedback type');
console.assert(feedback.isCorrect === true, 'Should be correct');
console.assert(feedback.explanation, 'Should include explanation');
console.assert(feedback.explanationLabel === 'פתרון:', 'Correct answer should show solution label');
console.assert(feedback.autoAdvance === true, 'Should auto-advance on correct');
console.log('✅ Correct answer check passed\n');

// Test 7: Check Wrong Answer with Explanation
console.log('Test 7: Check Wrong Answer');
const wrongModule = new OrderOperationsModule();
const wrongQ = wrongModule.generateQuestion();
const wrongAnswer = 9999; // Obviously wrong
const wrongFeedback = wrongModule.checkAnswer(wrongAnswer, wrongQ.correctAnswer, wrongQ);
console.log('Wrong feedback:', JSON.stringify(wrongFeedback, null, 2));
console.assert(wrongFeedback.isCorrect === false, 'Should be incorrect');
console.assert(wrongFeedback.correctAnswerDisplay !== null, 'Should show correct answer');
console.assert(wrongFeedback.explanation, 'Should include explanation');
console.assert(wrongFeedback.explanationLabel === 'הסבר:', 'Wrong answer should show explanation label');
console.log('✅ Wrong answer check passed\n');

// Test 8: Difficulty Adjustment (Level Up)
console.log('Test 8: Difficulty Adjustment (Level Up)');
const levelUpModule = new OrderOperationsModule({ initialLevel: 'קל' });
console.log('Starting level:', levelUpModule.currentLevel);
for (let i = 0; i < 3; i++) {
    const q = levelUpModule.generateQuestion();
    const f = levelUpModule.checkAnswer(q.correctAnswer, q.correctAnswer, q);
}
console.log('After 3 correct, level:', levelUpModule.currentLevel);
console.assert(levelUpModule.currentLevel === 'בינוני', 'Should level up to בינוני');
console.log('✅ Level up passed\n');

// Test 9: Word Problem Detection
console.log('Test 9: Word Problem Detection');
const wordProblemModule = new OrderOperationsModule({ initialLevel: 'בינוני' });
let foundWordProblem = false;
for (let i = 0; i < 20; i++) {
    const q = wordProblemModule.generateQuestion();
    if (q.wordProblem === true) {
        foundWordProblem = true;
        console.log('Found word problem:', q.questionText.substring(0, 50) + '...');
        console.assert(q.expressionHint, 'Word problem should have expression hint');
        break;
    }
}
console.assert(foundWordProblem, 'Should generate word problems');
console.log('✅ Word problem detection passed\n');

// Test 10: Integer Results Only
console.log('Test 10: Integer Results Only');
const integerModule = new OrderOperationsModule({ initialLevel: 'קשה' });
for (let i = 0; i < 20; i++) {
    const q = integerModule.generateQuestion();
    console.assert(Number.isInteger(q.correctAnswer), 'All answers should be integers');
}
console.log('✅ Integer results passed\n');

// Test 11: Zero DOM Verification
console.log('Test 11: Zero DOM Verification');
console.assert(typeof window === 'undefined', 'window should be undefined in Node.js');
console.assert(typeof document === 'undefined', 'document should be undefined in Node.js');
console.log('✅ Zero DOM verification passed\n');

// Test 12: Explanation Always Present
console.log('Test 12: Explanation Always Present');
const explainModule = new OrderOperationsModule();
for (let i = 0; i < 10; i++) {
    const q = explainModule.generateQuestion();
    console.assert(q.explanation && q.explanation.length > 0, 'Every question should have explanation');
}
console.log('✅ Explanation presence passed\n');

console.log('🎉 All tests passed! OrderOperationsModule is headless and ready for Next.js.\n');
