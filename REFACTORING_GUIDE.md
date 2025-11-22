# Story 16: Module Refactoring Guide

## ✅ Phase 1 Complete (Infrastructure + 2 Modules)

### Completed Work:
1. **templates.json** - Added `instructions` section for all 5 modules with Hebrew & English
2. **content/index.ts** - Added `getInstruction()` helper function
3. **DecimalModule** - FULLY refactored & language-aware
4. **FractionModule** - FULLY refactored & language-aware

### Pattern Established:

#### 1. Import Changes:
```typescript
// BEFORE:
import { MathModule, Level, Question } from '../types';

// AFTER:
import { MathModule, Level, Question, Language } from '../types';
import { getInstruction } from '../content';
```

#### 2. Function Signature:
```typescript
// BEFORE:
function generateQuestion(level: Level = 'בינוני', lang: string = 'he'): Question {

// AFTER:
function generateQuestion(level: Level = 'בינוני', lang: Language = 'he'): Question {
```

#### 3. Replace Hardcoded Strings:
```typescript
// BEFORE:
question: `מה ערך הספרה ${digit} במספר ${num}?`

// AFTER:
const questionText = getInstruction('decimal', 'digitValue', lang, { digit, number: num });
question: questionText
```

#### 4. Add Language-Aware Explanations:
```typescript
// BEFORE:
explanation: `הספרה ${digit} במספר ${num} שווה ${value}`

// AFTER:
const explanationText = lang === 'he'
  ? `הספרה ${digit} במספר ${num} שווה ${value}`
  : `The digit ${digit} in the number ${num} equals ${value}`;
explanation: explanationText
```

#### 5. Add Metadata:
```typescript
return {
  question: questionText,
  type: 'input',
  correctAnswer: value,
  difficulty: level,
  explanation: explanationText,
  metadata: { lang },  // ← ADD THIS
};
```

#### 6. Update Helper Functions:
```typescript
function getHint(questionData: Question): string {
  const lang = questionData.metadata?.lang || 'he';
  return lang === 'he'
    ? '💡 Hebrew hint'
    : '💡 English hint';
}
```

---

## 📋 Phase 2: Remaining 3 Modules

### Distributive Module Refactoring Checklist:
- [ ] Add imports: `Language`, `getInstruction`
- [ ] Update function signature for `lang: Language`
- [ ] Line 28 & 36: Replace "מהו המספר החסר?" with `getInstruction('distributive', 'missingNumber', lang)`
- [ ] Line 47: Replace "חשב בעזרת חוק הפילוג:" with `getInstruction('distributive', 'calculatePrompt', lang)`
- [ ] Lines 68, 82: Replace "רמז:" with `getInstruction('distributive', 'hint', lang)`
- [ ] All explanations (lines 32, 40, 51, 72, 86, 131): Add language awareness
- [ ] Add `metadata: { lang }` to all returned questions
- [ ] Update `getHint()` and `getExplanation()` to be language-aware

### OrderOperationsModule Refactoring Checklist:
- [ ] Add imports: `Language`, `getInstruction`
- [ ] Update function signature for `lang: Language`
- [ ] Lines 27, 37, 53, 78, 90: Replace "חשב:" with `getInstruction('order-operations', 'calculate', lang)`
- [ ] All explanations: Add language awareness
- [ ] Word problems (lines 107+): Should optionally use `generateWordProblem()` from templates
- [ ] Add `metadata: { lang }` to all returned questions
- [ ] Update `getHint()` and `getExplanation()` to be language-aware

### NumberLineModule Refactoring Checklist:
- [ ] Add imports: `Language`, `getInstruction`
- [ ] Update function signature for `lang: Language`
- [ ] Line 30: Replace "איזה מספר מסומן בחץ?" with `getInstruction('number-line', 'whatNumberExact', lang, { lastDigit })`
- [ ] Line 48: Replace "איזה מספר נמצא בדיוק באמצע..." with `getInstruction('number-line', 'betweenNumbers', lang, { num1, num2 })`
- [ ] Line 66: Replace "המספר X קרוב יותר ל-..." with `getInstruction('number-line', 'closerTo', lang, { testNum, option1, option2 })`
- [ ] All explanations: Add language awareness
- [ ] Add `metadata: { lang }` to all returned questions
- [ ] Update `getHint()` and `getExplanation()` to be language-aware

---

## 🧪 Testing Strategy

After refactoring each module, verify:

### 1. Hebrew Generation (Default):
```typescript
const question = generateQuestion('בינוני', 'he');
// Verify question.question contains Hebrew text
// Verify question.explanation contains Hebrew text
```

### 2. English Generation:
```typescript
const question = generateQuestion('בינוני', 'en');
// Verify question.question contains English text
// Verify question.explanation contains English text
```

### 3. All Question Types:
For each module, test all question types:
- **Decimal**: decomposition, digitValue, nextPrevious, compare, missingDigit
- **Fraction**: compare, addSameDenominator, simplify, fractionToDecimal, decimalToFraction
- **Distributive**: fill_blank, calculate (easy, medium, hard)
- **OrderOperations**: All difficulty levels and types
- **NumberLine**: whatIsNumber, betweenNumbers, closerTo

### 4. Metadata Presence:
```typescript
const question = generateQuestion('בינוני', 'en');
console.assert(question.metadata?.lang === 'en', 'Metadata lang should be "en"');
```

---

## 📝 Implementation Notes

### Why This Matters:
1. **Consistency**: All modules follow the same pattern
2. **Maintainability**: Text is centralized in `templates.json`
3. **Internationalization**: Easy to add new languages
4. **Testing**: Can verify both languages work correctly

### Success Criteria:
✓ All 5 modules use `getInstruction()` for UI text
✓ All modules respect the `lang` parameter
✓ All explanations are language-aware
✓ All questions include `metadata: { lang }`
✓ Helper functions (getHint, getExplanation) are language-aware
✓ Tests pass for both 'he' and 'en' languages

---

## 🚀 Next Steps

1. Complete refactoring of remaining 3 modules following the pattern above
2. Run integration tests
3. Commit Phase 2 changes
4. Update documentation
5. Close Story 16
