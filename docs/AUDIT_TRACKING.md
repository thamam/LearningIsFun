# Emma Math Lab - Complete Module & Question Type Audit

**Purpose**: Systematic verification of all modules and question types to ensure correct implementation and display.

**Date Created**: 2025-11-17

---

## Audit Process

For each module and question type, we will:
1. **Show Example**: Display a sample question (web screenshot or text description)
2. **Show Code**: Display the relevant code section that generates this question type
3. **Explain Logic**: Explain how the code generates the question and validates the answer
4. **Review Status**: Wait for thumbs up ✅ or correction request 🔧

---

## Module 1: Decimal Numbers (מבנה עשרוני)

**Module ID**: `decimal`
**State Object**: `decimalState`
**Code Location**: `src/math/Emma_math_lab.html:2092-2477`
**Difficulty Levels**: קל (10-99), בינוני (100-999), קשה (1000-9999)

### Question Types

#### 1.1 Decomposition (decomposition)
- **Code Lines**: 2115-2137
- **Question Type**: `input`
- **Example**: "4,521 = 4,000 + 500 + ? + 1"
- **Answer**: Missing place value (e.g., 20)
- **Visual**: Base-10 blocks displayed
- **Status**: ✅ Reviewed

#### 1.2 Digit Value (digitValue)
- **Code Lines**: 2139-2152
- **Question Type**: `input`
- **Example**: "מה ערך הספרה 8 במספר 28,885?"
- **Answer**: Value of the digit (e.g., 8000)
- **Visual**: Base-10 blocks displayed
- **Status**: ✅ Reviewed & Fixed - Now generates numbers with distinct digits

#### 1.3 Next/Previous (nextPrevious)
- **Code Lines**: 2154-2162
- **Question Type**: `input`
- **Example**: "מהו המספר העוקב של 4,521?"
- **Answer**: num + 1 or num - 1
- **Visual**: None
- **Status**: ✅ Reviewed

#### 1.4 Compare (compare)
- **Code Lines**: 2164-2188
- **Question Type**: `choice`
- **Choices**: ['<', '=', '>']
- **Example**: "4,521 ___ 3,891"
- **Answer**: Comparison symbol
- **Visual**: None
- **Status**: ✅ Reviewed

#### 1.5 Missing Digit (missingDigit)
- **Code Lines**: 2190-2252
- **Question Type**: `input`
- **Example**: "מהי הספרה החסרה? 2_,885 (המספר נמצא בין 9,647 ל-9,641)"
- **Answer Type**: OBJECT `{type: 'range', min, max, pattern, missingPos, originalDigit}`
- **Visual**: None
- **Status**: ✅ Reviewed & Fixed - Multi-attempt wrapper now validates range objects

---

## Module 2: Multiplication (כפל)

**Module ID**: `multiplication`
**State Object**: `multiplicationState`
**Code Location**: `src/math/Emma_math_lab.html:2806-2975`
**Difficulty Levels**: קל (1-5), בינוני (1-10), קשה (1-12)

### Question Types

#### 2.1 Missing Multiplier (missingMultiplier)
- **Code Lines**: 2830-2836
- **Question Type**: `input`
- **Example**: "7 × ___ = 35"
- **Answer**: num2
- **Visual**: None
- **Status**: ✅ Reviewed & Fixed - LTR Unicode embedding for equations

#### 2.2 Missing Multiplicand (missingMultiplicand)
- **Code Lines**: 2838-2844
- **Question Type**: `input`
- **Example**: "___ × 5 = 35"
- **Answer**: num1
- **Visual**: None
- **Status**: ✅ Reviewed & Fixed - LTR Unicode embedding for equations

#### 2.3 Missing Product (missingProduct)
- **Code Lines**: 2846-2852
- **Question Type**: `input`
- **Example**: "7 × 5 = ___"
- **Answer**: product
- **Visual**: None
- **Status**: ✅ Reviewed & Fixed - LTR Unicode embedding for equations

#### 2.4 Division (division)
- **Code Lines**: 2854-2860
- **Question Type**: `input`
- **Example**: "אם 7 × 5 = 35, אז 35 ÷ 7 = ___"
- **Answer**: num2
- **Visual**: None
- **Status**: ✅ Reviewed & Fixed - LTR Unicode embedding for equations

---

## Module 3: Number Line (ישר מספרים)

**Module ID**: `numberline`
**State Object**: `numberlineState`
**Code Location**: `src/math/Emma_math_lab.html:2977-3257`
**Difficulty Levels**: קל (0-100, interval 10), בינוני (0-500, interval 50), קשה (0-1000, interval 100)

### Question Types

#### 3.1 What Is Number (whatIsNumber)
- **Code Lines**: 2999-3008
- **Question Type**: `visual-input`
- **Example**: "איזה מספר מסומן בחץ?"
- **Answer**: arrowPosition
- **Visual**: Number line with arrow
- **Status**: ✅ Reviewed & Fixed - Two versions (exact/approximate), zoom, minor ticks, specific hints

#### 3.2 Between Numbers (betweenNumbers)
- **Code Lines**: 3010-3019
- **Question Type**: `input`
- **Example**: "איזה מספר נמצא בדיוק באמצע בין 20 ל-40?"
- **Answer**: (num1 + num2) / 2
- **Visual**: None
- **Status**: ✅ Reviewed

#### 3.3 Closer To (closerTo)
- **Code Lines**: 3021-3032
- **Question Type**: `choice`
- **Choices**: [option1, option2]
- **Example**: "המספר 23 קרוב יותר ל-20 או ל-30?"
- **Answer**: Closer number
- **Visual**: None
- **Status**: ✅ Reviewed

---

## Module 4: Fractions (שברים)

**Module ID**: `fraction`
**State Object**: `fractionState`
**Code Location**: `src/math/js/modules/fraction_module.js:1-274`
**Difficulty Levels**: קל (denominators 2,4), בינוני (denominators 2-6), קשה (denominators 2-12)

### Question Types

#### 4.1 Compare (compare)
- **Code Lines**: 27-51
- **Question Type**: `choice`
- **Choices**: ['>', '<', '=']
- **Example**: "מה הסימן הנכון? 3/4 ___ 1/4"
- **Answer**: Comparison symbol
- **Visual**: None
- **Status**: ✅ Reviewed & Fixed - Separate containers for text/equation, LTR buttons

#### 4.2 Add Same Denominator (addSameDenominator)
- **Code Lines**: 53-84
- **Question Type**: `input`
- **Example**: "2/5 + 1/5 = ___/5" or "1/2 + 1/2 = ___"
- **Answer**: Just numerator when denominator shown, or simplified fraction
- **Visual**: None
- **Status**: ✅ Reviewed & Fixed - Accepts just numerator when denominator in question

#### 4.3 Simplify (simplify)
- **Code Lines**: 85-97
- **Question Type**: `input`
- **Example**: "צמצמי: 4/8 = ___"
- **Answer**: Simplified fraction (e.g., "1/2")
- **Visual**: None
- **Status**: ✅ Reviewed & Fixed - Uses equation format for proper display

#### 4.4 Fraction to Decimal (fractionToDecimal)
- **REMOVED** - Not yet in curriculum

#### 4.5 Decimal to Fraction (decimalToFraction)
- **REMOVED** - Not yet in curriculum

---

## Module 5: Division (חילוק)

**Module ID**: `division`
**State Object**: `divisionState`
**Code Location**: `src/math/js/modules/division_module.js:1-150`
**Difficulty Levels**: קל (divisors 2-5), בינוני (divisors 2-8), קשה (divisors 2-12)

### Question Types

#### 5.1 Basic Division (basicDivision)
- **Code Lines**: 16-22
- **Question Type**: `input`
- **Example**: "12 ÷ 3 = ___"
- **Answer**: quotient
- **Visual**: None
- **Status**: ⬜ Not Reviewed

#### 5.2 Division with Remainder (divisionWithRemainder)
- **Code Lines**: 23-30
- **Question Type**: `input`
- **Example**: "13 ÷ 3 = ___ (כולל שארית)"
- **Answer**: String (e.g., "4 שארית 1")
- **Visual**: None
- **Status**: ⬜ Not Reviewed

#### 5.3 Missing Dividend (missingDividend)
- **Code Lines**: 31-37
- **Question Type**: `input`
- **Example**: "___ ÷ 3 = 4"
- **Answer**: dividend
- **Visual**: None
- **Status**: ⬜ Not Reviewed

#### 5.4 Missing Divisor (missingDivisor)
- **Code Lines**: 38-44
- **Question Type**: `input`
- **Example**: "12 ÷ ___ = 4"
- **Answer**: divisor
- **Visual**: None
- **Status**: ⬜ Not Reviewed

#### 5.5 Word Problem (wordProblem)
- **Code Lines**: 45-57
- **Question Type**: `input`
- **Example**: "לאמה יש 12 עוגיות. היא רוצה לחלק אותן שווה ב-3 קבוצות. כמה עוגיות בכל קבוצה?"
- **Answer**: perGroup
- **Visual**: None
- **Status**: ⬜ Not Reviewed

---

## Module 6: Order of Operations (סדר פעולות חשבון)

**Module ID**: `order`
**State Object**: `orderState`
**Code Location**: `src/math/js/modules/order_operations_module.js:42-350`
**Difficulty Levels**: קל (single rule), בינוני (multiple operations), קשה (complex with word problems)

### Question Types (קל Level)

#### 6.1 Parentheses First (parens_first)
- **Code Lines**: 58-84
- **Question Type**: `input`
- **Example**: "חשב: (3 + 5) × 4"
- **Answer**: Calculated result
- **Explanation**: Step-by-step shown
- **Status**: ⬜ Not Reviewed

#### 6.2 Multiplication Before Addition (mult_before_add)
- **Code Lines**: 86-100
- **Question Type**: `input`
- **Example**: "חשב: 10 + 3 × 4"
- **Answer**: Calculated result
- **Explanation**: Step-by-step shown
- **Status**: ⬜ Not Reviewed

### Question Types (בינוני Level)

#### 6.3 Three Operations (three_ops)
- **Code Lines**: 107-143
- **Question Type**: `input`
- **Example**: "(5 + 7) × 3 - 10" or "4 × 5 + 2 × 3"
- **Answer**: Calculated result
- **Status**: ⬜ Not Reviewed

#### 6.4 Subtract Divide (subtract_divide)
- **Code Lines**: 145-163
- **Question Type**: `input`
- **Example**: "20 - 12 ÷ 3"
- **Answer**: Calculated result
- **Status**: ⬜ Not Reviewed

#### 6.5 Word Problem Simple (word_problem_simple)
- **Code Lines**: 165-189
- **Question Type**: `input`
- **Example**: Word problem requiring order of operations
- **Answer**: Calculated result
- **Status**: ⬜ Not Reviewed

### Question Types (קשה Level)

#### 6.6 Complex Expression (complex_expr)
- **Code Lines**: 196-228
- **Question Type**: `input`
- **Example**: "(15 + 5) ÷ 4 × 3 - 2"
- **Answer**: Calculated result
- **Status**: ⬜ Not Reviewed

#### 6.7 Word Problem Complex (word_problem_complex)
- **Code Lines**: 230-290
- **Question Type**: `input`
- **Example**: Complex word problem
- **Answer**: Calculated result
- **Status**: ⬜ Not Reviewed

---

## Module 7: Distributive Property (חוק הפילוג)

**Module ID**: `distributive`
**State Object**: `distributiveState`
**Code Location**: `src/math/js/modules/distributive_module.js:46-300`
**Difficulty Levels**: קל (visual decomposition), בינוני (larger numbers), קשה (algebraic)

### Question Types (קל Level)

#### 7.1 Fill Blank (fill_blank)
- **Code Lines**: 63-81
- **Question Type**: `input`
- **Example**: "7 × 13 = 7 × (10 + 3) = (7 × 10) + (7 × ___)"
- **Answer**: Missing number
- **Visual**: Area model shown
- **Status**: ⬜ Not Reviewed

#### 7.2 Calculate (calculate)
- **Code Lines**: 83-90
- **Question Type**: `input`
- **Example**: "חשב בעזרת חוק הפילוג: 7 × 13 = 7 × (10 + 3) = (7 × 10) + (7 × 3) = ___ + ___ = ?"
- **Answer**: Final result
- **Visual**: Area model shown
- **Status**: ⬜ Not Reviewed

### Question Types (בינוני Level)

#### 7.3 Subtraction Decomposition (subtraction)
- **Code Lines**: 103-114
- **Question Type**: `input`
- **Example**: "חשב בעזרת חוק הפילוג: 7 × 19 (רמז: 19 = 20 - 1)"
- **Answer**: Final result
- **Visual**: Area model shown
- **Status**: ⬜ Not Reviewed

#### 7.4 Addition Larger Numbers (addition_large)
- **Code Lines**: 116-133
- **Question Type**: `input`
- **Example**: "חשב בעזרת חוק הפילוג: 8 × 47 (רמז: 47 = 40 + 7)"
- **Answer**: Final result
- **Visual**: Area model shown
- **Status**: ⬜ Not Reviewed

### Question Types (קשה Level)

#### 7.5 Two-Digit × Two-Digit (two_digit_by_two_digit)
- **Code Lines**: 138-170
- **Question Type**: `input`
- **Example**: "13 × 24 = (10 + 3) × (20 + 4)"
- **Answer**: Final result
- **Visual**: Area model shown
- **Status**: ⬜ Not Reviewed

#### 7.6 Algebraic Expression (algebraic)
- **Code Lines**: 172-200
- **Question Type**: `input`
- **Example**: "a × (b + c) = ?" with values given
- **Answer**: Final result
- **Visual**: None
- **Status**: ⬜ Not Reviewed

---

## Known Bugs

### Bug #1: "[object Object]" in Feedback
- **Module**: Decimal Numbers
- **Question Type**: Missing Digit (missingDigit)
- **Location**: Emma_math_lab.html:2396
- **Issue**: When displaying wrong answer feedback, currentAnswer object is converted to string
- **Screenshot**: 15.52.51
- **Fix Required**: Check if answer is object before displaying

### Bug #2: Input Field Shows Colon ":"
- **Module**: Decimal Numbers (possibly all modules)
- **Question Type**: All (navigation-related)
- **Location**: Navigation patch (line 4727)
- **Issue**: Answer object being partially displayed in input field
- **Screenshot**: 15.54.23
- **Fix Required**: Ensure input field never receives object values

---

## Progress Tracking

**Total Modules**: 7
**Total Question Types**: 30+ (after removals)
**Reviewed**: 6 modules
**Bugs Found & Fixed**: 15+
**Status**: 🟢 Complete (pending final testing)

### Completed Modules
- ✅ Module 1: Decimal Numbers (5/5 question types)
- ✅ Module 2: Multiplication (4/4 question types)
- ✅ Module 3: Number Line (3/3 question types)
- ✅ Module 4: Fractions (3/3 question types - 2 removed: fractionToDecimal, decimalToFraction)
- ✅ Module 5: Division (4/4 question types - 1 removed: divisionWithRemainder)
- ✅ Module 6: Order of Operations (5+ question types)

### Not Yet Integrated
- ⚠️ Module 7: Distributive Property - JS module exists but HTML section not integrated

### Recent Fixes (Session 2)
1. Division module: RTL separation, Enter key, flag button, removed remainder questions
2. Order of Operations module: RTL separation, Enter key, flag button
3. Navigation patch: Added orderState and distributiveState to getState() and extendStates()
4. State exposure: Added window.orderState and window.distributiveState in module files

### Verification Complete (Session 3)
- ✅ window.orderState exposure verified in order_operations_module.js:35
- ✅ window.distributiveState exposure verified in distributive_module.js:39
- ✅ Order of Operations module has Enter key support (lines 282-286)
- ✅ Distributive module has Enter key support (lines 207-211)

### Module 7 Integration Requirements
The Distributive Property module (חוק הפילוג) JS is complete but needs:
1. HTML section in Emma_math_lab.html (currently missing)
2. Script tag to load distributive_module.js
3. Home page card with button

### Current Issue
- Order of Operations module missing navigation buttons (Next/Skip/Previous)
- Cause: Navigation patch hardcoded module lists don't include "order"

### Pending
- Fix navigation buttons for Order of Operations module
- Final browser testing of all 6 active modules
- Optional: Integrate Module 7 (Distributive Property) if desired

---

## Notes

- All modules use Hebrew (RTL) interface
- Three difficulty levels per module: קל (easy), בינוני (medium), קשה (hard)
- Two main answer types: `input` (text input) and `choice` (multiple choice buttons)
- Visual types for number line: `visual-input`, `visual-choice`
- Navigation system adds question bank tracking to all modules
- Problem reporting system available on all questions
