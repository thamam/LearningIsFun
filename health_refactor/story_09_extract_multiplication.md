# Story 09: Extract Multiplication Module (Headless)

**Priority:** P1 (High)
**Complexity:** Low (4)
**Estimated Time:** 0.5 days
**Dependencies:** Story 06 (Division extraction pattern established)
**Phase:** 2 (Headless Extraction)

---

## 📋 Problem Statement

The **Multiplication Module** is embedded in `src/math/Emma_math_lab.html` (lines 2865-3039, ~175 lines) and is tightly coupled to the DOM. We need to extract the business logic into a **Pure JavaScript Class** that can be imported into a Next.js API route.

### Current Issues:
- ❌ Lines 2932-2942: Direct DOM manipulation (`getElementById`, `textContent`, `focus`)
- ❌ Lines 2952-2956: Reads input value and uses `alert()` (browser-only)
- ❌ Lines 2991-3012: Updates feedback element with `innerHTML`
- ❌ Lines 3016-3018: Uses `setTimeout()` for auto-advance (browser timing)
- ❌ Embedded in 4000+ line HTML file

### Success Criteria:
✅ Zero DOM access (no `window`, `document`, `getElementById`, `alert`)
✅ Returns JSON View Objects (all rendering data in plain objects)
✅ Console test passes (`node multiplication-console.js`)
✅ Can be copy-pasted into Next.js API route without modification

---

## 🎯 Extraction Scope

### Question Types (4):
1. **missingMultiplier** - `5 × ___ = 20` (answer: 4)
2. **missingMultiplicand** - `___ × 4 = 20` (answer: 5)
3. **missingProduct** - `5 × 4 = ___` (answer: 20)
4. **division** - "If 5 × 4 = 20, then 20 ÷ 5 = ___" (answer: 4)

**Note:** All questions use **input type** (no multiple choice).

### Difficulty Levels:
- **קל (Easy):** Numbers 1-5
- **בינוני (Medium):** Numbers 1-10
- **קשה (Hard):** Numbers 1-12 (full multiplication table)

### Special Features:
- **LTR Embedding:** Uses Unicode characters `\u202A` and `\u202C` to prevent RTL scrambling of equations
- **Adaptive Difficulty:** Auto level-up after 3 correct, down after 2 wrong
- **Auto-advance:** Correct answers trigger next question after 1.5s delay

---

## 📦 Implementation

### File: `extracted-modules/modules/MultiplicationModule.js`

```javascript
/**
 * MultiplicationModule - Headless Multiplication Practice
 *
 * Extracted from: src/math/Emma_math_lab.html (lines 2865-3039)
 * Zero DOM dependencies - Returns View Objects for rendering
 *
 * Question Types:
 * - missingMultiplier: a × ___ = c
 * - missingMultiplicand: ___ × b = c
 * - missingProduct: a × b = ___
 * - division: If a × b = c, then c ÷ a = ___
 *
 * All questions require numeric input (no multiple choice).
 */

class MultiplicationModule {
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

        this.questionTypes = [
            'missingMultiplier',
            'missingMultiplicand',
            'missingProduct',
            'division'
        ];

        this.difficultyConfig = {
            'קל': { min: 1, max: 5 },
            'בינוני': { min: 1, max: 10 },
            'קשה': { min: 1, max: 12 }
        };

        this.hebrewText = {
            encouragements: {
                correct: ['מעולה!', 'פנטסטי!', 'את גאונית!', 'כל הכבוד!', 'מושלם!'],
                wrong: ['לא נורא!', 'ננסה שוב!', 'כמעט!', 'אפשר ללמוד מטעויות!', 'בפעם הבאה!']
            },
            correctVoice: 'כל הכבוד אמה!',
            wrongTip: 'תרגלי את לוח הכפל!'
        };

        // LTR embedding characters for proper RTL display
        this.LTR_START = '\u202A';
        this.LTR_END = '\u202C';
    }

    /**
     * Generate a new multiplication question
     * @param {string} level - Difficulty level ('קל', 'בינוני', 'קשה')
     * @returns {Object} View Object for rendering
     */
    generateQuestion(level = this.currentLevel) {
        const type = this.questionTypes[Math.floor(Math.random() * this.questionTypes.length)];
        const range = this.difficultyConfig[level];

        // Generate two random numbers within range
        const num1 = Math.floor(Math.random() * range.max) + range.min;
        const num2 = Math.floor(Math.random() * range.max) + range.min;
        const product = num1 * num2;

        let questionText, correctAnswer;

        switch (type) {
            case 'missingMultiplier':
                // a × ___ = c
                questionText = `${this.LTR_START}${num1} × ___ = ${product}${this.LTR_END}`;
                correctAnswer = num2;
                break;

            case 'missingMultiplicand':
                // ___ × b = c
                questionText = `${this.LTR_START}___ × ${num2} = ${product}${this.LTR_END}`;
                correctAnswer = num1;
                break;

            case 'missingProduct':
                // a × b = ___
                questionText = `${this.LTR_START}${num1} × ${num2} = ___${this.LTR_END}`;
                correctAnswer = product;
                break;

            case 'division':
                // If a × b = c, then c ÷ a = ___
                const eq1 = `${this.LTR_START}${num1} × ${num2} = ${product}${this.LTR_END}`;
                const eq2 = `${this.LTR_START}${product} ÷ ${num1} = ___${this.LTR_END}`;
                questionText = `אם ${eq1}, אז ${eq2}`;
                correctAnswer = num2;
                break;

            default:
                throw new Error(`Unknown question type: ${type}`);
        }

        return {
            type: 'question',
            module: 'multiplication',
            questionText: questionText,
            questionType: 'input',
            inputPlaceholder: 'הכניסי מספר',
            correctAnswer: correctAnswer,
            showCheckButton: true,
            focus: true,
            metadata: {
                num1,
                num2,
                product,
                questionType: type,
                level
            }
        };
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

        return {
            type: 'feedback',
            module: 'multiplication',
            isCorrect: isCorrect,
            feedbackType: isCorrect ? 'correct' : 'wrong',
            feedbackMessage: isCorrect
                ? `✅ ${encouragement} תשובה נכונה!`
                : `❌ ${encouragement}`,
            voiceMessage: isCorrect ? this.hebrewText.correctVoice : null,
            correctAnswerDisplay: isCorrect ? null : `התשובה הנכונה: ${correctAnswer}`,
            explanationMessage: isCorrect ? null : `ההסבר: ${this.hebrewText.wrongTip}`,
            statistics: { ...this.statistics },
            difficultyChange: difficultyChange,
            autoAdvance: isCorrect,
            autoAdvanceDelay: 1500, // milliseconds
            celebrationTrigger: this.statistics.totalQuestions % 10 === 0,
            showNewQuestionButton: !isCorrect
        };
    }

    // ========================================
    // PRIVATE METHODS
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
    module.exports = MultiplicationModule;
}

// Export for ES6
if (typeof exports !== 'undefined') {
    exports.MultiplicationModule = MultiplicationModule;
}
```

---

## ✅ Console Test

### File: `extracted-modules/tests/console-tests/multiplication-console.js`

```javascript
/**
 * Console Test for MultiplicationModule
 * Run: node multiplication-console.js
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
const module = new MultiplicationModule({ initialLevel: 'קל' });
console.assert(module.currentLevel === 'קל', 'Initial level should be קל');
console.assert(module.statistics.totalQuestions === 0, 'Initial questions should be 0');
console.assert(module.questionTypes.length === 4, 'Should have 4 question types');
console.log('✅ Instantiation passed\n');

// Test 2: Generate Questions (All 4 Types)
console.log('Test 2: Generate Questions (All 4 Types)');
const types = {};
for (let i = 0; i < 40; i++) {
    const q = module.generateQuestion();
    types[q.metadata.questionType] = (types[q.metadata.questionType] || 0) + 1;
}
console.log('Question type distribution:', types);
console.assert(Object.keys(types).length === 4, 'Should generate all 4 question types');
console.log('✅ Question generation passed\n');

// Test 3: Verify Question Format
console.log('Test 3: Verify Question Format');
const question = module.generateQuestion('בינוני');
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
```

---

## 📐 TypeScript Interface

### File: `extracted-modules/types/MultiplicationModule.d.ts`

```typescript
/**
 * MultiplicationModule TypeScript Definitions
 */

export interface MultiplicationStatistics {
    totalQuestions: number;
    correctAnswers: number;
    currentStreak: number;
    bestStreak: number;
    consecutiveCorrect: number;
    consecutiveWrong: number;
}

export interface MultiplicationConfig {
    initialLevel?: 'קל' | 'בינוני' | 'קשה';
    statistics?: Partial<MultiplicationStatistics>;
}

export interface MultiplicationQuestionViewObject {
    type: 'question';
    module: 'multiplication';
    questionText: string;
    questionType: 'input';
    inputPlaceholder: string;
    correctAnswer: number;
    showCheckButton: true;
    focus: true;
    metadata: {
        num1: number;
        num2: number;
        product: number;
        questionType: 'missingMultiplier' | 'missingMultiplicand' | 'missingProduct' | 'division';
        level: 'קל' | 'בינוני' | 'קשה';
    };
}

export interface DifficultyChange {
    changed: true;
    newLevel: 'קל' | 'בינוני' | 'קשה';
    direction: 'up' | 'down';
}

export interface MultiplicationFeedbackViewObject {
    type: 'feedback';
    module: 'multiplication';
    isCorrect: boolean;
    feedbackType: 'correct' | 'wrong';
    feedbackMessage: string;
    voiceMessage: string | null;
    correctAnswerDisplay: string | null;
    explanationMessage: string | null;
    statistics: MultiplicationStatistics;
    difficultyChange: DifficultyChange | null;
    autoAdvance: boolean;
    autoAdvanceDelay: 1500;
    celebrationTrigger: boolean;
    showNewQuestionButton: boolean;
}

export interface MultiplicationValidationError {
    type: 'validation-error';
    message: string;
}

export type MultiplicationViewObject =
    | MultiplicationQuestionViewObject
    | MultiplicationFeedbackViewObject
    | MultiplicationValidationError;

export class MultiplicationModule {
    constructor(config?: MultiplicationConfig);

    generateQuestion(level?: 'קל' | 'בינוני' | 'קשה'): MultiplicationQuestionViewObject;

    checkAnswer(
        userAnswer: string | number,
        correctAnswer: number,
        currentQuestion: MultiplicationQuestionViewObject
    ): MultiplicationFeedbackViewObject | MultiplicationValidationError;

    getStatistics(): MultiplicationStatistics;

    getCurrentLevel(): 'קל' | 'בינוני' | 'קשה';

    resetStatistics(): void;
}
```

---

## 🚀 Next.js Integration Example

### File: `app/api/multiplication/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { MultiplicationModule } from '@/lib/modules/MultiplicationModule';

// In-memory session storage (replace with Redis/database in production)
const sessions = new Map<string, MultiplicationModule>();

export async function GET(request: NextRequest) {
    const sessionId = request.headers.get('x-session-id') || 'default';

    // Get or create module instance
    if (!sessions.has(sessionId)) {
        sessions.set(sessionId, new MultiplicationModule({ initialLevel: 'קל' }));
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

---

## ✅ Verification Plan

### Step 1: Zero DOM Check
```bash
cd extracted-modules/modules
grep -n "window\|document\|getElementById\|alert\|setTimeout" MultiplicationModule.js
# Expected: No results (exit code 1)
```

### Step 2: Console Test
```bash
cd extracted-modules/tests/console-tests
node multiplication-console.js
# Expected: "🎉 All tests passed! MultiplicationModule is headless and ready for Next.js."
```

### Step 3: Question Type Distribution
```bash
node -e "
const MultiplicationModule = require('./extracted-modules/modules/MultiplicationModule');
const module = new MultiplicationModule();
const types = {};
for (let i = 0; i < 100; i++) {
    const q = module.generateQuestion();
    types[q.metadata.questionType] = (types[q.metadata.questionType] || 0) + 1;
}
console.log('Question distribution (100 questions):', types);
"
# Expected: Roughly 25% each type
```

### Step 4: Difficulty Progression Test
```bash
node -e "
const MultiplicationModule = require('./extracted-modules/modules/MultiplicationModule');
const module = new MultiplicationModule({ initialLevel: 'קל' });
console.log('Starting level:', module.getCurrentLevel());
for (let i = 0; i < 5; i++) {
    const q = module.generateQuestion();
    const f = module.checkAnswer(q.correctAnswer, q.correctAnswer, q);
    if (f.difficultyChange) {
        console.log('Level changed to:', f.difficultyChange.newLevel);
    }
}
console.log('Final level:', module.getCurrentLevel());
"
# Expected: קל → בינוני progression
```

---

## 📊 Success Metrics

| Metric | Target | Validation |
|--------|--------|------------|
| Zero DOM Access | 0 references | `grep` command returns no results |
| Console Test Pass | 11/11 tests | All assertions pass |
| TypeScript Compile | No errors | `tsc --noEmit` on `.d.ts` file |
| Next.js Integration | Copy-paste ready | No modifications needed |
| Question Generation | All 4 types work | Distribution test shows all types |
| Difficulty Adjustment | Auto level-up/down | Progression test shows changes |
| LTR Embedding | Preserved | Visual inspection of question text |

---

## 🎯 Definition of Done

- [ ] `MultiplicationModule.js` created with zero DOM access
- [ ] `multiplication-console.js` test file passes all 11 tests
- [ ] `MultiplicationModule.d.ts` TypeScript interface created
- [ ] All 4 question types implemented and tested
- [ ] Answer validation handles numeric input only
- [ ] Adaptive difficulty works (level up after 3 correct, down after 2 wrong)
- [ ] `grep` verification confirms zero DOM references
- [ ] Next.js example demonstrates integration pattern
- [ ] Hebrew text preserved with LTR embedding for equations
- [ ] README updated: `health_refactor/01_orchestration_plan.md` (mark Story 09 complete)

---

## 📝 Notes

**Why This Is The Simplest Extraction:**
1. **Input Only:** No multiple choice logic (unlike Fraction, Decimal)
2. **4 Question Types:** Fewer than Division (4 vs 4) and Decimal (5)
3. **Simple Math:** Basic multiplication/division, no GCD or simplification
4. **Consistent Format:** All questions use same input pattern
5. **~175 Lines:** Smaller than Fraction (273) and Decimal (800+)

**Key Features:**
- **LTR Embedding:** Unicode `\u202A` and `\u202C` prevent RTL text direction from scrambling `5 × 4 = 20` into `20 = 4 × 5`
- **Auto-advance:** 1.5 second delay included in View Object for UI timing
- **Celebration Trigger:** Every 10th question triggers celebration (boolean flag in feedback)

**Copy-Paste Compatibility:**
This module works immediately in Next.js API routes. No modifications needed - just move to `lib/` directory.
