# Story 06: Extract Division Module (Headless)

**Priority:** P1 (High - First Extraction, Establishes Pattern)
**Complexity:** High (7)
**Estimated Time:** 1-2 days
**Can Run in Parallel:** ❌ No (must complete Story 01 first)
**Dependencies:** Story 01 (Duplicate Registry Cleanup)

---

## 1. The Problem (Context)

### From Migration Strategy

**Current State:**
The Division module (`src/math/js/modules/division_module.js`) is **tightly coupled to the DOM**. It directly manipulates HTML elements, making it impossible to reuse in a Next.js/React application.

**Evidence of DOM Coupling:**
```javascript
// Line 85: Direct DOM access
const questionEl = document.getElementById('division-question');
const equationEl = document.getElementById('division-equation');

// Line 90: DOM manipulation
questionEl.textContent = question.question;
equationEl.textContent = question.equation;
equationEl.style.display = 'block';

// Line 99: More DOM access
const inputEl = document.getElementById('division-answer-input');
inputEl.style.display = 'inline-block';
inputEl.value = '';
inputEl.focus();

// Line 105: Event binding
inputEl.onkeypress = function(e) {
    if (e.key === 'Enter') {
        checkDivisionAnswer();
    }
};
```

**Why This Blocks Migration:**
- ❌ Cannot be imported into Next.js (no `document` in server components)
- ❌ Cannot be unit tested (requires browser DOM)
- ❌ Cannot run in Node.js console (`document` is undefined)
- ❌ Business logic (question generation) mixed with rendering (DOM manipulation)

**The Goal:**
Extract the **business logic** (question generation, answer validation, difficulty management) into a **Headless Class** that:
1. ✅ Has **zero DOM access** (no `window`, `document`, `getElementById`)
2. ✅ Returns **JSON View Objects** (data for rendering)
3. ✅ Can be **console-tested** (`node console-test-division.js`)
4. ✅ Is **copy-paste ready** for Next.js API routes

---

## 2. The Fix (Requirements)

### Objective
Create `extracted-modules/modules/DivisionModule.js` - a pure JavaScript class with zero DOM dependencies.

---

### Step-by-Step Instructions

#### Step 1: Create Directory Structure
```bash
mkdir -p extracted-modules/modules
mkdir -p extracted-modules/tests/console-tests
mkdir -p extracted-modules/examples
```

#### Step 2: Read Original Module
**Action:** Study the original file to understand business logic.

```bash
# Open and read
cat src/math/js/modules/division_module.js
```

**Identify:**
- ✅ Question types: `basicDivision`, `missingDividend`, `missingDivisor`, `wordProblem`
- ✅ Difficulty levels: `קל` (easy), `בינוני` (medium), `קשה` (hard)
- ✅ Difficulty configuration: `getDivisionRange()` function (lines 7-15)
- ✅ Question generation: `generateDivisionQuestion()` function (lines 1-114)
- ✅ Answer validation: `checkDivisionAnswer()` function (lines 115-161)
- ✅ Difficulty adjustment: `adjustDivisionDifficulty()` function (lines 162-172)

**Separate:**
- **Keep (Business Logic):** Math operations, random generation, difficulty configs, validation logic
- **Remove (DOM Coupling):** `document.getElementById()`, `.textContent =`, `.style.display =`, `.focus()`, etc.

#### Step 3: Create Headless Module Class

**Action:** Create `extracted-modules/modules/DivisionModule.js`

```javascript
/**
 * Division Module (Headless)
 *
 * Pure JavaScript class for division practice.
 * Zero DOM dependencies - returns JSON View Objects.
 *
 * Extracted from: src/math/js/modules/division_module.js
 * Date: 2025-11-20
 */

class DivisionModule {
    /**
     * Initialize division module
     * @param {object} config - Configuration options
     * @param {string} config.initialLevel - Starting difficulty ('קל' | 'בינוני' | 'קשה')
     * @param {object} config.statistics - Existing statistics (for session continuity)
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

        // Difficulty configuration (extracted from getDivisionRange)
        this.difficultyConfig = {
            'קל': {
                maxQuotient: 10,
                divisors: [2, 3, 4, 5]
            },
            'בינוני': {
                maxQuotient: 12,
                divisors: [2, 3, 4, 5, 6, 7, 8]
            },
            'קשה': {
                maxQuotient: 15,
                divisors: [2, 3, 4, 5, 6, 7, 8, 9, 10, 12]
            }
        };

        // Hebrew text resources (extracted from checkDivisionAnswer)
        this.hebrewText = {
            encouragements: {
                correct: ['מעולה!', 'פנטסטי!', 'את גאונית!', 'כל הכבוד!', 'מושלם!', 'יופי!'],
                wrong: ['לא נורא!', 'ננסה שוב!', 'כמעט!', 'אפשר ללמוד מטעויות!', 'בפעם הבאה!']
            },
            questionPrefixes: {
                basic: 'חשבי:',
                missing: 'מצאי את המספר החסר:'
            },
            wordProblems: [
                'לאמה יש {total} עוגיות. היא רוצה לחלק אותן שווה ב-{groups} קבוצות. כמה עוגיות בכל קבוצה?',
                'יש {total} תפוחים ו-{groups} סלים. כמה תפוחים יהיו בכל סל אם נחלק שווה?',
                'אמה קראה {total} עמודים ב-{groups} ימים, כל יום אותו מספר עמודים. כמה עמודים קראה כל יום?'
            ]
        };
    }

    /**
     * Generate a new division question
     * @param {string} level - Difficulty level ('קל' | 'בינוני' | 'קשה')
     * @returns {object} View Object with question data
     */
    generateQuestion(level = this.currentLevel) {
        const types = ['basicDivision', 'missingDividend', 'missingDivisor', 'wordProblem'];
        const type = types[Math.floor(Math.random() * types.length)];

        const range = this.difficultyConfig[level];
        let questionData;

        switch (type) {
            case 'basicDivision':
                questionData = this._generateBasicDivision(range);
                break;
            case 'missingDividend':
                questionData = this._generateMissingDividend(range);
                break;
            case 'missingDivisor':
                questionData = this._generateMissingDivisor(range);
                break;
            case 'wordProblem':
                questionData = this._generateWordProblem(range);
                break;
        }

        // Return View Object (JSON)
        return {
            type: 'question',
            module: 'division',
            timestamp: Date.now(),
            difficulty: level,

            questionText: questionData.questionText,
            equation: questionData.equation || null,
            showEquation: !!questionData.equation,

            questionType: 'input',  // All division questions use text input
            inputValue: '',
            inputPlaceholder: 'הכניסי תשובה',
            inputType: 'number',
            focus: true,
            showInput: true,

            correctAnswer: questionData.correctAnswer,
            metadata: questionData.metadata || {},

            showCheckButton: true,
            showNextButton: false,
            showHintButton: true,

            hint: questionData.hint || 'חשבי על לוח הכפל!',
            hintVisible: false
        };
    }

    /**
     * Validate user answer
     * @param {string|number} userAnswer - User's answer
     * @param {string|number} correctAnswer - Expected answer
     * @returns {object} View Object with feedback data
     */
    checkAnswer(userAnswer, correctAnswer) {
        // Validation logic
        const isCorrect = parseFloat(userAnswer) === parseFloat(correctAnswer);

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
        const difficultyChange = this._checkDifficultyAdjustment();

        // Return View Object (JSON)
        return {
            type: 'feedback',
            module: 'division',
            timestamp: Date.now(),

            isCorrect: isCorrect,
            userAnswer: userAnswer,
            correctAnswer: correctAnswer,

            feedbackType: isCorrect ? 'correct' : 'wrong',
            feedbackMessage: this._getFeedbackMessage(isCorrect),
            encouragement: this._getRandomEncouragement(isCorrect),
            feedbackIcon: isCorrect ? '✅' : '❌',

            explanation: isCorrect ? null : `התשובה הנכונה: ${correctAnswer}`,
            showExplanation: !isCorrect,
            hint: '💡 טיפ: חשבי על לוח הכפל!',

            showCheckButton: false,
            showNextButton: true,
            enableInput: false,

            statistics: {
                totalQuestions: this.statistics.totalQuestions,
                correctAnswers: this.statistics.correctAnswers,
                currentStreak: this.statistics.currentStreak,
                bestStreak: this.statistics.bestStreak,
                accuracy: Math.round((this.statistics.correctAnswers / this.statistics.totalQuestions) * 100),
                scoreDisplay: `${this.statistics.correctAnswers}/${this.statistics.totalQuestions}`
            },

            difficultyChange: difficultyChange,  // 'level_up', 'level_down', null
            newDifficulty: this.currentLevel,

            nextAction: isCorrect ? 'generate_next' : 'show_hint',
            autoAdvance: isCorrect,
            autoAdvanceDelay: 1500,

            showCelebration: this.statistics.totalQuestions % 10 === 0
        };
    }

    // ========================================================================
    // PRIVATE METHODS (Business Logic)
    // ========================================================================

    _generateBasicDivision(range) {
        const divisor = range.divisors[Math.floor(Math.random() * range.divisors.length)];
        const quotient = Math.floor(Math.random() * range.maxQuotient) + 1;
        const dividend = divisor * quotient;

        return {
            questionText: this.hebrewText.questionPrefixes.basic,
            equation: `${dividend} ÷ ${divisor} = ___`,
            correctAnswer: quotient,
            metadata: {
                dividend: dividend,
                divisor: divisor,
                quotient: quotient,
                questionType: 'basicDivision'
            },
            hint: `חשבי: ${divisor} × ? = ${dividend}`
        };
    }

    _generateMissingDividend(range) {
        const divisor = range.divisors[Math.floor(Math.random() * range.divisors.length)];
        const quotient = Math.floor(Math.random() * range.maxQuotient) + 1;
        const dividend = divisor * quotient;

        return {
            questionText: this.hebrewText.questionPrefixes.missing,
            equation: `___ ÷ ${divisor} = ${quotient}`,
            correctAnswer: dividend,
            metadata: {
                dividend: dividend,
                divisor: divisor,
                quotient: quotient,
                questionType: 'missingDividend'
            },
            hint: `חשבי: ${divisor} × ${quotient} = ?`
        };
    }

    _generateMissingDivisor(range) {
        const divisor = range.divisors[Math.floor(Math.random() * range.divisors.length)];
        const quotient = Math.floor(Math.random() * range.maxQuotient) + 1;
        const dividend = divisor * quotient;

        return {
            questionText: this.hebrewText.questionPrefixes.missing,
            equation: `${dividend} ÷ ___ = ${quotient}`,
            correctAnswer: divisor,
            metadata: {
                dividend: dividend,
                divisor: divisor,
                quotient: quotient,
                questionType: 'missingDivisor'
            },
            hint: `חשבי: ${dividend} ÷ ? = ${quotient}`
        };
    }

    _generateWordProblem(range) {
        const problemTemplate = this.hebrewText.wordProblems[
            Math.floor(Math.random() * this.hebrewText.wordProblems.length)
        ];

        const groups = range.divisors[Math.floor(Math.random() * range.divisors.length)];
        const perGroup = Math.floor(Math.random() * range.maxQuotient) + 1;
        const total = groups * perGroup;

        const questionText = problemTemplate
            .replace('{total}', total)
            .replace('{groups}', groups);

        return {
            questionText: questionText,
            equation: null,  // Word problems don't show equation
            correctAnswer: perGroup,
            metadata: {
                total: total,
                groups: groups,
                perGroup: perGroup,
                questionType: 'wordProblem'
            },
            hint: `חשבי: ${total} ÷ ${groups} = ?`
        };
    }

    _getFeedbackMessage(isCorrect) {
        const encouragement = this._getRandomEncouragement(isCorrect);

        if (isCorrect) {
            return `${encouragement} תשובה נכונה!`;
        } else {
            return `${encouragement}`;
        }
    }

    _getRandomEncouragement(isCorrect) {
        const pool = this.hebrewText.encouragements[isCorrect ? 'correct' : 'wrong'];
        return pool[Math.floor(Math.random() * pool.length)];
    }

    _checkDifficultyAdjustment() {
        // Level up after 3 consecutive correct
        if (this.statistics.consecutiveCorrect >= 3 && this.currentLevel !== 'קשה') {
            if (this.currentLevel === 'קל') {
                this.currentLevel = 'בינוני';
            } else if (this.currentLevel === 'בינוני') {
                this.currentLevel = 'קשה';
            }
            this.statistics.consecutiveCorrect = 0;
            return 'level_up';
        }

        // Level down after 2 consecutive wrong
        if (this.statistics.consecutiveWrong >= 2 && this.currentLevel !== 'קל') {
            if (this.currentLevel === 'קשה') {
                this.currentLevel = 'בינוני';
            } else if (this.currentLevel === 'בינוני') {
                this.currentLevel = 'קל';
            }
            this.statistics.consecutiveWrong = 0;
            return 'level_down';
        }

        return null;
    }

    /**
     * Get current statistics
     * @returns {object} Statistics object
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
     * Reset statistics (new session)
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
    module.exports = DivisionModule;
}

// Export for ES6 modules
if (typeof exports !== 'undefined') {
    exports.DivisionModule = DivisionModule;
}
```

#### Step 4: Create Console Test

**Action:** Create `extracted-modules/tests/console-tests/division-console.js`

```javascript
/**
 * Console Test for DivisionModule (Headless)
 * Run with: node extracted-modules/tests/console-tests/division-console.js
 */

const DivisionModule = require('../../modules/DivisionModule');

console.log('🧪 Testing DivisionModule (Headless - Zero DOM Access)\n');
console.log('=' + '='.repeat(60) + '\n');

// Initialize module
const module = new DivisionModule({
    initialLevel: 'קל'
});

console.log('✅ Module initialized');
console.log(`   Initial level: ${module.getCurrentLevel()}\n`);

// Test 1: Generate question (Easy)
console.log('Test 1: Generate Question (Easy Level)');
console.log('-'.repeat(60));
const questionEasy = module.generateQuestion('קל');
console.log(JSON.stringify(questionEasy, null, 2));
console.assert(questionEasy.questionText, '❌ Should have questionText');
console.assert(questionEasy.correctAnswer !== undefined, '❌ Should have correctAnswer');
console.assert(questionEasy.type === 'question', '❌ Type should be "question"');
console.log('✅ Easy question generated\n');

// Test 2: Check correct answer
console.log('Test 2: Check Correct Answer');
console.log('-'.repeat(60));
const feedback1 = module.checkAnswer(questionEasy.correctAnswer, questionEasy.correctAnswer);
console.log(JSON.stringify(feedback1, null, 2));
console.assert(feedback1.isCorrect === true, '❌ Should be correct');
console.assert(feedback1.feedbackType === 'correct', '❌ Feedback type should be "correct"');
console.assert(feedback1.statistics.totalQuestions === 1, '❌ Total questions should be 1');
console.log('✅ Correct answer validated\n');

// Test 3: Check wrong answer
console.log('Test 3: Check Wrong Answer');
console.log('-'.repeat(60));
const questionEasy2 = module.generateQuestion('קל');
const feedback2 = module.checkAnswer(999, questionEasy2.correctAnswer);
console.log(JSON.stringify(feedback2, null, 2));
console.assert(feedback2.isCorrect === false, '❌ Should be incorrect');
console.assert(feedback2.feedbackType === 'wrong', '❌ Feedback type should be "wrong"');
console.assert(feedback2.showExplanation === true, '❌ Should show explanation');
console.log('✅ Wrong answer validated\n');

// Test 4: Generate question (Hard level)
console.log('Test 4: Generate Question (Hard Level)');
console.log('-'.repeat(60));
const questionHard = module.generateQuestion('קשה');
console.log(JSON.stringify(questionHard, null, 2));
console.assert(questionHard.difficulty === 'קשה', '❌ Difficulty should be קשה');
console.log('✅ Hard question generated\n');

// Test 5: Difficulty adjustment (level up)
console.log('Test 5: Difficulty Adjustment (Level Up)');
console.log('-'.repeat(60));
module.resetStatistics();
module.currentLevel = 'קל';

// Answer 3 questions correctly (should level up)
for (let i = 0; i < 3; i++) {
    const q = module.generateQuestion();
    module.checkAnswer(q.correctAnswer, q.correctAnswer);
}

const stats = module.getStatistics();
console.log('Statistics after 3 correct:', JSON.stringify(stats, null, 2));
console.log('Current level:', module.getCurrentLevel());
console.assert(module.getCurrentLevel() === 'בינוני', '❌ Should have leveled up to בינוני');
console.log('✅ Level up works\n');

// Test 6: Verify JSON output (no DOM references)
console.log('Test 6: Verify Zero DOM Access');
console.log('-'.repeat(60));
const q = module.generateQuestion();
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
```

#### Step 5: Create TypeScript Interface

**Action:** Create `extracted-modules/modules/DivisionModule.d.ts`

```typescript
/**
 * TypeScript interface for DivisionModule
 * Use in Next.js for type safety
 */

export interface DivisionModuleConfig {
    initialLevel?: 'קל' | 'בינוני' | 'קשה';
    statistics?: ModuleStatistics;
}

export interface ModuleStatistics {
    totalQuestions: number;
    correctAnswers: number;
    currentStreak: number;
    bestStreak: number;
    consecutiveCorrect: number;
    consecutiveWrong: number;
}

export interface QuestionViewObject {
    type: 'question';
    module: 'division';
    timestamp: number;
    difficulty: 'קל' | 'בינוני' | 'קשה';

    questionText: string;
    equation: string | null;
    showEquation: boolean;

    questionType: 'input';
    inputValue: string;
    inputPlaceholder: string;
    inputType: 'number';
    focus: boolean;
    showInput: boolean;

    correctAnswer: number;
    metadata: {
        dividend?: number;
        divisor?: number;
        quotient?: number;
        total?: number;
        groups?: number;
        perGroup?: number;
        questionType: 'basicDivision' | 'missingDividend' | 'missingDivisor' | 'wordProblem';
    };

    showCheckButton: boolean;
    showNextButton: boolean;
    showHintButton: boolean;

    hint: string;
    hintVisible: boolean;
}

export interface FeedbackViewObject {
    type: 'feedback';
    module: 'division';
    timestamp: number;

    isCorrect: boolean;
    userAnswer: number | string;
    correctAnswer: number | string;

    feedbackType: 'correct' | 'wrong';
    feedbackMessage: string;
    encouragement: string;
    feedbackIcon: '✅' | '❌';

    explanation: string | null;
    showExplanation: boolean;
    hint: string;

    showCheckButton: boolean;
    showNextButton: boolean;
    enableInput: boolean;

    statistics: {
        totalQuestions: number;
        correctAnswers: number;
        currentStreak: number;
        bestStreak: number;
        accuracy: number;
        scoreDisplay: string;
    };

    difficultyChange: 'level_up' | 'level_down' | null;
    newDifficulty: 'קל' | 'בינוני' | 'קשה';

    nextAction: 'generate_next' | 'show_hint';
    autoAdvance: boolean;
    autoAdvanceDelay: number;

    showCelebration: boolean;
}

export class DivisionModule {
    constructor(config?: DivisionModuleConfig);

    generateQuestion(level?: 'קל' | 'בינוני' | 'קשה'): QuestionViewObject;
    checkAnswer(userAnswer: number | string, correctAnswer: number | string): FeedbackViewObject;
    getStatistics(): ModuleStatistics;
    getCurrentLevel(): 'קל' | 'בינוני' | 'קשה';
    resetStatistics(): void;
}
```

#### Step 6: Create Next.js Integration Example

**Action:** Create `extracted-modules/examples/api-route-division.ts`

```typescript
// Example Next.js API Route
// File: app/api/math/division/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { DivisionModule } from '@/lib/modules/DivisionModule';
import type { QuestionViewObject, FeedbackViewObject } from '@/lib/modules/DivisionModule';

export async function POST(request: NextRequest) {
    try {
        const { action, level, userAnswer, correctAnswer, sessionData } = await request.json();

        // Initialize module with session data
        const module = new DivisionModule({
            initialLevel: sessionData?.level || 'קל',
            statistics: sessionData?.statistics
        });

        // Handle different actions
        switch (action) {
            case 'generate': {
                const question: QuestionViewObject = module.generateQuestion(level);
                return NextResponse.json({
                    success: true,
                    data: question,
                    session: {
                        level: module.getCurrentLevel(),
                        statistics: module.getStatistics()
                    }
                });
            }

            case 'check': {
                const feedback: FeedbackViewObject = module.checkAnswer(userAnswer, correctAnswer);
                return NextResponse.json({
                    success: true,
                    data: feedback,
                    session: {
                        level: module.getCurrentLevel(),
                        statistics: module.getStatistics()
                    }
                });
            }

            default:
                return NextResponse.json(
                    { success: false, error: 'Invalid action' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Division API error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
```

---

## 3. Target Files

### Files to Create
- ✏️ `extracted-modules/modules/DivisionModule.js` (headless class)
- ✏️ `extracted-modules/tests/console-tests/division-console.js` (Node.js test)
- ✏️ `extracted-modules/modules/DivisionModule.d.ts` (TypeScript interface)
- ✏️ `extracted-modules/examples/api-route-division.ts` (Next.js integration example)

### Files to Keep (No Changes)
- ✅ `src/math/js/modules/division_module.js` (original, unchanged for now)
- ✅ All other files (zero changes to legacy app)

---

## 4. Verification Plan

### Step 1: Zero DOM Access Check
```bash
# Search for DOM references (must return zero matches)
grep -n "window\." extracted-modules/modules/DivisionModule.js
grep -n "document\." extracted-modules/modules/DivisionModule.js
grep -n "getElementById" extracted-modules/modules/DivisionModule.js
grep -n "querySelector" extracted-modules/modules/DivisionModule.js
grep -n "innerHTML" extracted-modules/modules/DivisionModule.js
grep -n "textContent" extracted-modules/modules/DivisionModule.js
grep -n "addEventListener" extracted-modules/modules/DivisionModule.js

# All should return: (no matches)
```

### Step 2: Console Test (Critical)
```bash
# Run console test (NO BROWSER REQUIRED)
node extracted-modules/tests/console-tests/division-console.js
```

**Expected Output:**
```
🧪 Testing DivisionModule (Headless - Zero DOM Access)

==============================================================

✅ Module initialized
   Initial level: קל

Test 1: Generate Question (Easy Level)
------------------------------------------------------------
{
  "type": "question",
  "module": "division",
  "timestamp": 1700000000000,
  "difficulty": "קל",
  "questionText": "חשבי:",
  "equation": "12 ÷ 4 = ___",
  "showEquation": true,
  ...
}
✅ Easy question generated

Test 2: Check Correct Answer
------------------------------------------------------------
{
  "type": "feedback",
  "module": "division",
  "isCorrect": true,
  ...
}
✅ Correct answer validated

Test 3: Check Wrong Answer
------------------------------------------------------------
{
  "type": "feedback",
  "isCorrect": false,
  "showExplanation": true,
  ...
}
✅ Wrong answer validated

Test 4: Generate Question (Hard Level)
------------------------------------------------------------
✅ Hard question generated

Test 5: Difficulty Adjustment (Level Up)
------------------------------------------------------------
✅ Level up works

Test 6: Verify Zero DOM Access
------------------------------------------------------------
✅ Zero DOM references confirmed

==============================================================
✅ ALL TESTS PASSED!
   Module is headless (zero DOM access)
   Module can run in Node.js (no browser required)
   Module is ready for Next.js integration
==============================================================
```

### Step 3: Business Logic Preservation
**Verify same question generation as original:**

```bash
# Test in original app
# 1. Open src/math/Emma_math_lab.html in browser
# 2. Navigate to Division module
# 3. Generate 5 questions, note the types and structure

# Test in extracted module
node -e "
const DivisionModule = require('./extracted-modules/modules/DivisionModule');
const module = new DivisionModule();
for (let i = 0; i < 5; i++) {
    const q = module.generateQuestion('קל');
    console.log('Question type:', q.metadata.questionType, '| Answer:', q.correctAnswer);
}
"
```

**Expected:** Same question types, same difficulty ranges, same logic

### Step 4: TypeScript Interface Check
```bash
# Verify TypeScript file syntax
npx tsc --noEmit extracted-modules/modules/DivisionModule.d.ts

# Should complete with no errors
```

### Step 5: Integration Readiness
**Test copy-paste into Next.js:**

```bash
# Simulate Next.js environment
node -e "
// Simulate API route
const DivisionModule = require('./extracted-modules/modules/DivisionModule');

async function handler(request) {
    const { action, level } = request;
    const module = new DivisionModule();

    if (action === 'generate') {
        return module.generateQuestion(level);
    }
}

// Test request
const response = handler({ action: 'generate', level: 'קל' });
console.log('API Response:', JSON.stringify(response, null, 2));
"
```

**Expected:** Clean JSON output, no errors

---

## 5. PR Description Template

```markdown
## Story 06: Extract Division Module (Headless)

### Problem
The Division module was tightly coupled to the DOM, making it impossible to reuse in Next.js:
- Direct DOM manipulation (`document.getElementById`, `.textContent`, etc.)
- Cannot be unit tested (requires browser)
- Cannot run in Node.js console
- Business logic mixed with rendering

### Solution
Extracted business logic into **pure JavaScript class** (DivisionModule) with:
- ✅ **Zero DOM access** (no `window`, `document`, `getElementById`)
- ✅ **JSON View Objects** (returns data for rendering)
- ✅ **Console-testable** (runs in Node.js without browser)
- ✅ **Copy-paste ready** for Next.js API routes

### Changes
**Created:**
- `extracted-modules/modules/DivisionModule.js` (190 lines, headless)
- `extracted-modules/tests/console-tests/division-console.js` (Node.js test)
- `extracted-modules/modules/DivisionModule.d.ts` (TypeScript interface)
- `extracted-modules/examples/api-route-division.ts` (Next.js integration example)

**Unchanged:**
- `src/math/js/modules/division_module.js` (original preserved)

### Verification

#### ✅ Zero DOM Access
```bash
$ grep -n "document\|window\|getElementById" extracted-modules/modules/DivisionModule.js
(no matches)
```

#### ✅ Console Test Passes
```bash
$ node extracted-modules/tests/console-tests/division-console.js
✅ ALL TESTS PASSED!
   Module is headless (zero DOM access)
   Module can run in Node.js (no browser required)
   Module is ready for Next.js integration
```

#### ✅ Business Logic Preserved
- Same question types (basicDivision, missingDividend, missingDivisor, wordProblem)
- Same difficulty configuration (קל, בינוני, קשה)
- Same validation logic
- Same difficulty adjustment (3 correct = level up, 2 wrong = level down)

#### ✅ TypeScript Interface
- All View Objects typed
- Next.js team can use with full type safety

#### ✅ Integration Example
- Sample API route provided
- Copy-paste ready for Next.js

### View Object Examples

**Question:**
```json
{
  "type": "question",
  "module": "division",
  "questionText": "חשבי:",
  "equation": "12 ÷ 4 = ___",
  "questionType": "input",
  "correctAnswer": 3,
  "showCheckButton": true
}
```

**Feedback:**
```json
{
  "type": "feedback",
  "isCorrect": true,
  "feedbackMessage": "מעולה! תשובה נכונה!",
  "statistics": {
    "totalQuestions": 10,
    "correctAnswers": 8,
    "accuracy": 80
  },
  "autoAdvance": true
}
```

### Impact
- ✅ **Reusable:** Can be used in Next.js, Vue, Angular, CLI, etc.
- ✅ **Testable:** Unit tests without browser (Jest, Mocha, etc.)
- ✅ **Maintainable:** Business logic separate from UI
- ✅ **Type-safe:** TypeScript interfaces provided
- ✅ **Framework-agnostic:** No React, no DOM, pure logic

### Next Steps
- Integrate into Next.js API route (`app/api/math/division/route.ts`)
- Build React component to consume JSON View Objects
- Repeat extraction pattern for remaining 6 modules

### References
- **Migration Strategy:** `health_refactor/00_global_context.md`
- **DOM-to-JSON Mapping:** `health_refactor/MIGRATION_BRIDGE.md`
- **Orchestration Plan:** `health_refactor/01_orchestration_plan.md` (Story 06)

---

**Type:** `extract`
**Scope:** `division`
**Complexity:** High (7)
**Risk:** Low (original file preserved)

Closes: Story 06
```

---

## 6. Success Criteria

### Definition of Done
- [x] **Zero DOM access** - grep confirms no `window`, `document`, `getElementById`
- [x] **Console test passes** - `node console-test-division.js` shows "✅ ALL TESTS PASSED!"
- [x] **View Object schema documented** - TypeScript interface complete
- [x] **Copy-paste ready** - Can be used in Next.js without changes
- [x] **Business logic preserved** - Same questions, validation, difficulty
- [x] **Integration example provided** - Sample Next.js API route
- [x] **No regressions** - Original file unchanged, legacy app still works
- [x] **PR description uses template**

### Conventional Commit Message
```
extract(division): create headless DivisionModule class

Extracted division logic from division_module.js into pure
JavaScript class with zero DOM access. Returns JSON View Objects
for question generation and answer validation.

Created files:
- DivisionModule.js (headless, 190 lines)
- division-console.js (Node.js test, passes)
- DivisionModule.d.ts (TypeScript interface)
- api-route-division.ts (Next.js integration example)

Console test: ✅ All tests passed
DOM references: ✅ Zero (confirmed via grep)
Business logic: ✅ Preserved (same questions, validation, difficulty)
Integration: ✅ Ready for Next.js (copy-paste ready)

Fixes: Story 06
```

---

## 7. Notes for AI Agent

### This Is the Pattern Story
Story 06 (Division) establishes the extraction pattern for all future modules. Pay close attention to:
- How DOM operations map to JSON properties
- How state management is separated from rendering
- How Hebrew text is preserved
- How business logic is extracted without modification

**All subsequent extractions (Stories 07-12) will follow this pattern.**

### Critical Checks
- ⚠️ **Preserve Hebrew text** - Do not corrupt Hebrew characters (מבנה, חילוק, etc.)
- ⚠️ **Preserve business logic** - Same questions, same difficulty, same validation
- ⚠️ **No DOM access** - Zero tolerance for `window`, `document`, etc.
- ⚠️ **Console test must pass** - This is the ultimate proof of headless extraction

### Success Indicators
- ✅ `node console-test-division.js` prints "✅ ALL TESTS PASSED!"
- ✅ `grep "document" DivisionModule.js` returns zero matches
- ✅ JSON output is valid (can be parsed by `JSON.parse()`)
- ✅ Hebrew text displays correctly in console

### Common Pitfalls
- ❌ **Don't delete original file** - Keep `division_module.js` unchanged
- ❌ **Don't mix concerns** - No rendering logic in business logic class
- ❌ **Don't hardcode UI** - No HTML strings in JSON (use semantic properties)
- ❌ **Don't lose Hebrew** - Ensure UTF-8 encoding preserved

### If Something Goes Wrong
- Check that all DOM operations have been mapped to JSON properties
- Verify Hebrew text encoding (should be UTF-8)
- Test with `node console-test.js` immediately (don't wait for browser testing)
- Compare output JSON to original DOM structure for correctness

---

**Story Status:** Ready for Implementation
**Estimated Time:** 1-2 days
**Next Story:** Story 07 (Extract Decimal - Uses this pattern)
**Pattern Established:** All future extractions follow this template
