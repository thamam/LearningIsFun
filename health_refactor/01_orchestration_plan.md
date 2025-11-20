# Refactoring Orchestration Plan

**Project:** LearningIsFun
**Plan Version:** 1.0
**Created:** 2025-11-20
**Target Completion:** 6 weeks
**Current Health Score:** 67/100 → **Target:** 90/100

---

## Executive Summary

This plan addresses **6 Critical (P0)** and **7 High Priority (P1)** issues identified in the Security & Architecture Audit. The work is broken into **15 atomic, independent user stories** designed for sequential or parallel execution by an AI coding agent.

### Principles
1. **Atomic & Independent:** Each story produces a deployable, green-test PR
2. **No Breaking Changes:** Main branch always deployable
3. **Coupling-Aware:** Cross-file changes bundled into single stories
4. **Test-First:** Add testing infrastructure before refactoring

---

## Story Sequencing Strategy

### Phase 1: Critical Security Fixes (Week 1)
**Goal:** Eliminate immediate security vulnerabilities
**Parallelization:** Stories 01-05 can run in parallel (no dependencies)

### Phase 2: Infrastructure & Observability (Week 2)
**Goal:** Enable monitoring and prevent silent failures
**Parallelization:** Stories 06-08 can run in parallel

### Phase 3: Code Quality & Maintainability (Weeks 3-4)
**Goal:** Reduce technical debt, prepare for AI integration
**Parallelization:** Stories 09-11 sequential (architectural changes)

### Phase 4: AI-Readiness (Weeks 5-6)
**Goal:** Enable AI-driven content generation and personalization
**Parallelization:** Stories 12-15 can run in parallel after Story 11

---

## Master Schedule

| Seq ID | Story Name | Risk Addressed | Target Files | Complexity | Dependencies | Week |
|--------|------------|----------------|--------------|------------|--------------|------|
| **01** | Eliminate Duplicate Module Registry | Version Drift, Maintenance | `src/math/js/features/module-registry.js`, `Emma_math_lab.html` | **Low (2)** | None | 1 |
| **02** | Add Backend Rate Limiting | DDoS Vulnerability | `server.js`, `package.json` | **Low (2)** | None | 1 |
| **03** | Implement Backend Input Validation | XSS, Data Integrity | `server.js` | **Medium (4)** | None | 1 |
| **04** | Restrict CORS to Whitelist | Security Vulnerability | `server.js` | **Low (1)** | None | 1 |
| **05** | Fix Blocking File I/O with Async Queue | Server Hangs Under Load | `server.js` | **Medium (5)** | None | 1 |
| **06** | Add Client-Side Error Telemetry | Silent Failures | `Emma_math_lab.html`, `English/index.html`, `server.js` | **Medium (4)** | None | 2 |
| **07** | Add Performance Monitoring | Observability Gap | `Emma_math_lab.html`, `English/js/app.js` | **Medium (3)** | None | 2 |
| **08** | Implement Backend Health Metrics | SRE Readiness | `server.js` | **Low (2)** | None | 2 |
| **09** | Extract Magic Numbers to Constants | Maintainability | All module files, `src/math/js/core/constants.js` (new) | **Medium (5)** | ⚠️ Must complete before Story 10 | 3 |
| **10** | Standardize Module Registration | Inconsistent Architecture | `Emma_math_lab.html`, `src/math/js/modules/decimal.js` (new), `multiplication.js` (new), `numberline.js` (new) | **High (7)** | ⚠️ Requires Story 09 | 3 |
| **11** | Implement Content Validation Layer | AI Injection Safety | `src/math/js/core/content-validator.js` (new), `English/js/data/stories.js`, `English/js/data/vocabulary.js` | **High (6)** | None | 4 |
| **12** | Externalize Strings to i18n System | AI Personalization Blocker | `src/math/js/core/i18n.js` (new), all module files | **High (8)** | ⚠️ Requires Story 11 | 5 |
| **13** | Implement Data Retention Policy | GDPR Compliance | `English/js/utils/storage.js`, `src/math/Emma_math_lab.html` | **Medium (4)** | None | 5 |
| **14** | Add Parental Consent Mechanism | COPPA Compliance | `index.html` (landing), `src/math/Emma_math_lab.html`, `English/index.html` | **Medium (5)** | None | 6 |
| **15** | Build AI Content Injection API | AI-First Architecture | `src/math/js/core/ai-content-manager.js` (new), `server.js` | **High (7)** | ⚠️ Requires Stories 11, 12 | 6 |

---

## Complexity Scoring Legend

| Score | Definition | Estimated Time | Risk |
|-------|------------|----------------|------|
| **1-2** | Low - Single file, simple change | 1-2 hours | Low |
| **3-5** | Medium - Multiple files or moderate logic | 3-6 hours | Medium |
| **6-8** | High - Architectural change or extensive refactoring | 1-2 days | Medium-High |
| **9-10** | Critical - Major refactoring, high risk | 3+ days | High |

---

## Dependency Graph

```
Phase 1 (Parallel)
├── Story 01 ──┐
├── Story 02 ──┤
├── Story 03 ──┤──→ Phase 2 (Parallel)
├── Story 04 ──┤    ├── Story 06 ──┐
└── Story 05 ──┘    ├── Story 07 ──┤──→ Phase 3 (Sequential)
                    └── Story 08 ──┘    ├── Story 09 ──→ Story 10 ──┐
                                         └── Story 11 ──────────────┤──→ Phase 4 (Parallel)
                                                                     │    ├── Story 12 ──┐
                                                                     │    ├── Story 13 ──┤──→ Story 15
                                                                     └────→ Story 14 ────┘
```

**Critical Path:** Stories 09 → 10 → 12 → 15 (must be sequential)

---

## Detailed Story Breakdown

### Phase 1: Critical Security Fixes (Week 1)

#### Story 01: Eliminate Duplicate Module Registry
**Priority:** P0 (Critical)
**Risk:** Version drift, maintenance confusion
**Complexity:** Low (2)
**Can Run in Parallel:** ✅ Yes

**Target Files:**
- `src/math/js/features/module-registry.js` (DELETE)
- `src/math/Emma_math_lab.html` (UPDATE: script src reference)

**Acceptance Criteria:**
- Only one `module-registry.js` exists in codebase
- All modules still register successfully
- Console shows "✅ Module registered" for all 7 modules

---

#### Story 02: Add Backend Rate Limiting
**Priority:** P0 (Critical)
**Risk:** DDoS vulnerability on `/api/flag` endpoint
**Complexity:** Low (2)
**Can Run in Parallel:** ✅ Yes

**Target Files:**
- `server.js` (ADD: rate limiting middleware)
- `package.json` (ADD: `express-rate-limit` dependency)

**Acceptance Criteria:**
- `/api/flag` limited to 10 requests/minute/IP
- `/api/health` not rate-limited
- Rate limit exceeded returns 429 status with clear message

---

#### Story 03: Implement Backend Input Validation
**Priority:** P0 (Critical)
**Risk:** XSS, data integrity, malformed requests
**Complexity:** Medium (4)
**Can Run in Parallel:** ✅ Yes

**Target Files:**
- `server.js` (ADD: validation middleware, sanitization functions)

**Acceptance Criteria:**
- `module` field validated against whitelist
- `timestamp` validated as valid ISO8601 date
- String fields sanitized (remove `<` and `>`)
- Payload size limited to 10KB
- Invalid requests return 400 with descriptive error

---

#### Story 04: Restrict CORS to Whitelist
**Priority:** P0 (Critical)
**Risk:** Unauthorized API access
**Complexity:** Low (1)
**Can Run in Parallel:** ✅ Yes

**Target Files:**
- `server.js` (UPDATE: CORS configuration)

**Acceptance Criteria:**
- CORS only allows: `file://`, `http://localhost:3000`
- Other origins receive CORS error
- OPTIONS preflight requests handled correctly

---

#### Story 05: Fix Blocking File I/O with Async Queue
**Priority:** P0 (Critical)
**Risk:** Server hangs under concurrent load
**Complexity:** Medium (5)
**Can Run in Parallel:** ✅ Yes

**Target Files:**
- `server.js` (REFACTOR: Replace `fs.writeFileSync` with async queue)

**Acceptance Criteria:**
- All file operations use `fs.promises`
- Write queue prevents race conditions
- Server handles 100 concurrent `/api/flag` requests without timeout
- Event loop not blocked (test with `ab` load testing)

---

### Phase 2: Infrastructure & Observability (Week 2)

#### Story 06: Add Client-Side Error Telemetry
**Priority:** P0 (Critical)
**Risk:** Silent failures, no production debugging
**Complexity:** Medium (4)
**Can Run in Parallel:** ✅ Yes

**Target Files:**
- `src/math/Emma_math_lab.html` (ADD: global error handlers)
- `English/index.html` (ADD: global error handlers)
- `server.js` (ADD: `POST /api/error` endpoint)

**Acceptance Criteria:**
- All uncaught errors logged to backend
- Unhandled promise rejections caught
- Errors stored in LocalStorage if backend unreachable
- Session ID tracks errors across session

---

#### Story 07: Add Performance Monitoring
**Priority:** P1 (High)
**Risk:** Performance regressions undetected
**Complexity:** Medium (3)
**Can Run in Parallel:** ✅ Yes

**Target Files:**
- `src/math/Emma_math_lab.html` (ADD: performance monitor)
- `English/js/app.js` (ADD: performance tracking)

**Acceptance Criteria:**
- Question generation time tracked
- LocalStorage operations tracked
- Slow operations (>1s) logged as warnings
- Metrics exportable from console

---

#### Story 08: Implement Backend Health Metrics
**Priority:** P1 (High)
**Risk:** No SRE visibility
**Complexity:** Low (2)
**Can Run in Parallel:** ✅ Yes

**Target Files:**
- `server.js` (ADD: `GET /api/metrics` endpoint)

**Acceptance Criteria:**
- `/api/metrics` returns uptime, memory, CPU usage
- Endpoint not rate-limited
- Metrics formatted as JSON

---

### Phase 3: Code Quality & Maintainability (Weeks 3-4)

#### Story 09: Extract Magic Numbers to Constants
**Priority:** P1 (High)
**Risk:** Maintainability, difficult difficulty tuning
**Complexity:** Medium (5)
**Can Run in Parallel:** ❌ No (required by Story 10)

**Target Files:**
- `src/math/js/core/constants.js` (NEW)
- All module files (UPDATE: replace magic numbers)

**Acceptance Criteria:**
- All difficulty thresholds in `constants.js`
- All difficulty ranges in `constants.js`
- No hardcoded numbers in module logic
- Constants exported and imported correctly

---

#### Story 10: Standardize Module Registration
**Priority:** P1 (High)
**Risk:** Inconsistent architecture, hard to scale
**Complexity:** High (7)
**Can Run in Parallel:** ❌ No (depends on Story 09)

**Target Files:**
- `src/math/Emma_math_lab.html` (EXTRACT: decimal, multiplication, numberline modules)
- `src/math/js/modules/decimal.js` (NEW)
- `src/math/js/modules/multiplication.js` (NEW)
- `src/math/js/modules/numberline.js` (NEW)
- `src/math/js/module-registry.js` (UPDATE: remove conditional registration)

**Acceptance Criteria:**
- All 7 modules use `ModuleRegistry.register()`
- No conditional registration (`if (typeof ... !== 'undefined')`)
- All modules work standalone (can be imported independently)
- Backward compatibility with existing LocalStorage data

---

#### Story 11: Implement Content Validation Layer
**Priority:** P1 (High)
**Risk:** AI-generated content unsafe, app crashes
**Complexity:** High (6)
**Can Run in Parallel:** ✅ Yes

**Target Files:**
- `src/math/js/core/content-validator.js` (NEW)
- `English/js/data/stories.js` (UPDATE: validate on load)
- `English/js/data/vocabulary.js` (UPDATE: validate on load)

**Acceptance Criteria:**
- Schema validation for questions, stories, vocabulary
- Runtime validation catches invalid data
- Validation failures logged to backend
- Invalid content throws descriptive error

---

### Phase 4: AI-Readiness (Weeks 5-6)

#### Story 12: Externalize Strings to i18n System
**Priority:** P1 (High)
**Risk:** AI cannot personalize feedback
**Complexity:** High (8)
**Can Run in Parallel:** ❌ No (depends on Story 11)

**Target Files:**
- `src/math/js/core/i18n.js` (NEW)
- All module files (UPDATE: replace hardcoded Hebrew strings)
- `English/js/app.js` (UPDATE: replace hardcoded English strings)

**Acceptance Criteria:**
- Zero hardcoded Hebrew/English strings in JavaScript
- All user-facing text in `i18n.js`
- AI can inject custom strings via API
- Fallback to key if translation missing

---

#### Story 13: Implement Data Retention Policy
**Priority:** P1 (High)
**Risk:** GDPR violation (data kept indefinitely)
**Complexity:** Medium (4)
**Can Run in Parallel:** ✅ Yes

**Target Files:**
- `English/js/utils/storage.js` (ADD: auto-cleanup function)
- `src/math/Emma_math_lab.html` (ADD: cleanup on load)

**Acceptance Criteria:**
- Sessions older than 90 days auto-deleted
- Cleanup runs on app load
- User can manually delete all data
- Data export function provided

---

#### Story 14: Add Parental Consent Mechanism
**Priority:** P1 (High)
**Risk:** COPPA violation
**Complexity:** Medium (5)
**Can Run in Parallel:** ✅ Yes

**Target Files:**
- `index.html` (landing page) (ADD: consent banner)
- `src/math/Emma_math_lab.html` (ADD: consent check)
- `English/index.html` (ADD: consent check)

**Acceptance Criteria:**
- Consent banner shown on first visit
- App blocked until consent given
- Consent stored in LocalStorage
- Privacy policy link provided

---

#### Story 15: Build AI Content Injection API
**Priority:** P1 (High)
**Risk:** AI integration blocked
**Complexity:** High (7)
**Can Run in Parallel:** ❌ No (depends on Stories 11, 12)

**Target Files:**
- `src/math/js/core/ai-content-manager.js` (NEW)
- `server.js` (ADD: `POST /api/ai-feedback` endpoint)

**Acceptance Criteria:**
- AI can inject questions via `aiContentManager.injectQuestion()`
- All AI-generated content validated before use
- Approval workflow for human review
- Validation failures reported to backend
- Approved questions persisted to LocalStorage

---

## Risk Mitigation Strategy

### High-Risk Stories (Score 6+)
- **Story 10:** Large refactoring, must not break existing modules
  - **Mitigation:** Extract one module at a time, test after each extraction
- **Story 12:** Touches all modules, high regression risk
  - **Mitigation:** Use find/replace carefully, add i18n tests first
- **Story 15:** Complex new system
  - **Mitigation:** Build in isolation, integrate last

### Rollback Plan
- All stories must be revertible via `git revert`
- No database migrations (LocalStorage schema compatible)
- Feature flags for new functionality (if applicable)

---

## Success Metrics

### By Phase 1 Completion (Week 1)
- ✅ Zero critical security vulnerabilities
- ✅ Server handles 100 concurrent requests
- ✅ All endpoints rate-limited and validated

### By Phase 2 Completion (Week 2)
- ✅ Error telemetry operational
- ✅ Performance metrics tracked
- ✅ Backend health monitoring enabled

### By Phase 3 Completion (Week 4)
- ✅ All modules use standard registration
- ✅ Zero magic numbers in code
- ✅ Content validation layer operational

### By Phase 4 Completion (Week 6)
- ✅ i18n system operational (AI personalization ready)
- ✅ GDPR/COPPA compliance achieved
- ✅ AI content injection API functional
- ✅ **Health Score: 90/100**

---

## Execution Notes for AI Agent

### General Workflow (Per Story)
1. Read `00_global_context.md` and current story file
2. Create branch: `fix/story-[ID]-[slug]`
3. Implement changes according to "The Fix" section
4. Run verification plan (section 4 of story)
5. Commit with conventional commit message
6. Create PR using provided template (section 5 of story)
7. Merge to `main` after tests pass

### When to Ask for Human Review
- If verification plan fails and fix is not obvious
- If architectural assumption conflicts with observed behavior
- If new dependencies need to be added beyond those specified
- If breaking change is unavoidable

### Context Management
- Load `00_global_context.md` once at start of work
- Load current story file for each new story
- Do NOT load other stories (prevents context overflow)
- Refer to audit report only if story references specific findings

---

**Plan Status:** Ready for Execution
**First Stories to Execute:** 01, 02, 03, 04, 05 (parallel batch)
**Estimated Total Duration:** 6 weeks (30 working days)
**Total Story Points:** 64 (average 4.3 per story)
