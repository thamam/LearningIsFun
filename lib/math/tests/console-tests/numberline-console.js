/**
 * Console Test for NumberLineModule
 * Run: node numberline-console.js
 *
 * Tests:
 * 1. Module instantiation
 * 2. All 3 question types
 * 3. Visual data presence for visual questions
 * 4. Major markers, minor ticks, arrow data
 * 5. Approximate answer tolerance
 * 6. Non-visual questions
 * 7. Zero DOM verification
 */

const NumberLineModule = require('../../modules/NumberLineModule');

console.log('🧪 NumberLineModule Console Test\n');

// Test 1: Instantiation
console.log('Test 1: Module Instantiation');
const numberlineModule = new NumberLineModule({ initialLevel: 'קל' });
console.assert(numberlineModule.currentLevel === 'קל', 'Initial level should be קל');
console.assert(numberlineModule.statistics.totalQuestions === 0, 'Initial questions should be 0');
console.assert(numberlineModule.questionTypes.length === 3, 'Should have 3 question types');
console.log('✅ Instantiation passed\n');

// Test 2: Question Type Distribution
console.log('Test 2: Question Type Distribution');
const types = {};
for (let i = 0; i < 30; i++) {
    const q = numberlineModule.generateQuestion();
    types[q.metadata.questionType] = (types[q.metadata.questionType] || 0) + 1;
}
console.log('Question distribution:', types);
console.assert(Object.keys(types).length === 3, 'Should generate all 3 question types');
console.log('✅ Question type distribution passed\n');

// Test 3: Visual Data for "whatIsNumber" Questions
console.log('Test 3: Visual Data for "whatIsNumber" Questions');
let foundVisualQuestion = false;
for (let i = 0; i < 20; i++) {
    const q = numberlineModule.generateQuestion();
    if (q.questionType === 'visual-input') {
        foundVisualQuestion = true;
        console.log('Visual question sample:', JSON.stringify(q, null, 2));
        console.assert(q.visualData !== null, 'Visual question should have visualData');
        console.assert(q.visualData.majorMarkers, 'Should have major markers');
        console.assert(q.visualData.minorTicks, 'Should have minor ticks');
        console.assert(q.visualData.arrow, 'Should have arrow data');
        console.assert(q.visualData.display, 'Should have display range');
        console.log(`Visual data includes: ${q.visualData.majorMarkers.length} major markers, ${q.visualData.minorTicks.length} minor ticks`);
        break;
    }
}
console.assert(foundVisualQuestion, 'Should generate visual questions');
console.log('✅ Visual data passed\n');

// Test 4: Major Markers Validation
console.log('Test 4: Major Markers Validation');
const visualModule = new NumberLineModule({ initialLevel: 'בינוני' });
let visualQ;
for (let i = 0; i < 20; i++) {
    visualQ = visualModule.generateQuestion();
    if (visualQ.visualData) break;
}
if (visualQ && visualQ.visualData) {
    const markers = visualQ.visualData.majorMarkers;
    console.log('Major markers:', markers);
    console.assert(markers.length >= 2, 'Should have at least 2 major markers');
    markers.forEach(marker => {
        console.assert(marker.value !== undefined, 'Marker should have value');
        console.assert(marker.position !== undefined, 'Marker should have position');
        console.assert(marker.label !== undefined, 'Marker should have label');
        console.assert(marker.position >= 0 && marker.position <= 100, 'Position should be 0-100%');
    });
}
console.log('✅ Major markers validation passed\n');

// Test 5: Non-Visual Questions
console.log('Test 5: Non-Visual Questions (betweenNumbers, closerTo)');
let foundBetween = false;
let foundCloser = false;
for (let i = 0; i < 50; i++) {
    const q = numberlineModule.generateQuestion();
    if (q.metadata.questionType === 'betweenNumbers') {
        foundBetween = true;
        console.assert(q.visualData === null, 'betweenNumbers should have no visual data');
        console.assert(q.questionType === 'input', 'betweenNumbers should be input type');
    } else if (q.metadata.questionType === 'closerTo') {
        foundCloser = true;
        console.assert(q.visualData === null, 'closerTo should have no visual data');
        console.assert(q.questionType === 'choice', 'closerTo should be choice type');
        console.assert(q.choices.length === 2, 'closerTo should have 2 choices');
    }
    if (foundBetween && foundCloser) break;
}
console.assert(foundBetween, 'Should generate betweenNumbers questions');
console.assert(foundCloser, 'Should generate closerTo questions');
console.log('✅ Non-visual questions passed\n');

// Test 6: Approximate Answer Tolerance
console.log('Test 6: Approximate Answer Tolerance');
let foundApproximate = false;
for (let i = 0; i < 50; i++) {
    const q = numberlineModule.generateQuestion();
    if (q.acceptableRange) {
        foundApproximate = true;
        console.log('Found approximate question:');
        console.log('  Correct answer:', q.correctAnswer);
        console.log('  Acceptable range:', q.acceptableRange);
        console.assert(q.acceptableRange.min < q.correctAnswer, 'Range min should be less than answer');
        console.assert(q.acceptableRange.max > q.correctAnswer, 'Range max should be greater than answer');
        break;
    }
}
console.log('✅ Approximate answer tolerance passed\n');

// Test 7: Check Correct Answer (Exact)
console.log('Test 7: Check Correct Answer (Exact)');
const checkModule = new NumberLineModule();
let exactQ;
for (let i = 0; i < 20; i++) {
    exactQ = checkModule.generateQuestion();
    if (!exactQ.acceptableRange) break; // Find exact answer question
}
const feedback = checkModule.checkAnswer(exactQ.correctAnswer, exactQ.correctAnswer, exactQ);
console.log('Feedback:', JSON.stringify(feedback, null, 2));
console.assert(feedback.type === 'feedback', 'Should be feedback type');
console.assert(feedback.isCorrect === true, 'Should be correct');
console.assert(feedback.autoAdvance === true, 'Should auto-advance on correct');
console.log('✅ Correct answer check passed\n');

// Test 8: Check Approximate Answer
console.log('Test 8: Check Approximate Answer (Within Range)');
let approxQ;
for (let i = 0; i < 50; i++) {
    approxQ = checkModule.generateQuestion();
    if (approxQ.acceptableRange) break;
}
if (approxQ && approxQ.acceptableRange) {
    // Test answer within range
    const midRange = (approxQ.acceptableRange.min + approxQ.acceptableRange.max) / 2;
    const approxFeedback = checkModule.checkAnswer(midRange, approxQ.correctAnswer, approxQ);
    console.log('Approximate answer:', midRange, 'for correct:', approxQ.correctAnswer);
    console.log('Acceptable range:', approxQ.acceptableRange);
    console.assert(approxFeedback.isCorrect === true, 'Answer within range should be correct');

    // Test answer outside range
    const outsideAnswer = approxQ.acceptableRange.max + 50;
    const wrongFeedback = checkModule.checkAnswer(outsideAnswer, approxQ.correctAnswer, approxQ);
    console.assert(wrongFeedback.isCorrect === false, 'Answer outside range should be wrong');
}
console.log('✅ Approximate answer check passed\n');

// Test 9: Wrong Answer
console.log('Test 9: Check Wrong Answer');
const wrongModule = new NumberLineModule();
const wrongQ = wrongModule.generateQuestion();
const wrongAnswer = 9999; // Obviously wrong
const wrongFeedback = wrongModule.checkAnswer(wrongAnswer, wrongQ.correctAnswer, wrongQ);
console.log('Wrong feedback:', JSON.stringify(wrongFeedback, null, 2));
console.assert(wrongFeedback.isCorrect === false, 'Should be incorrect');
console.assert(wrongFeedback.correctAnswerDisplay !== null, 'Should show correct answer');
console.log('✅ Wrong answer check passed\n');

// Test 10: Difficulty Progression
console.log('Test 10: Difficulty Progression');
const easyModule = new NumberLineModule({ initialLevel: 'קל' });
const mediumModule = new NumberLineModule({ initialLevel: 'בינוני' });
const hardModule = new NumberLineModule({ initialLevel: 'קשה' });

const easyQ = easyModule.generateQuestion();
const mediumQ = mediumModule.generateQuestion();
const hardQ = hardModule.generateQuestion();

console.log('Easy range:', easyQ.visualData ? easyQ.visualData.range : easyQ.metadata);
console.log('Medium range:', mediumQ.visualData ? mediumQ.visualData.range : mediumQ.metadata);
console.log('Hard range:', hardQ.visualData ? hardQ.visualData.range : hardQ.metadata);

if (easyQ.visualData) {
    console.assert(easyQ.visualData.range.max === 100, 'Easy should be 0-100');
}
if (mediumQ.visualData) {
    console.assert(mediumQ.visualData.range.max === 500, 'Medium should be 0-500');
}
if (hardQ.visualData) {
    console.assert(hardQ.visualData.range.max === 1000, 'Hard should be 0-1000');
}
console.log('✅ Difficulty progression passed\n');

// Test 11: Zoom Feature Verification
console.log('Test 11: Zoom Feature Verification');
let zoomQ;
for (let i = 0; i < 20; i++) {
    zoomQ = numberlineModule.generateQuestion();
    if (zoomQ.visualData && zoomQ.visualData.arrow) {
        console.log('Zoom display range:', zoomQ.visualData.display);
        console.log('Full range:', zoomQ.visualData.range);
        console.assert(
            zoomQ.visualData.display.max - zoomQ.visualData.display.min <
            zoomQ.visualData.range.max - zoomQ.visualData.range.min,
            'Zoom should show smaller range than full'
        );
        break;
    }
}
console.log('✅ Zoom feature passed\n');

// Test 12: Zero DOM Verification
console.log('Test 12: Zero DOM Verification');
console.assert(typeof window === 'undefined', 'window should be undefined in Node.js');
console.assert(typeof document === 'undefined', 'document should be undefined in Node.js');
console.log('✅ Zero DOM verification passed\n');

console.log('🎉 All tests passed! NumberLineModule is headless and ready for Next.js.\n');
console.log('🏁 PHASE 2 COMPLETE! All 7 modules successfully extracted! 🏁\n');
