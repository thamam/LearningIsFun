# Modular Refactoring Plan

## Overview

Refactor Emma_math_lab.html (155KB) into modular architecture for easier maintenance and module addition.

## New File Structure

```
src/math/
├── Emma_math_lab.html              (~25KB - structure + HTML only)
├── css/
│   └── main.css                   (~10KB - all styles)
├── js/
│   ├── core/
│   │   └── app.js                 (~20KB - core app logic, state management)
│   ├── features/
│   │   ├── export-import.js       (~8KB - Feature 1: Save/Load)
│   │   ├── race-track.js          (~5KB - Feature 2: Progress visualization)
│   │   ├── navigation.js          (~15KB - Feature 4: Prev/Next/Skip)
│   │   ├── multi-attempt.js       (~12KB - Feature 5: Multiple attempts)
│   │   └── module-registry.js     (~3KB - Feature 6: Module interface)
│   └── modules/
│       ├── README.md              (How to add new modules) ✅ Created
│       ├── decimal.js             (~15KB - Decimal module)
│       ├── multiplication.js      (~12KB - Multiplication module)
│       ├── numberline.js          (~18KB - Number line module)
│       └── [future modules here]
└── MODULAR_REFACTORING_PLAN.md    (this file) ✅ Created
```

## Benefits

### 1. **Easy Module Addition** (Primary Goal)
- Create single file: `js/modules/new-module.js`
- Add one line: `<script src="js/modules/new-module.js"></script>`
- Register: `moduleRegistry.register('id', ModuleObject);`
- **Total time: < 30 minutes**

### 2. **Maintainability**
- Edit features independently
- Debug specific functionality easily
- No risk of breaking unrelated code

### 3. **Team Collaboration**
- Multiple developers can work on different modules
- Clear separation of concerns
- Version control friendly

### 4. **Performance**
- Browser caches individual files
- Only load what's needed (future enhancement)
- Easier to optimize specific features

## Migration Steps

### Phase 1: Extract Styles ✅ In Progress
- [x] Create css/ directory
- [ ] Extract all CSS from `<style>` to `css/main.css`
- [ ] Replace `<style>` with `<link rel="stylesheet" href="css/main.css">`

### Phase 2: Extract Core App
- [ ] Create `js/core/app.js`
- [ ] Move: State management (decimalState, multiplicationState, numberlineState)
- [ ] Move: Core functions (showSection, hideCelebration, getState, saveProgress, loadProgress)
- [ ] Move: Initialization (DOMContentLoaded listeners)

### Phase 3: Extract Features
- [ ] Create feature files in `js/features/`
- [ ] Extract Feature 1 (Export/Import) to `export-import.js`
- [ ] Extract Feature 2 (Race Track) to `race-track.js`
- [ ] Extract Feature 4 (Navigation) to `navigation.js`
- [ ] Extract Feature 5 (Multi-Attempt) to `multi-attempt.js`
- [ ] Extract Feature 6 (Module Registry) to `module-registry.js`

### Phase 4: Extract Modules
- [ ] Create module files in `js/modules/`
- [ ] Extract decimal questions/logic to `decimal.js`
- [ ] Extract multiplication questions/logic to `multiplication.js`
- [ ] Extract numberline questions/logic to `numberline.js`

### Phase 5: Update Main HTML
- [ ] Remove extracted CSS (replace with `<link>`)
- [ ] Remove extracted JavaScript (replace with `<script src="...">`)
- [ ] Add proper loading order:
  ```html
  <!-- Core -->
  <script src="js/core/app.js"></script>

  <!-- Features -->
  <script src="js/features/module-registry.js"></script>
  <script src="js/features/export-import.js"></script>
  <script src="js/features/race-track.js"></script>
  <script src="js/features/multi-attempt.js"></script>
  <script src="js/features/navigation.js"></script>

  <!-- Modules -->
  <script src="js/modules/decimal.js"></script>
  <script src="js/modules/multiplication.js"></script>
  <script src="js/modules/numberline.js"></script>
  ```

### Phase 6: Testing
- [ ] Test all 3 existing modules work
- [ ] Test all 6 features work
- [ ] Test state persistence
- [ ] Test export/import
- [ ] Test navigation
- [ ] Test multi-attempt flow
- [ ] Test race track updates
- [ ] Verify file sizes acceptable

## File Size Comparison

### Before (Monolithic)
- Emma_math_lab.html: **155KB** (everything in one file)

### After (Modular)
- Emma_math_lab.html: ~25KB (structure only)
- css/main.css: ~10KB
- js/core/app.js: ~20KB
- js/features/*.js: ~43KB total (5 files)
- js/modules/*.js: ~45KB total (3 modules)
- **Total: ~143KB** (12KB savings + modularity!)

## Future Module Addition Example

### Before (Monolithic):
1. Find correct insertion point in 3,500+ line file ❌
2. Copy/paste code, risk breaking existing code ❌
3. Test everything to make sure nothing broke ❌
4. **Time: 2-4 hours** ❌

### After (Modular):
1. Create `js/modules/angles.js` ✅
2. Copy template from README ✅
3. Implement 4 required functions ✅
4. Add `<script src="js/modules/angles.js"></script>` ✅
5. Register: `moduleRegistry.register('angles', AnglesModule);` ✅
6. **Time: < 30 minutes** ✅

## Next Steps

Would you like me to:
1. **Execute the full refactoring** (automated, systematic)
2. **Review the plan** before proceeding
3. **Modify the structure** (different organization)

Recommend: **Option 1** - I'll execute the refactoring systematically with verification at each step.
