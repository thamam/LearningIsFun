# Next.js Integration Guide - Extracted Math Modules

**Developer Manual for Frontend Team**

This guide explains how to integrate the 7 extracted headless math modules into a Next.js App Router application.

---

## Table of Contents

1. [File Placement](#1-file-placement)
2. [API Route Example](#2-api-route-example)
3. [React Component Example](#3-react-component-example)
4. [Module Reference](#4-module-reference)
5. [TypeScript Support](#5-typescript-support)
6. [Testing](#6-testing)

---

## 1. File Placement

### Recommended Directory Structure

```
your-nextjs-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── math/
│   │   │       ├── generate/
│   │   │       │   └── route.ts         # Generate question API
│   │   │       └── check/
│   │   │           └── route.ts         # Check answer API
│   │   └── practice/
│   │       └── [module]/
│   │           └── page.tsx             # Practice page
│   └── lib/
│       └── math/
│           ├── modules/
│           │   ├── DivisionModule.js
│           │   ├── DivisionModule.d.ts
│           │   ├── DecimalModule.js
│           │   ├── DecimalModule.d.ts
│           │   ├── FractionModule.js
│           │   ├── FractionModule.d.ts
│           │   ├── MultiplicationModule.js
│           │   ├── MultiplicationModule.d.ts
│           │   ├── OrderOperationsModule.js
│           │   ├── OrderOperationsModule.d.ts
│           │   ├── DistributiveModule.js
│           │   ├── DistributiveModule.d.ts
│           │   ├── NumberLineModule.js
│           │   └── NumberLineModule.d.ts
│           ├── index.js                 # Barrel export
│           └── package.json
```

### Installation Steps

1. **Copy the extracted-modules folder:**
   ```bash
   cp -r extracted-modules/* your-nextjs-app/src/lib/math/
   ```

2. **Update import paths** in `index.js` if needed (should work as-is).

3. **Install types** (optional but recommended):
   ```bash
   npm install --save-dev @types/node
   ```

---

## 2. API Route Example

### Generate Question API (`app/api/math/generate/route.ts`)

This API route generates a new math question for any module.

```typescript
import { NextRequest, NextResponse } from 'next/server';
import {
  DivisionModule,
  DecimalModule,
  FractionModule,
  MultiplicationModule,
  OrderOperationsModule,
  DistributiveModule,
  NumberLineModule
} from '@/lib/math';

// Module registry
const modules = {
  division: DivisionModule,
  decimal: DecimalModule,
  fraction: FractionModule,
  multiplication: MultiplicationModule,
  order: OrderOperationsModule,
  distributive: DistributiveModule,
  numberline: NumberLineModule
};

export async function POST(request: NextRequest) {
  try {
    const { moduleName, level = 'בינוני', config = {} } = await request.json();

    // Validate module name
    if (!moduleName || !modules[moduleName]) {
      return NextResponse.json(
        { error: 'Invalid module name', availableModules: Object.keys(modules) },
        { status: 400 }
      );
    }

    // Validate level
    const validLevels = ['קל', 'בינוני', 'קשה'];
    if (!validLevels.includes(level)) {
      return NextResponse.json(
        { error: 'Invalid level', validLevels },
        { status: 400 }
      );
    }

    // Instantiate module
    const ModuleClass = modules[moduleName];
    const moduleInstance = new ModuleClass({ initialLevel: level, ...config });

    // Generate question
    const question = moduleInstance.generateQuestion(level);

    // Return question + current statistics
    return NextResponse.json({
      success: true,
      question: question,
      statistics: moduleInstance.getStatistics(),
      currentLevel: moduleInstance.getCurrentLevel()
    });

  } catch (error) {
    console.error('Error generating question:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
```

### Check Answer API (`app/api/math/check/route.ts`)

This API route validates a user's answer.

```typescript
import { NextRequest, NextResponse } from 'next/server';
import {
  DivisionModule,
  DecimalModule,
  FractionModule,
  MultiplicationModule,
  OrderOperationsModule,
  DistributiveModule,
  NumberLineModule
} from '@/lib/math';

const modules = {
  division: DivisionModule,
  decimal: DecimalModule,
  fraction: FractionModule,
  multiplication: MultiplicationModule,
  order: OrderOperationsModule,
  distributive: DistributiveModule,
  numberline: NumberLineModule
};

export async function POST(request: NextRequest) {
  try {
    const {
      moduleName,
      userAnswer,
      currentQuestion,
      sessionStatistics = {}
    } = await request.json();

    // Validate module name
    if (!moduleName || !modules[moduleName]) {
      return NextResponse.json(
        { error: 'Invalid module name' },
        { status: 400 }
      );
    }

    // Validate input
    if (userAnswer === undefined || !currentQuestion) {
      return NextResponse.json(
        { error: 'Missing userAnswer or currentQuestion' },
        { status: 400 }
      );
    }

    // Instantiate module with session statistics
    const ModuleClass = modules[moduleName];
    const moduleInstance = new ModuleClass({
      initialLevel: currentQuestion.metadata?.level || 'בינוני',
      statistics: sessionStatistics
    });

    // Check answer
    const feedback = moduleInstance.checkAnswer(
      userAnswer,
      currentQuestion.correctAnswer,
      currentQuestion
    );

    // Return feedback + updated statistics
    return NextResponse.json({
      success: true,
      feedback: feedback,
      statistics: moduleInstance.getStatistics(),
      currentLevel: moduleInstance.getCurrentLevel()
    });

  } catch (error) {
    console.error('Error checking answer:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
```

### Usage from Client:

```typescript
// Generate a question
const response = await fetch('/api/math/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    moduleName: 'division',
    level: 'בינוני'
  })
});
const { question, statistics } = await response.json();

// Check an answer
const checkResponse = await fetch('/api/math/check', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    moduleName: 'division',
    userAnswer: 42,
    currentQuestion: question,
    sessionStatistics: statistics
  })
});
const { feedback } = await checkResponse.json();
```

---

## 3. React Component Example

### Text-Based Question Component (`components/MathQuestion.tsx`)

For modules like Division, Multiplication, Order of Operations:

```typescript
'use client';

import { useState, useEffect } from 'react';

interface MathQuestionProps {
  moduleName: string;
  level?: string;
}

export default function MathQuestion({ moduleName, level = 'בינוני' }: MathQuestionProps) {
  const [question, setQuestion] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<any>(null);
  const [statistics, setStatistics] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // Generate initial question
  useEffect(() => {
    generateQuestion();
  }, [moduleName, level]);

  const generateQuestion = async () => {
    setLoading(true);
    setFeedback(null);
    setUserAnswer('');

    const response = await fetch('/api/math/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ moduleName, level })
    });

    const data = await response.json();
    setQuestion(data.question);
    setStatistics(data.statistics);
    setLoading(false);
  };

  const checkAnswer = async () => {
    const response = await fetch('/api/math/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        moduleName,
        userAnswer,
        currentQuestion: question,
        sessionStatistics: statistics
      })
    });

    const data = await response.json();
    setFeedback(data.feedback);
    setStatistics(data.statistics);

    // Auto-advance to next question if correct
    if (data.feedback.isCorrect && data.feedback.autoAdvance) {
      setTimeout(() => generateQuestion(), data.feedback.autoAdvanceDelay || 1500);
    }
  };

  if (loading) return <div>טוען שאלה...</div>;

  return (
    <div className="math-question-container" dir="rtl">
      {/* Question */}
      <div className="question-text">
        <h2>{question.questionText}</h2>
      </div>

      {/* Explanation (if present) */}
      {question.explanation && (
        <div className="explanation">
          <pre>{question.explanation}</pre>
        </div>
      )}

      {/* Input or Choice */}
      {question.questionType === 'input' && (
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder={question.inputPlaceholder}
          disabled={feedback !== null}
        />
      )}

      {question.questionType === 'choice' && (
        <div className="choices">
          {question.choices.map((choice: any) => (
            <button
              key={choice.id}
              onClick={() => setUserAnswer(choice.value.toString())}
              className={userAnswer === choice.value.toString() ? 'selected' : ''}
              disabled={feedback !== null}
            >
              {choice.text}
            </button>
          ))}
        </div>
      )}

      {/* Check Button */}
      {!feedback && (
        <button onClick={checkAnswer} disabled={!userAnswer}>
          בדוק תשובה
        </button>
      )}

      {/* Feedback */}
      {feedback && (
        <div className={`feedback ${feedback.feedbackType}`}>
          <p>{feedback.feedbackMessage}</p>
          {feedback.correctAnswerDisplay && <p>{feedback.correctAnswerDisplay}</p>}
          {feedback.explanation && <pre>{feedback.explanation}</pre>}
          {!feedback.autoAdvance && (
            <button onClick={generateQuestion}>שאלה הבאה</button>
          )}
        </div>
      )}

      {/* Statistics */}
      <div className="statistics">
        <p>שאלות: {statistics.totalQuestions}</p>
        <p>נכונות: {statistics.correctAnswers}</p>
        <p>רצף נוכחי: {statistics.currentStreak}</p>
      </div>
    </div>
  );
}
```

### Visual Question Component - Number Line (`components/NumberLineQuestion.tsx`)

For the NumberLineModule with visual rendering:

```typescript
'use client';

import { useState, useEffect } from 'react';

interface NumberLineQuestionProps {
  level?: string;
}

export default function NumberLineQuestion({ level = 'קל' }: NumberLineQuestionProps) {
  const [question, setQuestion] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateQuestion();
  }, [level]);

  const generateQuestion = async () => {
    setLoading(true);
    setFeedback(null);
    setUserAnswer('');

    const response = await fetch('/api/math/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ moduleName: 'numberline', level })
    });

    const data = await response.json();
    setQuestion(data.question);
    setLoading(false);
  };

  const checkAnswer = async () => {
    const response = await fetch('/api/math/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        moduleName: 'numberline',
        userAnswer,
        currentQuestion: question
      })
    });

    const data = await response.json();
    setFeedback(data.feedback);

    if (data.feedback.isCorrect && data.feedback.autoAdvance) {
      setTimeout(() => generateQuestion(), data.feedback.autoAdvanceDelay);
    }
  };

  if (loading) return <div>טוען שאלה...</div>;

  return (
    <div className="numberline-question" dir="rtl">
      <h2>{question.questionText}</h2>

      {/* Render Number Line (if visualData exists) */}
      {question.visualData && (
        <div className="numberline-container">
          <svg width="800" height="100" viewBox="0 0 800 100">
            {/* Main line */}
            <line x1="50" y1="50" x2="750" y2="50" stroke="#333" strokeWidth="2" />

            {/* Major markers */}
            {question.visualData.majorMarkers.map((marker: any) => {
              const x = 50 + (marker.position / 100) * 700;
              return (
                <g key={marker.value}>
                  <line x1={x} y1="40" x2={x} y2="60" stroke="#333" strokeWidth="2" />
                  <text x={x} y="80" textAnchor="middle" fontSize="14">{marker.label}</text>
                </g>
              );
            })}

            {/* Minor ticks */}
            {question.visualData.minorTicks.map((tick: any, idx: number) => {
              const x = 50 + (tick.position / 100) * 700;
              return (
                <line key={idx} x1={x} y1="45" x2={x} y2="55" stroke="#bbb" strokeWidth="1" />
              );
            })}

            {/* Arrow */}
            {question.visualData.arrow && (
              <text
                x={50 + (question.visualData.arrow.position / 100) * 700}
                y="30"
                textAnchor="middle"
                fontSize="24"
              >
                {question.visualData.arrow.symbol}
              </text>
            )}
          </svg>
        </div>
      )}

      {/* Input */}
      <input
        type="number"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder={question.inputPlaceholder}
        disabled={feedback !== null}
      />

      {/* Check Button */}
      {!feedback && (
        <button onClick={checkAnswer} disabled={!userAnswer}>
          בדוק תשובה
        </button>
      )}

      {/* Feedback */}
      {feedback && (
        <div className={`feedback ${feedback.feedbackType}`}>
          <p>{feedback.feedbackMessage}</p>
          {feedback.correctAnswerDisplay && <p>{feedback.correctAnswerDisplay}</p>}
          {!feedback.autoAdvance && (
            <button onClick={generateQuestion}>שאלה הבאה</button>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## 4. Module Reference

### Available Modules

| Module Name | Question Types | Input Types | Special Features |
|------------|---------------|-------------|------------------|
| `division` | 5 | input, choice | Division types (partitive/quotative) |
| `decimal` | 5 | input, choice | Range-based validation |
| `fraction` | 5 | input, choice | Fraction simplification |
| `multiplication` | 4 | input | Celebration triggers |
| `order` | 8 | input | Word problems, explanations |
| `distributive` | 5 | input | Area model data, pedagogical insights |
| `numberline` | 3 | input, choice, visual-input | Visual data with zoom feature |

### Difficulty Levels

All modules support 3 difficulty levels:
- `'קל'` (Easy)
- `'בינוני'` (Medium)
- `'קשה'` (Hard)

### Adaptive Difficulty

All modules automatically adjust difficulty:
- **Level up:** After 3 consecutive correct answers
- **Level down:** After 2 consecutive wrong answers

---

## 5. TypeScript Support

All modules include TypeScript definition files (`.d.ts`).

### Import Types:

```typescript
import type {
  DivisionQuestionViewObject,
  DivisionFeedbackViewObject
} from '@/lib/math/modules/DivisionModule';

import type {
  NumberLineQuestionViewObject,
  VisualData
} from '@/lib/math/modules/NumberLineModule';
```

### Example Typed Component:

```typescript
import type { NumberLineQuestionViewObject } from '@/lib/math/modules/NumberLineModule';

interface Props {
  question: NumberLineQuestionViewObject;
}

export default function NumberLineRenderer({ question }: Props) {
  if (!question.visualData) return null;

  return (
    <svg width="800" height="100">
      {/* Render with full type safety */}
      {question.visualData.majorMarkers.map(marker => (
        <text key={marker.value} x={marker.position} y="50">
          {marker.label}
        </text>
      ))}
    </svg>
  );
}
```

---

## 6. Testing

### Run All Module Tests:

```bash
cd src/lib/math
npm run test:division
npm run test:decimal
npm run test:fraction
npm run test:multiplication
npm run test:order
npm run test:distributive
npm run test:numberline
```

### Verify Zero DOM Dependencies:

All tests run in Node.js (not browser) to prove headless operation.

```bash
# If all tests pass, modules are ready for SSR/API routes
node tests/console-tests/division-console.js
# Output: 🎉 All tests passed! DivisionModule is headless and ready for Next.js.
```

---

## Integration Checklist

- [ ] Copy `extracted-modules/` to `src/lib/math/`
- [ ] Create API routes: `/api/math/generate` and `/api/math/check`
- [ ] Test API routes with Postman or curl
- [ ] Create React components for each module type (text vs. visual)
- [ ] Add RTL CSS (`dir="rtl"`) to all Hebrew text
- [ ] Test adaptive difficulty progression
- [ ] Implement localStorage for session persistence
- [ ] Add celebration animations (every 10 questions)
- [ ] Style feedback messages (correct: green, wrong: orange)
- [ ] Add loading states and error boundaries

---

## Support

For questions or issues:
1. Check TypeScript definitions for method signatures
2. Run console tests to verify module behavior
3. Review source code comments for implementation details
4. Refer to `AI_CURRICULUM_GUIDE.md` for curriculum context

---

**Phase 2 Complete** | All 7 modules extracted, tested, and documented.
