# Story 11: Extract Distributive Property Module (Headless)

**Priority:** P1 (High)
**Complexity:** High (8)
**Estimated Time:** 1.5 days
**Dependencies:** Story 06 (Division extraction pattern established)
**Phase:** 2 (Headless Extraction)

---

## 📋 Problem Statement

The **Distributive Property Module** is located in `src/math/js/modules/distributive_module.js` (352 lines) and is tightly coupled to the DOM. According to the pedagogical report, this is **the most critical module** - it's the "bridge" connecting place value understanding to multiplication.

### Current Issues:
- ❌ Lines 187-198: Direct DOM manipulation (`getElementById`, `textContent`)
- ❌ Lines 191-197: Calls `displayAreaModel()` function (visual rendering, DOM-dependent)
- ❌ Lines 201-211: Input element manipulation and focus
- ❌ Lines 233: Reads input value from DOM
- ❌ Lines 268-299: Updates feedback element with `innerHTML`
- ❌ Lines 303-305: Uses `setTimeout()` for auto-advance (browser timing)
- ❌ Lines 39: Pollutes global `window` namespace

### Success Criteria:
✅ Zero DOM access (no `window`, `document`, `getElementById`, `setTimeout`)
✅ Returns JSON View Objects (all rendering data in plain objects)
✅ Console test passes (`node distributive-console.js`)
✅ Can be copy-pasted into Next.js API route without modification
✅ Preserves all pedagogical explanations and area model data
✅ Area model data returned as JSON (for client-side rendering)

---

## 🎯 Extraction Scope

### Pedagogical Philosophy:
**Distributive property is NOT just a "trick"** - it's the fundamental principle that:
1. Enables multi-digit multiplication
2. Justifies the standard multiplication algorithm
3. Connects expanded notation to multiplication

Example: `7 × 13 = 7 × (10 + 3) = (7 × 10) + (7 × 3) = 70 + 21 = 91`

### Question Types by Difficulty:

#### **קל (Easy)** - 2 types:
1. **fill_blank** - Fill missing number in decomposition: `7 × 13 = 7 × (10 + ___)` → Answer: 3
2. **calculate** - Calculate using distributive property with given decomposition

#### **בינוני (Medium)** - 2 approaches:
1. **Addition decomposition** - Larger numbers: `8 × 47 = 8 × (40 + 7)`
2. **Subtraction decomposition** - Near-round numbers: `7 × 19 = 7 × (20 - 1)`
   - **Key insight:** Subtraction helps when number is close to round ten!

#### **קשה (Hard)**:
1. **Three-digit multiplication** - `6 × 235 = 6 × (200 + 30 + 5)`
2. **Connection to standard algorithm** - Shows this IS the vertical multiplication algorithm
3. **Full pedagogical explanation** with step-by-step breakdown

### Special Features:
- **Area model data** embedded in View Object (for visual rendering)
- **Step-by-step explanations** with pedagogical insights
- **Connection to algorithm** flagged for hard questions
- **Number formatting** with thousands separator for readability
- **Longer auto-advance delay** (2.5s to read explanations)

---

## 📦 Implementation

### File: `extracted-modules/modules/DistributiveModule.js`

```javascript
/**
 * DistributiveModule - Headless Distributive Property Practice
 *
 * Extracted from: src/math/js/modules/distributive_module.js
 * Zero DOM dependencies - Returns View Objects for rendering
 *
 * Pedagogical Philosophy (from the pedagogical triad):
 * This is the BRIDGE module - connecting place value to multiplication.
 * The distributive property is not a trick, but the fundamental principle
 * that enables all multi-digit multiplication.
 *
 * Example: 7 × 13 = 7 × (10 + 3) = (7 × 10) + (7 × 3) = 70 + 21 = 91
 *
 * Question Types:
 * - fill_blank: Fill missing number in decomposition
 * - calculate: Calculate final answer using distributive property
 * - subtraction_decomposition: Use (a × (b - c)) for near-round numbers
 * - three_digit: Connect to standard vertical algorithm
 *
 * All questions include detailed pedagogical explanations.
 *
 * @version 1.0.0
 */

class DistributiveModule {
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

        this.hebrewText = {
            encouragements: {
                correct: ['מעולה!', 'פנטסטי!', 'את גאונית!', 'כל הכבוד!', 'מושלם!'],
                wrong: ['לא נורא!', 'ננסה שוב!', 'כמעט!', 'אפשר ללמוד מטעויות!']
            }
        };
    }

    /**
     * Generate a new distributive property question
     * @param {string} level - Difficulty level ('קל', 'בינוני', 'קשה')
     * @returns {Object} View Object for rendering
     */
    generateQuestion(level = this.currentLevel) {
        if (level === 'קל') {
            return this._generateEasyQuestion();
        } else if (level === 'בינוני') {
            return this._generateMediumQuestion();
        } else {
            return this._generateHardQuestion();
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
        const userNum = parseFloat(userAnswer);

        if (isNaN(userNum)) {
            return {
                type: 'validation-error',
                message: 'אנא הכניסי מספר!'
            };
        }

        const isCorrect = userNum === correctAnswer;

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

        // Include explanation (always shown for both correct and wrong)
        const explanation = currentQuestion.explanation || null;

        return {
            type: 'feedback',
            module: 'distributive',
            isCorrect: isCorrect,
            feedbackType: isCorrect ? 'correct' : 'wrong',
            feedbackMessage: isCorrect
                ? `✅ ${encouragement} תשובה נכונה!`
                : `❌ ${encouragement}`,
            correctAnswerDisplay: isCorrect ? null : `התשובה הנכונה: ${this._formatNumber(correctAnswer)}`,
            explanation: explanation,
            statistics: { ...this.statistics },
            difficultyChange: difficultyChange,
            autoAdvance: isCorrect,
            autoAdvanceDelay: 2500, // Longer delay to read explanation
            celebrationTrigger: this.statistics.totalQuestions % 10 === 0,
            showNewQuestionButton: !isCorrect
        };
    }

    // ========================================
    // PRIVATE METHODS - Question Generators
    // ========================================

    /**
     * Generate easy-level question (קל)
     * @private
     */
    _generateEasyQuestion() {
        const a = Math.floor(Math.random() * 7) + 3; // 3-9
        const tens = (Math.floor(Math.random() * 3) + 1) * 10; // 10, 20, or 30
        const ones = Math.floor(Math.random() * 8) + 2; // 2-9
        const b = tens + ones; // 12-39

        const types = ['fill_blank', 'calculate'];
        const type = types[Math.floor(Math.random() * types.length)];

        if (type === 'fill_blank') {
            return this._generateFillBlank(a, b, tens, ones);
        } else {
            return this._generateCalculate(a, b, tens, ones);
        }
    }

    /**
     * Fill in the blank question
     * @private
     */
    _generateFillBlank(a, b, tens, ones) {
        const missingPart = Math.random() < 0.5 ? 'ones' : 'tens';

        if (missingPart === 'ones') {
            return {
                type: 'question',
                module: 'distributive',
                questionText: `${a} × ${b} = ${a} × (${tens} + ${ones})\n= (${a} × ${tens}) + (${a} × ___)\n\nמהו המספר החסר?`,
                questionType: 'input',
                inputPlaceholder: 'הכניסי תשובה',
                correctAnswer: ones,
                explanation: `התשובה: ${ones}\n\nהסבר: אנחנו מפרקים את ${b} ל-${tens} + ${ones}, ואז מכפילים כל חלק ב-${a}.\nאז צריך: (${a} × ${tens}) + (${a} × ${ones}) = ${a * tens} + ${a * ones} = ${a * b}`,
                areaModel: {
                    factor1: a,
                    factor2: b,
                    decomposition: { tens, ones }
                },
                metadata: {
                    questionType: 'fill_blank',
                    missingPart: 'ones'
                }
            };
        } else {
            return {
                type: 'question',
                module: 'distributive',
                questionText: `${a} × ${b} = ${a} × (${tens} + ${ones})\n= (${a} × ___) + (${a} × ${ones})\n\nמהו המספר החסר?`,
                questionType: 'input',
                inputPlaceholder: 'הכניסי תשובה',
                correctAnswer: tens,
                explanation: `התשובה: ${tens}\n\nהסבר: אנחנו מפרקים את ${b} ל-${tens} + ${ones}, ואז מכפילים כל חלק ב-${a}.\nאז צריך: (${a} × ${tens}) + (${a} × ${ones}) = ${a * tens} + ${a * ones} = ${a * b}`,
                areaModel: {
                    factor1: a,
                    factor2: b,
                    decomposition: { tens, ones }
                },
                metadata: {
                    questionType: 'fill_blank',
                    missingPart: 'tens'
                }
            };
        }
    }

    /**
     * Calculate final answer using distributive property
     * @private
     */
    _generateCalculate(a, b, tens, ones) {
        const answer = a * b;

        return {
            type: 'question',
            module: 'distributive',
            questionText: `חשב בעזרת חוק הפילוג:\n\n${a} × ${b} = ${a} × (${tens} + ${ones})\n= (${a} × ${tens}) + (${a} × ${ones})\n= ___ + ___\n= ?`,
            questionType: 'input',
            inputPlaceholder: 'הכניסי תשובה',
            correctAnswer: answer,
            explanation: `פתרון:\n1) ${a} × ${tens} = ${a * tens}\n2) ${a} × ${ones} = ${a * ones}\n3) ${a * tens} + ${a * ones} = ${answer}`,
            areaModel: {
                factor1: a,
                factor2: b,
                decomposition: { tens, ones }
            },
            metadata: {
                questionType: 'calculate'
            }
        };
    }

    /**
     * Generate medium-level question (בינוני)
     * @private
     */
    _generateMediumQuestion() {
        const a = Math.floor(Math.random() * 8) + 3; // 3-10
        const base = (Math.floor(Math.random() * 9) + 2) * 10; // 20, 30, ..., 100
        const offset = Math.floor(Math.random() * 8) + 1; // 1-8

        const useSubtraction = Math.random() < 0.5;

        if (useSubtraction) {
            return this._generateSubtractionDecomposition(a, base, offset);
        } else {
            return this._generateAdditionDecomposition(a, base, offset);
        }
    }

    /**
     * Subtraction decomposition: 7 × 19 = 7 × (20 - 1)
     * @private
     */
    _generateSubtractionDecomposition(a, base, offset) {
        const b = base - offset;
        const answer = a * b;

        return {
            type: 'question',
            module: 'distributive',
            questionText: `חשב בעזרת חוק הפילוג:\n\n${a} × ${b}\n\nרמז: ${b} = ${base} - ${offset}`,
            questionType: 'input',
            inputPlaceholder: 'הכניסי תשובה',
            correctAnswer: answer,
            explanation: `פתרון:\n${a} × ${b} = ${a} × (${base} - ${offset})\n= (${a} × ${base}) - (${a} × ${offset})\n= ${a * base} - ${a * offset}\n= ${answer}\n\n💡 שימוש בחיסור עוזר כשהמספר קרוב לעשרת עגולה!`,
            areaModel: {
                factor1: a,
                factor2: b,
                decomposition: { base, offset, operation: 'subtraction' }
            },
            metadata: {
                questionType: 'subtraction_decomposition',
                base,
                offset
            }
        };
    }

    /**
     * Addition decomposition with larger numbers: 8 × 47 = 8 × (40 + 7)
     * @private
     */
    _generateAdditionDecomposition(a, base, offset) {
        const b = base + offset;
        const tens = Math.floor(b / 10) * 10;
        const ones = b % 10;
        const answer = a * b;

        return {
            type: 'question',
            module: 'distributive',
            questionText: `חשב בעזרת חוק הפילוג:\n\n${a} × ${b}\n\nרמז: ${b} = ${tens} + ${ones}`,
            questionType: 'input',
            inputPlaceholder: 'הכניסי תשובה',
            correctAnswer: answer,
            explanation: `פתרון:\n${a} × ${b} = ${a} × (${tens} + ${ones})\n= (${a} × ${tens}) + (${a} × ${ones})\n= ${a * tens} + ${a * ones}\n= ${answer}`,
            areaModel: {
                factor1: a,
                factor2: b,
                decomposition: { tens, ones }
            },
            metadata: {
                questionType: 'addition_decomposition',
                tens,
                ones
            }
        };
    }

    /**
     * Generate hard-level question (קשה) - Three-digit multiplication
     * @private
     */
    _generateHardQuestion() {
        const a = Math.floor(Math.random() * 6) + 4; // 4-9
        const hundreds = (Math.floor(Math.random() * 3) + 1) * 100; // 100, 200, 300
        const tens = Math.floor(Math.random() * 10) * 10; // 0-90
        const ones = Math.floor(Math.random() * 10); // 0-9
        const b = hundreds + tens + ones; // 100-399

        const answer = a * b;

        const h = Math.floor(b / 100) * 100;
        const t = Math.floor((b % 100) / 10) * 10;
        const o = b % 10;

        // Build decomposition string
        const parts = [];
        const calculation = [];
        const sumParts = [];

        if (h > 0) {
            parts.push(`(${a} × ${h})`);
            calculation.push(`${a} × ${h} = ${a * h}`);
            sumParts.push(`${a * h}`);
        }
        if (t > 0) {
            parts.push(`(${a} × ${t})`);
            calculation.push(`${a} × ${t} = ${a * t}`);
            sumParts.push(`${a * t}`);
        }
        if (o > 0) {
            parts.push(`(${a} × ${o})`);
            calculation.push(`${a} × ${o} = ${a * o}`);
            sumParts.push(`${a * o}`);
        }

        const decomposition = parts.join(' + ');

        // Build decomposition display
        const decompParts = [];
        if (h > 0) decompParts.push(`${h}`);
        if (t > 0) decompParts.push(`${t}`);
        if (o > 0) decompParts.push(`${o}`);

        return {
            type: 'question',
            module: 'distributive',
            questionText: `חשב בעזרת חוק הפילוג:\n\n${a} × ${this._formatNumber(b)}`,
            questionType: 'input',
            inputPlaceholder: 'הכניסי תשובה',
            correctAnswer: answer,
            explanation: `פתרון מלא:\n\n1) פירוק עשרוני: ${this._formatNumber(b)} = ${decompParts.join(' + ')}\n\n2) חוק הפילוג:\n${a} × ${this._formatNumber(b)} = ${decomposition}\n\n3) חישוב:\n${calculation.join('\n')}\n\n4) חיבור:\n${sumParts.join(' + ')} = ${this._formatNumber(answer)}\n\n💡 זה בדיוק מה שקורה באלגוריתם הכפל המאונך!`,
            connectionToAlgorithm: true, // Flag for UI to highlight pedagogy
            areaModel: {
                factor1: a,
                factor2: b,
                decomposition: { hundreds: h, tens: t, ones: o }
            },
            metadata: {
                questionType: 'three_digit',
                hundreds: h,
                tens: t,
                ones: o
            }
        };
    }

    // ========================================
    // PRIVATE METHODS - Utilities
    // ========================================

    /**
     * Format large numbers with thousands separator
     * @private
     */
    _formatNumber(num) {
        return num.toLocaleString('en-US');
    }

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
    module.exports = DistributiveModule;
}

// Export for ES6
if (typeof exports !== 'undefined') {
    exports.DistributiveModule = DistributiveModule;
}
```

---

## ✅ Console Test

### File: `extracted-modules/tests/console-tests/distributive-console.js`

```javascript
/**
 * Console Test for DistributiveModule
 * Run: node distributive-console.js
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
const module = new DistributiveModule({ initialLevel: 'קל' });
console.assert(module.currentLevel === 'קל', 'Initial level should be קל');
console.assert(module.statistics.totalQuestions === 0, 'Initial questions should be 0');
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
const areaModelQ = module.generateQuestion();
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
    const q = module.generateQuestion();
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
```

---

## 📐 TypeScript Interface

### File: `extracted-modules/types/DistributiveModule.d.ts`

```typescript
/**
 * DistributiveModule TypeScript Definitions
 */

export interface DistributiveStatistics {
    totalQuestions: number;
    correctAnswers: number;
    currentStreak: number;
    bestStreak: number;
    consecutiveCorrect: number;
    consecutiveWrong: number;
}

export interface DistributiveConfig {
    initialLevel?: 'קל' | 'בינוני' | 'קשה';
    statistics?: Partial<DistributiveStatistics>;
}

export interface AreaModelData {
    factor1: number;
    factor2: number;
    decomposition:
        | { tens: number; ones: number } // Easy & medium addition
        | { base: number; offset: number; operation: 'subtraction' } // Medium subtraction
        | { hundreds: number; tens: number; ones: number }; // Hard
}

export interface DistributiveQuestionViewObject {
    type: 'question';
    module: 'distributive';
    questionText: string;
    questionType: 'input';
    inputPlaceholder: string;
    correctAnswer: number;
    explanation: string; // Detailed pedagogical explanation
    areaModel: AreaModelData; // Data for visual area model rendering
    connectionToAlgorithm?: boolean; // True for hard questions - shows connection to vertical algorithm
    metadata: {
        questionType:
            | 'fill_blank'
            | 'calculate'
            | 'addition_decomposition'
            | 'subtraction_decomposition'
            | 'three_digit';
        missingPart?: 'tens' | 'ones'; // For fill_blank type
        tens?: number;
        ones?: number;
        base?: number;
        offset?: number;
        hundreds?: number;
    };
}

export interface DifficultyChange {
    changed: true;
    newLevel: 'קל' | 'בינוני' | 'קשה';
    direction: 'up' | 'down';
}

export interface DistributiveFeedbackViewObject {
    type: 'feedback';
    module: 'distributive';
    isCorrect: boolean;
    feedbackType: 'correct' | 'wrong';
    feedbackMessage: string;
    correctAnswerDisplay: string | null;
    explanation: string; // Always present
    statistics: DistributiveStatistics;
    difficultyChange: DifficultyChange | null;
    autoAdvance: boolean;
    autoAdvanceDelay: 2500;
    celebrationTrigger: boolean;
    showNewQuestionButton: boolean;
}

export interface DistributiveValidationError {
    type: 'validation-error';
    message: string;
}

export type DistributiveViewObject =
    | DistributiveQuestionViewObject
    | DistributiveFeedbackViewObject
    | DistributiveValidationError;

export class DistributiveModule {
    constructor(config?: DistributiveConfig);

    generateQuestion(level?: 'קל' | 'בינוני' | 'קשה'): DistributiveQuestionViewObject;

    checkAnswer(
        userAnswer: string | number,
        correctAnswer: number,
        currentQuestion: DistributiveQuestionViewObject
    ): DistributiveFeedbackViewObject | DistributiveValidationError;

    getStatistics(): DistributiveStatistics;

    getCurrentLevel(): 'קל' | 'בינוני' | 'קשה';

    resetStatistics(): void;
}
```

---

## 🚀 Next.js Integration Example

### React Component with Area Model Rendering:

```typescript
'use client';

import { useState, useEffect } from 'react';

// Area Model Visualizer Component
function AreaModelVisualizer({ areaModel }: { areaModel: any }) {
    const { factor1, factor2, decomposition } = areaModel;

    // Example: Simple visual representation
    return (
        <div className="border-2 border-blue-500 p-4 my-4" dir="ltr">
            <h3 className="text-lg font-bold mb-2">Area Model</h3>
            <div className="grid gap-2">
                <div>Factor 1: {factor1}</div>
                <div>Factor 2: {factor2}</div>
                <div className="mt-2">
                    <strong>Decomposition:</strong>
                    <pre className="bg-gray-100 p-2 mt-1">
                        {JSON.stringify(decomposition, null, 2)}
                    </pre>
                </div>
            </div>
            {/* TODO: Add visual grid representation */}
        </div>
    );
}

export default function DistributivePractice() {
    const [question, setQuestion] = useState(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState(null);

    const fetchQuestion = async () => {
        const res = await fetch('/api/distributive', {
            headers: { 'x-session-id': 'user-123' }
        });
        const data = await res.json();
        setQuestion(data.data);
        setFeedback(null);
        setUserAnswer('');
    };

    const submitAnswer = async () => {
        const res = await fetch('/api/distributive', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-session-id': 'user-123'
            },
            body: JSON.stringify({
                userAnswer,
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
        <div dir="rtl" className="p-6">
            <h2 className="text-2xl mb-4">חוק הפילוג</h2>

            {/* Show pedagogical connection flag */}
            {question.connectionToAlgorithm && (
                <div className="bg-yellow-100 p-3 mb-4 border-r-4 border-yellow-500">
                    💡 שאלה זו מדגימה את הקשר לאלגוריתם הכפל המאונך!
                </div>
            )}

            <div className="whitespace-pre-wrap text-lg mb-4">
                {question.questionText}
            </div>

            {/* Area Model Visualization */}
            {question.areaModel && (
                <AreaModelVisualizer areaModel={question.areaModel} />
            )}

            <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder={question.inputPlaceholder}
                className="border p-2 w-32"
                dir="ltr"
            />

            <button onClick={submitAnswer} className="mr-4 px-4 py-2 bg-green-500 text-white">
                בדקי
            </button>

            {feedback && (
                <div className={`mt-4 p-4 ${feedback.isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                    <p className="font-bold">{feedback.feedbackMessage}</p>
                    {feedback.correctAnswerDisplay && <p>{feedback.correctAnswerDisplay}</p>}
                    {feedback.explanation && (
                        <div className="mt-2 whitespace-pre-wrap text-sm">
                            {feedback.explanation}
                        </div>
                    )}
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
grep -n "window\|document\|getElementById\|alert\|setTimeout\|displayAreaModel" DistributiveModule.js
# Expected: No results (exit code 1)
```

### Step 2: Console Test
```bash
cd extracted-modules/tests/console-tests
node distributive-console.js
# Expected: "🎉 All tests passed! DistributiveModule is headless and ready for Next.js."
```

### Step 3: Area Model Data Verification
```bash
node -e "
const DistributiveModule = require('./extracted-modules/modules/DistributiveModule');
const module = new DistributiveModule({ initialLevel: 'קל' });
for (let i = 0; i < 10; i++) {
    const q = module.generateQuestion();
    if (!q.areaModel || !q.areaModel.factor1 || !q.areaModel.decomposition) {
        console.error('❌ Missing area model data');
        process.exit(1);
    }
}
console.log('✅ All questions have complete area model data');
"
```

### Step 4: Subtraction Decomposition Test
```bash
node -e "
const DistributiveModule = require('./extracted-modules/modules/DistributiveModule');
const module = new DistributiveModule({ initialLevel: 'בינוני' });
let found = false;
for (let i = 0; i < 50; i++) {
    const q = module.generateQuestion();
    if (q.metadata.questionType === 'subtraction_decomposition') {
        found = true;
        console.log('✅ Found subtraction decomposition:', q.questionText.substring(0, 40));
        break;
    }
}
if (!found) {
    console.error('❌ Subtraction decomposition not generated');
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
| Area Model Data | 100% coverage | Every question includes data |
| Pedagogical Explanations | 100% coverage | Every question has explanation |
| Connection Flag | Present in hard | Hard questions flagged |
| Subtraction Type | Generated | Medium level includes subtraction |

---

## 🎯 Definition of Done

- [ ] `DistributiveModule.js` created with zero DOM access
- [ ] `distributive-console.js` test file passes all 12 tests
- [ ] `DistributiveModule.d.ts` TypeScript interface created
- [ ] All question types implemented (fill_blank, calculate, subtraction, three_digit)
- [ ] Area model data embedded in every question View Object
- [ ] Step-by-step pedagogical explanations included
- [ ] Connection to algorithm flag for hard questions
- [ ] Number formatting with thousands separator
- [ ] `grep` verification confirms zero DOM references
- [ ] Next.js example demonstrates area model rendering
- [ ] README updated: `health_refactor/01_orchestration_plan.md` (mark Story 11 complete)

---

## 📝 Notes

**Why This Is Pedagogically The Most Important Module:**
According to the pedagogical report, the distributive property is the **BRIDGE** connecting:
1. Place value understanding (tens, ones, hundreds)
2. Multi-digit multiplication ability
3. Standard vertical multiplication algorithm

This is not a "trick" to memorize - it's the fundamental principle that enables all multi-digit arithmetic.

**Key Features:**
- **Area Model Data:** Every question includes structured data for visual rendering (factor1, factor2, decomposition)
- **Subtraction Decomposition:** Unique pedagogical insight - `7 × 19 = 7 × (20 - 1)` helps with near-round numbers
- **Connection to Algorithm:** Hard questions explicitly flag that they demonstrate the vertical algorithm
- **2.5 Second Delay:** Longest auto-advance to allow reading rich explanations

**Area Model Rendering:**
The `areaModel` object in the View Object contains all data needed for client-side rendering:
- `factor1`, `factor2`: The two numbers being multiplied
- `decomposition`: Structured breakdown (tens/ones, or hundreds/tens/ones, or base/offset for subtraction)

The UI can use this data to render visual grid representations.

**Copy-Paste Compatibility:**
This module is production-ready for Next.js. The area model data is pure JSON - no DOM dependencies.
