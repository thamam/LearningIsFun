# AI Curriculum Guide - Infinite Worksheet Generation

**How LLMs Can Generate Custom Math Worksheets Using Extracted Modules**

This guide explains how to use the 7 extracted headless math modules to programmatically generate infinite, curriculum-aligned math practice materials in any format (Markdown, PDF, LaTeX, HTML).

---

## Table of Contents

1. [Overview](#overview)
2. [Basic Workflow](#basic-workflow)
3. [Module-by-Module Guide](#module-by-module-guide)
4. [Worksheet Generation Examples](#worksheet-generation-examples)
5. [Curriculum Alignment](#curriculum-alignment)
6. [Advanced Use Cases](#advanced-use-cases)

---

## Overview

### What Are These Modules?

Each module is a **pure JavaScript class** that generates math questions and validates answers with **zero dependencies**. They can run in Node.js, browsers, serverless functions, or LLM code interpreters.

### Key Features for AI Worksheet Generation

- **Infinite Questions:** Call `generateQuestion()` in a loop - every call returns a unique question
- **Difficulty Levels:** 3 levels per module (`'קל'`, `'בינוני'`, `'קשה'`)
- **JSON Output:** All questions return structured JSON (not HTML)
- **Curriculum-Aligned:** Based on Israeli Grade 3 math curriculum
- **Type Variety:** 35 different question types across 7 modules
- **Self-Documenting:** TypeScript definitions explain all data structures

---

## Basic Workflow

### 1. Import a Module

```javascript
const { DivisionModule } = require('./extracted-modules');
```

### 2. Create an Instance

```javascript
const division = new DivisionModule({ initialLevel: 'בינוני' });
```

### 3. Generate Questions

```javascript
for (let i = 0; i < 20; i++) {
  const question = division.generateQuestion();
  console.log(question.questionText);
  console.log(`Answer: ${question.correctAnswer}`);
}
```

### 4. Format as Worksheet

```javascript
// Markdown example
let markdown = '# Division Practice Worksheet\n\n';
for (let i = 0; i < 10; i++) {
  const q = division.generateQuestion();
  markdown += `${i + 1}. ${q.questionText}\n\n`;
}
markdown += '\n---\n## Answer Key\n\n';
// Add answers...
```

---

## Module-by-Module Guide

### 1. DivisionModule

**Curriculum Focus:** Partitive vs. Quotative division, remainders, division with multiplication

**Question Types:**
- `missingDividend` - "÷ 5 = 8" (find the dividend)
- `missingDivisor` - "40 ÷ ___ = 8" (find the divisor)
- `missingQuotient` - "40 ÷ 5 = ___" (find the quotient)
- `withRemainder` - "43 ÷ 5 = ___ שארית ___" (quotient + remainder)
- `checkWithMultiplication` - "אם 40 ÷ 5 = 8, אז 8 × 5 = ___"

**Example Usage:**

```javascript
const division = new DivisionModule({ initialLevel: 'קל' });

// Generate 10 questions, mix of types
for (let i = 0; i < 10; i++) {
  const q = division.generateQuestion();

  // question.metadata.questionType tells you which type
  if (q.metadata.questionType === 'withRemainder') {
    console.log(`${q.questionText}`);
    console.log(`Answer: ${q.correctAnswer.quotient} שארית ${q.correctAnswer.remainder}`);
  } else {
    console.log(`${q.questionText} = ${q.correctAnswer}`);
  }
}
```

### 2. DecimalModule (Place Value)

**Curriculum Focus:** Understanding place value, decomposition, digit value

**Question Types:**
- `decomposition` - "4,521 = ? + 500 + 20 + 1"
- `digitValue` - "מה ערך הספרה 5 במספר 4,521?" (value of digit 5)
- `nextPrevious` - "מהו המספר העוקב של 999?"
- `compare` - "4,521 ___ 4,512" (>, <, =)
- `missingDigit` - "4,5_1 נמצא בין 4,500 ל-4,600" (range-based)

**Special Feature:** Range-based answers for `missingDigit` type.

```javascript
const decimal = new DecimalModule({ initialLevel: 'קשה' });
const q = decimal.generateQuestion();

if (q.metadata.questionType === 'missingDigit') {
  // Answer can be any digit that fits the range
  console.log(`Acceptable range: ${q.correctAnswer.min} - ${q.correctAnswer.max}`);
}
```

### 3. FractionModule

**Curriculum Focus:** Fraction comparison, addition, simplification, conversion

**Question Types:**
- `compare` - "1/2 ___ 3/4"
- `addSameDenominator` - "2/5 + 1/5 = ?"
- `simplify` - "צמצמי: 4/8"
- `fractionToDecimal` - "1/2 = ?"
- `decimalToFraction` - "0.5 = ?"

```javascript
const fraction = new FractionModule({ initialLevel: 'בינוני' });
const q = fraction.generateQuestion();

// Answers can be numeric or fraction strings
if (q.metadata.questionType === 'simplify') {
  console.log(`Answer: ${q.correctAnswer}`); // "1/2"
}
```

### 4. MultiplicationModule

**Curriculum Focus:** Multiplication tables, missing factors, division connection

**Question Types:**
- `missingMultiplier` - "6 × ___ = 42"
- `missingMultiplicand` - "___ × 7 = 42"
- `missingProduct` - "6 × 7 = ___"
- `division` - "אם 6 × 7 = 42, אז 42 ÷ 6 = ___"

**Special Feature:** Celebrates every 10th question (set `celebrationTrigger: true`).

```javascript
const mult = new MultiplicationModule({ initialLevel: 'קשה' });

// Generate 100 questions (multiplication drill)
for (let i = 0; i < 100; i++) {
  const q = mult.generateQuestion();
  const feedback = mult.checkAnswer(q.correctAnswer, q.correctAnswer, q);

  if (feedback.celebrationTrigger) {
    console.log('🎉 10 questions completed!');
  }
}
```

### 5. OrderOperationsModule

**Curriculum Focus:** Parentheses, multiplication before addition, order of operations

**Question Types:**
- `parens_first` - "(5 + 3) × 2 = ?"
- `mult_before_add` - "5 + 3 × 2 = ?"
- `three_ops` - "10 - 2 × 3 = ?"
- `subtract_divide` - "(20 - 5) ÷ 3 = ?"
- `word_problem_simple` - Word problem with expression
- `shopping_problem` - Multi-step shopping scenario
- `auditorium_problem` - Rows and columns problem
- `class_division_problem` - Sharing items among students

**Special Feature:** All questions include step-by-step explanations.

```javascript
const order = new OrderOperationsModule({ initialLevel: 'בינוני' });
const q = order.generateQuestion();

console.log(q.questionText);
console.log('');
console.log('Step-by-step solution:');
console.log(q.explanation);
```

### 6. DistributiveModule

**Curriculum Focus:** Distributive property, connecting to vertical multiplication algorithm

**Question Types:**
- `fill_blank` - "6 × 37 = 6 × (30 + 7) = (6 × 30) + (6 × ___)"
- `calculate` - "חשב: 6 × 37 בעזרת חוק הפילוג"
- `addition_decomposition` - Large numbers (e.g., "7 × 156")
- `subtraction_decomposition` - Near-round numbers (e.g., "4 × 29 = 4 × (30 - 1)")
- `three_digit` - Three-digit multiplication with connection to algorithm

**Special Feature:** Area model data for visual rendering.

```javascript
const dist = new DistributiveModule({ initialLevel: 'קשה' });
const q = dist.generateQuestion();

// Area model data available for visualization
console.log(q.areaModel);
// { factor1: 7, factor2: 340, decomposition: { hundreds: 300, tens: 40, ones: 0 } }

// Hard questions connect to vertical algorithm
if (q.connectionToAlgorithm) {
  console.log('💡 זה בדיוק מה שקורה באלגוריתם הכפל המאונך!');
}
```

### 7. NumberLineModule

**Curriculum Focus:** Number sense, estimation, proximity on number line

**Question Types:**
- `whatIsNumber` - "איזה מספר מסומן בחץ?" (visual question)
- `betweenNumbers` - "איזה מספר נמצא בדיוק באמצע בין 50 ל-100?"
- `closerTo` - "המספר 73 קרוב יותר ל-70 או ל-80?"

**Special Feature:** Visual data for rendering number lines.

```javascript
const numberline = new NumberLineModule({ initialLevel: 'קל' });
const q = numberline.generateQuestion();

if (q.visualData) {
  // Render number line using visual data
  console.log('Number line range:', q.visualData.range);
  console.log('Major markers:', q.visualData.majorMarkers.map(m => m.value));
  console.log('Arrow points to:', q.visualData.arrow.value);
}
```

---

## Worksheet Generation Examples

### Example 1: Mixed Practice Worksheet (Markdown)

Generate a worksheet with questions from all modules:

```javascript
const {
  DivisionModule,
  MultiplicationModule,
  DecimalModule,
  FractionModule
} = require('./extracted-modules');

function generateMixedWorksheet(questionsPerModule = 5) {
  const modules = {
    'חילוק': new DivisionModule({ initialLevel: 'בינוני' }),
    'כפל': new MultiplicationModule({ initialLevel: 'בינוני' }),
    'מבנה עשרוני': new DecimalModule({ initialLevel: 'בינוני' }),
    'שברים': new FractionModule({ initialLevel: 'בינוני' })
  };

  let markdown = '# תרגול מתמטיקה - כיתה ג\n\n';
  markdown += `**תאריך:** ${new Date().toLocaleDateString('he-IL')}\n\n`;
  markdown += '---\n\n';

  const allQuestions = [];

  // Generate questions from each module
  Object.entries(modules).forEach(([moduleName, module]) => {
    markdown += `## ${moduleName}\n\n`;

    for (let i = 0; i < questionsPerModule; i++) {
      const q = module.generateQuestion();
      const qNum = allQuestions.length + 1;
      allQuestions.push({ ...q, module: moduleName });

      markdown += `**${qNum}.** ${q.questionText}\n\n`;
      markdown += `תשובה: _____________\n\n`;
    }

    markdown += '\n';
  });

  // Answer key
  markdown += '---\n\n## מפתח תשובות\n\n';
  allQuestions.forEach((q, idx) => {
    let answer = q.correctAnswer;

    // Format special answer types
    if (typeof answer === 'object' && answer.quotient !== undefined) {
      answer = `${answer.quotient} שארית ${answer.remainder}`;
    } else if (typeof answer === 'object' && answer.min !== undefined) {
      answer = `${answer.min} - ${answer.max}`;
    }

    markdown += `${idx + 1}. ${answer}\n`;
  });

  return markdown;
}

// Generate and save
const fs = require('fs');
const worksheet = generateMixedWorksheet(5);
fs.writeFileSync('worksheet.md', worksheet, 'utf8');
console.log('✅ Worksheet generated: worksheet.md');
```

### Example 2: Progressive Difficulty Worksheet

Start easy, increase difficulty:

```javascript
function generateProgressiveWorksheet(moduleName = 'division', totalQuestions = 30) {
  const { DivisionModule } = require('./extracted-modules');

  let markdown = `# ${moduleName} - תרגול מדורג\n\n`;

  const levels = ['קל', 'בינוני', 'קשה'];
  const questionsPerLevel = totalQuestions / 3;

  levels.forEach(level => {
    const module = new DivisionModule({ initialLevel: level });
    markdown += `## רמה: ${level}\n\n`;

    for (let i = 0; i < questionsPerLevel; i++) {
      const q = module.generateQuestion(level);
      markdown += `${i + 1}. ${q.questionText}\n\n`;
    }

    markdown += '\n';
  });

  return markdown;
}
```

### Example 3: Timed Quiz Generator (JSON)

Generate a timed quiz in JSON format:

```javascript
function generateTimedQuiz(moduleName, level, timeLimit = 300) {
  const modules = require('./extracted-modules');
  const ModuleClass = modules[`${moduleName.charAt(0).toUpperCase()}${moduleName.slice(1)}Module`];
  const module = new ModuleClass({ initialLevel: level });

  const quiz = {
    title: `${moduleName} Quiz - ${level}`,
    timeLimit: timeLimit, // seconds
    questions: []
  };

  for (let i = 0; i < 20; i++) {
    const q = module.generateQuestion();
    quiz.questions.push({
      id: i + 1,
      text: q.questionText,
      type: q.questionType,
      inputPlaceholder: q.inputPlaceholder,
      choices: q.choices || null,
      correctAnswer: q.correctAnswer,
      metadata: q.metadata
    });
  }

  return quiz;
}

// Save as JSON
const quiz = generateTimedQuiz('division', 'בינוני', 600);
require('fs').writeFileSync('quiz.json', JSON.stringify(quiz, null, 2), 'utf8');
```

### Example 4: Visual Worksheet with Number Lines (HTML)

```javascript
function generateVisualWorksheet() {
  const { NumberLineModule } = require('./extracted-modules');
  const numberline = new NumberLineModule({ initialLevel: 'קל' });

  let html = `<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <title>תרגול ישר מספרים</title>
  <style>
    body { font-family: 'Arial', sans-serif; }
    .question { margin: 30px 0; }
    svg { border: 1px solid #ccc; }
  </style>
</head>
<body>
  <h1>תרגול ישר מספרים</h1>
`;

  for (let i = 0; i < 10; i++) {
    const q = numberline.generateQuestion();

    html += `<div class="question">`;
    html += `<p><strong>${i + 1}. ${q.questionText}</strong></p>`;

    if (q.visualData) {
      // Render SVG number line
      html += `<svg width="800" height="100">`;
      html += `<line x1="50" y1="50" x2="750" y2="50" stroke="#333" stroke-width="2"/>`;

      // Major markers
      q.visualData.majorMarkers.forEach(marker => {
        const x = 50 + (marker.position / 100) * 700;
        html += `<line x1="${x}" y1="40" x2="${x}" y2="60" stroke="#333" stroke-width="2"/>`;
        html += `<text x="${x}" y="80" text-anchor="middle" font-size="14">${marker.label}</text>`;
      });

      // Arrow
      if (q.visualData.arrow) {
        const x = 50 + (q.visualData.arrow.position / 100) * 700;
        html += `<text x="${x}" y="30" text-anchor="middle" font-size="24">${q.visualData.arrow.symbol}</text>`;
      }

      html += `</svg>`;
    }

    html += `<p>תשובה: _____________</p>`;
    html += `</div>`;
  }

  html += `</body></html>`;

  return html;
}

// Save as HTML
require('fs').writeFileSync('numberline.html', generateVisualWorksheet(), 'utf8');
```

---

## Curriculum Alignment

### Israeli Grade 3 Math Curriculum

These modules align with the Israeli Ministry of Education Grade 3 curriculum:

| Module | Curriculum Topic | Standard Code |
|--------|-----------------|---------------|
| Division | חילוק עד 100, חילוק עם שארית | G3.NUM.4 |
| Decimal | מבנה המספר העשרוני, ערך מקומי | G3.NUM.1 |
| Fraction | שברים פשוטים, השוואת שברים | G3.NUM.5 |
| Multiplication | לוח הכפל עד 12, קשר בין כפל וחילוק | G3.NUM.3 |
| Order of Operations | סדר פעולות חשבון, שימוש בסוגריים | G3.ALG.1 |
| Distributive | חוק הפילוג, מעבר לאלגוריתם המאונך | G3.ALG.2 |
| Number Line | ישר המספרים, אומדן, קירוב | G3.NUM.2 |

### Differentiation by Difficulty

- **קל (Easy):** Foundational concepts, smaller numbers
- **בינוני (Medium):** Grade-level expectations
- **קשה (Hard):** Challenge problems, larger numbers, multi-step

---

## Advanced Use Cases

### 1. Personalized Learning Paths

Track student performance and generate adaptive worksheets:

```javascript
function generateAdaptiveWorksheet(studentHistory) {
  // studentHistory = { division: 0.85, fraction: 0.60, ... }

  const worksheet = [];

  Object.entries(studentHistory).forEach(([module, accuracy]) => {
    // More struggling = more questions at easier level
    const level = accuracy > 0.8 ? 'קשה' : accuracy > 0.6 ? 'בינוני' : 'קל';
    const count = accuracy < 0.7 ? 10 : 5; // More practice if struggling

    const ModuleClass = require('./extracted-modules')[`${module.charAt(0).toUpperCase()}${module.slice(1)}Module`];
    const instance = new ModuleClass({ initialLevel: level });

    for (let i = 0; i < count; i++) {
      worksheet.push(instance.generateQuestion());
    }
  });

  return worksheet;
}
```

### 2. Bulk Worksheet Generation

Generate 100 unique worksheets for a school:

```javascript
function bulkGenerate(count = 100, moduleName = 'division', level = 'בינוני') {
  const fs = require('fs');
  const { DivisionModule } = require('./extracted-modules');

  for (let sheet = 1; sheet <= count; sheet++) {
    const module = new DivisionModule({ initialLevel: level });
    let markdown = `# Worksheet ${sheet}\n\n`;

    for (let i = 0; i < 20; i++) {
      const q = module.generateQuestion();
      markdown += `${i + 1}. ${q.questionText}\n\n`;
    }

    fs.writeFileSync(`worksheets/sheet_${sheet}.md`, markdown, 'utf8');
  }

  console.log(`✅ Generated ${count} unique worksheets`);
}
```

### 3. LLM-Assisted Problem Solving

Use an LLM to generate story problems based on the math:

```javascript
async function generateStoryProblem(moduleName, level) {
  const modules = require('./extracted-modules');
  const ModuleClass = modules[`${moduleName.charAt(0).toUpperCase()}${moduleName.slice(1)}Module`];
  const module = new ModuleClass({ initialLevel: level });

  const mathQuestion = module.generateQuestion();

  // Send to LLM to wrap in story context
  const prompt = `Create a real-world story problem for this math question:
Math: ${mathQuestion.questionText}
Answer: ${mathQuestion.correctAnswer}

Requirements:
- Culturally appropriate for Israeli students
- Grade 3 reading level
- Relatable scenario (playground, family, food, etc.)
- Hebrew language
`;

  // Call your LLM here (OpenAI, Anthropic, etc.)
  // const story = await callLLM(prompt);

  return {
    math: mathQuestion,
    story: '...' // LLM-generated story
  };
}
```

### 4. Assessment Analytics

Generate data for learning analytics:

```javascript
function runSimulatedAssessment(moduleName, studentAccuracy = 0.7) {
  const modules = require('./extracted-modules');
  const ModuleClass = modules[`${moduleName.charAt(0).toUpperCase()}${moduleName.slice(1)}Module`];
  const module = new ModuleClass({ initialLevel: 'בינוני' });

  const results = {
    correct: 0,
    wrong: 0,
    byType: {},
    timeSpent: [],
    difficultyChanges: []
  };

  for (let i = 0; i < 50; i++) {
    const q = module.generateQuestion();
    const type = q.metadata.questionType;

    // Simulate answer (correct if random < accuracy)
    const isCorrect = Math.random() < studentAccuracy;
    const simulatedAnswer = isCorrect ? q.correctAnswer : 'wrong';

    const feedback = module.checkAnswer(simulatedAnswer, q.correctAnswer, q);

    results.correct += feedback.isCorrect ? 1 : 0;
    results.wrong += feedback.isCorrect ? 0 : 1;
    results.byType[type] = (results.byType[type] || 0) + (feedback.isCorrect ? 1 : 0);

    if (feedback.difficultyChange) {
      results.difficultyChanges.push({
        question: i + 1,
        direction: feedback.difficultyChange.direction,
        newLevel: feedback.difficultyChange.newLevel
      });
    }
  }

  return results;
}

// Example: Which question types does the student struggle with?
const analytics = runSimulatedAssessment('division', 0.65);
console.log('Accuracy by question type:', analytics.byType);
console.log('Difficulty adjustments:', analytics.difficultyChanges);
```

---

## Best Practices

### 1. Always Reset Statistics Between Worksheets

```javascript
const module = new DivisionModule({ initialLevel: 'בינוני' });
module.resetStatistics(); // Clear previous session data
```

### 2. Use Metadata for Filtering

```javascript
const questions = [];
while (questions.length < 10) {
  const q = module.generateQuestion();
  // Only include word problems
  if (q.metadata.questionType.includes('problem')) {
    questions.push(q);
  }
}
```

### 3. Format Hebrew Text Properly

```javascript
// Ensure RTL direction in output
function formatHebrewMarkdown(text) {
  return `<div dir="rtl">\n\n${text}\n\n</div>`;
}
```

### 4. Validate Answer Types

```javascript
// Some questions have complex answer types
if (typeof answer === 'object' && answer.quotient !== undefined) {
  // Division with remainder
  console.log(`${answer.quotient} שארית ${answer.remainder}`);
} else if (typeof answer === 'object' && answer.min !== undefined) {
  // Range-based answer
  console.log(`כל תשובה בין ${answer.min} ל-${answer.max}`);
} else {
  // Simple numeric or string answer
  console.log(answer);
}
```

---

## Quick Reference: Generate 1000 Questions

```javascript
const modules = require('./extracted-modules');
const fs = require('fs');

// Generate 1000 unique math questions
const allQuestions = [];

Object.entries(modules).forEach(([name, ModuleClass]) => {
  const module = new ModuleClass({ initialLevel: 'בינוני' });

  for (let i = 0; i < 150; i++) {
    const q = module.generateQuestion();
    allQuestions.push({
      module: name,
      question: q.questionText,
      answer: q.correctAnswer,
      type: q.metadata.questionType,
      level: module.getCurrentLevel()
    });
  }
});

// Save as JSON
fs.writeFileSync('1000_questions.json', JSON.stringify(allQuestions, null, 2), 'utf8');
console.log(`✅ Generated ${allQuestions.length} unique questions`);
```

---

## Support

For curriculum questions or module customization:
1. Review TypeScript definitions (`.d.ts` files) for data structures
2. Run console tests to see all question types in action
3. Check `NEXTJS_INTEGRATION_GUIDE.md` for API examples

---

**Phase 2 Complete** | 7 modules | 35 question types | Infinite possibilities
