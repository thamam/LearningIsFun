# Global Context: LearningIsFun Refactoring

**Repository:** LearningIsFun
**Language Stack:** JavaScript (ES6), HTML5, CSS3, Node.js (Express)
**Architecture:** Dual-module educational application (Hebrew Math + English Language)
**Target Users:** Children (Grade 3, ~8 years old)
**Current Health Score:** 67/100 (Functional MVP with Technical Debt)

---

## System Architecture Overview

### Frontend Applications

#### 1. Hebrew Math Application
**Entry Point:** `src/math/Emma_math_lab.html` (4,919 lines - monolithic)

**Built-in Modules (Inline in HTML):**
- Decimal Numbers (מבנה עשרוני)
- Multiplication (כפל)
- Number Line (ישר מספרים)

**Registered Modules (External JS):**
- Division (`src/math/js/modules/division_module.js`)
- Fractions (`src/math/js/modules/fraction_module.js`)
- Order of Operations (`src/math/js/modules/order_operations_module.js`)
- Distributive Property (`src/math/js/modules/distributive_module.js`)

**Core Systems:**
- Module Registry: `src/math/js/module-registry.js` ⚠️ **DUPLICATE EXISTS** at `src/math/js/features/module-registry.js`
- State Management: Individual state objects per module (e.g., `decimalState`, `divisionState`)
- Persistence: LocalStorage with keys like `emmaDecimalProgress`, `emmaDivisionProgress`

#### 2. English Language Application
**Entry Point:** `English/index.html`

**Modules:**
- Listen & Respond (`English/js/app.js`)
- Speak & Practice (uses Web Speech API)
- Read & Match
- Write & Create

**Core Systems:**
- Voice Manager: `English/js/voice-manager.js` (Web Speech API wrapper)
- Storage Manager: `English/js/utils/storage.js`
- Validation Utils: `English/js/utils/validation.js`
- Data: `English/js/data/stories.js`, `English/js/data/vocabulary.js`

### Backend

**Server:** `server.js` (Express.js, 106 lines)
- **Purpose:** Flag logging for problematic questions
- **Endpoints:**
  - `POST /api/flag` - Logs flagged questions to `logs/[module]/[date].json`
  - `GET /api/health` - Health check
- **Port:** 3000 (configurable via `process.env.PORT`)

**Launcher:** `launch.js` (Orchestrates server startup + browser opening)

---

## Architectural Rules

### 1. Security & Privacy (COPPA/GDPR Compliance)
- ❌ **No hardcoded secrets** (API keys, credentials)
- ❌ **No PII in logs without parental consent**
- ✅ **LocalStorage only for educational progress** (no personal identifiers)
- ✅ **Voice data must be disclosed** (Web Speech API sends to Google)
- ✅ **All network requests must use HTTPS in production**

### 2. Data Validation
- ✅ **All user input must be sanitized** (prevent XSS)
- ✅ **All AI-generated content must be validated** against schemas
- ✅ **Backend endpoints must validate all fields** (type, format, whitelist)

### 3. State Management
- ✅ **State structure must be consistent** across all modules:
  ```javascript
  {
    level: 'קל' | 'בינוני' | 'קשה',
    totalQuestions: number,
    correctAnswers: number,
    currentStreak: number,
    sessionHistory: array,
    startTime: timestamp,
    lastSaved: timestamp
  }
  ```
- ✅ **All state changes must call `saveProgress(moduleName)`**
- ✅ **Race conditions must be prevented** (use write queues for concurrent operations)

### 4. Error Handling & Observability
- ✅ **All errors must be logged** (client and server)
- ✅ **No silent failures** - user must see feedback
- ❌ **No `console.error()` only** - must also send to backend telemetry
- ✅ **Performance metrics must be tracked** (question generation time, load times)

### 5. Code Quality
- ❌ **No magic numbers** - use named constants
- ❌ **No global namespace pollution** - use modules or namespaced objects
- ❌ **No duplicate code** - extract to shared utilities
- ✅ **All functions must have single responsibility**
- ✅ **Use JSDoc for all public APIs**

### 6. Testing & Deployment
- ✅ **All PRs must pass existing tests** (currently none - add tests first!)
- ✅ **New code must include tests** (unit + integration)
- ✅ **No breaking changes to LocalStorage schema** without migration
- ✅ **Backward compatibility with existing user data**

---

## Definition of Done (Per Story)

Every completed story must satisfy:

### ✅ Code Quality
- [ ] No ESLint errors (once configured)
- [ ] No hardcoded values (use constants)
- [ ] JSDoc comments on all new/modified functions
- [ ] No duplicate code introduced

### ✅ Testing
- [ ] All existing tests pass (`npm test`)
- [ ] New tests added for the fix (unit or integration)
- [ ] Manual testing completed (see story's Verification Plan)
- [ ] No regressions in other modules

### ✅ Security
- [ ] No secrets committed
- [ ] Input validation added/verified
- [ ] XSS vulnerabilities checked
- [ ] CORS configuration secure

### ✅ Documentation
- [ ] CHANGELOG.md updated with change summary
- [ ] Relevant docs updated (if architectural change)
- [ ] PR description matches template (see story file)
- [ ] Code comments explain "why" not "what"

### ✅ Deployment Readiness
- [ ] Changes tested in browser (manual QA)
- [ ] LocalStorage backward compatibility verified
- [ ] No breaking API changes
- [ ] Can be deployed independently (no dependencies on other PRs)

---

## Repository Map

### Core Logic Location

```
LearningIsFun/
├── src/math/                           # Hebrew Math Application
│   ├── Emma_math_lab.html              # Main entry (MONOLITHIC - needs refactoring)
│   ├── css/
│   │   └── main.css                    # All styles (1,231 lines)
│   ├── js/
│   │   ├── module-registry.js          # ⚠️ PRIMARY (keep this)
│   │   ├── features/
│   │   │   └── module-registry.js      # ⚠️ DUPLICATE (delete this)
│   │   └── modules/
│   │       ├── division_module.js
│   │       ├── fraction_module.js
│   │       ├── order_operations_module.js
│   │       └── distributive_module.js
│   └── docs/                           # Documentation (20 files)
│
├── English/                            # English Language Application
│   ├── index.html                      # Main entry
│   ├── css/
│   │   └── main.css                    # English styles (926 lines)
│   └── js/
│       ├── app.js                      # Main application logic (1,176 lines)
│       ├── voice-manager.js            # Web Speech API wrapper
│       ├── data/
│       │   ├── stories.js              # Story content (5 easy + 1 medium)
│       │   └── vocabulary.js           # Vocabulary words (80 words, 3 tiers)
│       └── utils/
│           ├── storage.js              # LocalStorage wrapper
│           └── validation.js           # Input validation utilities
│
├── server.js                           # Backend API (Express, 106 lines)
├── launch.js                           # Launcher script (173 lines)
├── package.json                        # Dependencies (express, cors, open)
│
├── logs/                               # Backend logs (gitignored)
│   ├── decimal/[date].json
│   ├── multiplication/[date].json
│   └── numberline/[date].json
│
├── docs/                               # Root-level documentation
│   ├── reports/
│   │   ├── SECURITY_ARCHITECTURE_AUDIT_2025.md  # Latest audit
│   │   └── STABILITY_UX_AUDIT_REPORT.md
│   ├── grade3/                         # Curriculum materials
│   └── research/                       # Study plans
│
└── archive/                            # Archived files (backups, test results)
```

---

## Critical Interdependencies

### 1. Module Registry System
**Files:** `src/math/js/module-registry.js`, all module files
**Dependency:** All modules must register with `ModuleRegistry.register()`
**Risk:** Changing registry API breaks all modules

### 2. State Persistence
**Files:** All modules, `English/js/utils/storage.js`
**Dependency:** LocalStorage schema must remain backward compatible
**Risk:** Schema changes break existing user progress

### 3. Backend Flag Logging
**Files:** `server.js`, `src/math/Emma_math_lab.html` (inline flag submission code)
**Dependency:** Flag submission format must match server expectations
**Risk:** API changes break flag logging feature

### 4. Web Speech API (English App)
**Files:** `English/js/voice-manager.js`, `English/js/app.js`
**Dependency:** Browser must support `SpeechRecognition` and `SpeechSynthesis`
**Risk:** Changes to voice manager break all speaking/listening activities

---

## Known Issues (From Audit Report)

### 🔴 Critical (P0 - Fix Immediately)
1. **Duplicate `module-registry.js`** - Version drift risk
2. **No client-side error telemetry** - Silent failures
3. **Blocking file I/O in `server.js`** - Server hangs under load
4. **No rate limiting on `/api/flag`** - DDoS vulnerability
5. **CORS allows all origins** - Security vulnerability
6. **No input validation on flag endpoint** - XSS/data integrity risk

### 🟡 High Priority (P1 - Fix Within 2 Weeks)
7. **4,919-line monolithic HTML** - Maintainability nightmare
8. **Inconsistent module registration** - 3 built-in modules not using registry
9. **Hardcoded strings** - No i18n system, prevents AI personalization
10. **Magic numbers throughout** - Difficulty tuning requires code changes
11. **No content validation layer** - AI-generated content unsafe
12. **LocalStorage PII exposure** - GDPR concern (timestamps, user answers)
13. **No parental consent mechanism** - COPPA violation

---

## Communication Protocols

### Git Workflow
- **Branch naming:** `fix/story-[ID]-[slug]` (e.g., `fix/story-01-duplicate-registry`)
- **Commit messages:** Conventional Commits format
  ```
  type(scope): Short description

  Longer explanation if needed

  Fixes: Story [ID]
  ```
  Types: `fix`, `feat`, `refactor`, `test`, `docs`, `chore`

### PR Process
1. Create branch from `main`
2. Implement fix according to story requirements
3. Run verification plan locally
4. Commit with conventional commit message
5. Push and create PR using story's PR template
6. Ensure all CI checks pass (once configured)
7. Request review
8. Merge to `main` (squash or rebase preferred)

---

## Testing Strategy

### Current State
⚠️ **No automated tests exist** - Manual testing only

### Target State (Per Story)
- **Unit tests:** For utility functions, data validation, state management
- **Integration tests:** For module interactions, API endpoints
- **E2E tests:** For critical user flows (question generation → answer → feedback)

### Test Framework Recommendations
- **Frontend:** Jest + Testing Library
- **Backend:** Jest + Supertest (for API testing)
- **E2E:** Playwright (browser automation)

---

## Deployment Context

### Current Deployment
- **Development:** `npm run launch` (starts server + opens HTML in browser)
- **Entry point:** `file:///.../src/math/Emma_math_lab.html` (direct file access)
- **Backend:** `http://localhost:3000`

### Production Requirements (Future)
- **Frontend:** Static hosting (S3, Netlify, Vercel)
- **Backend:** Cloud deployment (AWS Lambda, Cloud Run, Heroku)
- **HTTPS:** Required for production (voice API, CORS, security)
- **CDN:** For assets (fonts, CSS, JS)

---

## Key Contacts & Resources

### Documentation
- **Project Overview:** `README.md`
- **Claude Guidelines:** `CLAUDE.md`
- **Latest Audit:** `docs/reports/SECURITY_ARCHITECTURE_AUDIT_2025.md`
- **Original Requirements:** `original_prompt.md`

### External Dependencies
- **Fonts:** Google Fonts (Noto Sans Hebrew, Poppins)
- **CSS Framework:** Pico CSS (CDN)
- **Web APIs:** Web Speech API (browser native)

---

## Success Metrics

### Code Health
- ✅ Reduce monolithic HTML from 4,919 lines to < 500 lines
- ✅ Eliminate all duplicate files
- ✅ Extract all magic numbers to constants
- ✅ Achieve 80%+ test coverage

### Performance
- ✅ Question generation < 100ms
- ✅ LocalStorage operations < 50ms
- ✅ Server response time < 200ms

### Security
- ✅ Zero XSS vulnerabilities
- ✅ All endpoints rate-limited
- ✅ Input validation on 100% of user inputs
- ✅ COPPA/GDPR compliance achieved

### AI Readiness
- ✅ All strings externalized (i18n system)
- ✅ Content validation layer implemented
- ✅ AI injection API operational
- ✅ Question templates data-driven

---

**Last Updated:** 2025-11-20
**Audit Report:** `docs/reports/SECURITY_ARCHITECTURE_AUDIT_2025.md`
**Health Score:** 67/100 → Target: 90/100
