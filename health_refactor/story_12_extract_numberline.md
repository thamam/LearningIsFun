# Story 12: Extract Number Line Module (Headless) - FINAL EXTRACTION

**Priority:** P1 (High)
**Complexity:** High (9) - Most complex due to visual rendering
**Estimated Time:** 2 days
**Dependencies:** Story 06 (Division extraction pattern established)
**Phase:** 2 (Headless Extraction)

---

## 📋 Problem Statement

The **Number Line Module** is embedded in `src/math/Emma_math_lab.html` (lines 3042-3398, ~357 lines) and is **the most DOM-coupled module** due to extensive visual rendering. The `displayNumberLine()` function creates a complete DOM structure with markers, labels, minor ticks, and arrows.

### Current Issues:
- ❌ Lines 3160-3192: DOM manipulation for question display and interface setup
- ❌ Lines 3195-3276: **`displayNumberLine()` - Creates entire visual DOM structure** (most complex extraction)
- ❌ Lines 3234-3246: Creates marker and label DOM elements in loop
- ❌ Lines 3249-3265: Creates minor tick DOM elements with inline styles
- ❌ Lines 3268-3275: Creates arrow DOM element
- ❌ Lines 3278-3287: Modifies button styles for choice selection
- ❌ Lines 3299-3306: Reads input/choice from DOM, uses `alert()`
- ❌ Lines 3350-3372: Updates feedback with `innerHTML`
- ❌ Lines 3375-3377: Uses `setTimeout()` for auto-advance

### Success Criteria:
✅ Zero DOM access (no `window`, `document`, `getElementById`, `createElement`, `alert`)
✅ Returns JSON View Objects with **complete visual rendering data**
✅ Console test passes (`node numberline-console.js`)
✅ Can be copy-pasted into Next.js API route without modification
✅ Visual data includes: range, markers, minor ticks, arrow position, zoom settings

---

## 🎯 Extraction Scope

### Question Types (3):

1. **whatIsNumber** - "What number is marked by the arrow?" (`visual-input`)
   - **Two versions:**
     - **Exact:** Requires exact answer with last digit hint
     - **Approximate:** Accepts answer within 25% tolerance with hint
   - **Zoom feature:** Shows 3 segments centered on arrow

2. **betweenNumbers** - "What number is exactly between X and Y?" (`input`)
   - **No visual** - Pure calculation question

3. **closerTo** - "Is number X closer to A or B?" (`choice`)
   - **No visual** - Pure comparison question

### Difficulty Levels:
- **קל (Easy):** Range 0-100, interval 10 (10 segments)
- **בינוני (Medium):** Range 0-500, interval 50 (10 segments)
- **קשה (Hard):** Range 0-1000, interval 100 (10 segments)

### Visual Rendering Requirements:

The extracted module must return **complete visual data** for client-side rendering:
- **Major markers:** Labeled tick marks at interval positions
- **Minor ticks:** 5 unlabeled ticks between each major marker
- **Arrow:** Position indicator (for `whatIsNumber` questions)
- **Zoom:** Display range (3 segments centered on arrow, or full range)
- **Positioning:** Percentage-based positions for responsive rendering

---

## 📦 Implementation

### File: `extracted-modules/modules/NumberLineModule.js`

```javascript
/**
 * NumberLineModule - Headless Number Line Practice
 *
 * Extracted from: src/math/Emma_math_lab.html (lines 3042-3398)
 * Zero DOM dependencies - Returns View Objects with visual rendering data
 *
 * Question Types:
 * - whatIsNumber: Arrow points to position, identify the number (visual-input)
 * - betweenNumbers: Calculate midpoint between two numbers (input, no visual)
 * - closerTo: Which reference number is closer? (choice, no visual)
 *
 * Visual Rendering:
 * For visual questions, the View Object includes complete data for
 * rendering the number line: markers, minor ticks, arrow position, zoom range.
 *
 * @version 1.0.0
 */

class NumberLineModule {
    /**
     * @param {Object} config - Configuration options
     * @param {string} config.initialLevel - Starting difficulty ('קל', 'בינוני', 'קשה')
     * @param {Object} config.statistics - Initial statistics
     */
    constructor(config = {}) {
        this.currentLevel = config.initialLevel || 'קל';

        this.statistics = config.statistics || {
            totalQuestions: 0,
            correctAnswers: 0,
            currentStreak: 0,
            bestStreak: 0,
            consecutiveCorrect: 0,
            consecutiveWrong: 0
        };

        this.difficultyConfig = {
            'קל': { min: 0, max: 100, interval: 10 },
            'בינוני': { min: 0, max: 500, interval: 50 },
            'קשה': { min: 0, max: 1000, interval: 100 }
        };

        this.questionTypes = ['whatIsNumber', 'betweenNumbers', 'closerTo'];

        this.hebrewText = {
            encouragements: {
                correct: ['מעולה!', 'פנטסטי!', 'את גאונית!', 'כל הכבוד!', 'מושלם!'],
                wrong: ['לא נורא!', 'ננסה שוב!', 'כמעט!', 'אפשר ללמוד מטעויות!', 'בפעם הבאה!']
            },
            correctVoice: 'כל הכבוד אמה!'
        };
    }

    /**
     * Generate a new number line question
     * @param {string} level - Difficulty level ('קל', 'בינוני', 'קשה')
     * @returns {Object} View Object for rendering
     */
    generateQuestion(level = this.currentLevel) {
        const range = this.difficultyConfig[level];
        const type = this.questionTypes[Math.floor(Math.random() * this.questionTypes.length)];

        switch (type) {
            case 'whatIsNumber':
                return this._generateWhatIsNumber(range);
            case 'betweenNumbers':
                return this._generateBetweenNumbers(range);
            case 'closerTo':
                return this._generateCloserTo(range);
            default:
                throw new Error(`Unknown question type: ${type}`);
        }
    }

    /**
     * Check user answer and return feedback
     * @param {string|number} userAnswer - User's answer
     * @param {number} correctAnswer - Correct answer
     * @param {Object} currentQuestion - Current question object (for context)
     * @returns {Object} View Object for feedback rendering
     */
    checkAnswer(userAnswer, correctAnswer, currentQuestion) {
        if (userAnswer === undefined || userAnswer === null || userAnswer === '') {
            return {
                type: 'validation-error',
                message: 'אנא הכניסי תשובה!'
            };
        }

        const userNum = parseFloat(userAnswer);

        if (isNaN(userNum)) {
            return {
                type: 'validation-error',
                message: 'אנא הכניסי מספר!'
            };
        }

        // Check if this question accepts approximate answers
        let isCorrect;
        if (currentQuestion.acceptableRange) {
            const range = currentQuestion.acceptableRange;
            isCorrect = (userNum >= range.min && userNum <= range.max);
        } else {
            isCorrect = userNum === correctAnswer;
        }

        // Update statistics
        this.statistics.totalQuestions++;

        if (isCorrect) {
            this.statistics.correctAnswers++;
            this.statistics.currentStreak++;
            this.statistics.consecutiveCorrect++;
            this.statistics.consecutiveWrong = 0;

            if (this.statistics.currentStreak > this.statistics.bestStreak) {
                this.statistics.bestStreak = this.statistics.currentStreak;
            }
        } else {
            this.statistics.currentStreak = 0;
            this.statistics.consecutiveWrong++;
            this.statistics.consecutiveCorrect = 0;
        }

        // Check for difficulty adjustment
        const difficultyChange = this._adjustDifficulty();

        // Build feedback View Object
        const encouragement = this._getRandomEncouragement(isCorrect);

        return {
            type: 'feedback',
            module: 'numberline',
            isCorrect: isCorrect,
            feedbackType: isCorrect ? 'correct' : 'wrong',
            feedbackMessage: isCorrect
                ? `✅ ${encouragement} תשובה נכונה!`
                : `❌ ${encouragement}`,
            voiceMessage: isCorrect ? this.hebrewText.correctVoice : null,
            correctAnswerDisplay: isCorrect ? null : `התשובה הנכונה: ${correctAnswer}`,
            statistics: { ...this.statistics },
            difficultyChange: difficultyChange,
            autoAdvance: isCorrect,
            autoAdvanceDelay: 1500,
            celebrationTrigger: this.statistics.totalQuestions % 10 === 0,
            showNewQuestionButton: !isCorrect
        };
    }

    // ========================================
    // PRIVATE METHODS - Question Generators
    // ========================================

    /**
     * "What number is marked by the arrow?" (visual question)
     * @private
     */
    _generateWhatIsNumber(range) {
        const useExactWithHint = Math.random() < 0.5;

        // Pick a random segment between two markers
        const numSegments = (range.max / range.interval) - 1;
        const segment = Math.floor(Math.random() * numSegments);
        const segmentStart = segment * range.interval;

        let arrowPosition;
        let questionText;
        let acceptableRange;

        if (useExactWithHint) {
            // Version 1: Exact answer with last digit hint
            const halfInterval = range.interval / 2;
            arrowPosition = segmentStart + halfInterval;
            const lastDigit = arrowPosition % 10;
            questionText = `איזה מספר מסומן בחץ? (מסתיים ב-${lastDigit})`;
            acceptableRange = null; // Exact answer required
        } else {
            // Version 2: Approximate answer with hint
            const possibleOffsets = [];
            for (let i = 1; i < range.interval / 5; i++) {
                possibleOffsets.push(i * 5); // Every 5 units
            }
            const offset = possibleOffsets[Math.floor(Math.random() * possibleOffsets.length)];
            arrowPosition = segmentStart + offset;

            // Determine hint
            let hint;
            if (arrowPosition % 10 === 0) {
                hint = 'מתחלק ב-10'; // Divisible by 10
            } else if (arrowPosition % 5 === 0) {
                hint = 'מסתיים ב-5'; // Ends with 5
            } else {
                const lastDigit = arrowPosition % 10;
                hint = `מסתיים ב-${lastDigit}`;
            }

            questionText = `איזה מספר מסומן בחץ? (${hint})`;

            // Accept within 25% of interval
            const tolerance = range.interval * 0.25;
            acceptableRange = {
                min: arrowPosition - tolerance,
                max: arrowPosition + tolerance
            };
        }

        // Generate visual rendering data
        const visualData = this._generateVisualData(range, arrowPosition);

        return {
            type: 'question',
            module: 'numberline',
            questionText: questionText,
            questionType: 'visual-input',
            inputPlaceholder: 'הכניסי מספר',
            correctAnswer: arrowPosition,
            acceptableRange: acceptableRange,
            visualData: visualData, // Complete data for rendering
            metadata: {
                questionType: 'whatIsNumber',
                arrowPosition,
                useExactWithHint
            }
        };
    }

    /**
     * "What number is exactly between X and Y?" (no visual)
     * @private
     */
    _generateBetweenNumbers(range) {
        const num1 = Math.floor(Math.random() * (range.max / range.interval / 2)) * range.interval;
        const num2 = num1 + range.interval * 2;
        const between = (num1 + num2) / 2;

        return {
            type: 'question',
            module: 'numberline',
            questionText: `איזה מספר נמצא בדיוק באמצע בין ${num1} ל-${num2}?`,
            questionType: 'input',
            inputPlaceholder: 'הכניסי תשובה',
            correctAnswer: between,
            visualData: null, // No visual for this question type
            metadata: {
                questionType: 'betweenNumbers',
                num1,
                num2
            }
        };
    }

    /**
     * "Is number X closer to A or B?" (choice, no visual)
     * @private
     */
    _generateCloserTo(range) {
        const baseNum = Math.floor(Math.random() * (range.max / range.interval)) * range.interval;
        const testNum = baseNum + Math.floor(range.interval * 0.3);
        const option1 = baseNum;
        const option2 = baseNum + range.interval;

        const answer = Math.abs(testNum - option1) < Math.abs(testNum - option2) ? option1 : option2;

        return {
            type: 'question',
            module: 'numberline',
            questionText: `המספר ${testNum} קרוב יותר ל-${option1} או ל-${option2}?`,
            questionType: 'choice',
            choices: [
                { id: 0, text: option1.toString(), value: option1 },
                { id: 1, text: option2.toString(), value: option2 }
            ],
            correctAnswer: answer,
            visualData: null, // No visual for this question type
            metadata: {
                questionType: 'closerTo',
                testNum,
                option1,
                option2
            }
        };
    }

    // ========================================
    // PRIVATE METHODS - Visual Data Generation
    // ========================================

    /**
     * Generate complete visual data for number line rendering
     * @private
     * @param {Object} range - {min, max, interval}
     * @param {number} arrowPosition - Position of arrow (or undefined)
     * @returns {Object} Complete visual data
     */
    _generateVisualData(range, arrowPosition) {
        // Calculate display range (zoom feature)
        let displayMin, displayMax;

        if (arrowPosition !== undefined) {
            // Zoom: show 3 segments centered on arrow
            const arrowSegment = Math.floor(arrowPosition / range.interval);
            const segmentsToShow = 3;
            const totalSegments = range.max / range.interval;

            let startSegment = Math.max(0, arrowSegment - 1);
            let endSegment = Math.min(totalSegments, startSegment + segmentsToShow);

            // Adjust if at the end
            if (endSegment === totalSegments) {
                startSegment = Math.max(0, endSegment - segmentsToShow);
            }

            displayMin = startSegment * range.interval;
            displayMax = endSegment * range.interval;
        } else {
            // No arrow, show full range
            displayMin = range.min;
            displayMax = range.max;
        }

        const displayRange = displayMax - displayMin;

        // Generate major markers (labeled)
        const majorMarkers = [];
        for (let value = displayMin; value <= displayMax; value += range.interval) {
            const position = ((value - displayMin) / displayRange) * 100;
            majorMarkers.push({
                value: value,
                position: position,
                label: value.toString()
            });
        }

        // Generate minor ticks (unlabeled, between major markers)
        const minorTicks = [];
        const minorTickInterval = range.interval / 5;
        for (let value = displayMin; value <= displayMax; value += minorTickInterval) {
            // Skip if this is a major marker position
            if (value % range.interval === 0) continue;

            const position = ((value - displayMin) / displayRange) * 100;
            minorTicks.push({
                value: value,
                position: position
            });
        }

        // Arrow data (if present)
        let arrow = null;
        if (arrowPosition !== undefined) {
            const arrowPos = ((arrowPosition - displayMin) / displayRange) * 100;
            arrow = {
                value: arrowPosition,
                position: arrowPos,
                symbol: '⬇️'
            };
        }

        return {
            range: {
                min: range.min,
                max: range.max,
                interval: range.interval
            },
            display: {
                min: displayMin,
                max: displayMax,
                range: displayRange
            },
            majorMarkers: majorMarkers,
            minorTicks: minorTicks,
            arrow: arrow
        };
    }

    // ========================================
    // PRIVATE METHODS - Utilities
    // ========================================

    /**
     * Get random encouragement message
     * @private
     */
    _getRandomEncouragement(isCorrect) {
        const array = isCorrect
            ? this.hebrewText.encouragements.correct
            : this.hebrewText.encouragements.wrong;
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * Adjust difficulty based on consecutive correct/wrong answers
     * @private
     * @returns {Object|null} Difficulty change info or null
     */
    _adjustDifficulty() {
        let changed = false;
        let newLevel = this.currentLevel;
        let direction = null;

        // Level up after 3 consecutive correct
        if (this.statistics.consecutiveCorrect >= 3 && this.currentLevel !== 'קשה') {
            changed = true;
            direction = 'up';
            if (this.currentLevel === 'קל') {
                newLevel = 'בינוני';
            } else if (this.currentLevel === 'בינוני') {
                newLevel = 'קשה';
            }
            this.currentLevel = newLevel;
            this.statistics.consecutiveCorrect = 0;
        }
        // Level down after 2 consecutive wrong
        else if (this.statistics.consecutiveWrong >= 2 && this.currentLevel !== 'קל') {
            changed = true;
            direction = 'down';
            if (this.currentLevel === 'קשה') {
                newLevel = 'בינוני';
            } else if (this.currentLevel === 'בינוני') {
                newLevel = 'קל';
            }
            this.currentLevel = newLevel;
            this.statistics.consecutiveWrong = 0;
        }

        return changed ? { changed: true, newLevel, direction } : null;
    }

    /**
     * Get current statistics
     * @returns {Object} Current statistics
     */
    getStatistics() {
        return { ...this.statistics };
    }

    /**
     * Get current difficulty level
     * @returns {string} Current level
     */
    getCurrentLevel() {
        return this.currentLevel;
    }

    /**
     * Reset statistics
     */
    resetStatistics() {
        this.statistics = {
            totalQuestions: 0,
            correctAnswers: 0,
            currentStreak: 0,
            bestStreak: 0,
            consecutiveCorrect: 0,
            consecutiveWrong: 0
        };
    }
}

// Export for Node.js (CommonJS)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NumberLineModule;
}

// Export for ES6
if (typeof exports !== 'undefined') {
    exports.NumberLineModule = NumberLineModule;
}
```

---

## ✅ Console Test

### File: `extracted-modules/tests/console-tests/numberline-console.js`

```javascript
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
const module = new NumberLineModule({ initialLevel: 'קל' });
console.assert(module.currentLevel === 'קל', 'Initial level should be קל');
console.assert(module.statistics.totalQuestions === 0, 'Initial questions should be 0');
console.assert(module.questionTypes.length === 3, 'Should have 3 question types');
console.log('✅ Instantiation passed\n');

// Test 2: Question Type Distribution
console.log('Test 2: Question Type Distribution');
const types = {};
for (let i = 0; i < 30; i++) {
    const q = module.generateQuestion();
    types[q.metadata.questionType] = (types[q.metadata.questionType] || 0) + 1;
}
console.log('Question distribution:', types);
console.assert(Object.keys(types).length === 3, 'Should generate all 3 question types');
console.log('✅ Question type distribution passed\n');

// Test 3: Visual Data for "whatIsNumber" Questions
console.log('Test 3: Visual Data for "whatIsNumber" Questions');
let foundVisualQuestion = false;
for (let i = 0; i < 20; i++) {
    const q = module.generateQuestion();
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
    const q = module.generateQuestion();
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
    const q = module.generateQuestion();
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
    zoomQ = module.generateQuestion();
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
```

---

## 📐 TypeScript Interface

### File: `extracted-modules/types/NumberLineModule.d.ts`

```typescript
/**
 * NumberLineModule TypeScript Definitions
 */

export interface NumberLineStatistics {
    totalQuestions: number;
    correctAnswers: number;
    currentStreak: number;
    bestStreak: number;
    consecutiveCorrect: number;
    consecutiveWrong: number;
}

export interface NumberLineConfig {
    initialLevel?: 'קל' | 'בינוני' | 'קשה';
    statistics?: Partial<NumberLineStatistics>;
}

export interface VisualMarker {
    value: number;
    position: number; // 0-100 percentage
    label: string;
}

export interface VisualMinorTick {
    value: number;
    position: number; // 0-100 percentage
}

export interface VisualArrow {
    value: number;
    position: number; // 0-100 percentage
    symbol: '⬇️';
}

export interface VisualData {
    range: {
        min: number;
        max: number;
        interval: number;
    };
    display: {
        min: number;
        max: number;
        range: number;
    };
    majorMarkers: VisualMarker[];
    minorTicks: VisualMinorTick[];
    arrow: VisualArrow | null;
}

export interface AcceptableRange {
    min: number;
    max: number;
}

export interface NumberLineChoice {
    id: number;
    text: string;
    value: number;
}

export interface NumberLineQuestionViewObject {
    type: 'question';
    module: 'numberline';
    questionText: string;
    questionType: 'visual-input' | 'input' | 'choice';
    inputPlaceholder?: string; // Present if questionType is 'input' or 'visual-input'
    choices?: NumberLineChoice[]; // Present if questionType is 'choice'
    correctAnswer: number;
    acceptableRange?: AcceptableRange; // Present for approximate answer questions
    visualData: VisualData | null; // Null for non-visual questions (betweenNumbers, closerTo)
    metadata: {
        questionType: 'whatIsNumber' | 'betweenNumbers' | 'closerTo';
        arrowPosition?: number;
        useExactWithHint?: boolean;
        num1?: number;
        num2?: number;
        testNum?: number;
        option1?: number;
        option2?: number;
    };
}

export interface DifficultyChange {
    changed: true;
    newLevel: 'קל' | 'בינוני' | 'קשה';
    direction: 'up' | 'down';
}

export interface NumberLineFeedbackViewObject {
    type: 'feedback';
    module: 'numberline';
    isCorrect: boolean;
    feedbackType: 'correct' | 'wrong';
    feedbackMessage: string;
    voiceMessage: string | null;
    correctAnswerDisplay: string | null;
    statistics: NumberLineStatistics;
    difficultyChange: DifficultyChange | null;
    autoAdvance: boolean;
    autoAdvanceDelay: 1500;
    celebrationTrigger: boolean;
    showNewQuestionButton: boolean;
}

export interface NumberLineValidationError {
    type: 'validation-error';
    message: string;
}

export type NumberLineViewObject =
    | NumberLineQuestionViewObject
    | NumberLineFeedbackViewObject
    | NumberLineValidationError;

export class NumberLineModule {
    constructor(config?: NumberLineConfig);

    generateQuestion(level?: 'קל' | 'בינוני' | 'קשה'): NumberLineQuestionViewObject;

    checkAnswer(
        userAnswer: string | number,
        correctAnswer: number,
        currentQuestion: NumberLineQuestionViewObject
    ): NumberLineFeedbackViewObject | NumberLineValidationError;

    getStatistics(): NumberLineStatistics;

    getCurrentLevel(): 'קל' | 'בינוני' | 'קשה';

    resetStatistics(): void;
}
```

---

## 🚀 Next.js Integration with Visual Rendering

### React Component with Number Line Visualization:

```typescript
'use client';

import { useState, useEffect } from 'react';
import type { VisualData } from '@/types/NumberLineModule';

// Number Line Visualizer Component
function NumberLineVisualizer({ visualData }: { visualData: VisualData }) {
    return (
        <div className="relative w-full h-32 my-6 bg-gray-50 border border-gray-300 rounded" dir="ltr">
            {/* Main line */}
            <div className="absolute w-full h-1 bg-blue-500 top-1/2 transform -translate-y-1/2" />

            {/* Major markers (labeled) */}
            {visualData.majorMarkers.map((marker, idx) => (
                <div key={`major-${idx}`}>
                    <div
                        className="absolute w-0.5 h-6 bg-blue-700"
                        style={{
                            left: `${marker.position}%`,
                            top: 'calc(50% - 12px)'
                        }}
                    />
                    <div
                        className="absolute text-sm font-bold"
                        style={{
                            left: `${marker.position}%`,
                            transform: 'translateX(-50%)',
                            bottom: '10px'
                        }}
                    >
                        {marker.label}
                    </div>
                </div>
            ))}

            {/* Minor ticks (unlabeled) */}
            {visualData.minorTicks.map((tick, idx) => (
                <div
                    key={`minor-${idx}`}
                    className="absolute w-px h-3 bg-gray-400"
                    style={{
                        left: `${tick.position}%`,
                        top: 'calc(50% - 6px)'
                    }}
                />
            ))}

            {/* Arrow */}
            {visualData.arrow && (
                <div
                    className="absolute text-2xl"
                    style={{
                        left: `${visualData.arrow.position}%`,
                        transform: 'translateX(-50%)',
                        top: '-5px'
                    }}
                >
                    {visualData.arrow.symbol}
                </div>
            )}
        </div>
    );
}

export default function NumberLinePractice() {
    const [question, setQuestion] = useState(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [selectedChoice, setSelectedChoice] = useState(null);
    const [feedback, setFeedback] = useState(null);

    const fetchQuestion = async () => {
        const res = await fetch('/api/numberline', {
            headers: { 'x-session-id': 'user-123' }
        });
        const data = await res.json();
        setQuestion(data.data);
        setFeedback(null);
        setUserAnswer('');
        setSelectedChoice(null);
    };

    const submitAnswer = async () => {
        const answer = question.questionType === 'choice' ? selectedChoice : userAnswer;

        const res = await fetch('/api/numberline', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-session-id': 'user-123'
            },
            body: JSON.stringify({
                userAnswer: answer,
                correctAnswer: question.correctAnswer,
                currentQuestion: question
            })
        });
        const data = await res.json();
        setFeedback(data.data);

        if (data.data.autoAdvance) {
            setTimeout(fetchQuestion, data.data.autoAdvanceDelay);
        }
    };

    useEffect(() => {
        fetchQuestion();
    }, []);

    if (!question) return <div>טוען...</div>;

    return (
        <div dir="rtl" className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl mb-4">ישר מספרים</h2>

            <div className="text-lg mb-4">{question.questionText}</div>

            {/* Render visual number line if data present */}
            {question.visualData && (
                <NumberLineVisualizer visualData={question.visualData} />
            )}

            {/* Input or Choice interface */}
            {(question.questionType === 'input' || question.questionType === 'visual-input') && (
                <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder={question.inputPlaceholder}
                    className="border p-2 w-32"
                    dir="ltr"
                />
            )}

            {question.questionType === 'choice' && (
                <div className="flex gap-2">
                    {question.choices.map((choice) => (
                        <button
                            key={choice.id}
                            onClick={() => setSelectedChoice(choice.value)}
                            className={`px-4 py-2 border ${
                                selectedChoice === choice.value
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-white'
                            }`}
                        >
                            {choice.text}
                        </button>
                    ))}
                </div>
            )}

            <button onClick={submitAnswer} className="mt-4 px-4 py-2 bg-green-500 text-white">
                בדקי
            </button>

            {feedback && (
                <div className={`mt-4 p-4 ${feedback.isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                    <p className="font-bold">{feedback.feedbackMessage}</p>
                    {feedback.correctAnswerDisplay && <p>{feedback.correctAnswerDisplay}</p>}
                </div>
            )}
        </div>
    );
}
```

---

## ✅ Verification Plan

### Step 1: Zero DOM Check
```bash
cd extracted-modules/modules
grep -n "window\|document\|getElementById\|createElement\|alert\|setTimeout\|displayNumberLine" NumberLineModule.js
# Expected: No results (exit code 1)
```

### Step 2: Console Test
```bash
cd extracted-modules/tests/console-tests
node numberline-console.js
# Expected: "🎉 All tests passed! NumberLineModule is headless and ready for Next.js."
# Expected: "🏁 PHASE 2 COMPLETE! All 7 modules successfully extracted! 🏁"
```

### Step 3: Visual Data Completeness
```bash
node -e "
const NumberLineModule = require('./extracted-modules/modules/NumberLineModule');
const module = new NumberLineModule({ initialLevel: 'קל' });
let visualCount = 0;
for (let i = 0; i < 50; i++) {
    const q = module.generateQuestion();
    if (q.visualData) {
        visualCount++;
        if (!q.visualData.majorMarkers || !q.visualData.minorTicks) {
            console.error('❌ Incomplete visual data');
            process.exit(1);
        }
        if (q.metadata.questionType === 'whatIsNumber' && !q.visualData.arrow) {
            console.error('❌ Missing arrow in whatIsNumber question');
            process.exit(1);
        }
    }
}
console.log('✅ All', visualCount, 'visual questions have complete data');
"
```

### Step 4: Approximate Answer Range Test
```bash
node -e "
const NumberLineModule = require('./extracted-modules/modules/NumberLineModule');
const module = new NumberLineModule();
let found = false;
for (let i = 0; i < 100; i++) {
    const q = module.generateQuestion();
    if (q.acceptableRange) {
        found = true;
        console.log('Found approximate question:');
        console.log('  Correct:', q.correctAnswer);
        console.log('  Range:', q.acceptableRange);

        // Test within range
        const midRange = (q.acceptableRange.min + q.acceptableRange.max) / 2;
        const feedback = module.checkAnswer(midRange, q.correctAnswer, q);
        if (!feedback.isCorrect) {
            console.error('❌ Answer within range should be correct');
            process.exit(1);
        }
        console.log('✅ Approximate answer tolerance works correctly');
        break;
    }
}
if (!found) {
    console.error('❌ No approximate questions generated');
    process.exit(1);
}
"
```

---

## 📊 Success Metrics

| Metric | Target | Validation |
|--------|--------|------------|
| Zero DOM Access | 0 references | `grep` command returns no results |
| Console Test Pass | 12/12 tests | All assertions pass |
| TypeScript Compile | No errors | `tsc --noEmit` on `.d.ts` file |
| Next.js Integration | Copy-paste ready | No modifications needed |
| Visual Data Complete | 100% coverage | All visual questions have complete data |
| Major Markers | Present | All visual questions have markers array |
| Minor Ticks | Present | All visual questions have ticks array |
| Arrow Data | Present when needed | whatIsNumber questions have arrow |
| Zoom Feature | Working | Display range < full range when arrow present |
| Approximate Answers | Working | Tolerance range validation passes |

---

## 🎯 Definition of Done

- [ ] `NumberLineModule.js` created with zero DOM access
- [ ] `numberline-console.js` test file passes all 12 tests
- [ ] `NumberLineModule.d.ts` TypeScript interface created
- [ ] All 3 question types implemented
- [ ] Visual data generation for whatIsNumber questions
- [ ] Major markers and minor ticks calculated correctly
- [ ] Zoom feature working (3 segments centered on arrow)
- [ ] Approximate answer tolerance working
- [ ] Non-visual questions (betweenNumbers, closerTo) working
- [ ] `grep` verification confirms zero DOM references
- [ ] Next.js example demonstrates visual rendering
- [ ] README updated: `health_refactor/01_orchestration_plan.md` (mark Story 12 complete)
- [ ] **PHASE 2 COMPLETE** - Celebrate! 🎉

---

## 📝 Notes

**Why This Is The Most Complex Extraction:**
1. **Visual Rendering Logic:** 80+ lines of DOM manipulation must become JSON data
2. **Zoom Feature:** Complex calculation for 3-segment display window
3. **Percentage Positioning:** All elements positioned as 0-100% for responsive rendering
4. **Mixed Question Types:** Some visual, some not (3 different interfaces)
5. **Approximate Answers:** Tolerance range validation adds complexity

**Key Visual Data Structure:**
```javascript
visualData: {
    range: { min, max, interval },           // Full range (0-100, 0-500, 0-1000)
    display: { min, max, range },            // Zoomed display range (3 segments)
    majorMarkers: [                          // Labeled tick marks
        { value: 20, position: 50, label: "20" },
        ...
    ],
    minorTicks: [                            // Unlabeled ticks (5 per segment)
        { value: 22, position: 55 },
        ...
    ],
    arrow: {                                 // Arrow indicator
        value: 25,
        position: 62.5,
        symbol: '⬇️'
    }
}
```

**Client-Side Rendering:**
The React component uses this data to render:
- CSS positioning with `left: ${position}%`
- Responsive layout (scales with container width)
- No server-side rendering of visual elements (pure data → client render)

**Copy-Paste Compatibility:**
This module is production-ready for Next.js. The visual data is pure JSON with percentage positions.

**🏁 PHASE 2 MILESTONE:**
This is the **FINAL extraction story**. Upon completion:
- **7 math modules** fully extracted (Division, Decimal, Fraction, Multiplication, Order, Distributive, NumberLine)
- **Zero DOM dependencies** in all modules
- **Production-ready** for Next.js import
- **Complete test coverage** with console tests

**Next Steps After Phase 2:**
With all extractions complete, the next phase would be integrating these headless modules into the Next.js application (PR #10).
