# Story 03: Implement Backend Input Validation

**Priority:** P0 (Critical)
**Complexity:** Medium (4)
**Estimated Time:** 3-4 hours
**Can Run in Parallel:** ✅ Yes
**Dependencies:** None

---

## 1. The Problem (Context)

### From Audit Report: Section 3 - Observability & Reliability (SRE)

**Finding:**
> 🔴 **NO INPUT VALIDATION ON FLAG SUBMISSION**
>
> **Current validation (server.js:32-37):**
> ```javascript
> if (!flagData.module || !flagData.timestamp) {
>     return res.status(400).json({
>         success: false,
>         error: 'Missing required fields'
>     });
> }
> ```
>
> **Missing validation:**
> - ❌ No check if `module` is valid (accepts `"<script>alert(1)</script>"`)
> - ❌ No timestamp format validation (accepts `"not-a-date"`)
> - ❌ No max payload size limit (accepts 10MB JSON bomb)
> - ❌ No sanitization of `questionType`, `userAnswer`, etc.

**Current State:**
The `/api/flag` endpoint performs minimal validation:
- Only checks if `module` and `timestamp` exist
- Does NOT validate format, type, or content
- Does NOT sanitize string inputs
- Does NOT enforce payload size limits

**Attack Vectors:**

1. **XSS via Stored Data:**
   ```javascript
   // Malicious payload
   {
     "module": "<script>alert('XSS')</script>",
     "question": "<img src=x onerror='alert(1)'>",
     "userAnswer": "evil payload"
   }
   ```
   If logs are viewed in a web interface later, XSS executes.

2. **JSON Bomb (DoS):**
   ```javascript
   // 10MB payload causes server memory exhaustion
   {
     "module": "decimal",
     "timestamp": "2025-11-20",
     "userAnswer": "A".repeat(10000000)  // 10 million characters
   }
   ```

3. **Invalid Data Corruption:**
   ```javascript
   // Breaks log file parsing
   {
     "module": "invalid-module",
     "timestamp": "not-a-timestamp",
     "questionType": 123,  // Should be string
     "userAnswer": { "nested": "object" }  // Unexpected type
   }
   ```

**Why This Matters:**
- **Security:** XSS vulnerabilities if logs displayed in web UI
- **Reliability:** Invalid data corrupts log files, breaks analytics
- **Debuggability:** Garbage data makes logs useless for debugging
- **Storage:** Large payloads waste disk space

---

## 2. The Fix (Requirements)

### Objective
Implement comprehensive input validation and sanitization for all `/api/flag` request fields.

### Step-by-Step Instructions

#### Step 1: Add Validation Helper Functions
**Action:** Create validation and sanitization utilities at the top of `server.js`.

**Add this code after `const modules = ['decimal', 'multiplication', 'numberline'];` (around line 15):**

```javascript
// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Valid module names (whitelist)
 */
const VALID_MODULES = [
    'decimal',
    'multiplication',
    'numberline',
    'division',
    'fraction',
    'order',          // order_operations
    'distributive'
];

/**
 * Valid difficulty levels
 */
const VALID_LEVELS = ['קל', 'בינוני', 'קשה'];

/**
 * Valid problem report reasons
 */
const VALID_REASONS = ['wrong_answer', 'unclear_purpose', 'other'];

/**
 * Sanitize string by removing potentially dangerous characters
 * @param {any} input - Input to sanitize
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} Sanitized string
 */
function sanitizeString(input, maxLength = 1000) {
    if (typeof input !== 'string') {
        return String(input).substring(0, maxLength);
    }

    // Remove < and > to prevent HTML injection
    let sanitized = input.replace(/[<>]/g, '');

    // Trim whitespace
    sanitized = sanitized.trim();

    // Enforce max length
    if (sanitized.length > maxLength) {
        sanitized = sanitized.substring(0, maxLength);
    }

    return sanitized;
}

/**
 * Validate timestamp is a valid ISO8601 date string
 * @param {any} timestamp - Timestamp to validate
 * @returns {boolean} True if valid
 */
function isValidTimestamp(timestamp) {
    if (typeof timestamp !== 'string') {
        return false;
    }

    // Try parsing as date
    const date = new Date(timestamp);

    // Check if valid date and not too far in past/future
    if (isNaN(date.getTime())) {
        return false;
    }

    // Reject dates before 2020 or more than 1 day in the future
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const minDate = new Date('2020-01-01').getTime();

    if (date.getTime() < minDate || date.getTime() > now + oneDay) {
        return false;
    }

    return true;
}

/**
 * Validate and sanitize flag data
 * @param {object} flagData - Raw flag data from request
 * @returns {object} { valid: boolean, sanitized?: object, error?: string }
 */
function validateFlagData(flagData) {
    // Check if flagData is an object
    if (!flagData || typeof flagData !== 'object') {
        return { valid: false, error: 'Invalid request body: expected JSON object' };
    }

    // Validate required fields exist
    if (!flagData.module || !flagData.timestamp) {
        return { valid: false, error: 'Missing required fields: module and timestamp' };
    }

    // Validate module name (whitelist)
    if (!VALID_MODULES.includes(flagData.module)) {
        return {
            valid: false,
            error: `Invalid module: "${flagData.module}". Valid modules: ${VALID_MODULES.join(', ')}`
        };
    }

    // Validate timestamp format
    if (!isValidTimestamp(flagData.timestamp)) {
        return {
            valid: false,
            error: 'Invalid timestamp: must be a valid ISO8601 date string'
        };
    }

    // Build sanitized object
    const sanitized = {
        module: flagData.module,  // Already validated against whitelist
        timestamp: flagData.timestamp,  // Already validated
        question: sanitizeString(flagData.question, 1000),
        userAnswer: sanitizeString(flagData.userAnswer, 500),
        correctAnswer: sanitizeString(flagData.correctAnswer, 500),
        questionType: sanitizeString(flagData.questionType, 100),
        difficulty: VALID_LEVELS.includes(flagData.difficulty)
            ? flagData.difficulty
            : undefined,
        reason: VALID_REASONS.includes(flagData.reason)
            ? flagData.reason
            : undefined
    };

    return { valid: true, sanitized };
}
```

#### Step 2: Add Payload Size Limit Middleware
**Action:** Configure Express to reject large payloads.

**Find this line (around line 11):**
```javascript
app.use(express.json());
```

**Replace with:**
```javascript
// Limit JSON payload size to 10KB (prevents JSON bombs)
app.use(express.json({ limit: '10kb' }));
```

**Explanation:** This prevents attackers from sending 10MB payloads that exhaust server memory.

#### Step 3: Update /api/flag Endpoint to Use Validation
**Action:** Replace manual validation with comprehensive validation function.

**Find this section (around line 27-37):**
```javascript
app.post('/api/flag', (req, res) => {
    try {
        const flagData = req.body;

        // Validate required fields
        if (!flagData.module || !flagData.timestamp) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: module and timestamp'
            });
        }
```

**Replace with:**
```javascript
app.post('/api/flag', (req, res) => {
    try {
        const flagData = req.body;

        // Validate and sanitize input
        const validation = validateFlagData(flagData);

        if (!validation.valid) {
            console.warn('⚠️ Invalid flag submission:', validation.error);
            return res.status(400).json({
                success: false,
                error: validation.error
            });
        }

        // Use sanitized data from this point forward
        const sanitizedData = validation.sanitized;
```

**Important:** Change all subsequent references from `flagData` to `sanitizedData` in the rest of the function.

#### Step 4: Update Log Writing to Use Sanitized Data
**Action:** Ensure only sanitized data is written to log files.

**Find this line (around line 61):**
```javascript
logs.push(flagData);
```

**Replace with:**
```javascript
logs.push(sanitizedData);
```

**Find this line (around line 40):**
```javascript
const module = flagData.module;
```

**Replace with:**
```javascript
const module = sanitizedData.module;
```

**Find this line (around line 66):**
```javascript
console.log(`✅ Flag logged: ${module} - ${dateStr} (Total: ${logs.length})`);
```

**Keep as-is** (module is already from sanitized data at this point).

#### Step 5: Add Request Logging for Security Monitoring
**Action:** Log validation failures for security analysis.

**Add this after the validation failure return (around line 35):**
```javascript
if (!validation.valid) {
    // Log validation failure for security monitoring
    console.warn('⚠️ Invalid flag submission:', {
        error: validation.error,
        ip: req.ip,
        timestamp: new Date().toISOString(),
        bodyKeys: Object.keys(req.body)
    });

    return res.status(400).json({
        success: false,
        error: validation.error
    });
}
```

---

## 3. Target Files

### Files to Modify
- ✏️ `server.js` - Add validation utilities and update `/api/flag` endpoint

### Files to Create
- None (all logic in `server.js`)

### Files to Keep (No Changes)
- ✅ Frontend files - No changes needed
- ✅ `package.json` - No new dependencies required

---

## 4. Verification Plan

### Step 1: Start Server
```bash
npm start
```

**Expected:** Server starts without errors.

### Step 2: Test Valid Flag Submission
**Test that legitimate flags still work:**

```bash
curl -X POST http://localhost:3000/api/flag \
  -H "Content-Type: application/json" \
  -d '{
    "module": "decimal",
    "timestamp": "2025-11-20T12:00:00.000Z",
    "question": "What is 5 + 3?",
    "userAnswer": "8",
    "correctAnswer": "8",
    "questionType": "addition",
    "difficulty": "קל",
    "reason": "wrong_answer"
  }' \
  -w "\nHTTP Status: %{http_code}\n"
```

**Expected Result:**
- HTTP 200
- `"success": true`
- Flag written to log file

### Step 3: Test Invalid Module Name
**Test whitelist enforcement:**

```bash
curl -X POST http://localhost:3000/api/flag \
  -H "Content-Type: application/json" \
  -d '{
    "module": "hacking",
    "timestamp": "2025-11-20T12:00:00.000Z"
  }' \
  -w "\nHTTP Status: %{http_code}\n"
```

**Expected Result:**
- HTTP 400
- `"success": false`
- Error: `"Invalid module: \"hacking\". Valid modules: decimal, multiplication, ..."`

### Step 4: Test XSS Payload (Sanitization)
**Test that HTML/JS is removed:**

```bash
curl -X POST http://localhost:3000/api/flag \
  -H "Content-Type: application/json" \
  -d '{
    "module": "decimal",
    "timestamp": "2025-11-20T12:00:00.000Z",
    "question": "<script>alert(\"XSS\")</script>Test question",
    "userAnswer": "<img src=x onerror=\"alert(1)\">42"
  }' \
  -w "\nHTTP Status: %{http_code}\n"
```

**Expected Result:**
- HTTP 200 (request accepted)
- Check log file: `logs/decimal/2025-11-20.json`
- Verify `<` and `>` characters removed:
  ```json
  {
    "question": "scriptalert(\"XSS\")/scriptTest question",
    "userAnswer": "img src=x onerror=\"alert(1)\"42"
  }
  ```

### Step 5: Test Invalid Timestamp
**Test timestamp validation:**

```bash
# Test 1: Not a date
curl -X POST http://localhost:3000/api/flag \
  -H "Content-Type: application/json" \
  -d '{
    "module": "decimal",
    "timestamp": "not-a-date"
  }' \
  -w "\nHTTP Status: %{http_code}\n"

# Test 2: Date too old (before 2020)
curl -X POST http://localhost:3000/api/flag \
  -H "Content-Type: application/json" \
  -d '{
    "module": "decimal",
    "timestamp": "2019-01-01T00:00:00.000Z"
  }' \
  -w "\nHTTP Status: %{http_code}\n"

# Test 3: Date too far in future (more than 1 day)
curl -X POST http://localhost:3000/api/flag \
  -H "Content-Type: application/json" \
  -d '{
    "module": "decimal",
    "timestamp": "2030-01-01T00:00:00.000Z"
  }' \
  -w "\nHTTP Status: %{http_code}\n"
```

**Expected Result:**
- All 3 tests: HTTP 400
- Error: `"Invalid timestamp: must be a valid ISO8601 date string"`

### Step 6: Test Payload Size Limit
**Test that large payloads are rejected:**

```bash
# Generate large payload (11KB, exceeds 10KB limit)
python3 -c "import json; print(json.dumps({'module': 'decimal', 'timestamp': '2025-11-20T12:00:00Z', 'userAnswer': 'A' * 11000}))" > /tmp/large-payload.json

curl -X POST http://localhost:3000/api/flag \
  -H "Content-Type: application/json" \
  -d @/tmp/large-payload.json \
  -w "\nHTTP Status: %{http_code}\n"
```

**Expected Result:**
- HTTP 413 (Payload Too Large)
- Response: `"request entity too large"`

### Step 7: Test String Length Truncation
**Test that excessively long strings are truncated:**

```bash
# 2000-character question (will be truncated to 1000)
curl -X POST http://localhost:3000/api/flag \
  -H "Content-Type: application/json" \
  -d "{\"module\":\"decimal\",\"timestamp\":\"2025-11-20T12:00:00Z\",\"question\":\"$(python3 -c 'print("A" * 2000)')\"}" \
  -w "\nHTTP Status: %{http_code}\n"
```

**Expected Result:**
- HTTP 200 (accepted)
- Check log file: question length is exactly 1000 characters (truncated)

### Step 8: Test Missing Required Fields
**Test that missing fields are caught:**

```bash
# Missing module
curl -X POST http://localhost:3000/api/flag \
  -H "Content-Type: application/json" \
  -d '{"timestamp": "2025-11-20T12:00:00Z"}' \
  -w "\nHTTP Status: %{http_code}\n"

# Missing timestamp
curl -X POST http://localhost:3000/api/flag \
  -H "Content-Type: application/json" \
  -d '{"module": "decimal"}' \
  -w "\nHTTP Status: %{http_code}\n"
```

**Expected Result:**
- Both: HTTP 400
- Error: `"Missing required fields: module and timestamp"`

### Step 9: Test Invalid JSON
**Test malformed JSON is rejected:**

```bash
curl -X POST http://localhost:3000/api/flag \
  -H "Content-Type: application/json" \
  -d 'not valid json' \
  -w "\nHTTP Status: %{http_code}\n"
```

**Expected Result:**
- HTTP 400
- Error from Express: `"Unexpected token 'o', \"not valid \"... is not valid JSON"`

### Step 10: Browser Integration Test
**Test from actual application:**

1. Start application: `npm run launch`
2. Navigate to Decimal module
3. Submit a problem report (click "⚠️ יש בעיה בתרגיל הזה")
4. Check log file: `logs/decimal/[today].json`
5. Verify all fields are sanitized (no `<` or `>` characters)

### Step 11: Security Validation
**Check server logs for validation warnings:**

```bash
# Check console output for validation failures
# Should see lines like:
# ⚠️ Invalid flag submission: { error: 'Invalid module: ...', ip: '::1', ... }
```

---

## 5. PR Description Template

```markdown
## Story 03: Implement Backend Input Validation

### Problem
The `/api/flag` endpoint performed minimal validation:
- Only checked if `module` and `timestamp` fields existed
- Did NOT validate format, type, or content
- Did NOT sanitize strings (XSS vulnerability)
- Did NOT limit payload size (DoS vulnerability)

### Attack Vectors Mitigated
1. **XSS via Stored Data:** Malicious HTML/JS in logs
2. **JSON Bomb:** 10MB payloads exhausting memory
3. **Invalid Data:** Corrupted log files breaking analytics
4. **Module Poisoning:** Invalid module names accepted

### Solution
Implemented comprehensive input validation:
- **Module whitelist:** Only 7 valid module names accepted
- **Timestamp validation:** Must be valid ISO8601, 2020-present, max +1 day future
- **String sanitization:** Remove `<` and `>` characters
- **Length limits:** Questions (1000 chars), answers (500 chars), types (100 chars)
- **Payload size limit:** 10KB maximum
- **Enum validation:** Difficulty levels, report reasons validated

### Changes
- **Modified:** `server.js`
  - Added validation utilities:
    - `VALID_MODULES`, `VALID_LEVELS`, `VALID_REASONS` constants
    - `sanitizeString()` - Remove HTML/JS characters
    - `isValidTimestamp()` - Validate date format and range
    - `validateFlagData()` - Comprehensive validation function
  - Updated `express.json()` to limit payload to 10KB
  - Replaced manual validation with `validateFlagData()`
  - Added security logging for validation failures

### Testing
#### ✅ Valid Flag Submission
- Legitimate flag with all fields → HTTP 200, flag logged correctly

#### ✅ Invalid Module Name
- `"module": "hacking"` → HTTP 400, error: "Invalid module"

#### ✅ XSS Payload Sanitization
- `"question": "<script>alert('XSS')</script>"` → Sanitized to "scriptalert('XSS')/script"
- Verified in log file: no `<` or `>` characters

#### ✅ Invalid Timestamp
- `"timestamp": "not-a-date"` → HTTP 400, error: "Invalid timestamp"
- `"timestamp": "2019-01-01"` (too old) → HTTP 400
- `"timestamp": "2030-01-01"` (too future) → HTTP 400

#### ✅ Payload Size Limit
- 11KB payload → HTTP 413, "request entity too large"

#### ✅ String Length Truncation
- 2000-char question → Accepted, truncated to 1000 chars in log

#### ✅ Missing Required Fields
- Missing `module` → HTTP 400, "Missing required fields"
- Missing `timestamp` → HTTP 400, "Missing required fields"

#### ✅ Malformed JSON
- Invalid JSON syntax → HTTP 400, Express parse error

#### ✅ Browser Integration
- Submitted problem report from app → Logged correctly with sanitization

### Security Impact
- ✅ **XSS Prevention:** All string inputs sanitized
- ✅ **DoS Prevention:** Payload size limited
- ✅ **Data Integrity:** Invalid data rejected, logs remain parseable
- ✅ **Attack Visibility:** Validation failures logged with IP for monitoring

### Configuration Details
```javascript
// Validation limits
MAX_QUESTION_LENGTH: 1000 characters
MAX_ANSWER_LENGTH: 500 characters
MAX_TYPE_LENGTH: 100 characters
MAX_PAYLOAD_SIZE: 10KB
VALID_DATE_RANGE: 2020-01-01 to now+1day
```

### Backward Compatibility
- ✅ All existing legitimate flags still accepted
- ✅ No breaking changes to API contract
- ✅ New validation is additive (rejects only invalid data)

### References
- **Audit Report:** `docs/reports/SECURITY_ARCHITECTURE_AUDIT_2025.md` (Section 3.3)
- **Orchestration Plan:** `health_refactor/01_orchestration_plan.md` (Story 03)
- **Fixes:** Critical Issue #6 (No Input Validation)

---

**Type:** `fix`
**Scope:** `security`
**Complexity:** Medium (4)
**Risk:** Low

Closes: Story 03
```

---

## 6. Rollback Plan

If this change causes unexpected issues:

### Immediate Rollback (Git)
```bash
git revert HEAD
npm start
```

### Manual Rollback
1. Remove validation utilities from `server.js`:
   - Delete `VALID_MODULES`, `VALID_LEVELS`, `VALID_REASONS` constants
   - Delete `sanitizeString()`, `isValidTimestamp()`, `validateFlagData()` functions

2. Revert `express.json()` to no limit:
   ```javascript
   app.use(express.json());
   ```

3. Restore original validation in `/api/flag`:
   ```javascript
   if (!flagData.module || !flagData.timestamp) {
       return res.status(400).json({
           success: false,
           error: 'Missing required fields: module and timestamp'
       });
   }
   ```

4. Change `sanitizedData` back to `flagData` throughout the function

---

## 7. Success Criteria

### Definition of Done
- [x] All validation utilities implemented (whitelist, sanitization, timestamp check)
- [x] Payload size limited to 10KB
- [x] Module name validated against whitelist (7 valid modules)
- [x] Timestamp validated (ISO8601, 2020-present, max +1 day future)
- [x] String fields sanitized (remove `<` and `>`)
- [x] Length limits enforced (questions 1000, answers 500, types 100)
- [x] Validation failures return HTTP 400 with descriptive errors
- [x] Security logging added for failed validations
- [x] All 11 test scenarios pass (see verification plan)
- [x] Browser integration test passes (problem reporting works)
- [x] No breaking changes to API
- [x] PR description uses provided template

### Conventional Commit Message
```
fix(security): implement comprehensive input validation for flag endpoint

Added validation and sanitization for /api/flag to prevent:
- XSS attacks via stored malicious HTML/JS
- DoS attacks via JSON bombs (10MB+ payloads)
- Data corruption via invalid module names/timestamps
- Log file poisoning via unsanitized strings

Changes:
- Add module name whitelist (7 valid modules)
- Validate timestamp format and range (2020 to now+1day)
- Sanitize strings (remove < and > characters)
- Enforce length limits (1000/500/100 chars)
- Limit payload size to 10KB
- Add security logging for validation failures

All existing legitimate flags continue to work.

Tested with 11 scenarios including XSS payloads, invalid
timestamps, oversized payloads, and malformed JSON.

Fixes: Story 03
```

---

## 8. Notes for AI Agent

### Common Pitfalls
- ⚠️ **Don't break existing flags** - All legitimate current flags must still be accepted
- ⚠️ **Don't sanitize too aggressively** - Hebrew characters (מבנה, כפל, etc.) must be preserved
- ⚠️ **Don't reject valid past dates** - Timestamps from 2020-present are legitimate
- ⚠️ **Don't forget to update all `flagData` refs** - Change to `sanitizedData` throughout

### Success Indicators
- ✅ XSS payload test shows `<` and `>` removed in log file
- ✅ Invalid module name returns HTTP 400 with clear error
- ✅ 11KB payload rejected with HTTP 413
- ✅ Malformed timestamps rejected with HTTP 400

### Configuration Tuning
Current limits are conservative. If legitimate usage patterns require adjustment:
- **Max question length (1000):** Increase if long word problems needed
- **Max answer length (500):** Increase if detailed explanations captured
- **Payload size (10KB):** Increase if rich question data (images, etc.) added
- **Date range (2020-present):** Adjust start date if historical data needed

### If Something Goes Wrong
- Check if validation is too strict (rejecting legitimate flags)
- Review sanitization - ensure Hebrew text not corrupted
- Verify `sanitizedData` used instead of `flagData` throughout
- Test with actual app, not just curl (real-world payloads differ)

### Security Considerations
- This validation prevents **stored XSS** (logs viewed in web UI later)
- Does NOT prevent **reflected XSS** (immediate echoing) - not applicable here
- Does NOT encrypt data - consider TLS in production
- Does NOT rate limit - handled separately in Story 02

---

**Story Status:** Ready for Implementation
**Estimated Time:** 3-4 hours
**Next Story:** Story 04 (Restrict CORS to Whitelist)
