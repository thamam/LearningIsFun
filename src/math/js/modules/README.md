# Adding New Practice Modules

This directory contains all practice modules for Emma's math app. Each module follows the standardized IModule interface.

## Quick Start (< 30 minutes)

### 1. Create Your Module File

Create `js/modules/your-module-name.js`:

```javascript
const YourModule = {
    // Required Metadata
    name: "שם המודול בעברית",
    id: "your-module-id",
    icon: "🎯",
    description: "תיאור קצר של המודול",
    topics: ["נושא 1", "נושא 2", "נושא 3"],
    targetPages: "עמודים X-Y",

    // Required Functions
    generateQuestion: function(level = 'בינוני') {
        // Your question generation logic
        return {
            question: "השאלה כאן?",
            type: "input", // or "choice", "visual-input", "visual-choice"
            correctAnswer: 42,
            choices: [], // for choice-type questions
            explanation: "הסבר מפורט",
            difficulty: level
        };
    },

    checkAnswer: function(userAnswer, correctAnswer, questionData) {
        return userAnswer === correctAnswer;
    },

    getHint: function(questionData) {
        return "💡 רמז מועיל כאן";
    },

    getExplanation: function(questionData, userAnswer) {
        return {
            detailed: "הסבר מפורט על התשובה",
            tip: "טיפ קצר לפעם הבאה",
            nextSteps: "מה לתרגל הלאה"
        };
    },

    // Optional Functions
    getDifficultyRange: function(level) {
        return { /* custom difficulty settings */ };
    },

    getStats: function(moduleState) {
        return { /* custom statistics */ };
    },

    // Optional: Custom CSS
    customCSS: `
        .custom-style { color: blue; }
    `,

    // Optional: Custom HTML
    customHTML: "" // special visualizations if needed
};

// Export the module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = YourModule;
}
```

### 2. Register Your Module

Add to `Emma_math_lab.html` before `</body>`:

```html
<script src="js/modules/your-module-name.js"></script>
<script>
    moduleRegistry.register('your-module-id', YourModule);
</script>
```

### 3. Add UI Card (Optional)

The module registry can auto-generate cards, or you can manually add:

```html
<div class="exercise-card card-your-id">
    <div class="card-icon">🎯</div>
    <div class="card-title">שם המודול</div>
    <div class="card-description">תיאור</div>
    <div class="card-topics">נושאים</div>
    <div class="progress-indicator" id="your-id-progress">
        <div class="progress-text">🆕 התחל תרגול חדש</div>
    </div>
    <button class="start-button" onclick="showSection('your-id')">
        🚀 התחל תרגול
    </button>
</div>
```

## Module Interface Specification

### Required Properties
- `name` (string): Module name in Hebrew
- `id` (string): Unique identifier (lowercase, no spaces)
- `icon` (string): Emoji for display
- `description` (string): Short description in Hebrew
- `topics` (array): List of topics covered
- `targetPages` (string): Relevant textbook pages

### Required Functions

#### `generateQuestion(level)`
Generates a new question.

**Parameters:**
- `level` (string): "קל", "בינוני", or "קשה"

**Returns:** Object with:
- `question` (string): Question text
- `type` (string): "input", "choice", "visual-input", or "visual-choice"
- `correctAnswer` (any): The correct answer
- `choices` (array, optional): For choice-type questions
- `explanation` (string): Detailed explanation
- `difficulty` (string): Question difficulty level

#### `checkAnswer(userAnswer, correctAnswer, questionData)`
Validates user's answer.

**Returns:** boolean (true if correct)

#### `getHint(questionData)`
Provides a helpful hint.

**Returns:** string with hint text

#### `getExplanation(questionData, userAnswer)`
Provides detailed explanation after answering.

**Returns:** Object with:
- `detailed` (string): Full explanation
- `tip` (string): Quick tip
- `nextSteps` (string): What to practice next

## Example: Angles Module

```javascript
const AnglesModule = {
    name: "זוויות בגיאומטריה",
    id: "angles",
    icon: "📐",
    description: "זיהוי וחישוב זוויות, סוגי זוויות",
    topics: ["זווית חדה", "זווית קהה", "זווית ישרה"],
    targetPages: "עמודים 8-12",

    generateQuestion: function(level = 'בינוני') {
        const angles = level === 'קל'
            ? [30, 45, 60, 90]
            : [35, 47, 83, 127, 156];
        const angle = angles[Math.floor(Math.random() * angles.length)];

        return {
            question: `איזה סוג זווית היא זווית של ${angle} מעלות?`,
            type: 'choice',
            correctAnswer: angle === 90 ? 'זווית ישרה' :
                          angle < 90 ? 'זווית חדה' : 'זווית קהה',
            choices: ['זווית חדה', 'זווית ישרה', 'זווית קהה'],
            explanation: angle === 90
                ? 'זווית של 90° נקראת זווית ישרה'
                : angle < 90
                ? 'זוויות קטנות מ-90° נקראות זוויות חדות'
                : 'זוויות גדולות מ-90° נקראות זוויות קהות',
            difficulty: level
        };
    },

    checkAnswer: function(userAnswer, correctAnswer) {
        return userAnswer === correctAnswer;
    },

    getHint: function(questionData) {
        return "💡 זכרי: חדה < 90°, ישרה = 90°, קהה > 90°";
    },

    getExplanation: function(questionData, userAnswer) {
        return {
            detailed: questionData.explanation,
            tip: "תמיד השוואי את הזווית ל-90 מעלות",
            nextSteps: "תתרגלי עם זוויות נוספות בטווחים שונים"
        };
    }
};
```

## Testing Your Module

1. Open Emma_math_lab.html in browser
2. Open Developer Console (F12)
3. Check for: `✅ מודול 'שם המודול' (your-id) נרשם בהצלחה`
4. Test module functions:
```javascript
// Get your module
const myModule = moduleRegistry.get('your-id');

// Test question generation
const question = myModule.generateQuestion('בינוני');
console.log(question);

// Test answer checking
const isCorrect = myModule.checkAnswer(42, 42, question);
console.log(isCorrect);
```

## Existing Modules

- **decimal** (מבנה עשרוני): Decimal place value
- **multiplication** (השלמת גורם ומכפלה): Multiplication tables
- **numberline** (ישר מספרים): Number line visualization

## Need Help?

Check the existing modules in this directory for complete examples!
