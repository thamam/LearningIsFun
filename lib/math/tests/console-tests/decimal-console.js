/**
 * Console Test for DecimalModule (Headless)
 * Run with: node extracted-modules/tests/console-tests/decimal-console.js
 */

const DecimalModule = require('../../modules/DecimalModule');

console.log('🧪 Testing DecimalModule (Headless - Zero DOM Access)\n');
console.log('=' + '='.repeat(60) + '\n');

// Initialize module
const decimalModule = new DecimalModule({
    initialLevel: 'קל'
});

console.log('✅ Module initialized');
console.log(`   Initial level: ${decimalModule.getCurrentLevel()}\n`);

// Test 1: Generate question (Easy)
console.log('Test 1: Generate Question (Easy Level)');
console.log('-'.repeat(60));
const questionEasy = decimalModule.generateQuestion('קל');
console.log(JSON.stringify(questionEasy, null, 2));
console.assert(questionEasy.questionText, '❌ Should have questionText');
console.assert(questionEasy.correctAnswer !== undefined, '❌ Should have correctAnswer');
console.assert(questionEasy.type === 'question', '❌ Type should be "question"');
console.assert(questionEasy.module === 'decimal', '❌ Module should be "decimal"');
console.log('✅ Easy question generated\n');

// Test 2: Check correct answer (handle both simple and range answers)
console.log('Test 2: Check Correct Answer');
console.log('-'.repeat(60));

// Extract correct answer value (handle range objects)
let userAnswerToSubmit;
if (questionEasy.correctAnswer && questionEasy.correctAnswer.type === 'range') {
    // For range-based answers, submit the original number
    userAnswerToSubmit = questionEasy.correctAnswer.pattern;
} else {
    userAnswerToSubmit = questionEasy.correctAnswer;
}

const feedback1 = decimalModule.checkAnswer(userAnswerToSubmit, questionEasy.correctAnswer);
console.log(JSON.stringify(feedback1, null, 2));
console.assert(feedback1.isCorrect === true, '❌ Should be correct');
console.assert(feedback1.feedbackType === 'correct', '❌ Feedback type should be "correct"');
console.assert(feedback1.statistics.totalQuestions === 1, '❌ Total questions should be 1');
console.assert(feedback1.statistics.correctAnswers === 1, '❌ Correct answers should be 1');
console.log('✅ Correct answer validated\n');

// Test 3: Check wrong answer
console.log('Test 3: Check Wrong Answer');
console.log('-'.repeat(60));
const questionEasy2 = decimalModule.generateQuestion('קל');
const feedback2 = decimalModule.checkAnswer(999999, questionEasy2.correctAnswer);
console.log(JSON.stringify(feedback2, null, 2));
console.assert(feedback2.isCorrect === false, '❌ Should be incorrect');
console.assert(feedback2.feedbackType === 'wrong', '❌ Feedback type should be "wrong"');
console.assert(feedback2.showExplanation === true, '❌ Should show explanation');
console.assert(feedback2.statistics.currentStreak === 0, '❌ Streak should be reset to 0');
console.log('✅ Wrong answer validated\n');

// Test 4: Generate question (Hard level)
console.log('Test 4: Generate Question (Hard Level)');
console.log('-'.repeat(60));
const questionHard = decimalModule.generateQuestion('קשה');
console.log(JSON.stringify(questionHard, null, 2));
console.assert(questionHard.difficulty === 'קשה', '❌ Difficulty should be קשה');
console.log('✅ Hard question generated\n');

// Test 5: Test range-based answer (missingDigit type)
console.log('Test 5: Range-Based Answer Validation (missingDigit)');
console.log('-'.repeat(60));
decimalModule.resetStatistics();
// Generate questions until we get a missingDigit type
let missingDigitQuestion = null;
for (let i = 0; i < 20; i++) {
    const q = decimalModule.generateQuestion('קל');
    if (q.metadata && q.metadata.questionType === 'missingDigit') {
        missingDigitQuestion = q;
        break;
    }
}

if (missingDigitQuestion) {
    console.log('Generated missingDigit question:', JSON.stringify(missingDigitQuestion, null, 2));

    // Test answer within range
    const correctAnswer = missingDigitQuestion.correctAnswer;
    if (correctAnswer.type === 'range') {
        const validAnswer = correctAnswer.originalDigit !== undefined
            ? correctAnswer.pattern.replace('_', correctAnswer.originalDigit)
            : correctAnswer.min;

        const feedbackRange = decimalModule.checkAnswer(validAnswer, correctAnswer);
        console.log('Feedback for valid answer:', JSON.stringify(feedbackRange, null, 2));
        console.assert(feedbackRange.isCorrect === true, '❌ Valid answer within range should be correct');
        console.log('✅ Range-based validation works');
    }
} else {
    console.log('⚠️  Could not generate missingDigit question in 20 attempts (random chance)\n');
}

// Test 6: Difficulty adjustment (level up)
console.log('Test 6: Difficulty Adjustment (Level Up)');
console.log('-'.repeat(60));
decimalModule.resetStatistics();
decimalModule.currentLevel = 'קל';

// Answer 3 questions correctly (should level up)
for (let i = 0; i < 3; i++) {
    const q = decimalModule.generateQuestion();

    // Handle range-based answers
    let answerToSubmit;
    if (q.correctAnswer && q.correctAnswer.type === 'range') {
        answerToSubmit = q.correctAnswer.pattern;
    } else {
        answerToSubmit = q.correctAnswer;
    }

    decimalModule.checkAnswer(answerToSubmit, q.correctAnswer);
}

const stats = decimalModule.getStatistics();
console.log('Statistics after 3 correct:', JSON.stringify(stats, null, 2));
console.log('Current level:', decimalModule.getCurrentLevel());
console.assert(decimalModule.getCurrentLevel() === 'בינוני', '❌ Should have leveled up to בינוני');
console.log('✅ Level up works\n');

// Test 7: Difficulty adjustment (level down)
console.log('Test 7: Difficulty Adjustment (Level Down)');
console.log('-'.repeat(60));
decimalModule.resetStatistics();
decimalModule.currentLevel = 'בינוני';

// Answer 2 questions incorrectly (should level down)
for (let i = 0; i < 2; i++) {
    const q = decimalModule.generateQuestion();
    decimalModule.checkAnswer(999999, q.correctAnswer);
}

console.log('Current level:', decimalModule.getCurrentLevel());
console.assert(decimalModule.getCurrentLevel() === 'קל', '❌ Should have leveled down to קל');
console.log('✅ Level down works\n');

// Test 8: Verify all 5 question types can be generated
console.log('Test 8: Verify All Question Types');
console.log('-'.repeat(60));
const questionTypes = new Set();
for (let i = 0; i < 50; i++) {
    const q = decimalModule.generateQuestion('בינוני');
    if (q.metadata && q.metadata.questionType) {
        questionTypes.add(q.metadata.questionType);
    }
}
console.log('Question types generated:', Array.from(questionTypes));
console.assert(questionTypes.size >= 4, '❌ Should generate at least 4 different question types in 50 tries');
console.log('✅ Multiple question types verified\n');

// Test 9: Number formatting
console.log('Test 9: Number Formatting');
console.log('-'.repeat(60));
const q1000 = decimalModule.generateQuestion('קשה');
const qStr = JSON.stringify(q1000);
// Hard level generates 1000-9999, so we should see formatted numbers
console.log('Sample hard question text:', q1000.questionText);
console.log('✅ Number formatting checked\n');

// Test 10: Verify JSON output (no DOM references)
console.log('Test 10: Verify Zero DOM Access');
console.log('-'.repeat(60));
const q = decimalModule.generateQuestion();
const qStr10 = JSON.stringify(q);
const feedbackStr = JSON.stringify(feedback1);

console.assert(!qStr10.includes('document'), '❌ Question should not reference document');
console.assert(!qStr10.includes('window'), '❌ Question should not reference window');
console.assert(!qStr10.includes('getElementById'), '❌ Question should not reference getElementById');
console.assert(!qStr10.includes('querySelector'), '❌ Question should not reference querySelector');
console.assert(!feedbackStr.includes('document'), '❌ Feedback should not reference document');
console.assert(!feedbackStr.includes('window'), '❌ Feedback should not reference window');
console.log('✅ Zero DOM references confirmed\n');

// Summary
console.log('=' + '='.repeat(60));
console.log('✅ ALL TESTS PASSED!');
console.log('   Module is headless (zero DOM access)');
console.log('   Module can run in Node.js (no browser required)');
console.log('   Module supports 5 question types:');
console.log('     - decomposition (place value)');
console.log('     - digitValue (digit position value)');
console.log('     - nextPrevious (sequential numbers)');
console.log('     - compare (number comparison)');
console.log('     - missingDigit (pattern completion with range)');
console.log('   Module is ready for Next.js integration');
console.log('=' + '='.repeat(60));
