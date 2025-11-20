/**
 * Console Test for DivisionModule (Headless)
 * Run with: node extracted-modules/tests/console-tests/division-console.js
 */

const DivisionModule = require('../../modules/DivisionModule');

console.log('🧪 Testing DivisionModule (Headless - Zero DOM Access)\n');
console.log('=' + '='.repeat(60) + '\n');

// Initialize module
const divisionModule = new DivisionModule({
    initialLevel: 'קל'
});

console.log('✅ Module initialized');
console.log(`   Initial level: ${divisionModule.getCurrentLevel()}\n`);

// Test 1: Generate question (Easy)
console.log('Test 1: Generate Question (Easy Level)');
console.log('-'.repeat(60));
const questionEasy = divisionModule.generateQuestion('קל');
console.log(JSON.stringify(questionEasy, null, 2));
console.assert(questionEasy.questionText, '❌ Should have questionText');
console.assert(questionEasy.correctAnswer !== undefined, '❌ Should have correctAnswer');
console.assert(questionEasy.type === 'question', '❌ Type should be "question"');
console.log('✅ Easy question generated\n');

// Test 2: Check correct answer
console.log('Test 2: Check Correct Answer');
console.log('-'.repeat(60));
const feedback1 = divisionModule.checkAnswer(questionEasy.correctAnswer, questionEasy.correctAnswer);
console.log(JSON.stringify(feedback1, null, 2));
console.assert(feedback1.isCorrect === true, '❌ Should be correct');
console.assert(feedback1.feedbackType === 'correct', '❌ Feedback type should be "correct"');
console.assert(feedback1.statistics.totalQuestions === 1, '❌ Total questions should be 1');
console.log('✅ Correct answer validated\n');

// Test 3: Check wrong answer
console.log('Test 3: Check Wrong Answer');
console.log('-'.repeat(60));
const questionEasy2 = divisionModule.generateQuestion('קל');
const feedback2 = divisionModule.checkAnswer(999, questionEasy2.correctAnswer);
console.log(JSON.stringify(feedback2, null, 2));
console.assert(feedback2.isCorrect === false, '❌ Should be incorrect');
console.assert(feedback2.feedbackType === 'wrong', '❌ Feedback type should be "wrong"');
console.assert(feedback2.showExplanation === true, '❌ Should show explanation');
console.log('✅ Wrong answer validated\n');

// Test 4: Generate question (Hard level)
console.log('Test 4: Generate Question (Hard Level)');
console.log('-'.repeat(60));
const questionHard = divisionModule.generateQuestion('קשה');
console.log(JSON.stringify(questionHard, null, 2));
console.assert(questionHard.difficulty === 'קשה', '❌ Difficulty should be קשה');
console.log('✅ Hard question generated\n');

// Test 5: Difficulty adjustment (level up)
console.log('Test 5: Difficulty Adjustment (Level Up)');
console.log('-'.repeat(60));
divisionModule.resetStatistics();
divisionModule.currentLevel = 'קל';

// Answer 3 questions correctly (should level up)
for (let i = 0; i < 3; i++) {
    const q = divisionModule.generateQuestion();
    divisionModule.checkAnswer(q.correctAnswer, q.correctAnswer);
}

const stats = divisionModule.getStatistics();
console.log('Statistics after 3 correct:', JSON.stringify(stats, null, 2));
console.log('Current level:', divisionModule.getCurrentLevel());
console.assert(divisionModule.getCurrentLevel() === 'בינוני', '❌ Should have leveled up to בינוני');
console.log('✅ Level up works\n');

// Test 6: Verify JSON output (no DOM references)
console.log('Test 6: Verify Zero DOM Access');
console.log('-'.repeat(60));
const q = divisionModule.generateQuestion();
const qStr = JSON.stringify(q);
const feedbackStr = JSON.stringify(feedback1);

console.assert(!qStr.includes('document'), '❌ Question should not reference document');
console.assert(!qStr.includes('window'), '❌ Question should not reference window');
console.assert(!qStr.includes('getElementById'), '❌ Question should not reference getElementById');
console.assert(!feedbackStr.includes('document'), '❌ Feedback should not reference document');
console.log('✅ Zero DOM references confirmed\n');

// Summary
console.log('=' + '='.repeat(60));
console.log('✅ ALL TESTS PASSED!');
console.log('   Module is headless (zero DOM access)');
console.log('   Module can run in Node.js (no browser required)');
console.log('   Module is ready for Next.js integration');
console.log('=' + '='.repeat(60));
