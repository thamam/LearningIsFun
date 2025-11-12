# Manual Testing Checklist - Emma Math Lab

## Test Date: _____________
## Tester: _____________

---

## Pre-Test Setup

- [ ] Open `Emma_math_lab.html` in browser
- [ ] Open browser console (F12)
- [ ] Verify no console errors on page load
- [ ] Check for these console messages:
  - [ ] "🏗️ Module Registry initialized"
  - [ ] "✅ Feature 6: Module Interface Standardization loaded successfully!"
  - [ ] "✅ Navigation Feature Patch Loaded Successfully!"

---

## Home Screen Testing

- [ ] Home page displays correctly
- [ ] All Hebrew text is readable and properly aligned (RTL)
- [ ] Three module cards are visible:
  - [ ] מבנה עשרוני (Decimal)
  - [ ] כפל (Multiplication)
  - [ ] ישר מספרים (Number Line)
- [ ] Each card shows icon, title, description
- [ ] Click each card - transitions to module work correctly

---

## Decimal Module (מבנה עשרוני)

### Difficulty Level: קל (Easy)
- [ ] Click "בחירת רמה" dropdown
- [ ] Select "קל"
- [ ] Generate 5 questions, verify each type appears at least once:
  1. [ ] **Decomposition**: e.g., `42 = 40 + ?` → Answer should be 2
  2. [ ] **Digit Value**: e.g., "What is value of 4 in 42?" → Answer should be 40
  3. [ ] **Next/Previous**: e.g., "Next number after 42?" → Answer should be 43
  4. [ ] **Compare**: e.g., `42 ___ 58` → Choice buttons appear with <, =, >
  5. [ ] **Missing Digit**: e.g., `4_ (between 40-50)` → Answer should be digit
- [ ] Test multiple choice (compare):
  - [ ] Click on < button - button highlights
  - [ ] Click "בדוק תשובה" - feedback appears
  - [ ] Verify correct answer is marked correctly
- [ ] Test input answers:
  - [ ] Enter number in input field
  - [ ] Click "בדוק תשובה"
  - [ ] Verify feedback (✅ for correct, ❌ for wrong)
- [ ] Verify statistics update correctly

### Difficulty Level: בינוני (Medium)
- [ ] Select "בינוני" from dropdown
- [ ] Numbers should be 100-499
- [ ] Test 3-digit decomposition works correctly
- [ ] Test compare with larger numbers
- [ ] Verify all question types work

### Difficulty Level: קשה (Hard)
- [ ] Select "קשה" from dropdown
- [ ] Numbers should be 500-999
- [ ] Test 3-digit questions
- [ ] Verify all question types work

### Navigation Features
- [ ] Generate 3 questions
- [ ] Click "הקודם" (Previous) - should go back
- [ ] Verify "הקודם" is disabled on first question
- [ ] Click "הבא" (Next) - should move forward
- [ ] Click "דלג" (Skip) - should skip and show feedback
- [ ] Verify counters update: "נענו" and "דולגו"
- [ ] Return to skipped question via "הקודם"
- [ ] Answer the skipped question
- [ ] Verify "נענו" counter increases

---

## Multiplication Module (כפל)

### Difficulty Level: קל (Easy)
- [ ] Numbers should be 1-5
- [ ] Generate 5 questions, test each type:
  1. [ ] **Missing Multiplier**: `3 × ___ = 15` → Answer: 5
  2. [ ] **Missing Multiplicand**: `___ × 5 = 15` → Answer: 3
  3. [ ] **Missing Product**: `3 × 5 = ___` → Answer: 15
  4. [ ] **Division**: `If 3×5=15, then 15÷3 = ___` → Answer: 5
- [ ] Enter answers and verify feedback
- [ ] Test that multiplication is correct (no off-by-one errors)

### Difficulty Level: בינוני (Medium)
- [ ] Select "בינוני"
- [ ] Numbers should be 1-10
- [ ] Test several questions
- [ ] Verify multiplication tables work correctly

### Difficulty Level: קשה (Hard)
- [ ] Select "קשה"
- [ ] Numbers should be 1-12
- [ ] Test multiplication up to 12×12
- [ ] Verify all answers are mathematically correct

### Navigation Features
- [ ] Test Previous/Next/Skip buttons
- [ ] Verify counters work correctly
- [ ] Return to previous questions and verify they still display correctly

---

## Number Line Module (ישר מספרים)

### Difficulty Level: קל (Easy)
- [ ] Range should be 0-100, interval 10
- [ ] Generate 5 questions, test each type:
  1. [ ] **Where Is Number**: Visual number line appears, numbers are at correct positions
  2. [ ] **What Is Number**: Arrow appears on number line at correct position
  3. [ ] **Between Numbers**: e.g., "Number between 20 and 40?" → Answer: 30
  4. [ ] **Closer To**: e.g., "Is 23 closer to 20 or 30?" → Choice buttons work
- [ ] Test visual number line:
  - [ ] All markers (0, 10, 20, ..., 100) appear
  - [ ] Markers are evenly spaced
  - [ ] Arrow appears when needed
- [ ] Test choice buttons:
  - [ ] Click button - highlights correctly
  - [ ] Submit answer - feedback appears

### Difficulty Level: בינוני (Medium)
- [ ] Range should be 0-500, interval 50
- [ ] Verify number line shows 0, 50, 100, ..., 500
- [ ] Test all question types with larger numbers

### Difficulty Level: קשה (Hard)
- [ ] Range should be 0-1000, interval 100
- [ ] Verify number line shows 0, 100, 200, ..., 1000
- [ ] Test "between numbers" with larger intervals
- [ ] Test "closer to" logic with 100-unit intervals

### Navigation Features
- [ ] Test Previous/Next/Skip
- [ ] Visual questions should redisplay correctly when navigating back
- [ ] Verify arrow position persists when returning to previous questions

---

## Cross-Module Testing

### Home Button
- [ ] From Decimal module, click "חזרה לדף הבית"
- [ ] Verify returns to home screen
- [ ] From Multiplication module, click home button
- [ ] From Number Line module, click home button
- [ ] All transitions should be smooth

### Progress Persistence
- [ ] Answer 3 questions in Decimal module
- [ ] Go to home
- [ ] Return to Decimal module
- [ ] Verify statistics are preserved (correct answers, streak, etc.)
- [ ] Test for all three modules

### Multiple Modules Session
- [ ] Work on Decimal module (5 questions)
- [ ] Switch to Multiplication (5 questions)
- [ ] Switch to Number Line (5 questions)
- [ ] Return to each module
- [ ] Verify all progress is maintained separately

---

## Feature Testing

### Export/Import (if visible)
- [ ] Find export/import panel
- [ ] Click "ייצא נתונים" (Export)
- [ ] Verify JSON downloads
- [ ] Click "ייבא נתונים" (Import)
- [ ] Upload JSON file
- [ ] Verify progress is restored

### Race Track (if visible)
- [ ] Complete several questions
- [ ] Check if race track visualization appears
- [ ] Verify progress bar updates

### Stats Display
- [ ] For each module, verify these stats display:
  - [ ] Total questions (שאלות כוללות)
  - [ ] Correct answers (תשובות נכונות)
  - [ ] Current streak (רצף נוכחי)
  - [ ] Best streak (רצף מקסימלי)
  - [ ] Success rate percentage

---

## Bug Verification

### Critical Bug Fix: Choice Buttons
- [ ] In Decimal module, get a "compare" question (`<`, `=`, `>`)
- [ ] Click a choice button
- [ ] **VERIFY**: Button highlights (changes color)
- [ ] **VERIFY**: No console errors appear
- [ ] Click "בדוק תשובה"
- [ ] **VERIFY**: Answer is registered correctly
- [ ] In Number Line module, get a "closer to" question
- [ ] Click a choice button
- [ ] **VERIFY**: Button highlights
- [ ] **VERIFY**: No console errors
- [ ] Submit answer and verify it works

**If buttons don't highlight or console shows "event is not defined", the bug fix failed!**

---

## Error Handling

- [ ] Try to submit empty answer - should show alert
- [ ] Try to submit non-numeric answer in input field
- [ ] Test edge cases (0, negative numbers if possible)
- [ ] Check console for any unexpected errors

---

## UI/UX Testing

### Hebrew Display
- [ ] All text is in Hebrew
- [ ] Text is right-to-left
- [ ] Numbers display correctly
- [ ] Buttons have Hebrew labels
- [ ] No mojibake or encoding issues

### Responsiveness
- [ ] Resize browser window - layout adapts
- [ ] Test on different screen sizes if possible
- [ ] All buttons remain clickable
- [ ] Text remains readable

### Accessibility
- [ ] Can tab through buttons with keyboard
- [ ] Enter key works to submit answers
- [ ] Focus indicators are visible
- [ ] Color contrast is sufficient

---

## Performance

- [ ] Page loads quickly (< 2 seconds)
- [ ] No lag when switching modules
- [ ] Question generation is instant
- [ ] Navigation between questions is smooth
- [ ] No memory leaks (check browser task manager after 50+ questions)

---

## Final Checklist

- [ ] All 3 modules tested thoroughly
- [ ] All difficulty levels tested
- [ ] All question types encountered
- [ ] Navigation features work correctly
- [ ] Choice button bug is FIXED ✅
- [ ] No console errors
- [ ] All Hebrew text displays correctly
- [ ] Progress saves correctly
- [ ] Home button works from all modules

---

## Notes / Issues Found

_Use this space to document any bugs, issues, or observations:_

1. ___________________________________________
2. ___________________________________________
3. ___________________________________________
4. ___________________________________________
5. ___________________________________________

---

## Test Result

- [ ] ✅ **PASS** - All tests passed, ready for Emma to use
- [ ] ⚠️ **PASS WITH MINOR ISSUES** - Works but has cosmetic issues
- [ ] ❌ **FAIL** - Critical bugs found, needs fixes

**Tester Signature**: _________________  **Date**: _________
