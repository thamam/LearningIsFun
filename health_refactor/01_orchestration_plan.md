# Refactoring Orchestration Plan (Migration Strategy)

**Project:** LearningIsFun → Next.js Migration
**Plan Version:** 2.0 (Migration-Focused)
**Created:** 2025-11-20
**Target Completion:** 4 weeks
**Current Health Score:** 67/100 → **Target:** Migrated to Next.js

---

## Executive Summary

**STRATEGIC PIVOT:** We are NOT renovating the old house. We are moving to a new house (Next.js/React in PR #10).

This plan focuses on:
1. **Phase 1 (Week 1):** Clean up & secure the backend (will become API service)
2. **Phase 2 (Weeks 2-4):** Extract business logic into **Headless Modules** (zero DOM coupling)

**DELETED from original plan:**
- ❌ Client-side telemetry (will be in Next.js)
- ❌ Performance monitoring (will be in Next.js)
- ❌ i18n system (will be in Next.js)
- ❌ UI refactoring (deleting the UI)

**The Goal:** Create **pure JavaScript classes** that can be copy-pasted into Next.js API routes without changing a single line.

---

## Story Sequencing Strategy

### Phase 1: Backend Cleanup & Security (Week 1)
**Goal:** Prepare backend for API service role
**Parallelization:** Stories 01-05 can run in parallel (no dependencies)
**Rationale:** `server.js` will be reused as an API endpoint service

### Phase 2: Headless Extraction (Weeks 2-4)
**Goal:** Extract math modules into framework-agnostic JavaScript classes
**Parallelization:** Stories 06-12 must run sequentially (learning from each extraction)
**Rationale:** Build pattern with simple module (Division), then scale to complex modules

---

## Master Schedule

| Seq ID | Story Name | Target | Output | Complexity | Dependencies | Week |
|--------|------------|--------|--------|------------|--------------|------|
| **PHASE 1: BACKEND CLEANUP** |
| **01** | Eliminate Duplicate Module Registry | Cleanup | Single `module-registry.js` | **Low (2)** | None | 1 |
| **02** | Add Backend Rate Limiting | Security | Rate-limited `/api/flag` | **Low (2)** | None | 1 |
| **03** | Implement Backend Input Validation | Security | Validated `/api/flag` | **Medium (4)** | None | 1 |
| **04** | Restrict CORS to Whitelist | Security | Whitelisted CORS | **Low (1)** | None | 1 |
| **05** | Fix Blocking File I/O | Performance | Async file writes | **Medium (5)** | None | 1 |
| **PHASE 2: HEADLESS EXTRACTION** |
| **06** | Extract Division Module | Extraction | `DivisionModule.js` (headless) | **High (7)** | ⚠️ Requires Story 01 | 2 |
| **07** | Extract Decimal Module | Extraction | `DecimalModule.js` (headless) | **High (8)** | ⚠️ Requires Story 06 (pattern) | 2 |
| **08** | Extract Fraction Module | Extraction | `FractionModule.js` (headless) | **Medium (6)** | ⚠️ Requires Story 06 (pattern) | 3 |
| **09** | Extract Multiplication Module | Extraction | `MultiplicationModule.js` (headless) | **High (7)** | ⚠️ Requires Story 07 (HTML extraction) | 3 |
| **10** | Extract Order of Operations Module | Extraction | `OrderOperationsModule.js` (headless) | **High (8)** | ⚠️ Requires Story 06 (pattern) | 3 |
| **11** | Extract Distributive Module | Extraction | `DistributiveModule.js` (headless) | **High (7)** | ⚠️ Requires Story 06 (pattern) | 4 |
| **12** | Extract Number Line Module | Extraction | `NumberLineModule.js` (headless) | **High (9)** | ⚠️ Requires Story 06 (visual pattern) | 4 |

---

## Complexity Scoring Legend

| Score | Definition | Estimated Time | Risk |
|-------|------------|----------------|------|
| **1-2** | Low - Single file, simple change | 1-2 hours | Low |
| **3-5** | Medium - Multiple files or moderate logic | 3-6 hours | Medium |
| **6-8** | High - Architectural extraction, DOM decoupling | 1-2 days | Medium-High |
| **9-10** | Critical - Complex extraction with edge cases | 2-3 days | High |

---

## Dependency Graph

```
Phase 1 (Parallel) - Backend Cleanup
├── Story 01 ──┐
├── Story 02 ──┤
├── Story 03 ──┤──→ Phase 2 (Sequential) - Extraction
├── Story 04 ──┤    │
└── Story 05 ──┘    │
                    Story 01 Complete
                         ↓
                    Story 06 (Division) ──→ Establishes Pattern
                         ↓
                    ┌────┴────┬────────────┬────────────┐
                    │         │            │            │
              Story 07    Story 08    Story 10    Story 11
              (Decimal)   (Fraction)  (Order)     (Distributive)
                    │         │            │            │
                    └─────────┴────────────┴────────────┘
                              ↓
                         Story 09 (Multiplication)
                              ↓
                         Story 12 (Number Line)
```

**Critical Path:** 01 → 06 → 07 → 09 → 12

**Why Sequential in Phase 2:**
- Story 06 (Division) establishes the extraction pattern
- Each extraction builds confidence and refines the pattern
- Complex modules (Order, Distributive) require lessons learned
- Visual module (Number Line) needs special View Object design

---

## Detailed Story Breakdown

### Phase 1: Backend Cleanup & Security (Week 1)

#### Story 01: Eliminate Duplicate Module Registry
**Priority:** P0 (Critical)
**Rationale:** Must have single source of truth before extraction
**Output:** Single `module-registry.js` file
**Time:** 1-2 hours

---

#### Story 02: Add Backend Rate Limiting
**Priority:** P0 (Critical)
**Rationale:** Secure backend before promoting to API service
**Output:** Rate-limited `/api/flag` endpoint
**Time:** 1-2 hours

---

#### Story 03: Implement Backend Input Validation
**Priority:** P0 (Critical)
**Rationale:** Prevent XSS, JSON bombs before API service role
**Output:** Validated and sanitized `/api/flag` endpoint
**Time:** 3-4 hours

---

#### Story 04: Restrict CORS to Whitelist
**Priority:** P0 (Critical)
**Rationale:** Security hardening for API service
**Output:** CORS-protected endpoints
**Time:** 1 hour

---

#### Story 05: Fix Blocking File I/O
**Priority:** P0 (Critical)
**Rationale:** API service must handle concurrent requests
**Output:** Async file operations with queue
**Time:** 3-4 hours

---

### Phase 2: Headless Extraction (Weeks 2-4)

#### Story 06: Extract Division Module
**Priority:** P1 (High)
**Complexity:** High (7)
**Rationale:** Simplest module (190 lines), establishes extraction pattern
**Time:** 1-2 days

**Input:** `src/math/js/modules/division_module.js` (DOM-coupled)
**Output:** `extracted-modules/modules/DivisionModule.js` (headless)

**Success Criteria:**
- ✅ Zero DOM references (`window`, `document`, `getElementById`, etc.)
- ✅ Console test passes (`node console-test-division.js`)
- ✅ View Object schema documented (TypeScript interface)
- ✅ Copy-paste ready for Next.js API route
- ✅ Same business logic (question generation, validation)

**Deliverables:**
1. `DivisionModule.js` - Headless class
2. `console-test-division.js` - Node.js test
3. `DivisionModule.d.ts` - TypeScript interface
4. `example-api-route-division.ts` - Next.js integration example

---

#### Story 07: Extract Decimal Module
**Priority:** P1 (High)
**Complexity:** High (8)
**Rationale:** Built-in module, needs HTML extraction, multiple question types
**Time:** 2 days

**Input:** `src/math/Emma_math_lab.html` (lines ~1200-2000, inline code)
**Output:** `extracted-modules/modules/DecimalModule.js` (headless)

**Challenges:**
- Code is inline in HTML (not separate file)
- Multiple question types (decomposition, digitValue, nextPrevious, compare, missingDigit)
- Hebrew text embedded in JavaScript

**Success Criteria:**
- ✅ All question types extracted
- ✅ Hebrew strings preserved (no corruption)
- ✅ Console test covers all question types
- ✅ View Object handles visual representations (number lines, place value charts)

---

#### Story 08: Extract Fraction Module
**Priority:** P1 (High)
**Complexity:** Medium (6)
**Rationale:** Similar to Division, good reinforcement
**Time:** 1 day

**Input:** `src/math/js/modules/fraction_module.js`
**Output:** `extracted-modules/modules/FractionModule.js` (headless)

---

#### Story 09: Extract Multiplication Module
**Priority:** P1 (High)
**Complexity:** High (7)
**Rationale:** Built-in module, needs HTML extraction, requires Decimal pattern
**Time:** 1-2 days

**Input:** `src/math/Emma_math_lab.html` (lines ~800-1200, inline code)
**Output:** `extracted-modules/modules/MultiplicationModule.js` (headless)

**Dependency:** Requires Story 07 completion (same HTML extraction pattern)

---

#### Story 10: Extract Order of Operations Module
**Priority:** P1 (High)
**Complexity:** High (8)
**Rationale:** Complex (458 lines), 6 question types
**Time:** 2 days

**Input:** `src/math/js/modules/order_operations_module.js`
**Output:** `extracted-modules/modules/OrderOperationsModule.js` (headless)

**Challenges:**
- 6 question types (PEMDAS, parentheses, multi-step, etc.)
- Complex expression generation
- LaTeX-like formatting needs

---

#### Story 11: Extract Distributive Module
**Priority:** P1 (High)
**Complexity:** High (7)
**Rationale:** Complex (351 lines), algebraic concepts
**Time:** 1-2 days

**Input:** `src/math/js/modules/distributive_module.js`
**Output:** `extracted-modules/modules/DistributiveModule.js` (headless)

---

#### Story 12: Extract Number Line Module
**Priority:** P1 (High)
**Complexity:** Critical (9)
**Rationale:** Visual module, needs special View Object design
**Time:** 2-3 days

**Input:** `src/math/Emma_math_lab.html` (lines ~2000-2500, inline code)
**Output:** `extracted-modules/modules/NumberLineModule.js` (headless)

**Challenges:**
- Visual representation (drag-and-drop number line)
- SVG/Canvas coordinates need JSON representation
- Interactive elements need state management

**View Object Design:**
```json
{
  "type": "numberline",
  "question": "מה המספר שמסומן בחץ?",
  "numberLine": {
    "min": 0,
    "max": 100,
    "interval": 10,
    "arrowPosition": 45,
    "markedPositions": [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    "correctAnswer": 45
  },
  "interactionType": "click" | "drag" | "input"
}
```

---

## Risk Mitigation Strategy

### High-Risk Stories (Score 7+)
- **Story 06 (Division):** First extraction, sets pattern for all others
  - **Mitigation:** Over-document, create reusable extraction checklist
- **Story 07 (Decimal):** HTML extraction, multiple question types
  - **Mitigation:** Extract one question type at a time, test incrementally
- **Story 12 (Number Line):** Visual module, complex View Object
  - **Mitigation:** Design View Object first, validate with Next.js team

### Rollback Plan
- All stories create NEW files (`extracted-modules/`)
- Original files unchanged until migration complete
- Can revert extraction by deleting `extracted-modules/` directory
- No breaking changes to legacy app

---

## Success Metrics

### By Phase 1 Completion (Week 1)
- ✅ Backend secure (rate limiting, validation, CORS)
- ✅ No duplicate files
- ✅ Server handles 100 concurrent requests
- ✅ `server.js` ready for API service role

### By Phase 2 Completion (Week 4)
- ✅ **7 modules extracted** (Division, Decimal, Fraction, Multiplication, Order, Distributive, Number Line)
- ✅ **Zero DOM references** in any extracted module
- ✅ **All console tests pass** (`node console-tests/run-all.js`)
- ✅ **Copy-paste ready** - Each module works in Next.js API route without changes
- ✅ **Business logic preserved** - Same questions, validation, difficulty progression
- ✅ **TypeScript interfaces** - All View Objects typed
- ✅ **Integration examples** - Sample Next.js API routes for each module

### Integration Readiness (End of Week 4)
- ✅ Extracted modules committed to repo
- ✅ Documentation complete (`MIGRATION_BRIDGE.md`, extraction stories)
- ✅ Ready for PR #10 (Next.js app) to import modules
- ✅ Next.js team can begin integration immediately

---

## Execution Notes for AI Agent

### General Workflow (Phase 1 - Backend)
1. Read `00_global_context.md`
2. Read specific story file (e.g., `story_02_backend_rate_limiting.md`)
3. Create branch: `fix/story-[ID]-[slug]`
4. Implement changes
5. Run verification plan
6. Create PR using template

### General Workflow (Phase 2 - Extraction)
1. Read `00_global_context.md` and `MIGRATION_BRIDGE.md`
2. Read specific extraction story (e.g., `story_06_extract_division.md`)
3. Create branch: `extract/story-[ID]-[module]`
4. Extract module to `extracted-modules/modules/[Module].js`
5. Create console test: `extracted-modules/tests/console-tests/[module]-console.js`
6. Run console test: `node extracted-modules/tests/console-tests/[module]-console.js`
7. Document View Object schema: TypeScript interface
8. Create Next.js integration example
9. Commit with extraction evidence
10. Create PR with console test output

### Critical Checklist (Per Extraction)
- [ ] No `window` references (search: `grep -n "window\." [file]`)
- [ ] No `document` references (search: `grep -n "document\." [file]`)
- [ ] No `getElementById` (search: `grep -n "getElementById" [file]`)
- [ ] No `querySelector` (search: `grep -n "querySelector" [file]`)
- [ ] No `innerHTML` or `textContent` (search: `grep -n "innerHTML\|textContent" [file]`)
- [ ] No `localStorage` (search: `grep -n "localStorage" [file]`)
- [ ] No `alert` or `confirm` (search: `grep -n "alert\|confirm" [file]`)
- [ ] Console test passes: `node console-test-[module].js`
- [ ] Output is JSON (all methods return objects)
- [ ] TypeScript interface complete

### When to Ask for Human Review
- If DOM dependency cannot be removed without breaking logic
- If View Object schema is unclear (especially visual modules)
- If original behavior is ambiguous
- If console test fails and root cause is unclear

### Context Management
- Load `00_global_context.md` once at start
- Load `MIGRATION_BRIDGE.md` for extraction stories
- Load current story file for each new story
- Refer to original module file for business logic
- Do NOT load other stories (prevents context overflow)

---

## Extraction Quality Gates

Each extraction must pass these gates before PR approval:

### Gate 1: Zero DOM Access
```bash
# Must return zero matches
grep -n "window\|document\|getElementById\|querySelector" extracted-modules/modules/[Module].js
```

### Gate 2: Console Test Passes
```bash
# Must print "✅ All tests passed!"
node extracted-modules/tests/console-tests/[module]-console.js
```

### Gate 3: TypeScript Interface Exists
```bash
# File must exist with ViewObject interfaces
ls extracted-modules/modules/[Module].d.ts
```

### Gate 4: Integration Example Exists
```bash
# File must exist showing Next.js usage
ls extracted-modules/examples/api-route-[module].ts
```

### Gate 5: Business Logic Preserved
- Generate question with extracted module
- Compare output to original module
- Verify same question structure, difficulty, validation logic

---

## Extraction Template (Reusable Pattern)

Every extraction follows this structure:

```javascript
// extracted-modules/modules/DivisionModule.js

/**
 * Division Module (Headless)
 * Extracted from: src/math/js/modules/division_module.js
 * Zero DOM dependencies - returns JSON View Objects
 */

class DivisionModule {
    constructor(config = {}) {
        this.currentLevel = config.initialLevel || 'קל';
        this.statistics = {
            totalQuestions: 0,
            correctAnswers: 0,
            currentStreak: 0,
            bestStreak: 0
        };
    }

    /**
     * Generate a new question
     * @param {string} level - 'קל' | 'בינוני' | 'קשה'
     * @returns {ViewObject} Question data for rendering
     */
    generateQuestion(level) {
        // Business logic here (no DOM)
        return {
            type: 'question',
            questionText: '...',
            questionType: 'input',
            correctAnswer: 42,
            // ... all rendering data
        };
    }

    /**
     * Validate user answer
     * @param {any} userAnswer - User's input
     * @param {any} correctAnswer - Expected answer
     * @returns {ViewObject} Feedback data for rendering
     */
    checkAnswer(userAnswer, correctAnswer) {
        // Validation logic here (no DOM)
        return {
            type: 'feedback',
            isCorrect: true,
            message: '...',
            // ... all rendering data
        };
    }

    // Helper methods (private, prefixed with _)
    _getDifficultyConfig(level) { /* ... */ }
    _getRandomEncouragement(isCorrect) { /* ... */ }
}

module.exports = DivisionModule;
```

---

**Plan Status:** Ready for Execution
**First Story:** Story 01 (Duplicate Registry - Prerequisite)
**First Extraction:** Story 06 (Division - Establishes Pattern)
**Estimated Total Duration:** 4 weeks
**Total Story Points:** 59 (average 4.9 per story)
