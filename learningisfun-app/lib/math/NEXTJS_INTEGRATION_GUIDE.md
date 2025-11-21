# Next.js Integration Guide - Headless Math Engine

This guide explains how to integrate the headless math engine into your Next.js application.

## Architecture

The math engine has been extracted from `Emma_math_lab.html` into pure TypeScript modules with no DOM dependencies. This allows it to run both server-side (in API routes) and client-side (in React components).

### Directory Structure

```
lib/math/
├── types.ts                    # TypeScript type definitions
├── index.ts                    # Main export and module registry
├── modules/
│   ├── division.ts            # Division module
│   └── multiplication.ts      # Multiplication module
└── NEXTJS_INTEGRATION_GUIDE.md # This file
```

## Integration Steps

### 1. Backend API Route

Create `app/api/math/generate/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getModule, Level } from '@/lib/math';

export async function POST(request: NextRequest) {
  try {
    const { moduleName, level } = await request.json();

    // Validate inputs
    if (!moduleName || !level) {
      return NextResponse.json(
        { error: 'Missing moduleName or level' },
        { status: 400 }
      );
    }

    // Get module
    const module = getModule(moduleName);
    if (!module) {
      return NextResponse.json(
        { error: `Module '${moduleName}' not found` },
        { status: 404 }
      );
    }

    // Generate question
    const question = module.generateQuestion(level as Level);

    return NextResponse.json({
      success: true,
      question,
      module: {
        name: module.name,
        id: module.id,
        icon: module.icon,
      },
    });
  } catch (error) {
    console.error('Error generating question:', error);
    return NextResponse.json(
      { error: 'Failed to generate question' },
      { status: 500 }
    );
  }
}
```

### 2. Frontend Component

Create `components/math/MathQuestion.tsx`:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Question } from '@/lib/math';

interface MathQuestionProps {
  moduleName: string;
  level: 'קל' | 'בינוני' | 'קשה';
}

export default function MathQuestion({ moduleName, level }: MathQuestionProps) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{
    show: boolean;
    isCorrect: boolean;
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchQuestion = async () => {
    setLoading(true);
    setFeedback(null);
    setUserAnswer('');

    try {
      const response = await fetch('/api/math/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleName, level }),
      });

      const data = await response.json();
      if (data.success) {
        setQuestion(data.question);
      } else {
        console.error('Failed to fetch question:', data.error);
      }
    } catch (error) {
      console.error('Error fetching question:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [moduleName, level]);

  const handleSubmit = () => {
    if (!question || !userAnswer.trim()) return;

    const isCorrect = checkAnswer(userAnswer, question.correctAnswer);
    setFeedback({
      show: true,
      isCorrect,
      message: isCorrect ? '🎉 נכון מאוד!' : `😞 לא נכון. התשובה הנכונה: ${question.correctAnswer}`,
    });
  };

  const checkAnswer = (user: string, correct: string | number): boolean => {
    if (typeof correct === 'number') {
      return parseFloat(user) === correct;
    }
    return user.trim() === correct.toString().trim();
  };

  if (loading) {
    return <div className="text-center">טוען שאלה...</div>;
  }

  if (!question) {
    return <div className="text-center">אין שאלה זמינה</div>;
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold text-center mb-6 text-purple-600">
        {question.question}
      </h3>

      <div className="mb-4">
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
          placeholder="הכניסי את התשובה כאן..."
          disabled={feedback?.show}
        />
      </div>

      {feedback?.show && (
        <div
          className={`mb-4 p-4 rounded-xl ${
            feedback.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {feedback.message}
        </div>
      )}

      <div className="flex gap-3">
        {!feedback?.show ? (
          <button
            onClick={handleSubmit}
            className="flex-1 bg-purple-500 text-white py-3 rounded-xl font-bold hover:bg-purple-600 transition"
          >
            בדקי תשובה
          </button>
        ) : (
          <button
            onClick={fetchQuestion}
            className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition"
          >
            שאלה חדשה
          </button>
        )}
      </div>
    </div>
  );
}
```

### 3. Test Page

Create `app/math-test/page.tsx`:

```typescript
import MathQuestion from '@/components/math/MathQuestion';

export default function MathTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-purple-600">
          Math Engine Test 🎯
        </h1>
        <MathQuestion moduleName="division" level="קל" />
      </div>
    </div>
  );
}
```

## Path Adjustments

If the guide mentions `src/lib`, treat it as `lib/` (no `src` directory in this project).

The import alias `@/lib/math` should work automatically if `tsconfig.json` has:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## Available Modules

- `division` - חילוק (Division)
- `multiplication` - כפל (Multiplication)

## Levels

- `קל` - Easy
- `בינוני` - Medium
- `קשה` - Hard

## Testing

1. Start dev server: `npm run dev`
2. Visit: `http://localhost:3000/math-test`
3. Try answering questions
4. Click "שאלה חדשה" for a new question

## Adding New Modules

1. Create `lib/math/modules/your-module.ts`
2. Implement the `MathModule` interface
3. Export from `lib/math/index.ts`
4. Add to the `modules` registry
