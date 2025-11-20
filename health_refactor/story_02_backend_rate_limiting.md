# Story 02: Add Backend Rate Limiting

**Priority:** P0 (Critical)
**Complexity:** Low (2)
**Estimated Time:** 1-2 hours
**Can Run in Parallel:** ✅ Yes
**Dependencies:** None

---

## 1. The Problem (Context)

### From Audit Report: Section 3 - Observability & Reliability (SRE)

**Finding:**
> 🔴 **NO RATE LIMITING**
>
> **Current `/api/flag` endpoint:**
> ```javascript
> app.post('/api/flag', (req, res) => {
>     // NO RATE LIMITING
>     // User can spam 1000 requests/second
>     const flagData = req.body;
>     // ...
> });
> ```
>
> **Attack vector:**
> ```bash
> # Malicious script floods server with junk flags
> while true; do
>     curl -X POST http://localhost:3000/api/flag \
>          -H "Content-Type: application/json" \
>          -d '{"module":"spam","timestamp":"now"}' &
> done
> ```
> Result: Disk fills with junk logs, server crashes.

**Current State:**
- `/api/flag` endpoint has NO rate limiting
- A single client can send unlimited requests
- No protection against DoS attacks
- Malicious actors can fill disk with junk logs

**Why This Matters:**
- **Security:** DDoS vulnerability allows service disruption
- **Reliability:** Server resources (disk, memory) can be exhausted
- **Cost:** In cloud deployment, excessive requests increase costs
- **Data Integrity:** Legitimate flags may be lost in flood of spam

**Real-World Scenario:**
A student finds the API endpoint and writes a script that sends 1000 flags per second. Within hours:
1. Server disk fills with log files
2. Legitimate flag submissions start failing
3. Server becomes unresponsive
4. Application crashes for all users

---

## 2. The Fix (Requirements)

### Objective
Implement rate limiting on the `/api/flag` endpoint to prevent abuse while allowing legitimate usage.

### Step-by-Step Instructions

#### Step 1: Install Rate Limiting Middleware
**Action:** Add the `express-rate-limit` package.

```bash
# Install the dependency
npm install express-rate-limit --save
```

**Expected Result:**
- `package.json` updated with new dependency
- `package-lock.json` updated
- Module installed in `node_modules/`

#### Step 2: Import Rate Limiter in server.js
**Action:** Add import at the top of `server.js`.

**Add this line after other require statements:**
```javascript
const rateLimit = require('express-rate-limit');
```

**Location:** Near line 3-4, after `const cors = require('cors');`

#### Step 3: Configure Rate Limiter for Flag Endpoint
**Action:** Create rate limiter configuration before route definitions.

**Add this code before `app.post('/api/flag', ...)` (around line 26):**
```javascript
// Rate limiter for flag submissions
// Limit: 10 flags per minute per IP address
const flagLimiter = rateLimit({
    windowMs: 60 * 1000,  // 1 minute window
    max: 10,              // Maximum 10 requests per window per IP
    message: {
        success: false,
        error: 'Too many flag submissions. Please wait a minute before submitting more flags.',
        retryAfter: 60
    },
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false,  // Disable `X-RateLimit-*` headers
    // Skip rate limiting for health check endpoint
    skip: (req) => req.path === '/api/health'
});
```

**Explanation:**
- **windowMs:** Time window for rate limiting (60 seconds)
- **max:** Maximum requests allowed per window (10 flags/minute is reasonable for legitimate use)
- **message:** Custom error response when limit exceeded
- **standardHeaders:** Include rate limit info in response headers
- **skip:** Exclude health check from rate limiting

#### Step 4: Apply Rate Limiter to Flag Endpoint
**Action:** Update the `/api/flag` route to use the rate limiter.

**Find this line (around line 27):**
```javascript
app.post('/api/flag', (req, res) => {
```

**Replace with:**
```javascript
app.post('/api/flag', flagLimiter, (req, res) => {
```

**Note:** The rate limiter middleware goes between the route path and the handler function.

#### Step 5: Add Rate Limiting Headers to Success Response
**Action:** Include rate limit info in successful flag submissions.

**Find the success response (around line 68-73):**
```javascript
res.json({
    success: true,
    message: 'Flag logged successfully',
    logFile: `logs/${module}/${dateStr}.json`,
    totalFlags: logs.length
});
```

**Replace with:**
```javascript
res.json({
    success: true,
    message: 'Flag logged successfully',
    logFile: `logs/${module}/${dateStr}.json`,
    totalFlags: logs.length,
    rateLimit: {
        limit: 10,
        remaining: req.rateLimit.remaining,
        resetTime: new Date(Date.now() + req.rateLimit.resetTime).toISOString()
    }
});
```

**Explanation:** This informs clients how many requests they have remaining.

---

## 3. Target Files

### Files to Modify
- ✏️ `server.js` - Add rate limiting middleware
- ✏️ `package.json` - Add `express-rate-limit` dependency (automatic via npm install)
- ✏️ `package-lock.json` - Updated by npm (automatic)

### Files to Create
- None

### Files to Keep (No Changes)
- ✅ All frontend files - No changes needed
- ✅ `launch.js` - No changes needed

---

## 4. Verification Plan

### Step 1: Install and Verify Dependency
```bash
# Install the dependency
npm install express-rate-limit --save

# Verify it's in package.json
grep "express-rate-limit" package.json
# Expected output: "express-rate-limit": "^X.X.X"

# Verify it's installed
ls node_modules/express-rate-limit
# Expected: Directory exists with package files
```

### Step 2: Start Server
```bash
# Start the server
npm start
```

**Expected Console Output:**
```
🚀 Flag Logging Server Started
================================
📡 Server running on: http://localhost:3000
...
```

### Step 3: Test Normal Usage (Within Limit)
**Test legitimate flag submissions:**

```bash
# Submit 5 flags rapidly (should all succeed)
for i in {1..5}; do
  curl -X POST http://localhost:3000/api/flag \
    -H "Content-Type: application/json" \
    -d "{\"module\":\"decimal\",\"timestamp\":\"$(date -Iseconds)\",\"question\":\"Test $i\"}" \
    -w "\nHTTP Status: %{http_code}\n\n"
done
```

**Expected Result:**
- All 5 requests return HTTP 200
- All responses contain `"success": true`
- Response includes `rateLimit` object showing remaining requests

**Example Response:**
```json
{
  "success": true,
  "message": "Flag logged successfully",
  "totalFlags": 5,
  "rateLimit": {
    "limit": 10,
    "remaining": 5,
    "resetTime": "2025-11-20T15:32:00.000Z"
  }
}
```

### Step 4: Test Rate Limit Enforcement (Exceed Limit)
**Test that 11th request is blocked:**

```bash
# Submit 11 flags rapidly (11th should fail)
for i in {1..11}; do
  curl -X POST http://localhost:3000/api/flag \
    -H "Content-Type: application/json" \
    -d "{\"module\":\"decimal\",\"timestamp\":\"$(date -Iseconds)\",\"question\":\"Test $i\"}" \
    -w "\nHTTP Status: %{http_code}\n\n"
  sleep 0.1  # Small delay to ensure sequential processing
done
```

**Expected Result:**
- First 10 requests: HTTP 200, `"success": true`
- 11th request: HTTP 429 (Too Many Requests)
- 11th response contains custom error message

**Example 11th Response:**
```json
{
  "success": false,
  "error": "Too many flag submissions. Please wait a minute before submitting more flags.",
  "retryAfter": 60
}
```

### Step 5: Test Rate Limit Reset
**Verify limit resets after 1 minute:**

```bash
# Wait 61 seconds
echo "Waiting 61 seconds for rate limit reset..."
sleep 61

# Try another request (should succeed)
curl -X POST http://localhost:3000/api/flag \
  -H "Content-Type: application/json" \
  -d "{\"module\":\"decimal\",\"timestamp\":\"$(date -Iseconds)\",\"question\":\"After reset\"}" \
  -w "\nHTTP Status: %{http_code}\n\n"
```

**Expected Result:**
- HTTP 200
- `"success": true`
- `rateLimit.remaining` should be 9 (reset to 10, consumed 1)

### Step 6: Verify Health Check Not Rate Limited
**Test that `/api/health` is exempt:**

```bash
# Hit health endpoint 20 times rapidly (should never be rate limited)
for i in {1..20}; do
  curl -X GET http://localhost:3000/api/health -w "\nHTTP Status: %{http_code}\n"
done
```

**Expected Result:**
- All 20 requests return HTTP 200
- No rate limit errors

### Step 7: Browser Integration Test
**Test from actual application:**

1. Start full application:
   ```bash
   npm run launch
   ```

2. Open Emma's Math Lab in browser

3. Navigate to a module (e.g., Decimal)

4. Click the "⚠️ יש בעיה בתרגיל הזה" (Problem Reporting) button 5 times on different questions

5. Verify flags are successfully submitted (check browser console for success messages)

6. Attempt to submit 6 more flags rapidly (total 11)

7. Verify 11th flag shows error message to user

**Expected User Experience:**
- First 10 flags: Success notifications
- 11th flag: "אנא המתן דקה לפני שליחת דיווחים נוספים" (Please wait a minute before submitting more reports)

### Step 8: Load Testing (Optional)
**Stress test with Apache Bench:**

```bash
# Install Apache Bench if needed
# sudo apt-get install apache2-utils  # On Ubuntu
# brew install httpd                   # On macOS

# Create test payload
echo '{"module":"decimal","timestamp":"2025-11-20T12:00:00Z","question":"Load test"}' > /tmp/flag-payload.json

# Send 100 requests with 10 concurrent connections
ab -n 100 -c 10 -p /tmp/flag-payload.json -T application/json \
   http://localhost:3000/api/flag
```

**Expected Result:**
- ~90 requests should fail with 429 (rate limited)
- ~10 requests should succeed with 200
- Server remains responsive (doesn't crash)

---

## 5. PR Description Template

```markdown
## Story 02: Add Backend Rate Limiting

### Problem
The `/api/flag` endpoint had no rate limiting, making the application vulnerable to:
- **DoS attacks:** Malicious users could flood the server with requests
- **Resource exhaustion:** Disk could fill with junk logs
- **Service disruption:** Legitimate users affected by abuse

### Solution
Implemented rate limiting using `express-rate-limit` middleware:
- **Limit:** 10 flag submissions per minute per IP address
- **Custom error message:** User-friendly feedback when limit exceeded
- **Rate limit headers:** Clients informed of remaining quota
- **Health check exempt:** `/api/health` not rate limited

### Changes
- **Modified:** `server.js`
  - Added `express-rate-limit` dependency
  - Configured `flagLimiter` middleware (10 req/min)
  - Applied rate limiter to `/api/flag` route
  - Added rate limit info to success responses
- **Modified:** `package.json` (added `express-rate-limit` dependency)

### Testing
#### ✅ Normal Usage (Within Limit)
- Submitted 5 flags rapidly → All succeeded (HTTP 200)
- Response includes remaining quota (e.g., `remaining: 5`)

#### ✅ Rate Limit Enforcement (Exceed Limit)
- Submitted 11 flags rapidly → 11th request blocked (HTTP 429)
- Error message: "Too many flag submissions. Please wait a minute..."
- Rate limit headers present in response

#### ✅ Rate Limit Reset
- Waited 61 seconds → Request succeeded (HTTP 200)
- Quota reset to 10 requests

#### ✅ Health Check Exempt
- Sent 20 health check requests → All succeeded (HTTP 200)
- No rate limiting applied

#### ✅ Load Test
- Apache Bench: 100 requests, 10 concurrent
- Server remained responsive, rate limits enforced correctly

### Configuration Details
```javascript
{
  windowMs: 60000,     // 1 minute
  max: 10,             // 10 requests per IP
  standardHeaders: true
}
```

### Impact
- ✅ Protected against DoS attacks
- ✅ Server resource usage bounded
- ✅ No impact on legitimate usage patterns
- ✅ No breaking changes to API

### References
- **Audit Report:** `docs/reports/SECURITY_ARCHITECTURE_AUDIT_2025.md` (Section 3.3)
- **Orchestration Plan:** `health_refactor/01_orchestration_plan.md` (Story 02)
- **Fixes:** Critical Issue #4 (No Rate Limiting)

---

**Type:** `fix`
**Scope:** `security`
**Complexity:** Low (2)
**Risk:** Low

Closes: Story 02
```

---

## 6. Rollback Plan

If this change causes unexpected issues:

### Immediate Rollback (Git)
```bash
# Revert the commit
git revert HEAD

# Reinstall original dependencies
npm install
```

### Manual Rollback
1. Remove rate limiter from `server.js`:
   - Delete `const rateLimit = require('express-rate-limit');`
   - Delete rate limiter configuration
   - Change `app.post('/api/flag', flagLimiter, (req, res) => {`
     back to `app.post('/api/flag', (req, res) => {`
   - Remove `rateLimit` object from success response

2. Uninstall dependency:
   ```bash
   npm uninstall express-rate-limit
   ```

3. Restart server and verify it works

---

## 7. Success Criteria

### Definition of Done
- [x] `express-rate-limit` installed and in `package.json`
- [x] Rate limiter configured for `/api/flag` (10 req/min)
- [x] 11th request within 1 minute returns HTTP 429
- [x] Rate limit resets after 60 seconds
- [x] `/api/health` not rate limited (verified with 20+ requests)
- [x] Success responses include rate limit info
- [x] Error message is user-friendly
- [x] No breaking changes to API contract
- [x] Load testing confirms server stability
- [x] PR description uses provided template

### Conventional Commit Message
```
fix(security): add rate limiting to flag submission endpoint

Implemented express-rate-limit middleware to prevent DoS attacks
on /api/flag endpoint. Limit set to 10 requests per minute per IP.
Health check endpoint remains unrestricted.

- Add express-rate-limit dependency
- Configure flagLimiter with 1-minute window, 10 req max
- Include rate limit info in success responses
- Return 429 status when limit exceeded

Tested with 100 concurrent requests - server remains stable.

Fixes: Story 02
```

---

## 8. Notes for AI Agent

### Common Pitfalls
- ⚠️ **Don't forget to install the dependency** - `npm install` must be run
- ⚠️ **Don't rate limit health checks** - Use `skip` option to exempt `/api/health`
- ⚠️ **Don't set limit too low** - 10 req/min balances security and usability
- ⚠️ **Don't forget to test reset** - Verify limit actually resets after window expires

### Success Indicators
- ✅ 11th request in 1 minute returns HTTP 429
- ✅ Response includes `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset` headers
- ✅ Server logs show rate limit being applied

### Configuration Tuning
Current limit (10 req/min) is conservative. If legitimate usage patterns require more:
- Increase `max` to 20 or 30
- Consider using `express-slow-down` for gradual throttling instead of hard cutoff
- Monitor actual usage patterns in production logs

### If Something Goes Wrong
- Check if `express-rate-limit` is actually installed: `npm list express-rate-limit`
- Verify middleware is applied before route handler
- Check server logs for rate limiter initialization messages
- Test with `curl` directly (bypasses browser caching)

---

**Story Status:** Ready for Implementation
**Estimated Time:** 1-2 hours
**Next Story:** Story 03 (Implement Backend Input Validation)
