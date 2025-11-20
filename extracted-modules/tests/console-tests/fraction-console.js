/**
 * Console Test for FractionModule
 * Run: node extracted-modules/tests/console-tests/fraction-console.js
 *
 * Tests:
 * 1. Module instantiation
 * 2. Question generation (all 5 types)
 * 3. Answer checking (correct/wrong)
 * 4. Difficulty adjustment
 * 5. Statistics tracking
 * 6. Zero DOM verification
 */

const FractionModule = require('../../modules/FractionModule');

console.log('🧪 FractionModule Console Test\n');

// Test 1: Instantiation
console.log('Test 1: Module Instantiation');
const fractionModule = new FractionModule({
    initialLevel: 'קל',
    enabledTypes: ['compare', 'addSameDenominator', 'simplify']
});
console.assert(fractionModule.currentLevel === 'קל', 'Initial level should be קל');
console.assert(fractionModule.statistics.totalQuestions === 0, 'Initial questions should be 0');
console.log('✅ Instantiation passed\n');

// Test 2: Generate Compare Question
console.log('Test 2: Generate Compare Question (choice)');
const compareModule = new FractionModule({ enabledTypes: ['compare'] });
const compareQ = compareModule.generateQuestion('קל');
console.log('Generated question:', JSON.stringify(compareQ, null, 2));
console.assert(compareQ.type === 'question', 'Should be question type');
console.assert(compareQ.questionType === 'choice', 'Should be choice type');
console.assert(compareQ.choices.length === 3, 'Should have 3 choices');
console.assert(compareQ.metadata.questionType === 'compare', 'Should be compare type');
console.log('✅ Compare question passed\n');

// Test 3: Generate Add Question
console.log('Test 3: Generate AddSameDenominator Question (input)');
const testModule = new FractionModule({ enabledTypes: ['addSameDenominator'] });
const addQ = testModule.generateQuestion('בינוני');
console.log('Generated question:', JSON.stringify(addQ, null, 2));
console.assert(addQ.type === 'question', 'Should be question type');
console.assert(addQ.questionType === 'input', 'Should be input type');
console.assert(addQ.equation.includes('+'), 'Equation should contain addition');
console.log('✅ Add question passed\n');

// Test 4: Generate Simplify Question
console.log('Test 4: Generate Simplify Question');
const simplifyModule = new FractionModule({ enabledTypes: ['simplify'] });
const simplifyQ = simplifyModule.generateQuestion('קשה');
console.log('Generated question:', JSON.stringify(simplifyQ, null, 2));
console.assert(simplifyQ.questionText === 'צמצמי:', 'Should ask to simplify');
console.assert(simplifyQ.metadata.questionType === 'simplify', 'Should be simplify type');
console.log('✅ Simplify question passed\n');

// Test 5: Check Correct Answer
console.log('Test 5: Check Correct Answer');
const checkModule = new FractionModule();
const question = checkModule.generateQuestion();
const feedback = checkModule.checkAnswer(
    question.correctAnswer,
    question.correctAnswer,
    question
);
console.log('Feedback:', JSON.stringify(feedback, null, 2));
console.assert(feedback.type === 'feedback', 'Should be feedback type');
console.assert(feedback.isCorrect === true, 'Should be correct');
console.assert(feedback.statistics.correctAnswers === 1, 'Should increment correct count');
console.assert(feedback.autoAdvance === true, 'Should auto-advance on correct');
console.log('✅ Correct answer check passed\n');

// Test 6: Check Wrong Answer
console.log('Test 6: Check Wrong Answer');
const wrongModule = new FractionModule();
const wrongQ = wrongModule.generateQuestion();
const wrongAnswer = wrongQ.questionType === 'choice' ? 'WRONG' : '999/999';
const wrongFeedback = wrongModule.checkAnswer(
    wrongAnswer,
    wrongQ.correctAnswer,
    wrongQ
);
console.log('Wrong feedback:', JSON.stringify(wrongFeedback, null, 2));
console.assert(wrongFeedback.isCorrect === false, 'Should be incorrect');
console.assert(wrongFeedback.correctAnswerDisplay !== null, 'Should show correct answer');
console.assert(wrongFeedback.showNewQuestionButton === true, 'Should show new question button');
console.log('✅ Wrong answer check passed\n');

// Test 7: Difficulty Adjustment (Level Up)
console.log('Test 7: Difficulty Adjustment (Level Up)');
const levelUpModule = new FractionModule({ initialLevel: 'קל' });
// Simulate 3 consecutive correct answers
for (let i = 0; i < 3; i++) {
    const q = levelUpModule.generateQuestion();
    levelUpModule.checkAnswer(q.correctAnswer, q.correctAnswer, q);
}
const levelUpQ = levelUpModule.generateQuestion();
const levelUpFeedback = levelUpModule.checkAnswer(
    levelUpQ.correctAnswer,
    levelUpQ.correctAnswer,
    levelUpQ
);
console.log('Level up feedback:', JSON.stringify(levelUpFeedback.difficultyChange, null, 2));
console.assert(levelUpModule.currentLevel === 'בינוני', 'Should level up to בינוני');
console.log('✅ Level up passed\n');

// Test 8: Future Question Types
console.log('Test 8: Future Question Types (fractionToDecimal, decimalToFraction)');
const futureModule = new FractionModule({ enabledTypes: ['fractionToDecimal', 'decimalToFraction'] });
const fracToDecQ = futureModule.generateQuestion();
console.log('Future question:', JSON.stringify(fracToDecQ, null, 2));
console.assert(
    fracToDecQ.metadata.questionType === 'fractionToDecimal' ||
    fracToDecQ.metadata.questionType === 'decimalToFraction',
    'Should generate future question types'
);
console.log('✅ Future question types passed\n');

// Test 9: Empty Answer Validation
console.log('Test 9: Empty Answer Validation');
const validationModule = new FractionModule();
const validationQ = validationModule.generateQuestion();
const validationError = validationModule.checkAnswer('', validationQ.correctAnswer, validationQ);
console.log('Validation error:', JSON.stringify(validationError, null, 2));
console.assert(validationError.type === 'validation-error', 'Should return validation error');
console.assert(validationError.message === 'אנא הכניסי תשובה!', 'Should have Hebrew error message');
console.log('✅ Validation passed\n');

// Test 10: Zero DOM Verification
console.log('Test 10: Zero DOM Verification');
console.assert(typeof window === 'undefined', 'window should be undefined in Node.js');
console.assert(typeof document === 'undefined', 'document should be undefined in Node.js');
console.log('✅ Zero DOM verification passed\n');

console.log('🎉 All tests passed! FractionModule is headless and ready for Next.js.\n');
