# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**LearningIsFun** is a Hebrew-language math practice web application for student Emma, consisting of a single-page HTML application with three practice modules:
- Decimal numbers (מבנה עשרוני)
- Multiplication practice (כפל)
- Number line exercises (ישר מספרים)

**Tech Stack**: Pure HTML/CSS/JavaScript (no framework, no build system)
**Language**: All UI and content is in Hebrew (right-to-left)

## Architecture

### Single-File Application
The entire application is in `src/math/Emma_math_lab.html` (~2500 lines):
- Sections managed by CSS classes (`.section.active` for visibility)
- State management via plain JavaScript objects
- LocalStorage for persistence (per-module keys)

### Core State Objects
Three independent state objects manage each module:
- `decimalState` - Decimal number practice state
- `multiplicationState` - Multiplication practice state
- `numberlineState` - Number line practice state

Each state object contains:
```javascript
{
    level: 'קל' | 'בינוני' | 'קשה',
    totalQuestions: number,
    correctAnswers: number,
    currentStreak: number,
    bestStreak: number,
    consecutiveCorrect: number,
    consecutiveWrong: number,
    sessionHistory: array,
    startTime: timestamp,
    currentQuestion: object,
    currentAnswer: any
}
```

### Key Functions Pattern
Each module follows the same pattern:
- `generate[Module]Question()` - Creates new question and updates state
- `check[Module]Answer()` - Validates answer, updates stats, provides feedback
- `select[Module]Choice()` - Handles multiple choice selection (if applicable)

### Persistence System
- `saveProgress(toolName)` - Saves module state to LocalStorage
- `loadProgress(toolName)` - Loads module state from LocalStorage
- Keys: `emmaDecimalProgress`, `emmaMultiplicationProgress`, `emmaNumberLineProgress`

### Section Navigation
- `showSection(sectionName)` - Shows/hides sections, initializes module
- Sections: 'home', 'decimal', 'multiplication', 'numberline'
- Home button (fixed position) always available to return to main screen

## Development Workflow

### Testing
No test framework - manual testing in browser:
1. Open `src/math/Emma_math_lab.html` in browser
2. Use browser DevTools console (F12) for debugging
3. Check console for navigation patch confirmation: `✅ Navigation Feature Patch Loaded Successfully!`

### Adding Features
When modifying the HTML file:
1. **Preserve Hebrew content** - All UI text must remain in Hebrew
2. **Maintain state structure** - Don't break existing persistence
3. **Test all three modules** - Changes may affect multiple sections
4. **Check console for errors** - Script errors will show in browser console

### Navigation Feature
The navigation system (Previous/Next/Skip buttons) is implemented as an injected patch at the end of the file:
- Extends state objects with question bank tracking
- Wraps existing generate/check functions
- Manages skipped vs answered question tracking
- File: `src/math/PASTE_THIS_Navigation_Code.md` contains the injectable version

## Important Patterns

### Hebrew RTL Considerations
- `dir="rtl"` and `lang="he"` on HTML element
- Font: 'Noto Sans Hebrew' from Google Fonts
- All text content, buttons, labels must be in Hebrew
- Number formatting follows Hebrew conventions

### State Modification Safety
Always save state after modifications:
```javascript
state.property = newValue;
saveProgress(toolName);
updateStats(toolName);
```

### Question Types
Two question types per module:
- `'input'` - Text input for answers
- `'choice'` - Multiple choice buttons
- Some modules have visual types: `'visual'`, `'visual-input'`, `'visual-choice'`

## File Organization

```
/
├── README.md                           # Minimal project description
├── original_prompt.md                  # Original sprint planning requirements (6 features)
└── src/
    └── math/
        ├── Emma_math_lab.html          # Main application (all code)
        └── PASTE_THIS_Navigation_Code.md  # Navigation feature patch documentation
```

## Future Development Notes

The `original_prompt.md` contains sprint planning for 6 features:
1. State persistence/portability (JSON export/import)
2. Progress visualization (race track metaphor)
3. Admin dashboard (heatmaps, analytics)
4. Question navigation (Previous/Next/Skip) - **PARTIALLY IMPLEMENTED**
5. Multi-attempt wrong answer flow
6. Module interface standardization

Feature #4 (navigation) has been implemented. Other features remain planned.

## Common Gotchas

1. **File is large** - 2500+ lines in single HTML file, use search/grep to find sections
2. **No build system** - Changes are directly in HTML, no compilation needed
3. **LocalStorage testing** - Use browser DevTools Application tab to inspect/clear storage
4. **Hebrew text direction** - RTL layout affects positioning and flex/grid flows
5. **State object references** - Three separate state objects, ensure you're modifying the correct one
