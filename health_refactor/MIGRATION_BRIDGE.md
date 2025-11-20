# Migration Bridge: DOM to JSON Mapping

**Purpose:** This document maps DOM manipulation patterns in the legacy app to JSON View Object properties for headless modules.

**Target Audience:** AI agents performing extractions (Phase 2)

---

## Core Principle

**Legacy Pattern (DOM-Coupled):**
```javascript
// ❌ OLD: Directly manipulate DOM
const questionEl = document.getElementById('division-question');
questionEl.textContent = 'What is 12 ÷ 4?';

const inputEl = document.getElementById('division-answer-input');
inputEl.value = '';
inputEl.focus();
```

**Headless Pattern (JSON View Object):**
```javascript
// ✅ NEW: Return JSON data for rendering
return {
    type: 'question',
    questionText: 'What is 12 ÷ 4?',
    questionType: 'input',
    inputPlaceholder: 'הכניסי תשובה',
    inputValue: '',
    focus: true,
    correctAnswer: 3
};
```

**React Component (Consumes JSON):**
```tsx
// Next.js component renders from JSON
<div>
    <h2>{data.questionText}</h2>
    <input
        type="number"
        placeholder={data.inputPlaceholder}
        defaultValue={data.inputValue}
        autoFocus={data.focus}
    />
</div>
```

---

## Mapping Table: Division Module Example

| Legacy DOM Pattern | DOM ID / Selector | New JSON Property | Type | Example Value |
|--------------------|-------------------|-------------------|------|---------------|
| **Question Display** |
| `questionEl.textContent = q.question` | `#division-question` | `questionText` | `string` | `"מה התוצאה של 12 ÷ 4?"` |
| `equationEl.textContent = q.equation` | `#division-equation` | `equation` | `string` | `"12 ÷ 4 = ___"` |
| `equationEl.style.display = 'block'` | `#division-equation` | `showEquation` | `boolean` | `true` |
| **Input Element** |
| `inputEl.value = ''` | `#division-answer-input` | `inputValue` | `string` | `""` |
| `inputEl.focus()` | `#division-answer-input` | `focus` | `boolean` | `true` |
| `inputEl.style.display = 'inline-block'` | `#division-answer-input` | `showInput` | `boolean` | `true` |
| **Buttons** |
| `checkBtn.style.display = 'inline-block'` | `#division-check-btn` | `showCheckButton` | `boolean` | `true` |
| `newBtn.style.display = 'none'` | `#division-new-question-btn` | `showNextButton` | `boolean` | `false` |
| **Feedback** |
| `feedback.className = 'feedback correct'` | `#division-feedback` | `feedbackType` | `'correct' \| 'wrong' \| 'hidden'` | `'correct'` |
| `feedback.innerHTML = '✅ מעולה!'` | `#division-feedback` | `feedbackMessage` | `string` | `"✅ מעולה! תשובה נכונה!"` |
| **Statistics** |
| `scoreEl.textContent = '5/10'` | `#division-score` | `statistics.score` | `string` | `"5/10"` |
| `streakEl.textContent = 'Streak: 3'` | `#division-streak` | `statistics.currentStreak` | `number` | `3` |
| **Hidden Data** |
| `divisionState.currentAnswer` | N/A (state variable) | `correctAnswer` | `number \| string` | `3` |
| `divisionState.level` | N/A (state variable) | `difficulty` | `'קל' \| 'בינוני' \| 'קשה'` | `'קל'` |

---

## View Object Schema: Question Generation

### Complete View Object Structure

```typescript
// TypeScript interface for question View Object
interface QuestionViewObject {
    // Metadata
    type: 'question';
    timestamp: number;
    module: string;              // 'division', 'decimal', etc.
    difficulty: 'קל' | 'בינוני' | 'קשה';

    // Question Content
    questionText: string;        // Main question text (Hebrew)
    equation?: string;           // Optional equation display
    showEquation: boolean;       // Whether to show equation section

    // Question Type
    questionType: 'input' | 'choice' | 'visual';

    // Input Configuration (if questionType === 'input')
    inputValue: string;          // Initial input value (usually empty)
    inputPlaceholder: string;    // Placeholder text (Hebrew)
    inputType: 'number' | 'text';
    focus: boolean;              // Should input be focused?
    showInput: boolean;

    // Choice Configuration (if questionType === 'choice')
    choices?: Array<{
        id: string | number;
        text: string;
        selected: boolean;
    }>;
    showChoices: boolean;

    // Visual Configuration (if questionType === 'visual')
    visual?: {
        type: 'numberline' | 'chart' | 'diagram';
        data: any;               // Visual-specific data
    };

    // Answer Data (hidden from UI)
    correctAnswer: number | string | object;
    metadata?: {
        dividend?: number;
        divisor?: number;
        quotient?: number;
        remainder?: number;
    };

    // UI State
    showCheckButton: boolean;
    showNextButton: boolean;
    showHintButton: boolean;

    // Hint System
    hint?: string;
    hintVisible: boolean;
}
```

### Example: Division Question (Input Type)

```json
{
    "type": "question",
    "timestamp": 1700000000000,
    "module": "division",
    "difficulty": "קל",

    "questionText": "חשבי:",
    "equation": "12 ÷ 4 = ___",
    "showEquation": true,

    "questionType": "input",
    "inputValue": "",
    "inputPlaceholder": "הכניסי תשובה",
    "inputType": "number",
    "focus": true,
    "showInput": true,

    "correctAnswer": 3,
    "metadata": {
        "dividend": 12,
        "divisor": 4,
        "quotient": 3
    },

    "showCheckButton": true,
    "showNextButton": false,
    "showHintButton": true,

    "hint": "חשבי על לוח הכפל: 4 × ? = 12",
    "hintVisible": false
}
```

### Example: Division Question (Choice Type)

```json
{
    "type": "question",
    "timestamp": 1700000000000,
    "module": "division",
    "difficulty": "בינוני",

    "questionText": "מה התוצאה של 20 ÷ 5?",
    "showEquation": false,

    "questionType": "choice",
    "choices": [
        { "id": "a", "text": "3", "selected": false },
        { "id": "b", "text": "4", "selected": false },
        { "id": "c", "text": "5", "selected": false }
    ],
    "showChoices": true,

    "correctAnswer": "4",

    "showCheckButton": false,
    "showNextButton": false,
    "showHintButton": true
}
```

---

## View Object Schema: Answer Validation

### Complete View Object Structure

```typescript
// TypeScript interface for feedback View Object
interface FeedbackViewObject {
    // Metadata
    type: 'feedback';
    timestamp: number;
    module: string;

    // Validation Result
    isCorrect: boolean;
    userAnswer: number | string;
    correctAnswer: number | string;

    // Feedback Display
    feedbackType: 'correct' | 'wrong' | 'partial';
    feedbackMessage: string;     // Hebrew feedback text
    encouragement: string;       // Random encouragement
    feedbackIcon: string;        // Emoji or icon

    // Explanation (for wrong answers)
    explanation?: string;        // Hebrew explanation
    showExplanation: boolean;
    workingSteps?: string[];     // Step-by-step solution

    // UI State
    showCheckButton: boolean;
    showNextButton: boolean;
    enableInput: boolean;        // Lock input after answer

    // Statistics Update
    statistics: {
        totalQuestions: number;
        correctAnswers: number;
        currentStreak: number;
        bestStreak: number;
        accuracy: number;        // Percentage
    };

    // Next Action
    nextAction: 'generate_next' | 'show_hint' | 'retry' | 'level_up' | 'level_down';
    autoAdvance: boolean;        // Auto-generate next question?
    autoAdvanceDelay: number;    // Milliseconds
}
```

### Example: Correct Answer Feedback

```json
{
    "type": "feedback",
    "timestamp": 1700000000000,
    "module": "division",

    "isCorrect": true,
    "userAnswer": 3,
    "correctAnswer": 3,

    "feedbackType": "correct",
    "feedbackMessage": "מעולה! תשובה נכונה!",
    "encouragement": "את גאונית!",
    "feedbackIcon": "✅",

    "showExplanation": false,

    "showCheckButton": false,
    "showNextButton": true,
    "enableInput": false,

    "statistics": {
        "totalQuestions": 10,
        "correctAnswers": 8,
        "currentStreak": 3,
        "bestStreak": 5,
        "accuracy": 80
    },

    "nextAction": "generate_next",
    "autoAdvance": true,
    "autoAdvanceDelay": 1500
}
```

### Example: Wrong Answer Feedback

```json
{
    "type": "feedback",
    "timestamp": 1700000000000,
    "module": "division",

    "isCorrect": false,
    "userAnswer": 4,
    "correctAnswer": 3,

    "feedbackType": "wrong",
    "feedbackMessage": "לא נכונה, נסי שוב!",
    "encouragement": "כמעט! אפשר ללמוד מטעויות.",
    "feedbackIcon": "❌",

    "explanation": "12 חלקי 4 שווה 3, כי 4 × 3 = 12",
    "showExplanation": true,
    "workingSteps": [
        "שלב 1: חשבי כמה פעמים 4 נכנס ב-12",
        "שלב 2: 4 × 1 = 4 (לא מספיק)",
        "שלב 3: 4 × 2 = 8 (לא מספיק)",
        "שלב 4: 4 × 3 = 12 (נכון!)",
        "לכן: 12 ÷ 4 = 3"
    ],

    "showCheckButton": false,
    "showNextButton": true,
    "enableInput": false,

    "statistics": {
        "totalQuestions": 10,
        "correctAnswers": 7,
        "currentStreak": 0,
        "bestStreak": 5,
        "accuracy": 70
    },

    "nextAction": "show_hint",
    "autoAdvance": false,
    "autoAdvanceDelay": 0
}
```

---

## Common DOM Patterns → JSON Transformations

### Pattern 1: Conditional Display

**Legacy:**
```javascript
// ❌ DOM manipulation
element.style.display = condition ? 'block' : 'none';
element.classList.add('hidden');
element.classList.remove('hidden');
```

**Headless:**
```javascript
// ✅ JSON property
{
    showElement: condition,
    elementVisible: !isHidden
}
```

---

### Pattern 2: Text Content

**Legacy:**
```javascript
// ❌ DOM manipulation
element.textContent = 'Some text';
element.innerHTML = '<strong>Bold text</strong>';
```

**Headless:**
```javascript
// ✅ JSON property
{
    elementText: 'Some text',
    elementHTML: '<strong>Bold text</strong>',  // If HTML needed
    elementTextOnly: 'Bold text'                // Preferred: plain text
}
```

---

### Pattern 3: CSS Classes (State)

**Legacy:**
```javascript
// ❌ DOM manipulation
feedback.className = 'feedback correct';
feedback.classList.add('success');
feedback.classList.toggle('visible');
```

**Headless:**
```javascript
// ✅ JSON property
{
    feedbackType: 'correct',      // Semantic state
    feedbackClasses: ['feedback', 'success', 'visible'],  // If needed
    feedbackState: 'success'      // Preferred: semantic enum
}
```

---

### Pattern 4: Input Values

**Legacy:**
```javascript
// ❌ DOM manipulation
inputEl.value = '42';
inputEl.placeholder = 'Enter answer';
inputEl.disabled = true;
```

**Headless:**
```javascript
// ✅ JSON property
{
    inputValue: '42',
    inputPlaceholder: 'Enter answer',
    inputDisabled: true
}
```

---

### Pattern 5: Event Handlers

**Legacy:**
```javascript
// ❌ DOM manipulation
element.onclick = handleClick;
element.addEventListener('keypress', handleKeypress);
```

**Headless:**
```javascript
// ✅ No event handlers in headless module!
// React component will handle events and call module methods

// Module only exposes methods:
checkAnswer(userAnswer) { /* ... */ }
generateQuestion() { /* ... */ }
```

---

### Pattern 6: Focus Management

**Legacy:**
```javascript
// ❌ DOM manipulation
inputEl.focus();
inputEl.blur();
```

**Headless:**
```javascript
// ✅ JSON property (React will apply)
{
    inputFocus: true,
    autoFocus: true
}
```

---

## Special Cases

### Case 1: Hebrew Text Direction

**Legacy:**
```javascript
// ❌ DOM manipulation
element.dir = 'rtl';
element.lang = 'he';
```

**Headless:**
```javascript
// ✅ JSON property
{
    textDirection: 'rtl',
    language: 'he',
    // React component will apply: dir="rtl" lang="he"
}
```

---

### Case 2: Random Selection (Encouragement Messages)

**Legacy:**
```javascript
// ❌ DOM manipulation + business logic
const encouragements = ['מעולה!', 'פנטסטי!', 'את גאונית!'];
const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
feedback.textContent = encouragement;
```

**Headless:**
```javascript
// ✅ Business logic in module, output in JSON
_getRandomEncouragement(isCorrect) {
    const messages = {
        correct: ['מעולה!', 'פנטסטי!', 'את גאונית!', 'כל הכבוד!'],
        wrong: ['לא נורא!', 'ננסה שוב!', 'כמעט!', 'אפשר ללמוד מטעויות!']
    };
    const pool = messages[isCorrect ? 'correct' : 'wrong'];
    return pool[Math.floor(Math.random() * pool.length)];
}

// Usage in method:
checkAnswer(userAnswer, correctAnswer) {
    const isCorrect = userAnswer === correctAnswer;
    return {
        encouragement: this._getRandomEncouragement(isCorrect),
        // ... other properties
    };
}
```

---

### Case 3: Progress Statistics

**Legacy:**
```javascript
// ❌ DOM manipulation
scoreEl.textContent = `${correctAnswers}/${totalQuestions}`;
streakEl.textContent = `Streak: ${currentStreak}`;
```

**Headless:**
```javascript
// ✅ JSON property
{
    statistics: {
        totalQuestions: 10,
        correctAnswers: 8,
        currentStreak: 3,
        bestStreak: 5,
        accuracy: 80,
        scoreDisplay: '8/10',    // Pre-formatted string
        streakDisplay: 'Streak: 3'
    }
}
```

---

### Case 4: Visual Elements (Number Line, Charts)

**Legacy:**
```javascript
// ❌ DOM manipulation
const numberLine = document.getElementById('numberline-svg');
numberLine.innerHTML = `<line x1="0" y1="50" x2="400" y2="50" ... />`;

const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
arrow.setAttribute('points', '200,40 210,50 200,60');
numberLine.appendChild(arrow);
```

**Headless:**
```javascript
// ✅ JSON property (data for SVG rendering)
{
    visual: {
        type: 'numberline',
        width: 400,
        height: 100,
        elements: [
            {
                type: 'line',
                x1: 0, y1: 50,
                x2: 400, y2: 50,
                stroke: '#333',
                strokeWidth: 2
            },
            {
                type: 'polygon',
                points: '200,40 210,50 200,60',
                fill: '#ff0000'
            }
        ],
        numberLine: {
            min: 0,
            max: 100,
            interval: 10,
            markedPositions: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
            arrowPosition: 45
        }
    }
}
```

---

## Extraction Checklist

Use this checklist when extracting each module:

### ✅ Step 1: Identify DOM References
```bash
# Search for DOM access in original file
grep -n "document\." src/math/js/modules/division_module.js
grep -n "window\." src/math/js/modules/division_module.js
grep -n "getElementById" src/math/js/modules/division_module.js
grep -n "querySelector" src/math/js/modules/division_module.js
grep -n "\.style\." src/math/js/modules/division_module.js
grep -n "\.classList" src/math/js/modules/division_module.js
```

### ✅ Step 2: Map Each DOM Operation to JSON Property
Create a mapping table (like above) for your specific module:
| DOM Operation | DOM ID | JSON Property | Type | Example |
|---------------|--------|---------------|------|---------|
| ... | ... | ... | ... | ... |

### ✅ Step 3: Extract Business Logic
- Separate question generation logic
- Separate answer validation logic
- Keep all math/logic operations
- Remove all DOM manipulation

### ✅ Step 4: Create View Object Methods
```javascript
generateQuestion(level) {
    // Business logic
    return { /* View Object */ };
}

checkAnswer(userAnswer, correctAnswer) {
    // Validation logic
    return { /* View Object */ };
}
```

### ✅ Step 5: Verify Zero DOM Access
```bash
# Must return zero results
grep -n "document\|window\|getElementById" extracted-modules/modules/DivisionModule.js
```

### ✅ Step 6: Write Console Test
```javascript
// Test without browser
const module = new DivisionModule();
const question = module.generateQuestion('קל');
console.log(JSON.stringify(question, null, 2));
```

### ✅ Step 7: Document TypeScript Interface
```typescript
// View Object schema
interface DivisionQuestionView {
    // ... all properties
}
```

---

## Integration Pattern: Next.js API Route

**Example:** Using extracted `DivisionModule` in Next.js

```typescript
// app/api/math/division/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { DivisionModule } from '@/lib/modules/DivisionModule';

export async function POST(request: NextRequest) {
    try {
        const { action, level, userAnswer, correctAnswer, sessionData } = await request.json();

        // Initialize module (headless)
        const module = new DivisionModule({
            initialLevel: sessionData?.level || 'קל',
            statistics: sessionData?.statistics
        });

        // Handle different actions
        switch (action) {
            case 'generate':
                // Generate new question (returns JSON View Object)
                const question = module.generateQuestion(level);
                return NextResponse.json({
                    success: true,
                    data: question
                });

            case 'check':
                // Validate answer (returns JSON View Object)
                const feedback = module.checkAnswer(userAnswer, correctAnswer);
                return NextResponse.json({
                    success: true,
                    data: feedback
                });

            case 'hint':
                // Get hint (returns JSON View Object)
                const hint = module.getHint(correctAnswer);
                return NextResponse.json({
                    success: true,
                    data: hint
                });

            default:
                return NextResponse.json(
                    { success: false, error: 'Invalid action' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Division API error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
```

**React Component:**
```tsx
// app/math/division/page.tsx
'use client';

import { useState } from 'react';

export default function DivisionPractice() {
    const [question, setQuestion] = useState(null);
    const [feedback, setFeedback] = useState(null);

    async function generateQuestion() {
        const res = await fetch('/api/math/division', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'generate',
                level: 'קל'
            })
        });
        const result = await res.json();
        setQuestion(result.data);  // Use JSON View Object
        setFeedback(null);
    }

    async function checkAnswer(userAnswer) {
        const res = await fetch('/api/math/division', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'check',
                userAnswer: userAnswer,
                correctAnswer: question.correctAnswer
            })
        });
        const result = await res.json();
        setFeedback(result.data);  // Use JSON View Object
    }

    return (
        <div dir="rtl">
            {question && (
                <div>
                    <h2>{question.questionText}</h2>
                    {question.showEquation && <p>{question.equation}</p>}

                    {question.questionType === 'input' && (
                        <input
                            type={question.inputType}
                            placeholder={question.inputPlaceholder}
                            onBlur={(e) => checkAnswer(e.target.value)}
                        />
                    )}

                    {feedback && (
                        <div className={`feedback ${feedback.feedbackType}`}>
                            <p>{feedback.feedbackIcon} {feedback.feedbackMessage}</p>
                            {feedback.showExplanation && <p>{feedback.explanation}</p>}
                        </div>
                    )}
                </div>
            )}

            <button onClick={generateQuestion}>שאלה חדשה</button>
        </div>
    );
}
```

---

**Last Updated:** 2025-11-20
**Purpose:** Guide AI agents through DOM → JSON extraction
**Target:** Zero DOM access, console-testable modules
**Success Metric:** Copy-paste into Next.js without changes
