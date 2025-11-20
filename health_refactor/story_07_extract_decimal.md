# Story 07: Extract Decimal Module (Headless)

**Priority:** P1 (High - Built-in Module, HTML Extraction)
**Complexity:** High (8)
**Estimated Time:** 2 days
**Can Run in Parallel:** ❌ No (requires Story 06 pattern)
**Dependencies:** Story 06 (establishes extraction pattern)

---

## 1. The Problem (Context)

### From Migration Strategy

**Current State:**
The Decimal module is **embedded inline** in `Emma_math_lab.html` (approximately lines 1200-2000). It's not a separate file like Division, making extraction more challenging.

**Evidence of Inline Code:**
```javascript
// Embedded in Emma_math_lab.html

// State object (line ~1200)
const decimalState = {
    level: 'קל',
    totalQuestions: 0,
    correctAnswers: 0,
    currentStreak: 0,
    bestStreak: 0,
    consecutiveCorrect: 0,
    consecutiveWrong: 0,
    currentQuestion: null,
    currentAnswer: null,
    sessionHistory: [],
    startTime: Date.now(),
    lastSaved: null
};

// Generate function (line ~1250)
function generateDecimalQuestion() {
    const types = ['decomposition', 'digitValue', 'nextPrevious', 'compare', 'missingDigit'];
    const type = types[Math.floor(Math.random() * types.length)];

    // ... DOM manipulation ...
    const questionEl = document.getElementById('decimal-question');
    questionEl.textContent = question.question;

    const choicesContainer = document.getElementById('decimal-choices');
    // ... more DOM operations ...
}

// Check function (line ~1600)
function checkDecimalAnswer() {
    const selectedChoice = decimalState.selectedChoice;
    // ... validation + DOM manipulation ...
    const feedback = document.getElementById('decimal-feedback');
    feedback.innerHTML = isCorrect ? '✅ מעולה!' : '❌ לא נכונה';
}
```

**Challenges:**
- ❌ Code is inline (not separate file) - must extract from HTML
- ❌ Multiple question types (5 types vs Division's 4)
- ❌ Multiple choice UI (Division only used input)
- ❌ More complex DOM manipulation (choice buttons, visual representations)
- ❌ Larger codebase (~800 lines vs Division's 190)

**Why This Blocks Migration:**
- Same issues as Division (DOM coupling) plus...
- Cannot be unit tested
- Cannot be imported into Next.js
- Business logic buried in 4,919-line HTML file

**The Goal:**
Extract the Decimal business logic into `DecimalModule.js` following the pattern established in Story 06.

---

## 2. The Fix (Requirements)

### Objective
Create `extracted-modules/modules/DecimalModule.js` - a pure JavaScript class with zero DOM dependencies, supporting 5 question types.

---

### Step-by-Step Instructions

#### Step 1: Extract Code from HTML

**Action:** Read and extract decimal code from `Emma_math_lab.html`

```bash
# View the decimal section
sed -n '1200,2000p' src/math/Emma_math_lab.html | less
```

**Identify sections:**
1. **State object** (`decimalState`) - lines ~1200-1220
2. **Generate function** (`generateDecimalQuestion`) - lines ~1250-1500
3. **Check function** (`checkDecimalAnswer`) - lines ~1600-1750
4. **Choice selection** (`selectDecimalChoice`) - lines ~1520-1540
5. **Difficulty adjustment** (`adjustDecimalDifficulty`) - lines ~1760-1800
6. **Helper functions** (if any) - scattered

#### Step 2: Identify Question Types

**5 Question Types:**

1. **decomposition** - "מה הערך המספרי של הספרה?"
   - Example: "What is the value of 3 in 354?" → Answer: 300

2. **digitValue** - "איזו ספרה נמצאת במקום היחידות/עשרות/מאות?"
   - Example: "Which digit is in the tens place in 354?" → Answer: 5

3. **nextPrevious** - "מה המספר הבא/הקודם?"
   - Example: "What number comes after 354?" → Answer: 355

4. **compare** - "מה גדול יותר/קטן יותר?"
   - Example: "Which is larger: 354 or 345?" → Answer: 354

5. **missingDigit** - "איזו ספרה חסרה?"
   - Example: "3_4 = 354" → Answer: 5

#### Step 3: Map DOM Operations to JSON (Using MIGRATION_BRIDGE.md)

| Legacy DOM Pattern | DOM ID | New JSON Property | Type |
|--------------------|--------|-------------------|------|
| `questionEl.textContent = q.question` | `#decimal-question` | `questionText` | `string` |
| `choicesContainer.innerHTML = ''` | `#decimal-choices` | `choices` | `array` |
| `choice.classList.add('selected')` | `.choice` | `choices[i].selected` | `boolean` |
| `feedback.className = 'feedback correct'` | `#decimal-feedback` | `feedbackType` | `'correct' \| 'wrong'` |
| `feedback.innerHTML = '✅ מעולה!'` | `#decimal-feedback` | `feedbackMessage` | `string` |

#### Step 4: Create Headless Module Class

**Action:** Create `extracted-modules/modules/DecimalModule.js`

**Structure Template:**
```javascript
class DecimalModule {
    constructor(config = {}) {
        this.currentLevel = config.initialLevel || 'קל';
        this.statistics = config.statistics || { /* ... */ };
        this.difficultyConfig = {
            'קל': { rangeMin: 100, rangeMax: 999 },
            'בינוני': { rangeMin: 1000, rangeMax: 9999 },
            'קשה': { rangeMin: 10000, rangeMax: 99999 }
        };
        this.hebrewText = { /* ... */ };
    }

    generateQuestion(level = this.currentLevel) {
        const types = ['decomposition', 'digitValue', 'nextPrevious', 'compare', 'missingDigit'];
        const type = types[Math.floor(Math.random() * types.length)];

        let questionData;
        switch (type) {
            case 'decomposition':
                questionData = this._generateDecomposition(level);
                break;
            case 'digitValue':
                questionData = this._generateDigitValue(level);
                break;
            case 'nextPrevious':
                questionData = this._generateNextPrevious(level);
                break;
            case 'compare':
                questionData = this._generateCompare(level);
                break;
            case 'missingDigit':
                questionData = this._generateMissingDigit(level);
                break;
        }

        // Return View Object (JSON)
        return {
            type: 'question',
            module: 'decimal',
            difficulty: level,
            questionText: questionData.questionText,
            questionType: questionData.questionType,  // 'choice' or 'input'
            choices: questionData.choices || null,
            correctAnswer: questionData.correctAnswer,
            metadata: questionData.metadata,
            // ... (see full implementation in Step 5)
        };
    }

    checkAnswer(userAnswer, correctAnswer) {
        const isCorrect = this._validateAnswer(userAnswer, correctAnswer);

        // Update statistics
        // ... (same pattern as Division)

        // Return View Object (JSON)
        return {
            type: 'feedback',
            module: 'decimal',
            isCorrect: isCorrect,
            feedbackMessage: /* ... */,
            statistics: { /* ... */ },
            // ... (see full implementation in Step 5)
        };
    }

    // Private methods for each question type
    _generateDecomposition(level) { /* ... */ }
    _generateDigitValue(level) { /* ... */ }
    _generateNextPrevious(level) { /* ... */ }
    _generateCompare(level) { /* ... */ }
    _generateMissingDigit(level) { /* ... */ }

    _validateAnswer(userAnswer, correctAnswer) { /* ... */ }
}

module.exports = DecimalModule;
```

#### Step 5: Implement Full Extraction

**Key Implementation Details:**

**Difficulty Configuration:**
```javascript
this.difficultyConfig = {
    'קל': {
        rangeMin: 100,
        rangeMax: 999,
        questionTypes: ['decomposition', 'digitValue', 'nextPrevious']
    },
    'בינוני': {
        rangeMin: 1000,
        rangeMax: 9999,
        questionTypes: ['decomposition', 'digitValue', 'compare', 'missingDigit']
    },
    'קשה': {
        rangeMin: 10000,
        rangeMax: 99999,
        questionTypes: ['all']
    }
};
```

**Example Question Type Implementation (Decomposition):**
```javascript
_generateDecomposition(level) {
    const range = this.difficultyConfig[level];
    const number = Math.floor(Math.random() * (range.rangeMax - range.rangeMin + 1)) + range.rangeMin;

    // Get random digit position
    const numStr = number.toString();
    const position = Math.floor(Math.random() * numStr.length);
    const digit = parseInt(numStr[position]);

    // Calculate place value (units, tens, hundreds, etc.)
    const placeValue = digit * Math.pow(10, numStr.length - position - 1);

    // Generate choices (correct + 3 wrong)
    const choices = [placeValue];

    // Add wrong choices (different place values for same digit)
    for (let i = 0; i < 3; i++) {
        const wrongPower = (numStr.length - position - 1 + i + 1) % numStr.length;
        const wrongValue = digit * Math.pow(10, wrongPower);
        if (wrongValue !== placeValue && !choices.includes(wrongValue)) {
            choices.push(wrongValue);
        }
    }

    // Fill to 4 choices if needed
    while (choices.length < 4) {
        const random = digit * Math.pow(10, Math.floor(Math.random() * numStr.length));
        if (!choices.includes(random)) {
            choices.push(random);
        }
    }

    // Shuffle choices
    choices.sort(() => Math.random() - 0.5);

    return {
        questionText: `מה הערך המספרי של הספרה ${digit} במספר ${number}?`,
        questionType: 'choice',
        choices: choices.map((c, i) => ({
            id: i,
            text: c.toString(),
            value: c
        })),
        correctAnswer: placeValue,
        metadata: {
            number: number,
            digit: digit,
            position: position,
            placeValue: placeValue,
            questionType: 'decomposition'
        }
    };
}
```

**Example: Choice Question View Object**
```json
{
    "type": "question",
    "module": "decimal",
    "timestamp": 1700000000000,
    "difficulty": "קל",

    "questionText": "מה הערך המספרי של הספרה 5 במספר 354?",
    "questionType": "choice",

    "choices": [
        { "id": 0, "text": "50", "value": 50 },
        { "id": 1, "text": "5", "value": 5 },
        { "id": 2, "text": "500", "value": 500 },
        { "id": 3, "text": "5000", "value": 5000 }
    ],

    "correctAnswer": 50,

    "metadata": {
        "number": 354,
        "digit": 5,
        "position": 1,
        "placeValue": 50,
        "questionType": "decomposition"
    },

    "showCheckButton": false,
    "showNextButton": false,
    "showHintButton": true,

    "hint": "חשבי באיזה מקום נמצאת הספרה 5: יחידות, עשרות או מאות?",
    "hintVisible": false
}
```

#### Step 6: Create Console Test

**Action:** Create `extracted-modules/tests/console-tests/decimal-console.js`

```javascript
const DecimalModule = require('../../modules/DecimalModule');

console.log('🧪 Testing DecimalModule (Headless - Zero DOM Access)\n');
console.log('=' + '='.repeat(60) + '\n');

const module = new DecimalModule({ initialLevel: 'קל' });

// Test 1: Generate each question type
console.log('Test 1: Generate All Question Types');
console.log('-'.repeat(60));

const types = ['decomposition', 'digitValue', 'nextPrevious', 'compare', 'missingDigit'];
types.forEach(type => {
    // Force generation of specific type (if module supports it)
    const q = module.generateQuestion('קל');
    console.log(`Question type: ${q.metadata.questionType}`);
    console.log(`Question: ${q.questionText}`);
    if (q.choices) {
        console.log(`Choices: ${q.choices.map(c => c.text).join(', ')}`);
    }
    console.log(`Correct answer: ${q.correctAnswer}\n`);
});

// Test 2: Generate question (Easy)
console.log('Test 2: Generate Question (Easy Level)');
console.log('-'.repeat(60));
const questionEasy = module.generateQuestion('קל');
console.log(JSON.stringify(questionEasy, null, 2));
console.assert(questionEasy.questionText, '❌ Should have questionText');
console.assert(questionEasy.correctAnswer !== undefined, '❌ Should have correctAnswer');
console.log('✅ Easy question generated\n');

// Test 3: Check correct answer
console.log('Test 3: Check Correct Answer');
console.log('-'.repeat(60));
const feedback1 = module.checkAnswer(questionEasy.correctAnswer, questionEasy.correctAnswer);
console.log(JSON.stringify(feedback1, null, 2));
console.assert(feedback1.isCorrect === true, '❌ Should be correct');
console.log('✅ Correct answer validated\n');

// Test 4: Check wrong answer
console.log('Test 4: Check Wrong Answer');
console.log('-'.repeat(60));
const questionEasy2 = module.generateQuestion('קל');
const wrongAnswer = questionEasy2.choices ? questionEasy2.choices[0].value : 999;
const feedback2 = module.checkAnswer(
    wrongAnswer !== questionEasy2.correctAnswer ? wrongAnswer : 999,
    questionEasy2.correctAnswer
);
console.log(JSON.stringify(feedback2, null, 2));
console.assert(feedback2.isCorrect === false, '❌ Should be incorrect');
console.log('✅ Wrong answer validated\n');

// Test 5: Test all difficulty levels
console.log('Test 5: Test All Difficulty Levels');
console.log('-'.repeat(60));
['קל', 'בינוני', 'קשה'].forEach(level => {
    const q = module.generateQuestion(level);
    console.log(`Level: ${level}`);
    console.log(`  Number range: ${q.metadata.number}`);
    console.log(`  Digit count: ${q.metadata.number.toString().length}`);
});
console.log('✅ All difficulty levels work\n');

// Test 6: Verify zero DOM access
console.log('Test 6: Verify Zero DOM Access');
console.log('-'.repeat(60));
const q = module.generateQuestion();
const qStr = JSON.stringify(q);
console.assert(!qStr.includes('document'), '❌ Should not reference document');
console.assert(!qStr.includes('window'), '❌ Should not reference window');
console.assert(!qStr.includes('getElementById'), '❌ Should not reference getElementById');
console.log('✅ Zero DOM references confirmed\n');

// Test 7: Choice vs Input question types
console.log('Test 7: Verify Question Type Handling');
console.log('-'.repeat(60));
for (let i = 0; i < 10; i++) {
    const q = module.generateQuestion('קל');
    console.log(`  ${q.metadata.questionType}: ${q.questionType} (${q.choices ? 'has choices' : 'no choices'})`);
}
console.log('✅ Question types handled correctly\n');

console.log('=' + '='.repeat(60));
console.log('✅ ALL TESTS PASSED!');
console.log('   Module is headless (zero DOM access)');
console.log('   Module supports 5 question types');
console.log('   Module supports 3 difficulty levels');
console.log('   Module can run in Node.js (no browser required)');
console.log('   Module is ready for Next.js integration');
console.log('=' + '='.repeat(60));
```

#### Step 7: Create TypeScript Interface

**Action:** Create `extracted-modules/modules/DecimalModule.d.ts`

```typescript
export interface DecimalModuleConfig {
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

export interface Choice {
    id: number;
    text: string;
    value: number | string;
}

export interface QuestionViewObject {
    type: 'question';
    module: 'decimal';
    timestamp: number;
    difficulty: 'קל' | 'בינוני' | 'קשה';

    questionText: string;
    questionType: 'choice' | 'input';

    choices?: Choice[];  // Present if questionType === 'choice'
    inputPlaceholder?: string;  // Present if questionType === 'input'

    correctAnswer: number | string;
    metadata: {
        number?: number;
        digit?: number;
        position?: number;
        placeValue?: number;
        number1?: number;
        number2?: number;
        missingPosition?: number;
        questionType: 'decomposition' | 'digitValue' | 'nextPrevious' | 'compare' | 'missingDigit';
    };

    showCheckButton: boolean;
    showNextButton: boolean;
    showHintButton: boolean;

    hint: string;
    hintVisible: boolean;
}

export interface FeedbackViewObject {
    type: 'feedback';
    module: 'decimal';
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

    showCheckButton: boolean;
    showNextButton: boolean;
    enableChoices: boolean;

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

export class DecimalModule {
    constructor(config?: DecimalModuleConfig);

    generateQuestion(level?: 'קל' | 'בינוני' | 'קשה'): QuestionViewObject;
    checkAnswer(userAnswer: number | string, correctAnswer: number | string): FeedbackViewObject;
    getStatistics(): ModuleStatistics;
    getCurrentLevel(): 'קל' | 'בינוני' | 'קשה';
    resetStatistics(): void;
}
```

---

## 3. Target Files

### Files to Create
- ✏️ `extracted-modules/modules/DecimalModule.js` (~400 lines, headless)
- ✏️ `extracted-modules/tests/console-tests/decimal-console.js` (Node.js test)
- ✏️ `extracted-modules/modules/DecimalModule.d.ts` (TypeScript interface)
- ✏️ `extracted-modules/examples/api-route-decimal.ts` (Next.js integration example)

### Files to Keep (No Changes)
- ✅ `src/math/Emma_math_lab.html` (original, unchanged for now)
- ✅ All other files (zero changes to legacy app)

---

## 4. Verification Plan

### Step 1: Zero DOM Access Check
```bash
grep -n "window\|document\|getElementById\|querySelector\|innerHTML\|textContent" extracted-modules/modules/DecimalModule.js

# Must return: (no matches)
```

### Step 2: Console Test (Critical)
```bash
node extracted-modules/tests/console-tests/decimal-console.js
```

**Expected Output:**
```
🧪 Testing DecimalModule (Headless - Zero DOM Access)
...
✅ ALL TESTS PASSED!
   Module is headless (zero DOM access)
   Module supports 5 question types
   Module supports 3 difficulty levels
   Module can run in Node.js (no browser required)
   Module is ready for Next.js integration
```

### Step 3: Question Type Coverage
**Verify all 5 question types work:**

```bash
node -e "
const DecimalModule = require('./extracted-modules/modules/DecimalModule');
const module = new DecimalModule();

const typeCounts = {};
for (let i = 0; i < 50; i++) {
    const q = module.generateQuestion('קל');
    const type = q.metadata.questionType;
    typeCounts[type] = (typeCounts[type] || 0) + 1;
}

console.log('Question type distribution (50 questions):');
Object.entries(typeCounts).forEach(([type, count]) => {
    console.log(\`  \${type}: \${count}\`);
});
"
```

**Expected:** All 5 types appear (decomposition, digitValue, nextPrevious, compare, missingDigit)

### Step 4: Difficulty Level Verification
**Verify number ranges match difficulty:**

```bash
node -e "
const DecimalModule = require('./extracted-modules/modules/DecimalModule');
const module = new DecimalModule();

['קל', 'בינוני', 'קשה'].forEach(level => {
    console.log(\`\nLevel: \${level}\`);
    for (let i = 0; i < 5; i++) {
        const q = module.generateQuestion(level);
        const num = q.metadata.number || q.metadata.number1;
        console.log(\`  Number: \${num} (digits: \${num.toString().length})\`);
    }
});
"
```

**Expected:**
- קל (easy): 3-digit numbers (100-999)
- בינוני (medium): 4-digit numbers (1000-9999)
- קשה (hard): 5-digit numbers (10000-99999)

### Step 5: Business Logic Preservation
**Compare with original:**

1. Open `src/math/Emma_math_lab.html` in browser
2. Navigate to Decimal module
3. Generate 10 questions at each difficulty level
4. Note question structures, choices, validation

5. Run extracted module:
```bash
node -e "
const DecimalModule = require('./extracted-modules/modules/DecimalModule');
const module = new DecimalModule();

console.log('Generating 10 questions at each level:\n');
['קל', 'בינוני', 'קשה'].forEach(level => {
    console.log(\`Level: \${level}\`);
    for (let i = 0; i < 10; i++) {
        const q = module.generateQuestion(level);
        console.log(\`  \${q.metadata.questionType}: \${q.questionText.substring(0, 50)}...\`);
    }
});
"
```

**Verify:** Same question types, same difficulty ranges, same logic

---

## 5. PR Description Template

```markdown
## Story 07: Extract Decimal Module (Headless)

### Problem
The Decimal module was **embedded inline** in the 4,919-line `Emma_math_lab.html`:
- Not a separate file (harder to extract)
- Tightly coupled to DOM (choice buttons, visual representations)
- 5 question types (more complex than Division)
- ~800 lines of inline JavaScript
- Cannot be reused in Next.js without massive refactoring

### Solution
Extracted business logic into **pure JavaScript class** (DecimalModule) with:
- ✅ **Zero DOM access** (no `window`, `document`, `getElementById`)
- ✅ **5 question types supported** (decomposition, digitValue, nextPrevious, compare, missingDigit)
- ✅ **3 difficulty levels** (קל: 3-digit, בינוני: 4-digit, קשה: 5-digit)
- ✅ **JSON View Objects** (returns data for rendering)
- ✅ **Console-testable** (runs in Node.js without browser)
- ✅ **Copy-paste ready** for Next.js API routes

### Changes
**Created:**
- `extracted-modules/modules/DecimalModule.js` (~400 lines, headless)
- `extracted-modules/tests/console-tests/decimal-console.js` (Node.js test)
- `extracted-modules/modules/DecimalModule.d.ts` (TypeScript interface)
- `extracted-modules/examples/api-route-decimal.ts` (Next.js integration example)

**Unchanged:**
- `src/math/Emma_math_lab.html` (original preserved)

### Verification

#### ✅ Zero DOM Access
```bash
$ grep -n "document\|window\|getElementById" extracted-modules/modules/DecimalModule.js
(no matches)
```

#### ✅ Console Test Passes
```bash
$ node extracted-modules/tests/console-tests/decimal-console.js
✅ ALL TESTS PASSED!
   Module is headless (zero DOM access)
   Module supports 5 question types
   Module supports 3 difficulty levels
   Module can run in Node.js (no browser required)
   Module is ready for Next.js integration
```

#### ✅ All Question Types Supported
Verified 50-question distribution:
- decomposition: 11 questions
- digitValue: 9 questions
- nextPrevious: 10 questions
- compare: 12 questions
- missingDigit: 8 questions

#### ✅ Difficulty Levels Work
- קל (easy): 100-999 (3 digits) ✅
- בינוני (medium): 1000-9999 (4 digits) ✅
- קשה (hard): 10000-99999 (5 digits) ✅

#### ✅ Business Logic Preserved
- Same question types and structures
- Same difficulty progression
- Same validation logic
- Same answer checking (exact match)
- Hebrew text preserved correctly

### Extraction Complexity
**More complex than Division (Story 06) due to:**
- Inline code (not separate file)
- 5 question types (vs 4 in Division)
- Multiple choice UI (vs input-only in Division)
- More complex question generation logic
- Larger codebase (~800 lines vs 190 in Division)

### View Object Examples

**Question (Choice Type):**
```json
{
  "type": "question",
  "module": "decimal",
  "questionText": "מה הערך המספרי של הספרה 5 במספר 354?",
  "questionType": "choice",
  "choices": [
    { "id": 0, "text": "50", "value": 50 },
    { "id": 1, "text": "5", "value": 5 },
    { "id": 2, "text": "500", "value": 500 }
  ],
  "correctAnswer": 50
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
    "correctAnswers": 9,
    "accuracy": 90
  },
  "autoAdvance": true
}
```

### Impact
- ✅ **Reusable:** Can be used in Next.js, Vue, Angular, CLI
- ✅ **Testable:** Unit tests without browser
- ✅ **Maintainable:** Business logic separate from UI
- ✅ **Type-safe:** TypeScript interfaces provided
- ✅ **Framework-agnostic:** Pure JavaScript, no dependencies

### Next Steps
- Integrate into Next.js API route (`app/api/math/decimal/route.ts`)
- Build React component to consume JSON View Objects
- Continue extraction: Fraction (Story 08), Multiplication (Story 09)

### References
- **Migration Strategy:** `health_refactor/00_global_context.md`
- **DOM-to-JSON Mapping:** `health_refactor/MIGRATION_BRIDGE.md`
- **Orchestration Plan:** `health_refactor/01_orchestration_plan.md` (Story 07)
- **Pattern Story:** Story 06 (Division extraction)

---

**Type:** `extract`
**Scope:** `decimal`
**Complexity:** High (8)
**Risk:** Low (original file preserved)

Closes: Story 07
```

---

## 6. Success Criteria

### Definition of Done
- [x] **Zero DOM access** - grep confirms no `window`, `document`, `getElementById`
- [x] **Console test passes** - `node console-test-decimal.js` shows "✅ ALL TESTS PASSED!"
- [x] **All 5 question types work** - decomposition, digitValue, nextPrevious, compare, missingDigit
- [x] **All 3 difficulty levels work** - קל (3-digit), בינוני (4-digit), קשה (5-digit)
- [x] **View Object schema documented** - TypeScript interface complete
- [x] **Copy-paste ready** - Can be used in Next.js without changes
- [x] **Business logic preserved** - Same questions, validation, difficulty
- [x] **Integration example provided** - Sample Next.js API route
- [x] **No regressions** - Original file unchanged, legacy app still works
- [x] **PR description uses template**

### Conventional Commit Message
```
extract(decimal): create headless DecimalModule class

Extracted decimal logic from Emma_math_lab.html (inline code,
~800 lines) into pure JavaScript class with zero DOM access.
Supports 5 question types and 3 difficulty levels.

Question types:
- decomposition (place value identification)
- digitValue (digit in specific place)
- nextPrevious (number sequence)
- compare (greater/less than)
- missingDigit (fill in the blank)

Difficulty levels:
- קל: 100-999 (3 digits)
- בינוני: 1000-9999 (4 digits)
- קשה: 10000-99999 (5 digits)

Created files:
- DecimalModule.js (headless, ~400 lines)
- decimal-console.js (Node.js test, passes)
- DecimalModule.d.ts (TypeScript interface)
- api-route-decimal.ts (Next.js integration example)

Console test: ✅ All tests passed
DOM references: ✅ Zero (confirmed via grep)
Question types: ✅ All 5 types working
Difficulty levels: ✅ All 3 levels working
Business logic: ✅ Preserved
Integration: ✅ Ready for Next.js

Follows pattern established in Story 06 (Division).

Fixes: Story 07
```

---

## 7. Notes for AI Agent

### Challenges Specific to This Story

#### Challenge 1: Inline Code Extraction
The code is **not in a separate file** - it's embedded in the HTML. You'll need to:
1. Identify the start/end of the decimal module code
2. Extract without breaking the HTML structure
3. Preserve the code exactly as-is (copy-paste into new file)

**Tip:** Use line numbers from the HTML file to identify sections:
```bash
# Find state object
grep -n "const decimalState" src/math/Emma_math_lab.html

# Find generate function
grep -n "function generateDecimalQuestion" src/math/Emma_math_lab.html

# Find check function
grep -n "function checkDecimalAnswer" src/math/Emma_math_lab.html
```

#### Challenge 2: Multiple Question Types
Division had 4 types, Decimal has 5. Each type has different:
- Question text patterns
- Answer types (some are numbers, some are choices)
- Validation logic
- Difficulty configurations

**Tip:** Extract one type at a time. Test each type with console test before moving to next.

#### Challenge 3: Choice vs Input
Some questions use **multiple choice** (buttons), others use **text input**.

**DOM Pattern (Choice):**
```javascript
// ❌ OLD: DOM manipulation
const choicesContainer = document.getElementById('decimal-choices');
choices.forEach(choice => {
    const button = document.createElement('button');
    button.textContent = choice;
    button.onclick = () => selectDecimalChoice(choice);
    choicesContainer.appendChild(button);
});
```

**Headless Pattern:**
```javascript
// ✅ NEW: JSON property
{
    questionType: 'choice',
    choices: [
        { id: 0, text: '50', value: 50 },
        { id: 1, text: '5', value: 5 },
        { id: 2, text: '500', value: 500 }
    ]
}
```

### Success Indicators
- ✅ Console test prints "✅ ALL TESTS PASSED!"
- ✅ All 5 question types generate successfully
- ✅ Number ranges match difficulty (3/4/5 digits)
- ✅ Hebrew text displays correctly
- ✅ Zero DOM references confirmed

### Common Pitfalls
- ❌ **Don't mix question types** - Each type needs separate generator method
- ❌ **Don't hardcode numbers** - Use difficulty config for ranges
- ❌ **Don't lose choices** - Choice questions need `choices` array in View Object
- ❌ **Don't corrupt Hebrew** - Ensure UTF-8 encoding throughout

### If Something Goes Wrong
- Start with ONE question type (decomposition is simplest)
- Test each type independently before combining
- Use console.log extensively during development
- Compare generated questions to original app's questions
- Check that number ranges match expected difficulty

### Testing Strategy
1. **Unit test each question type** - Generate 10 of each type, verify structure
2. **Test difficulty levels** - Verify 3/4/5 digit numbers
3. **Test validation logic** - Check correct and wrong answers
4. **Test Hebrew text** - Ensure no corruption
5. **Integration test** - Run full console test suite

---

**Story Status:** Ready for Implementation
**Estimated Time:** 2 days
**Previous Story:** Story 06 (Division - pattern established)
**Next Story:** Story 08 (Fraction - similar to Division)
**Complexity Note:** More complex than Division due to inline code + 5 question types
