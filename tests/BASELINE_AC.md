# Baseline Acceptance Criteria: Core Engine & Dashboard
**Version:** 1.0 (Covers Stories 01 - 14.5)
**Goal:** Verify the stability of the Headless Math Engine, the Next.js API integration, and critical UI/Accessibility fixes before further feature development.

---

## Suite 1: The Headless Engine (Stories 06-13)
**Objective:** Confirm the math logic is pure, portable, and DOM-free.

**Agent Instructions (MCP):**
1.  **Zero DOM Verification (Static Analysis):**
    * **Files to Scan:** All files in `learningisfun-app/lib/math/modules/`.
    * **Action:** Grep for banned terms: `document.getElementById`, `window.`, `alert(`, `jQuery`, `$(`.
    * **ASSERT:** Must return **0 matches**.
2.  **Module Registry Check:**
    * **Action:** Read `learningisfun-app/lib/math/index.ts`.
    * **ASSERT:** File must export at least 7 modules: `DivisionModule`, `MultiplicationModule`, `FractionModule`, `DecimalModule`, `DistributiveModule`, `OrderOperationsModule`, `NumberLineModule`.
3.  **Visual Data Contract:**
    * **Action:** Read `learningisfun-app/lib/math/modules/number-line.ts`.
    * **ASSERT:** The `generateQuestion` function must return an object containing a `visualData` property.

---

## Suite 2: API & Integration (Story 14)
**Objective:** Confirm the Next.js Backend is correctly serving the Math Engine.

**Agent Instructions (MCP):**
1.  **API Endpoint Existence:**
    * **Action:** Verify existence of `learningisfun-app/app/api/math/generate/route.ts`.
2.  **Runtime API Test (Smoke Test):**
    * **Action:** If server is running, perform a POST request:
        * **URL:** `http://localhost:3000/api/math/generate`
        * **Body:** `{ "moduleName": "division", "level": "medium" }`
    * **ASSERT:** Response status is `200`.
    * **ASSERT:** Response body contains valid JSON with `question.questionText`.

---

## Suite 3: Critical UI Fixes (Story 14.5)
**Objective:** Verify that specific bugs found in Code Review have been patched.

**Agent Instructions (MCP):**
1.  **RTL Math Fix (The "MathText" Primitive):**
    * **Action:** Check for existence of `learningisfun-app/components/ui/MathText.tsx`.
    * **Action:** Read the file.
    * **ASSERT:** It must contain `dir="ltr"` and `unicode-bidi-isolate` (or similar class) to prevent equation flipping.
2.  **Mobile Navigation Fix:**
    * **Action:** Read `learningisfun-app/components/layout/Navigation.tsx`.
    * **ASSERT:** It must contain a state variable (e.g., `isOpen` or `isMobileMenuOpen`) and an `onClick` handler on the hamburger button.
    * **ASSERT:** The SVG icon must contain a `<title>` tag (Accessibility fix).
3.  **CSS Cleanup:**
    * **Action:** Read `learningisfun-app/app/globals.css`.
    * **ASSERT:** It must **NOT** contain a generic `body { font-family: Arial... }` rule (as this was flagged to be removed).

---

## Suite 4: i18n Configuration (Story 14.6)
**Objective:** Verify the Internationalization infrastructure is correctly set up.

**Agent Instructions (MCP):**
1.  **Dictionary Check:**
    * **Action:** Verify existence of `learningisfun-app/messages/en.json` and `learningisfun-app/messages/he.json`.
2.  **Toggle Logic:**
    * **Action:** Read `learningisfun-app/components/layout/Navigation.tsx`.
    * **ASSERT:** It should NOT contain flag emojis (🇺🇸/🇮🇱).
    * **ASSERT:** It SHOULD contain text ISO codes ("EN" / "HE") or a reference to translation keys for them.

---

## Final QA Sign-Off
* [ ] Suite 1 Passed (Engine Integrity)
* [ ] Suite 2 Passed (API Integration)
* [ ] Suite 3 Passed (Bug Fixes)
* [ ] Suite 4 Passed (i18n Structure)
