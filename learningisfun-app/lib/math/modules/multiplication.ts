/**
 * Multiplication Module - Headless
 * Extracted from Emma's Math Lab
 */

import { MathModule, Level, Question, Language } from '../types';
import { generateWordProblem, getHint as getHintFromContent } from '../content';
import { getModuleFeedback, getLocalizedExplanation } from '../i18n';

function getMultiplicationRange(level: Level) {
  if (level === 'קל') {
    return { min: 2, max: 5 };
  } else if (level === 'בינוני') {
    return { min: 2, max: 10 };
  } else {
    return { min: 2, max: 12 };
  }
}

function generateQuestion(level: Level = 'בינוני', lang: Language = 'he'): Question {
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
        metadata: { lang },
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
        metadata: { lang },
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
        metadata: { lang },
      };
    }

    case 'wordProblem': {
      const groups = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      const items = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      const total = groups * items;

      // Load content from templates.json instead of hardcoded strings
      const questionText = generateWordProblem('multiplication', { groups, items }, lang);

      // Localized explanation
      const answerPrefix = lang === 'he' ? 'התשובה היא' : 'The answer is';
      const becauseWord = lang === 'he' ? 'כי' : 'because';
      const explanation = `${answerPrefix} ${total} ${becauseWord} ${groups} × ${items} = ${total}`;

      // Fallback to basic multiplication if content loading fails
      if (!questionText) {
        return {
          question: `${groups} × ${items} = ___`,
          type: 'input',
          correctAnswer: total,
          difficulty: level,
          explanation,
          metadata: { lang },
        };
      }

      return {
        question: questionText,
        type: 'input',
        correctAnswer: total,
        difficulty: level,
        explanation,
        metadata: { lang },
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
  const lang = (questionData.metadata?.lang as Language) || 'he';
  return getHintFromContent('multiplication', lang);
}

function getExplanation(questionData: Question, userAnswer: string | number) {
  const lang = (questionData.metadata?.lang as Language) || 'he';
  const feedback = getModuleFeedback('multiplication', lang);

  return {
    detailed: getLocalizedExplanation(questionData.explanation || '', 'multiplication', lang),
    tip: feedback.tip,
    nextSteps: feedback.nextSteps
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
