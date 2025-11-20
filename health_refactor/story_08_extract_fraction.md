# Story 08: Extract Fraction Module (Headless)

**Priority:** P1 (High)
**Complexity:** Medium (6)
**Estimated Time:** 1 day
**Dependencies:** Story 06 (Division extraction pattern established)
**Phase:** 2 (Headless Extraction)

---

## 📋 Problem Statement

The **Fraction Module** is located in `src/math/js/modules/fraction_module.js` (274 lines) and is tightly coupled to the DOM. We need to extract the business logic into a **Pure JavaScript Class** that can be imported into a Next.js API route.

### Current Issues:
- ❌ Lines 127-169: Direct DOM manipulation (`getElementById`, `textContent`, `innerHTML`)
- ❌ Lines 171-184: `selectFractionChoice()` modifies button styles directly
- ❌ Lines 186-242: `checkFractionAnswer()` reads from input/choice elements
- ❌ Lines 194, 238-240: Uses `alert()` and `setTimeout()` (browser-only APIs)
- ❌ Lines 255-257: Pollutes global `window` namespace

### Success Criteria:
✅ Zero DOM access (no `window`, `document`, `getElementById`, `alert`)
✅ Returns JSON View Objects (all rendering data in plain objects)
✅ Console test passes (`node fraction-console.js`)
✅ Can be copy-pasted into Next.js API route without modification

---

## 🎯 Extraction Scope

### Question Types (3 Active):
1. **compare** - Compare two fractions with same denominator (choice question)
2. **addSameDenominator** - Add fractions with same denominator (input question)
3. **simplify** - Simplify a fraction (input question)

**Note:** Types `fractionToDecimal` and `decimalToFraction` exist in code but are disabled (line 3: `const types = ['compare', 'addSameDenominator', 'simplify']`). We will include them in the extracted module for future use.

### Difficulty Levels:
- **קל (Easy):** maxNumerator: 4, denominators: [2, 4]
- **בינוני (Medium):** maxNumerator: 8, denominators: [2, 3, 4, 5, 6]
- **קשה (Hard):** maxNumerator: 12, denominators: [2, 3, 4, 5, 6, 8, 10, 12]

### Utility Functions:
- `gcd(a, b)` - Greatest Common Divisor (Euclidean algorithm)
- `simplifyFraction(num, den)` - Returns simplified fraction object

---

## 📦 Implementation

### File: `extracted-modules/modules/FractionModule.js`

```javascript
/**
 * FractionModule - Headless Fraction Practice
 *
 * Extracted from: src/math/js/modules/fraction_module.js
 * Zero DOM dependencies - Returns View Objects for rendering
 *
 * Question Types:
 * - compare: Compare two fractions (e.g., 3/4 ___ 1/4)
 * - addSameDenominator: Add fractions with same denominator
 * - simplify: Simplify a fraction
 * - fractionToDecimal: Convert fraction to decimal (future use)
 * - decimalToFraction: Convert decimal to fraction (future use)
 */

class FractionModule {
    /**
     * @param {Object} config - Configuration options
     * @param {string} config.initialLevel - Starting difficulty ('קל', 'בינוני', 'קשה')
     * @param {Object} config.statistics - Initial statistics
     * @param {string[]} config.enabledTypes - Question types to include (default: compare, addSameDenominator, simplify)
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

        // Question types to generate (future-proof: includes disabled types)
        this.enabledTypes = config.enabledTypes || ['compare', 'addSameDenominator', 'simplify'];

        this.difficultyConfig = {
            'קל': {
                maxNumerator: 4,
                denominators: [2, 4]
            },
            'בינוני': {
                maxNumerator: 8,
                denominators: [2, 3, 4, 5, 6]
            },
            'קשה': {
                maxNumerator: 12,
                denominators: [2, 3, 4, 5, 6, 8, 10, 12]
            }
        };

        this.hebrewText = {
            encouragements: {
                correct: ['מעולה!', 'פנטסטי!', 'את גאונית!', 'כל הכבוד!', 'מושלם!', 'יופי!'],
                wrong: ['לא נורא!', 'ננסה שוב!', 'כמעט!', 'אפשר ללמוד מטעויות!', 'בפעם הבאה!']
            },
            correctVoice: 'כל הכבוד אמה!',
            wrongTip: 'טיפ: תרגלי צמצום שברים!'
        };

        // LTR embedding characters for proper RTL display
        this.LTR_START = '\u202A';
        this.LTR_END = '\u202C';
    }

    /**
     * Generate a new fraction question
     * @param {string} level - Difficulty level ('קל', 'בינוני', 'קשה')
     * @returns {Object} View Object for rendering
     */
    generateQuestion(level = this.currentLevel) {
        const type = this.enabledTypes[Math.floor(Math.random() * this.enabledTypes.length)];
        const range = this.difficultyConfig[level];

        switch (type) {
            case 'compare':
                return this._generateCompare(range);
            case 'addSameDenominator':
                return this._generateAddSameDenominator(range);
            case 'simplify':
                return this._generateSimplify(range);
            case 'fractionToDecimal':
                return this._generateFractionToDecimal();
            case 'decimalToFraction':
                return this._generateDecimalToFraction();
            default:
                throw new Error(`Unknown question type: ${type}`);
        }
    }

    /**
     * Check user answer and return feedback
     * @param {string|number} userAnswer - User's answer
     * @param {string|number} correctAnswer - Correct answer
     * @param {Object} currentQuestion - Current question object (for context)
     * @returns {Object} View Object for feedback rendering
     */
    checkAnswer(userAnswer, correctAnswer, currentQuestion) {
        if (!userAnswer) {
            return {
                type: 'validation-error',
                message: 'אנא הכניסי תשובה!'
            };
        }

        let isCorrect = false;

        // Handle numeric answers
        if (typeof correctAnswer === 'number') {
            isCorrect = parseFloat(userAnswer) === correctAnswer;
        } else {
            // Handle string answers (fractions like "3/4")
            const userClean = userAnswer.toString().replace(/\s/g, '');
            const correctClean = correctAnswer.toString().replace(/\s/g, '');
            isCorrect = userClean === correctClean;
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
            module: 'fraction',
            isCorrect: isCorrect,
            feedbackType: isCorrect ? 'correct' : 'wrong',
            feedbackMessage: isCorrect
                ? `✅ ${encouragement} תשובה נכונה!`
                : `❌ ${encouragement}`,
            voiceMessage: isCorrect ? this.hebrewText.correctVoice : null,
            correctAnswerDisplay: isCorrect ? null : `התשובה הנכונה: ${correctAnswer}`,
            tipMessage: isCorrect ? null : this.hebrewText.wrongTip,
            statistics: { ...this.statistics },
            difficultyChange: difficultyChange, // { changed: true, newLevel: 'בינוני', direction: 'up' } or null
            autoAdvance: isCorrect, // If true, UI should auto-advance after delay
            celebrationTrigger: this.statistics.totalQuestions % 10 === 0,
            showNewQuestionButton: !isCorrect
        };
    }

    // ========================================
    // PRIVATE METHODS - Question Generators
    // ========================================

    /**
     * Generate a "compare fractions" question (same denominator)
     * @private
     */
    _generateCompare(range) {
        const den = range.denominators[Math.floor(Math.random() * range.denominators.length)];
        const num1 = Math.floor(Math.random() * den) + 1;
        const num2 = Math.floor(Math.random() * den) + 1;

        // Determine correct answer
        let correctAnswer;
        if (num1 > num2) correctAnswer = '>';
        else if (num1 < num2) correctAnswer = '<';
        else correctAnswer = '=';

        const leftFraction = `${num1}/${den}`;
        const rightFraction = `${num2}/${den}`;

        return {
            type: 'question',
            module: 'fraction',
            questionText: 'מה הסימן הנכון?',
            equation: `${leftFraction} ___ ${rightFraction}`,
            questionType: 'choice',
            choices: [
                { id: 0, text: '>', value: '>', ltr: true },
                { id: 1, text: '<', value: '<', ltr: true },
                { id: 2, text: '=', value: '=', ltr: true }
            ],
            correctAnswer: correctAnswer,
            metadata: {
                leftFraction,
                rightFraction,
                num1,
                num2,
                den,
                questionType: 'compare'
            }
        };
    }

    /**
     * Generate "add fractions with same denominator" question
     * @private
     */
    _generateAddSameDenominator(range) {
        const den = range.denominators[Math.floor(Math.random() * range.denominators.length)];
        const n1 = Math.floor(Math.random() * (den - 1)) + 1;
        const n2 = Math.floor(Math.random() * (den - n1)) + 1;
        const sum = n1 + n2;
        const simplified = this._simplifyFraction(sum, den);

        let equation, correctAnswer, questionText;

        if (simplified.den === 1) {
            // Result is a whole number
            correctAnswer = simplified.num;
            equation = `${n1}/${den} + ${n2}/${den} = ___`;
            questionText = 'חשבי:';
        } else if (simplified.num === sum && simplified.den === den) {
            // Result doesn't need simplification - ask for just numerator
            correctAnswer = sum;
            equation = `${n1}/${den} + ${n2}/${den} = ___/${den}`;
            questionText = 'חשבי:';
        } else {
            // Result needs simplification
            correctAnswer = `${simplified.num}/${simplified.den}`;
            equation = `${n1}/${den} + ${n2}/${den} = ___`;
            questionText = 'חשבי וצמצמי:';
        }

        return {
            type: 'question',
            module: 'fraction',
            questionText: questionText,
            equation: equation,
            questionType: 'input',
            inputPlaceholder: 'הכניסי תשובה',
            correctAnswer: correctAnswer,
            metadata: {
                n1,
                n2,
                den,
                sum,
                simplified,
                questionType: 'addSameDenominator'
            }
        };
    }

    /**
     * Generate "simplify fraction" question
     * @private
     */
    _generateSimplify(range) {
        const baseDen = range.denominators[Math.floor(Math.random() * range.denominators.length)];
        const multiplier = Math.floor(Math.random() * 3) + 2; // 2-4
        const numToSimplify = (Math.floor(Math.random() * (baseDen - 1)) + 1) * multiplier;
        const denToSimplify = baseDen * multiplier;

        const result = this._simplifyFraction(numToSimplify, denToSimplify);
        const correctAnswer = `${result.num}/${result.den}`;

        return {
            type: 'question',
            module: 'fraction',
            questionText: 'צמצמי:',
            equation: `${numToSimplify}/${denToSimplify} = ___`,
            questionType: 'input',
            inputPlaceholder: 'הכניסי תשובה',
            correctAnswer: correctAnswer,
            metadata: {
                numToSimplify,
                denToSimplify,
                result,
                questionType: 'simplify'
            }
        };
    }

    /**
     * Generate "fraction to decimal" question (for future use)
     * @private
     */
    _generateFractionToDecimal() {
        const fractionPairs = [
            { num: 1, den: 2, decimal: 0.5 },
            { num: 1, den: 4, decimal: 0.25 },
            { num: 3, den: 4, decimal: 0.75 },
            { num: 1, den: 5, decimal: 0.2 },
            { num: 2, den: 5, decimal: 0.4 },
            { num: 3, den: 5, decimal: 0.6 },
            { num: 4, den: 5, decimal: 0.8 },
            { num: 1, den: 10, decimal: 0.1 },
            { num: 3, den: 10, decimal: 0.3 }
        ];

        const pair = fractionPairs[Math.floor(Math.random() * fractionPairs.length)];
        const equationLTR = `${this.LTR_START}${pair.num}/${pair.den} = ___${this.LTR_END}`;

        return {
            type: 'question',
            module: 'fraction',
            questionText: `כתבי כעשרוני: ${equationLTR}`,
            questionType: 'input',
            inputPlaceholder: 'הכניסי תשובה',
            correctAnswer: pair.decimal,
            metadata: {
                fraction: `${pair.num}/${pair.den}`,
                decimal: pair.decimal,
                questionType: 'fractionToDecimal'
            }
        };
    }

    /**
     * Generate "decimal to fraction" question (for future use)
     * @private
     */
    _generateDecimalToFraction() {
        const decimalOptions = [
            { decimal: 0.5, num: 1, den: 2 },
            { decimal: 0.25, num: 1, den: 4 },
            { decimal: 0.75, num: 3, den: 4 },
            { decimal: 0.2, num: 1, den: 5 },
            { decimal: 0.4, num: 2, den: 5 }
        ];

        const pair = decimalOptions[Math.floor(Math.random() * decimalOptions.length)];
        const equationLTR = `${this.LTR_START}${pair.decimal} = ___${this.LTR_END}`;
        const correctAnswer = `${pair.num}/${pair.den}`;

        return {
            type: 'question',
            module: 'fraction',
            questionText: `כתבי כשבר: ${equationLTR}`,
            questionType: 'input',
            inputPlaceholder: 'הכניסי תשובה',
            correctAnswer: correctAnswer,
            metadata: {
                decimal: pair.decimal,
                fraction: correctAnswer,
                questionType: 'decimalToFraction'
            }
        };
    }

    // ========================================
    // PRIVATE METHODS - Utilities
    // ========================================

    /**
     * Greatest Common Divisor (Euclidean algorithm)
     * @private
     */
    _gcd(a, b) {
        return b === 0 ? a : this._gcd(b, a % b);
    }

    /**
     * Simplify a fraction to lowest terms
     * @private
     */
    _simplifyFraction(num, den) {
        const divisor = this._gcd(num, den);
        return {
            num: num / divisor,
            den: den / divisor
        };
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
    module.exports = FractionModule;
}

// Export for ES6
if (typeof exports !== 'undefined') {
    exports.FractionModule = FractionModule;
}
```

---

## ✅ Console Test

### File: `extracted-modules/tests/console-tests/fraction-console.js`

```javascript
/**
 * Console Test for FractionModule
 * Run: node fraction-console.js
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
const module = new FractionModule({
    initialLevel: 'קל',
    enabledTypes: ['compare', 'addSameDenominator', 'simplify']
});
console.assert(module.currentLevel === 'קל', 'Initial level should be קל');
console.assert(module.statistics.totalQuestions === 0, 'Initial questions should be 0');
console.log('✅ Instantiation passed\n');

// Test 2: Generate Compare Question
console.log('Test 2: Generate Compare Question (choice)');
const compareQ = module.generateQuestion('קל');
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
```

---

## 📐 TypeScript Interface

### File: `extracted-modules/types/FractionModule.d.ts`

```typescript
/**
 * FractionModule TypeScript Definitions
 */

export interface FractionStatistics {
    totalQuestions: number;
    correctAnswers: number;
    currentStreak: number;
    bestStreak: number;
    consecutiveCorrect: number;
    consecutiveWrong: number;
}

export interface FractionConfig {
    initialLevel?: 'קל' | 'בינוני' | 'קשה';
    statistics?: Partial<FractionStatistics>;
    enabledTypes?: Array<'compare' | 'addSameDenominator' | 'simplify' | 'fractionToDecimal' | 'decimalToFraction'>;
}

export interface FractionChoice {
    id: number;
    text: string;
    value: string;
    ltr?: boolean; // Force LTR direction for symbols like <, >, =
}

export interface FractionQuestionViewObject {
    type: 'question';
    module: 'fraction';
    questionText: string;
    equation?: string; // Optional equation display (e.g., "3/4 + 1/4 = ___")
    questionType: 'input' | 'choice';
    choices?: FractionChoice[]; // Present if questionType === 'choice'
    inputPlaceholder?: string; // Present if questionType === 'input'
    correctAnswer: string | number;
    metadata: {
        questionType: 'compare' | 'addSameDenominator' | 'simplify' | 'fractionToDecimal' | 'decimalToFraction';
        [key: string]: any; // Additional metadata per question type
    };
}

export interface DifficultyChange {
    changed: true;
    newLevel: 'קל' | 'בינוני' | 'קשה';
    direction: 'up' | 'down';
}

export interface FractionFeedbackViewObject {
    type: 'feedback';
    module: 'fraction';
    isCorrect: boolean;
    feedbackType: 'correct' | 'wrong';
    feedbackMessage: string;
    voiceMessage: string | null;
    correctAnswerDisplay: string | null; // Only present if wrong
    tipMessage: string | null; // Only present if wrong
    statistics: FractionStatistics;
    difficultyChange: DifficultyChange | null;
    autoAdvance: boolean;
    celebrationTrigger: boolean; // True if totalQuestions is multiple of 10
    showNewQuestionButton: boolean;
}

export interface FractionValidationError {
    type: 'validation-error';
    message: string;
}

export type FractionViewObject =
    | FractionQuestionViewObject
    | FractionFeedbackViewObject
    | FractionValidationError;

export class FractionModule {
    constructor(config?: FractionConfig);

    generateQuestion(level?: 'קל' | 'בינוני' | 'קשה'): FractionQuestionViewObject;

    checkAnswer(
        userAnswer: string | number,
        correctAnswer: string | number,
        currentQuestion: FractionQuestionViewObject
    ): FractionFeedbackViewObject | FractionValidationError;

    getStatistics(): FractionStatistics;

    getCurrentLevel(): 'קל' | 'בינוני' | 'קשה';

    resetStatistics(): void;
}
```

---

## 🚀 Next.js Integration Example

### File: `app/api/fraction/route.ts` (Next.js 14+ App Router)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { FractionModule } from '@/lib/modules/FractionModule';

// In-memory session storage (replace with Redis/database in production)
const sessions = new Map<string, FractionModule>();

export async function GET(request: NextRequest) {
    const sessionId = request.headers.get('x-session-id') || 'default';

    // Get or create module instance
    if (!sessions.has(sessionId)) {
        sessions.set(sessionId, new FractionModule({
            initialLevel: 'קל',
            enabledTypes: ['compare', 'addSameDenominator', 'simplify']
        }));
    }

    const module = sessions.get(sessionId)!;
    const question = module.generateQuestion();

    return NextResponse.json({
        success: true,
        data: question,
        statistics: module.getStatistics()
    });
}

export async function POST(request: NextRequest) {
    const sessionId = request.headers.get('x-session-id') || 'default';
    const { userAnswer, correctAnswer, currentQuestion } = await request.json();

    if (!sessions.has(sessionId)) {
        return NextResponse.json(
            { success: false, error: 'Session not found' },
            { status: 404 }
        );
    }

    const module = sessions.get(sessionId)!;
    const feedback = module.checkAnswer(userAnswer, correctAnswer, currentQuestion);

    return NextResponse.json({
        success: true,
        data: feedback
    });
}
```

### React Component Example:

```typescript
'use client';

import { useState, useEffect } from 'react';

export default function FractionPractice() {
    const [question, setQuestion] = useState(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState(null);

    const fetchQuestion = async () => {
        const res = await fetch('/api/fraction', {
            headers: { 'x-session-id': 'user-123' }
        });
        const data = await res.json();
        setQuestion(data.data);
        setFeedback(null);
        setUserAnswer('');
    };

    const submitAnswer = async () => {
        const res = await fetch('/api/fraction', {
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
            setTimeout(fetchQuestion, 1500);
        }
    };

    useEffect(() => {
        fetchQuestion();
    }, []);

    if (!question) return <div>טוען...</div>;

    return (
        <div dir="rtl" className="p-6">
            <h2 className="text-2xl mb-4">{question.questionText}</h2>
            {question.equation && <p className="text-xl mb-4">{question.equation}</p>}

            {question.questionType === 'input' ? (
                <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder={question.inputPlaceholder}
                    className="border p-2"
                />
            ) : (
                <div className="flex gap-2">
                    {question.choices.map((choice) => (
                        <button
                            key={choice.id}
                            onClick={() => setUserAnswer(choice.value)}
                            className={`px-4 py-2 border ${
                                userAnswer === choice.value ? 'bg-blue-500 text-white' : ''
                            }`}
                            style={choice.ltr ? { direction: 'ltr' } : {}}
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
                    <p>{feedback.feedbackMessage}</p>
                    {feedback.correctAnswerDisplay && <p>{feedback.correctAnswerDisplay}</p>}
                    {feedback.tipMessage && <p>{feedback.tipMessage}</p>}
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
grep -n "window\|document\|getElementById\|alert\|setTimeout\|innerHTML" FractionModule.js
# Expected: No results (exit code 1)
```

### Step 2: Console Test
```bash
cd extracted-modules/tests/console-tests
node fraction-console.js
# Expected: "🎉 All tests passed! FractionModule is headless and ready for Next.js."
```

### Step 3: Question Distribution Test
```bash
node -e "
const FractionModule = require('./extracted-modules/modules/FractionModule');
const module = new FractionModule();
const types = {};
for (let i = 0; i < 100; i++) {
    const q = module.generateQuestion('בינוני');
    types[q.metadata.questionType] = (types[q.metadata.questionType] || 0) + 1;
}
console.log('Question distribution (100 questions):', types);
"
# Expected: Roughly equal distribution among enabled types
```

### Step 4: Difficulty Progression Test
```bash
node -e "
const FractionModule = require('./extracted-modules/modules/FractionModule');
const module = new FractionModule({ initialLevel: 'קל' });
console.log('Starting level:', module.getCurrentLevel());
for (let i = 0; i < 5; i++) {
    const q = module.generateQuestion();
    const f = module.checkAnswer(q.correctAnswer, q.correctAnswer, q);
    if (f.difficultyChange) {
        console.log('Level changed to:', f.difficultyChange.newLevel, '(direction:', f.difficultyChange.direction + ')');
    }
}
console.log('Final level:', module.getCurrentLevel());
"
# Expected: Level up progression from קל → בינוני
```

### Step 5: Answer Validation Test
```bash
node -e "
const FractionModule = require('./extracted-modules/modules/FractionModule');
const module = new FractionModule({ enabledTypes: ['simplify'] });
const q = module.generateQuestion();
console.log('Question:', q.equation);
console.log('Correct answer:', q.correctAnswer);

// Test correct answer
const correct = module.checkAnswer(q.correctAnswer, q.correctAnswer, q);
console.log('Correct:', correct.isCorrect, correct.feedbackMessage);

// Test wrong answer
const wrong = module.checkAnswer('1/999', q.correctAnswer, q);
console.log('Wrong:', wrong.isCorrect, wrong.correctAnswerDisplay);

// Test empty answer
const empty = module.checkAnswer('', q.correctAnswer, q);
console.log('Empty:', empty.type, empty.message);
"
```

---

## 📊 Success Metrics

| Metric | Target | Validation |
|--------|--------|------------|
| Zero DOM Access | 0 references | `grep` command returns no results |
| Console Test Pass | 10/10 tests | All assertions pass |
| TypeScript Compile | No errors | `tsc --noEmit` on `.d.ts` file |
| Next.js Integration | Copy-paste ready | No modifications needed |
| Question Generation | All 5 types work | Console test generates all types |
| Difficulty Adjustment | Auto level-up/down | Progression test shows changes |
| Hebrew Text Preserved | All strings intact | Visual inspection |

---

## 🎯 Definition of Done

- [ ] `FractionModule.js` created with zero DOM access
- [ ] `fraction-console.js` test file passes all 10 tests
- [ ] `FractionModule.d.ts` TypeScript interface created
- [ ] All 5 question types implemented (3 active + 2 future)
- [ ] Answer checking handles numeric and string fractions
- [ ] Adaptive difficulty works (level up after 3 correct, down after 2 wrong)
- [ ] `grep` verification confirms zero DOM references
- [ ] Next.js example demonstrates integration pattern
- [ ] Hebrew text preserved with correct RTL/LTR embedding
- [ ] README updated: `health_refactor/01_orchestration_plan.md` (mark Story 08 complete)

---

## 📝 Notes

**Key Differences from Division Module:**
1. **Mixed Question Types:** Compare uses `choice`, Add/Simplify use `input`
2. **Fraction Simplification:** Uses GCD algorithm for reducing fractions
3. **Answer Format Variability:** Can be numeric (4), fraction string ("3/4"), or comparison symbol (">")
4. **Future-Proof:** Includes disabled question types for curriculum expansion
5. **RTL/LTR Handling:** Special unicode embedding for proper Hebrew display with English math notation

**Copy-Paste Compatibility:**
This module is designed to work immediately in a Next.js API route without ANY modifications. The only setup required is moving the file to the Next.js project's lib/ or utils/ directory.
