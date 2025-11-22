/**
 * Division Module - Headless
 * Extracted from Emma's Math Lab
 */

import { MathModule, Level, Question, Language } from '../types';
import { generateWordProblem, getHint as getHintFromContent } from '../content';
import { getModuleFeedback, getLocalizedExplanation } from '../i18n';

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
      const becauseWord = lang === 'he' ? 'כי' : 'because';
      return {
        question: `${dividend} ÷ ${divisor} = ___`,
        type: 'input',
        correctAnswer: quotient,
        difficulty: level,
        explanation: `${dividend} ÷ ${divisor} = ${quotient} ${becauseWord} ${divisor} × ${quotient} = ${dividend}`,
        metadata: { lang },
      };
    }

    case 'divisionWithRemainder': {
      const divisor = range.divisors[Math.floor(Math.random() * range.divisors.length)];
      const quotient = Math.floor(Math.random() * range.maxQuotient) + 1;
      const remainder = Math.floor(Math.random() * (divisor - 1)) + 1;
      const dividend = (divisor * quotient) + remainder;
      const withRemainderText = lang === 'he' ? 'כולל שארית' : 'with remainder';
      const remainderWord = lang === 'he' ? 'שארית' : 'remainder';
      const becauseWord = lang === 'he' ? 'כי' : 'because';
      const andWord = lang === 'he' ? 'ועוד' : 'plus';
      return {
        question: `${dividend} ÷ ${divisor} = ___ (${withRemainderText})`,
        type: 'input',
        correctAnswer: `${quotient} ${remainderWord} ${remainder}`,
        difficulty: level,
        explanation: `${dividend} ÷ ${divisor} = ${quotient} ${remainderWord} ${remainder} ${becauseWord} ${divisor} × ${quotient} = ${divisor * quotient} ${andWord} ${remainder}`,
        metadata: { lang },
      };
    }

    case 'missingDividend': {
      const divisor = range.divisors[Math.floor(Math.random() * range.divisors.length)];
      const quotient = Math.floor(Math.random() * range.maxQuotient) + 1;
      const dividend = divisor * quotient;
      const answerPrefix = lang === 'he' ? 'התשובה היא' : 'The answer is';
      const becauseWord = lang === 'he' ? 'כי' : 'because';
      return {
        question: `___ ÷ ${divisor} = ${quotient}`,
        type: 'input',
        correctAnswer: dividend,
        difficulty: level,
        explanation: `${answerPrefix} ${dividend} ${becauseWord} ${divisor} × ${quotient} = ${dividend}`,
        metadata: { lang },
      };
    }

    case 'missingDivisor': {
      const divisor = range.divisors[Math.floor(Math.random() * range.divisors.length)];
      const quotient = Math.floor(Math.random() * range.maxQuotient) + 1;
      const dividend = divisor * quotient;
      const answerPrefix = lang === 'he' ? 'התשובה היא' : 'The answer is';
      const becauseWord = lang === 'he' ? 'כי' : 'because';
      return {
        question: `${dividend} ÷ ___ = ${quotient}`,
        type: 'input',
        correctAnswer: divisor,
        difficulty: level,
        explanation: `${answerPrefix} ${divisor} ${becauseWord} ${dividend} ÷ ${divisor} = ${quotient}`,
        metadata: { lang },
      };
    }

    case 'wordProblem': {
      const groups = range.divisors[Math.floor(Math.random() * range.divisors.length)];
      const perGroup = Math.floor(Math.random() * range.maxQuotient) + 1;
      const total = groups * perGroup;

      // Load content from templates.json instead of hardcoded strings
      const questionText = generateWordProblem('division', { total, groups }, lang);

      // Localized explanation
      const answerPrefix = lang === 'he' ? 'התשובה היא' : 'The answer is';
      const becauseWord = lang === 'he' ? 'כי' : 'because';
      const explanation = `${answerPrefix} ${perGroup} ${becauseWord} ${total} ÷ ${groups} = ${perGroup}`;

      // Fallback to basic division if content loading fails
      if (!questionText) {
        return {
          question: `${total} ÷ ${groups} = ___`,
          type: 'input',
          correctAnswer: perGroup,
          difficulty: level,
          explanation,
          metadata: { lang },
        };
      }

      return {
        question: questionText,
        type: 'input',
        correctAnswer: perGroup,
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
  if (typeof correctAnswer === 'number') {
    return parseFloat(userAnswer.toString()) === correctAnswer;
  } else {
    const normalized = (val: string) => val.replace(/\s+/g, ' ').trim();
    return normalized(userAnswer.toString()) === normalized(correctAnswer.toString());
  }
}

function getHint(questionData: Question): string {
  const lang = (questionData.metadata?.lang as Language) || 'he';
  return getHintFromContent('division', lang);
}

function getExplanation(questionData: Question, userAnswer: string | number) {
  const lang = (questionData.metadata?.lang as Language) || 'he';
  const feedback = getModuleFeedback('division', lang);

  return {
    detailed: getLocalizedExplanation(questionData.explanation || '', 'division', lang),
    tip: feedback.tip,
    nextSteps: feedback.nextSteps
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
