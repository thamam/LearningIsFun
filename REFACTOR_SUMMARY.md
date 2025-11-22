# Story 16: Refactor Remaining Modules - Progress Summary

## Completed:
1. ✅ templates.json expanded with instructions for all 5 modules
2. ✅ content/index.ts - added `getInstruction()` helper function
3. ✅ DecimalModule - fully refactored to use templates
4. ✅ FractionModule - fully refactored to use templates

## In Progress:
5. ⏳ DistributiveModule - needs refactoring
6. ⏳ OrderOperationsModule - needs refactoring
7. ⏳ NumberLineModule - needs refactoring

## Remaining Work:

### DistributiveModule refactoring needed:
- Lines 28, 36: "מהו המספר החסר?" → `getInstruction('distributive', 'missingNumber', lang)`
- Lines 47: "חשב בעזרת חוק הפילוג:" → `getInstruction('distributive', 'calculatePrompt', lang)`
- Lines 32, 40, 51, 72, 86, 131: Explanation text needs language awareness
- Lines 68, 82: "רמז:" → `getInstruction('distributive', 'hint', lang)`
- Import Language type and getInstruction

### OrderOperationsModule refactoring needed:
- Lines 27, 37, 53, 78, 90, etc: "חשב:" → `getInstruction('order-operations', 'calculate', lang)`
- Word problem generation (lines 107+) should use templates.json word problems
- All explanation text needs language awareness
- Import Language type and getInstruction

### NumberLineModule refactoring needed:
- Line 30: "איזה מספר מסומן בחץ?" → `getInstruction('number-line', 'whatNumberExact', lang)` (with variables)
- Line 48: "איזה מספר נמצא בדיוק באמצע..." → `getInstruction('number-line', 'betweenNumbers', lang)`
- Line 66: "המספר X קרוב יותר ל-..." → `getInstruction('number-line', 'closerTo', lang)`
- All explanations need language awareness
- Import Language type and getInstruction

## Testing Plan:
After refactoring, we need to verify:
1. Hebrew questions work (lang='he')
2. English questions work (lang='en')
3. All question types in each module generate correctly
4. Language fallback works (defaults to Hebrew)

## Files Modified So Far:
- `/learningisfun-app/lib/math/content/templates.json`
- `/learningisfun-app/lib/math/content/index.ts`
- `/learningisfun-app/lib/math/modules/decimal.ts`
- `/learningisfun-app/lib/math/modules/fraction.ts`
