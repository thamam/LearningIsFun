/**
 * Multiplication Module - Headless
 * Extracted from Emma's Math Lab
 */

import { MathModule, Level, Question } from '../types';

function getMultiplicationRange(level: Level) {
  if (level === 'קל') {
    return { min: 2, max: 5 };
  } else if (level === 'בינוני') {
    return { min: 2, max: 10 };
  } else {
    return { min: 2, max: 12 };
  }
}

function generateQuestion(level: Level = 'בינוני'): Question {
  const types = ['missingProduct', 'missingMultiplier', 'missingMultiplicand', 'wordProblem'];
  const type = types[Math.floor(Math.random() * types.length)];
  const range = getMultiplicationRange(level);

  switch (type) {
    case 'missingProduct': {
      const a = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      const b = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      const product = a * b;
      return {
        question: `${a} × ${b} = ___`,
        type: 'input',
        correctAnswer: product,
        difficulty: level,
        explanation: `${a} × ${b} = ${product}`,
      };
    }

    case 'missingMultiplier': {
      const multiplicand = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      const multiplier = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      const product = multiplicand * multiplier;
      return {
        question: `${multiplicand} × ___ = ${product}`,
        type: 'input',
        correctAnswer: multiplier,
        difficulty: level,
        explanation: `${multiplicand} × ${multiplier} = ${product}`,
      };
    }

    case 'missingMultiplicand': {
      const multiplicand = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      const multiplier = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      const product = multiplicand * multiplier;
      return {
        question: `___ × ${multiplier} = ${product}`,
        type: 'input',
        correctAnswer: multiplicand,
        difficulty: level,
        explanation: `${multiplicand} × ${multiplier} = ${product}`,
      };
    }

    case 'wordProblem': {
      const problems = [
        'לאמה יש {groups} קבוצות של {items} עוגיות. כמה עוגיות יש לה בסך הכל?',
        'בכל קופסה יש {items} עפרונות. אם יש {groups} קופסאות, כמה עפרונות יש בסך הכל?',
        'אמה קוראת {items} עמודים בכל יום. כמה עמודים היא תקרא ב-{groups} ימים?'
      ];
      const problem = problems[Math.floor(Math.random() * problems.length)];
      const groups = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      const items = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      const total = groups * items;
      return {
        question: problem.replace('{groups}', groups.toString()).replace('{items}', items.toString()),
        type: 'input',
        correctAnswer: total,
        difficulty: level,
        explanation: `התשובה היא ${total} כי ${groups} × ${items} = ${total}`,
      };
    }

    default:
      throw new Error(`Unknown question type: ${type}`);
  }
}

function checkAnswer(
  userAnswer: string | number,
  correctAnswer: string | number,
  questionData: Question
): boolean {
  return parseFloat(userAnswer.toString()) === Number(correctAnswer);
}

function getHint(questionData: Question): string {
  return '💡 נסי להשתמש בטבלת הכפל';
}

function getExplanation(questionData: Question, userAnswer: string | number) {
  return {
    detailed: questionData.explanation || 'תרגלי עוד תרגילי כפל',
    tip: 'תרגול קבוע של טבלת הכפל עוזר מאוד',
    nextSteps: 'המשיכי לתרגל תרגילים דומים'
  };
}

export const multiplicationModule: MathModule = {
  name: 'כפל',
  id: 'multiplication',
  icon: '✖️',
  description: 'תרגול כפל - טבלאות כפל, גורם חסר, מכפלה חסרה',
  generateQuestion,
  checkAnswer,
  getHint,
  getExplanation,
};
