/**
 * Division Module - Headless
 * Extracted from Emma's Math Lab
 */

import { MathModule, Level, Question } from '../types';
import { generateWordProblem, Language } from '../content';

function getDivisionRange(level: Level) {
  if (level === 'קל') {
    return { maxQuotient: 10, divisors: [2, 3, 4, 5] };
  } else if (level === 'בינוני') {
    return { maxQuotient: 12, divisors: [2, 3, 4, 5, 6, 7, 8] };
  } else {
    return { maxQuotient: 15, divisors: [2, 3, 4, 5, 6, 7, 8, 9, 10, 12] };
  }
}

function generateQuestion(level: Level = 'בינוני', lang: Language = 'he'): Question {
  const types = ['basicDivision', 'divisionWithRemainder', 'missingDividend', 'missingDivisor', 'wordProblem'];
  const type = types[Math.floor(Math.random() * types.length)];
  const range = getDivisionRange(level);

  switch (type) {
    case 'basicDivision': {
      const divisor = range.divisors[Math.floor(Math.random() * range.divisors.length)];
      const quotient = Math.floor(Math.random() * range.maxQuotient) + 1;
      const dividend = divisor * quotient;
      return {
        question: `${dividend} ÷ ${divisor} = ___`,
        type: 'input',
        correctAnswer: quotient,
        difficulty: level,
        explanation: `${dividend} ÷ ${divisor} = ${quotient} כי ${divisor} × ${quotient} = ${dividend}`,
      };
    }

    case 'divisionWithRemainder': {
      const divisor = range.divisors[Math.floor(Math.random() * range.divisors.length)];
      const quotient = Math.floor(Math.random() * range.maxQuotient) + 1;
      const remainder = Math.floor(Math.random() * (divisor - 1)) + 1;
      const dividend = (divisor * quotient) + remainder;
      return {
        question: `${dividend} ÷ ${divisor} = ___ (כולל שארית)`,
        type: 'input',
        correctAnswer: `${quotient} שארית ${remainder}`,
        difficulty: level,
        explanation: `${dividend} ÷ ${divisor} = ${quotient} שארית ${remainder} כי ${divisor} × ${quotient} = ${divisor * quotient} ועוד ${remainder}`,
      };
    }

    case 'missingDividend': {
      const divisor = range.divisors[Math.floor(Math.random() * range.divisors.length)];
      const quotient = Math.floor(Math.random() * range.maxQuotient) + 1;
      const dividend = divisor * quotient;
      return {
        question: `___ ÷ ${divisor} = ${quotient}`,
        type: 'input',
        correctAnswer: dividend,
        difficulty: level,
        explanation: `התשובה היא ${dividend} כי ${divisor} × ${quotient} = ${dividend}`,
      };
    }

    case 'missingDivisor': {
      const divisor = range.divisors[Math.floor(Math.random() * range.divisors.length)];
      const quotient = Math.floor(Math.random() * range.maxQuotient) + 1;
      const dividend = divisor * quotient;
      return {
        question: `${dividend} ÷ ___ = ${quotient}`,
        type: 'input',
        correctAnswer: divisor,
        difficulty: level,
        explanation: `התשובה היא ${divisor} כי ${dividend} ÷ ${divisor} = ${quotient}`,
      };
    }

    case 'wordProblem': {
      const groups = range.divisors[Math.floor(Math.random() * range.divisors.length)];
      const perGroup = Math.floor(Math.random() * range.maxQuotient) + 1;
      const total = groups * perGroup;

      // Load content from templates.json instead of hardcoded strings
      const questionText = generateWordProblem('division', { total, groups }, lang);

      // Fallback to basic division if content loading fails
      if (!questionText) {
        return {
          question: `${total} ÷ ${groups} = ___`,
          type: 'input',
          correctAnswer: perGroup,
          difficulty: level,
          explanation: `התשובה היא ${perGroup} כי ${total} ÷ ${groups} = ${perGroup}`,
        };
      }

      return {
        question: questionText,
        type: 'input',
        correctAnswer: perGroup,
        difficulty: level,
        explanation: `התשובה היא ${perGroup} כי ${total} ÷ ${groups} = ${perGroup}`,
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
  if (typeof correctAnswer === 'number') {
    return parseFloat(userAnswer.toString()) === correctAnswer;
  } else {
    const normalized = (val: string) => val.replace(/\s+/g, ' ').trim();
    return normalized(userAnswer.toString()) === normalized(correctAnswer.toString());
  }
}

function getHint(questionData: Question): string {
  return '💡 נסי לחשוב על טבלאות הכפל שאת מכירה';
}

function getExplanation(questionData: Question, userAnswer: string | number) {
  return {
    detailed: questionData.explanation || 'תרגלי עוד תרגילי חילוק',
    tip: 'חילוק הוא הפוך של כפל',
    nextSteps: 'המשיכי לתרגל תרגילים דומים'
  };
}

export const divisionModule: MathModule = {
  name: 'חילוק',
  id: 'division',
  icon: '➗',
  description: 'תרגול חילוק - חילוק בסיסי, חילוק עם שארית, משוואות חילוק',
  generateQuestion,
  checkAnswer,
  getHint,
  getExplanation,
};
