# Global Context: LearningIsFun Migration to Next.js

**Repository:** LearningIsFun
**Current Stack:** jQuery/HTML monolith (4,919 lines)
**Target Stack:** Next.js/React (PR #10)
**Migration Strategy:** Extract business logic → Headless modules → API routes
**Current Health Score:** 67/100 (Functional MVP with Technical Debt)

---

## 🎯 Strategic Context: The Great Migration

### The Reality
We are **NOT renovating the old house**. We are **moving to a new house** (Next.js/React).

**Current Architecture (The "Old House"):**
- `src/math/Emma_math_lab.html` - 4,919-line monolithic HTML/jQuery app
- Math logic **tightly coupled** to DOM manipulation
- State management mixed with UI rendering
- Cannot be reused in modern React architecture

**Target Architecture (The "New House"):**
- Next.js/React application (PR #10 waiting)
- Server Components + API Routes
- Headless business logic (pure JavaScript classes)
- JSON-based data exchange (no DOM coupling)

### The Problem
Our **core intellectual property** (math question generation, answer validation, difficulty progression) is **trapped inside DOM-coupled spaghetti code**.

**Example of the problem:**
```javascript
// Current code in division_module.js (COUPLED TO DOM)
function generateDivisionQuestion() {
    const questionEl = document.getElementById('division-question');  // ❌ DOM ACCESS
    questionEl.textContent = question.question;  // ❌ DOM MANIPULATION

    const inputEl = document.getElementById('division-answer-input');  // ❌ DOM ACCESS
    inputEl.value = '';  // ❌ DOM MANIPULATION
}
```

**What we need:**
```javascript
// Headless module (NO DOM ACCESS)
class DivisionModule {
    generateQuestion(level) {
        // Pure business logic
        const question = this._createQuestion(level);

        // Return JSON (View Object)
        return {
            questionText: question.text,
            questionType: 'input',
            inputPlaceholder: 'הכניסי תשובה',
            correctAnswer: question.answer,
            difficulty: level
        };
    }
}
```

### The Migration Path

**Phase 1: Clean Up & Secure (Week 1)**
- Fix critical security issues in backend (Stories 01-05)
- Remove duplicate files
- Prepare backend for API service role

**Phase 2: Extract Business Logic (Weeks 2-4)**
- Extract math modules into **Headless Classes**
- Zero DOM access (no `window`, `document`, `jQuery`)
- Output: JSON "View Objects" for UI rendering
- Console-testable (run with `node`, no browser)

**Phase 3: Integration (Week 5)**
- Import extracted modules into Next.js API routes
- Build React components consuming the JSON data
- Parallel development: Frontend (React) + Backend (Pure JS)

**Phase 4: Cutover (Week 6)**
- Deprecate old HTML app
- Launch Next.js app
- Archive legacy code

---

## System Architecture Overview

### Current Architecture (Legacy - Being Replaced)

#### Hebrew Math Application (LEGACY)
**Entry Point:** `src/math/Emma_math_lab.html` (4,919 lines - monolithic)

**Built-in Modules (Inline, DOM-coupled):**
- Decimal Numbers (מבנה עשרוני) - ~800 lines in HTML
- Multiplication (כפל) - ~600 lines in HTML
- Number Line (ישר מספרים) - ~500 lines in HTML

**Registered Modules (External JS, DOM-coupled):**
- Division (`src/math/js/modules/division_module.js`) - 190 lines
- Fractions (`src/math/js/modules/fraction_module.js`) - 273 lines
- Order of Operations (`src/math/js/modules/order_operations_module.js`) - 458 lines
- Distributive Property (`src/math/js/modules/distributive_module.js`) - 351 lines

**Problems:**
- ❌ All modules call `document.getElementById()`, `querySelector()`, etc.
- ❌ State mixed with rendering (`divisionState` vs `questionEl`)
- ❌ Cannot be unit tested (requires browser DOM)
- ❌ Cannot be imported into Next.js without massive refactoring

#### Backend (KEEP - Will Become API Service)
**Server:** `server.js` (Express.js, 106 lines)
- **Endpoints:** `POST /api/flag`, `GET /api/health`
- **Purpose:** Flag logging, health checks
- **Status:** Needs security fixes (Stories 02-05), then reusable

### Target Architecture (Next.js - PR #10)

#### Frontend
```
nextjs-app/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── math/
│   │   ├── [module]/page.tsx       # Dynamic module pages
│   │   └── components/
│   │       ├── QuestionCard.tsx    # Renders question from JSON
│   │       ├── AnswerInput.tsx     # Captures user answer
│   │       └── FeedbackDisplay.tsx # Shows results
│   └── api/
│       └── math/
│           ├── division/route.ts   # API route using DivisionModule
│           ├── decimal/route.ts    # API route using DecimalModule
│           └── ...
```

#### Extracted Business Logic (NEW - Phase 2)
```
extracted-modules/
├── core/
│   ├── BaseModule.js               # Abstract base class
│   ├── DifficultyManager.js        # Difficulty progression logic
│   └── ValidationEngine.js         # Answer validation
├── modules/
│   ├── DivisionModule.js           # Pure JS, returns JSON
│   ├── DecimalModule.js            # Pure JS, returns JSON
│   ├── FractionModule.js           # Pure JS, returns JSON
│   └── ...
└── tests/
    ├── division.test.js            # Jest tests (no DOM)
    └── console-test.js             # Node.js smoke test
```

**Key Principle:** Each module is a **Headless Class** that:
1. Takes input (level, user answer)
2. Performs business logic (generate question, validate answer)
3. Returns JSON (View Object for rendering)

---

## Architectural Rules (Updated for Migration)

### 1. Extraction Rules (CRITICAL - Phase 2)

#### ❌ FORBIDDEN in Extracted Modules:
- `window.*` - No global browser objects
- `document.*` - No DOM access
- `getElementById()`, `querySelector()` - No DOM queries
- `innerHTML`, `textContent` - No DOM manipulation
- `addEventListener()` - No event binding
- `localStorage`, `sessionStorage` - No browser storage (use params)
- `alert()`, `confirm()` - No browser dialogs
- jQuery (`$()`) - No jQuery

#### ✅ ALLOWED in Extracted Modules:
- Pure JavaScript (ES6+ classes, functions)
- Math operations (`Math.random()`, `Math.floor()`, etc.)
- Array/Object manipulation
- String formatting
- JSON serialization (`JSON.stringify()`)
- `console.log()` (for debugging)
- `require()` or `import` (Node.js modules)

#### 📦 Output Format: View Object
Every extracted method must return a **View Object** (JSON) containing all data needed to render the UI.

**Example - Question Generation:**
```javascript
// ❌ OLD (DOM-coupled)
function generateDivisionQuestion() {
    document.getElementById('question').textContent = 'What is 12 ÷ 4?';
    document.getElementById('input').value = '';
}

// ✅ NEW (Headless)
generateQuestion(level) {
    return {
        type: 'question',
        questionText: 'What is 12 ÷ 4?',
        questionType: 'input',
        difficulty: level,
        correctAnswer: 3,
        hint: 'Think about division tables',
        metadata: {
            dividend: 12,
            divisor: 4,
            timestamp: Date.now()
        }
    };
}
```

**Example - Answer Validation:**
```javascript
// ❌ OLD (DOM-coupled)
function checkDivisionAnswer() {
    const userAnswer = document.getElementById('input').value;
    const feedback = document.getElementById('feedback');
    feedback.innerHTML = isCorrect ? '✅ Correct!' : '❌ Wrong';
}

// ✅ NEW (Headless)
checkAnswer(userAnswer, correctAnswer) {
    const isCorrect = parseFloat(userAnswer) === correctAnswer;

    return {
        type: 'feedback',
        isCorrect: isCorrect,
        message: isCorrect ? 'מעולה! תשובה נכונה!' : 'לא נכונה, נסה שוב',
        userAnswer: userAnswer,
        correctAnswer: correctAnswer,
        encouragement: this._getRandomEncouragement(isCorrect),
        nextAction: isCorrect ? 'generate_next' : 'show_hint'
    };
}
```

### 2. Testing Requirements (Phase 2)

#### Console Test (MANDATORY)
Every extracted module must pass a **Node.js console test** proving it works without a browser.

**Test Template:**
```javascript
// console-test.js
const DivisionModule = require('./DivisionModule');

console.log('🧪 Testing DivisionModule (Headless)\n');

const module = new DivisionModule();

// Test 1: Generate question
console.log('Test 1: Generate Question (Easy)');
const question = module.generateQuestion('קל');
console.log(JSON.stringify(question, null, 2));
console.assert(question.questionText, 'Should have questionText');
console.assert(question.correctAnswer !== undefined, 'Should have correctAnswer');

// Test 2: Validate correct answer
console.log('\nTest 2: Check Correct Answer');
const feedback1 = module.checkAnswer(question.correctAnswer, question.correctAnswer);
console.log(JSON.stringify(feedback1, null, 2));
console.assert(feedback1.isCorrect === true, 'Should be correct');

// Test 3: Validate wrong answer
console.log('\nTest 3: Check Wrong Answer');
const feedback2 = module.checkAnswer(999, question.correctAnswer);
console.log(JSON.stringify(feedback2, null, 2));
console.assert(feedback2.isCorrect === false, 'Should be incorrect');

console.log('\n✅ All tests passed!');
```

**Run test:**
```bash
node console-test.js
# Should print JSON output, no browser required
```

### 3. Next.js Integration Pattern

**API Route Example (`app/api/math/division/route.ts`):**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { DivisionModule } from '@/lib/modules/DivisionModule';

export async function POST(request: NextRequest) {
    const { action, level, userAnswer, correctAnswer } = await request.json();

    const module = new DivisionModule();

    if (action === 'generate') {
        const question = module.generateQuestion(level);
        return NextResponse.json(question);
    }

    if (action === 'check') {
        const feedback = module.checkAnswer(userAnswer, correctAnswer);
        return NextResponse.json(feedback);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
```

**React Component Example:**
```typescript
'use client';

export default function DivisionPractice() {
    const [question, setQuestion] = useState(null);

    async function generateQuestion() {
        const response = await fetch('/api/math/division', {
            method: 'POST',
            body: JSON.stringify({ action: 'generate', level: 'קל' })
        });
        const data = await response.json();
        setQuestion(data);  // Use JSON View Object
    }

    return (
        <div>
            <h2>{question?.questionText}</h2>
            <input placeholder={question?.inputPlaceholder} />
            {/* Render from JSON, no DOM coupling */}
        </div>
    );
}
```

---

## Revised Definition of Done (Per Story)

### ✅ Phase 1 Stories (Backend Security)
- [ ] All existing tests pass (once we add Jest)
- [ ] No security vulnerabilities introduced
- [ ] Backend endpoints still functional
- [ ] No breaking changes to current HTML app (we still need it running during migration)

### ✅ Phase 2 Stories (Extraction)
- [ ] **Zero DOM access** - No `window`, `document`, `jQuery` references
- [ ] **Console test passes** - `node console-test.js` runs successfully
- [ ] **View Object schema documented** - TypeScript interface provided
- [ ] **Copy-paste ready** - Can be imported into Next.js without changes
- [ ] **Business logic preserved** - Same question generation, validation logic
- [ ] **No regressions** - Extracted module produces same results as original
- [ ] **JSDoc complete** - All public methods documented
- [ ] **Integration example** - Sample Next.js API route provided

---

## Repository Map (Migration-Focused)

```
LearningIsFun/
├── src/math/                           # LEGACY (Will be archived after migration)
│   ├── Emma_math_lab.html              # 4,919 lines (DOM-coupled, being replaced)
│   └── js/modules/                     # DOM-coupled modules (extraction source)
│       ├── division_module.js          # 🎯 EXTRACT → DivisionModule.js
│       ├── fraction_module.js          # 🎯 EXTRACT → FractionModule.js
│       ├── order_operations_module.js  # 🎯 EXTRACT → OrderOperationsModule.js
│       └── distributive_module.js      # 🎯 EXTRACT → DistributiveModule.js
│
├── extracted-modules/                  # NEW (Phase 2 output)
│   ├── core/
│   │   ├── BaseModule.js               # Abstract base class
│   │   ├── DifficultyManager.js        # Difficulty progression logic
│   │   └── constants.js                # Magic numbers extracted
│   ├── modules/
│   │   ├── DivisionModule.js           # ✅ Headless, console-testable
│   │   ├── DecimalModule.js            # ✅ Headless, console-testable
│   │   ├── FractionModule.js           # ✅ Headless, console-testable
│   │   └── ...
│   └── tests/
│       ├── division.test.js            # Jest unit tests
│       └── console-tests/
│           ├── division-console.js     # Node.js smoke test
│           └── decimal-console.js      # Node.js smoke test
│
├── server.js                           # Backend API (Phase 1 fixes, then reuse)
├── package.json                        # Update with Jest, testing deps
│
├── health_refactor/                    # THIS DIRECTORY (Migration plan)
│   ├── 00_global_context.md            # This file
│   ├── 01_orchestration_plan.md        # Master schedule
│   ├── MIGRATION_BRIDGE.md             # DOM ID → JSON property mapping
│   ├── story_01_duplicate_registry.md  # Phase 1 (cleanup)
│   ├── story_02-05_*.md                # Phase 1 (security)
│   ├── story_06_extract_division.md    # Phase 2 (extraction)
│   ├── story_07_extract_decimal.md     # Phase 2 (extraction)
│   └── ...
│
└── docs/
    └── reports/
        └── SECURITY_ARCHITECTURE_AUDIT_2025.md
```

---

## Critical Interdependencies (Migration Context)

### Phase 1 → Phase 2 Dependency
- **Story 01 (Duplicate Registry)** must complete BEFORE extraction
- **Reason:** Extraction needs single source of truth for module patterns

### Extraction Order (Phase 2)
**Recommended sequence:**

1. **Story 06: Extract Division** (Simplest, 190 lines, good learning case)
2. **Story 07: Extract Decimal** (Moderate complexity, multiple question types)
3. **Story 08: Extract Fraction** (Similar to Division)
4. **Story 09: Extract Multiplication** (Built-in module, needs HTML extraction)
5. **Story 10: Extract Order of Operations** (Complex, 458 lines)
6. **Story 11: Extract Distributive** (Complex, 351 lines)
7. **Story 12: Extract Number Line** (Visual module, needs special handling)

**Why this order:**
- Start simple (Division) to establish pattern
- Build confidence before tackling built-in modules (Decimal, Multiplication)
- Complex modules last (Order of Operations, Distributive)
- Visual modules need special View Object design (Number Line)

---

## Success Metrics (Revised)

### Phase 1 Success (Week 1)
- ✅ Backend secure (rate limiting, input validation, CORS)
- ✅ No duplicate files
- ✅ `server.js` ready to become API service

### Phase 2 Success (Weeks 2-4)
- ✅ **7 modules extracted** (Division, Decimal, Fraction, Multiplication, Order, Distributive, Number Line)
- ✅ **Zero DOM references** in extracted code
- ✅ **All console tests pass** (`node console-test.js` for each module)
- ✅ **Copy-paste ready** for Next.js API routes
- ✅ **Business logic preserved** (same questions, validation, difficulty)

### Phase 3 Success (Week 5)
- ✅ Extracted modules integrated into Next.js API routes
- ✅ React components consuming JSON View Objects
- ✅ Feature parity with legacy app

### Phase 4 Success (Week 6)
- ✅ Next.js app launched
- ✅ Legacy app archived
- ✅ Migration complete

---

## Communication Protocols

### Git Workflow (Updated)
- **Branch naming:**
  - Phase 1: `fix/story-[ID]-[slug]` (e.g., `fix/story-01-duplicate-registry`)
  - Phase 2: `extract/story-[ID]-[module]` (e.g., `extract/story-06-division`)
- **Commit messages:** Conventional Commits
  ```
  extract(division): create headless DivisionModule class

  Extracted division logic from division_module.js into pure
  JavaScript class with zero DOM access. Returns JSON View Objects
  for question generation and answer validation.

  - Add DivisionModule.js (headless)
  - Add console-test-division.js (passes)
  - Add TypeScript interface for View Object
  - Add Next.js integration example

  Console test: ✅ All tests passed
  DOM references: ✅ Zero

  Fixes: Story 06
  ```

### PR Process (Phase 2 Extractions)
1. Create branch from `main`
2. Extract module (headless)
3. Write console test
4. Run `node console-test.js` (must pass)
5. Document View Object schema (TypeScript interface)
6. Provide Next.js integration example
7. Commit with conventional message
8. Create PR with extraction evidence (console test output)

---

## Key Contacts & Resources

### Documentation
- **Migration Plan:** `health_refactor/01_orchestration_plan.md`
- **DOM-to-JSON Mapping:** `health_refactor/MIGRATION_BRIDGE.md`
- **Latest Audit:** `docs/reports/SECURITY_ARCHITECTURE_AUDIT_2025.md`
- **Next.js Target:** PR #10 (waiting for extracted modules)

### External Dependencies
- **Testing:** Jest (for unit tests), Node.js (for console tests)
- **Target Framework:** Next.js 14+ (App Router)
- **TypeScript:** For type safety in Next.js integration

---

## Migration Philosophy

### The Strangler Fig Pattern
We are using the **Strangler Fig** pattern:
1. Build new functionality around the old system
2. Extract business logic incrementally
3. Route traffic to new system gradually
4. Remove old system when no longer needed

**NOT a Big Bang rewrite** - we keep the old app running during migration.

### The Headless Module Pattern
Every extracted module is a **Headless Class**:
- No UI dependencies
- Returns JSON (View Objects)
- Console-testable
- Framework-agnostic (can be used in Next.js, Vue, Angular, etc.)

**Benefits:**
- **Testable:** Unit tests without browser
- **Portable:** Copy-paste into any framework
- **Maintainable:** Business logic separate from rendering
- **Reusable:** Same module for web, mobile, CLI, etc.

---

**Last Updated:** 2025-11-20
**Migration Status:** Phase 1 Ready, Phase 2 Planning
**Target:** Next.js/React (PR #10)
**Strategy:** Extract → Test → Integrate → Cutover
