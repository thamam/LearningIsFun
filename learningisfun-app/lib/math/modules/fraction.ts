/**
 * Fraction Module - Headless
 * Extracted from Emma's Math Lab
 */

import { MathModule, Level, Question, Language } from '../types';
import { getInstruction, getHint as getHintFromContent } from '../content';

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function simplifyFraction(num: number, den: number): { num: number; den: number } {
  const divisor = gcd(num, den);
  return { num: num / divisor, den: den / divisor };
}

function getFractionRange(level: Level) {
  if (level === 'קל') {
    return { maxNumerator: 4, denominators: [2, 4] };
  } else if (level === 'בינוני') {
    return { maxNumerator: 8, denominators: [2, 3, 4, 5, 6] };
  } else {
    return { maxNumerator: 12, denominators: [2, 3, 4, 5, 6, 8, 10, 12] };
  }
}

function generateQuestion(level: Level = 'בינוני', lang: Language = 'he'): Question {
  const types = ['compare', 'addSameDenominator', 'simplify', 'fractionToDecimal', 'decimalToFraction'];
  const type = types[Math.floor(Math.random() * types.length)];
  const range = getFractionRange(level);

  switch (type) {
    case 'compare': {
      const den1 = range.denominators[Math.floor(Math.random() * range.denominators.length)];
      const num1 = Math.floor(Math.random() * den1) + 1;
      const num2 = Math.floor(Math.random() * den1) + 1;
      const choices = ['>', '<', '='];
      let answer: string;
      if (num1 > num2) answer = '>';
      else if (num1 < num2) answer = '<';
      else answer = '=';

      const promptText = getInstruction('fraction', 'comparePrompt', lang);
      const explanationText = lang === 'he'
        ? `${num1}/${den1} ${answer} ${num2}/${den1} כי ${num1} ${answer} ${num2}`
        : `${num1}/${den1} ${answer} ${num2}/${den1} because ${num1} ${answer} ${num2}`;

      return {
        question: `${promptText} ${num1}/${den1} ___ ${num2}/${den1}`,
        type: 'choice',
        correctAnswer: answer,
        choices: choices,
        difficulty: level,
        explanation: explanationText,
        metadata: { lang },
      };
    }

    case 'addSameDenominator': {
      const den = range.denominators[Math.floor(Math.random() * range.denominators.length)];
      const n1 = Math.floor(Math.random() * (den - 1)) + 1;
      const n2 = Math.floor(Math.random() * (den - n1)) + 1;
      const sum = n1 + n2;
      const simplified = simplifyFraction(sum, den);

      const calculateText = getInstruction('fraction', 'calculate', lang);
      const calculateAndSimplifyText = getInstruction('fraction', 'calculateAndSimplify', lang);

      if (simplified.den === 1) {
        const explanationText = lang === 'he'
          ? `${n1}/${den} + ${n2}/${den} = ${sum}/${den} = ${simplified.num}`
          : `${n1}/${den} + ${n2}/${den} = ${sum}/${den} = ${simplified.num}`;
        return {
          question: `${calculateText} ${n1}/${den} + ${n2}/${den} = ___`,
          type: 'input',
          correctAnswer: simplified.num,
          difficulty: level,
          explanation: explanationText,
          metadata: { lang },
        };
      } else if (simplified.num === sum && simplified.den === den) {
        const explanationText = lang === 'he'
          ? `${n1} + ${n2} = ${sum}, לכן התשובה היא ${sum}/${den}`
          : `${n1} + ${n2} = ${sum}, so the answer is ${sum}/${den}`;
        return {
          question: `${calculateText} ${n1}/${den} + ${n2}/${den} = ___/${den}`,
          type: 'input',
          correctAnswer: `${sum}/${den}`,
          difficulty: level,
          explanation: explanationText,
          metadata: { lang },
        };
      } else {
        const simplifyNote = lang === 'he' ? '(צמצמי!)' : '(simplify!)';
        const explanationText = lang === 'he'
          ? `${n1}/${den} + ${n2}/${den} = ${sum}/${den} = ${simplified.num}/${simplified.den}`
          : `${n1}/${den} + ${n2}/${den} = ${sum}/${den} = ${simplified.num}/${simplified.den}`;
        return {
          question: `${calculateAndSimplifyText} ${n1}/${den} + ${n2}/${den} = ___ ${simplifyNote}`,
          type: 'input',
          correctAnswer: `${simplified.num}/${simplified.den}`,
          difficulty: level,
          explanation: explanationText,
          metadata: { lang },
        };
      }
    }

    case 'simplify': {
      const baseDen = range.denominators[Math.floor(Math.random() * range.denominators.length)];
      const multiplier = Math.floor(Math.random() * 3) + 2;
      const numToSimplify = (Math.floor(Math.random() * (baseDen - 1)) + 1) * multiplier;
      const denToSimplify = baseDen * multiplier;
      const result = simplifyFraction(numToSimplify, denToSimplify);

      const simplifyText = getInstruction('fraction', 'simplify', lang);
      const explanationText = lang === 'he'
        ? `המחלק המשותף הגדול של ${numToSimplify} ו-${denToSimplify} הוא ${multiplier}, לכן ${numToSimplify}/${denToSimplify} = ${result.num}/${result.den}`
        : `The greatest common divisor of ${numToSimplify} and ${denToSimplify} is ${multiplier}, so ${numToSimplify}/${denToSimplify} = ${result.num}/${result.den}`;

      return {
        question: `${simplifyText} ${numToSimplify}/${denToSimplify} = ___`,
        type: 'input',
        correctAnswer: `${result.num}/${result.den}`,
        difficulty: level,
        explanation: explanationText,
        metadata: { lang },
      };
    }

    case 'fractionToDecimal': {
      const fractionPairs = [
        { num: 1, den: 2, decimal: 0.5 },
        { num: 1, den: 4, decimal: 0.25 },
        { num: 3, den: 4, decimal: 0.75 },
        { num: 1, den: 5, decimal: 0.2 },
        { num: 2, den: 5, decimal: 0.4 },
        { num: 3, den: 5, decimal: 0.6 },
        { num: 4, den: 5, decimal: 0.8 },
        { num: 1, den: 10, decimal: 0.1 },
        { num: 3, den: 10, decimal: 0.3 },
      ];
      const pair = fractionPairs[Math.floor(Math.random() * fractionPairs.length)];

      const promptText = getInstruction('fraction', 'fractionToDecimal', lang);

      return {
        question: `${promptText} ${pair.num}/${pair.den} = ___`,
        type: 'input',
        correctAnswer: pair.decimal,
        difficulty: level,
        explanation: `${pair.num}/${pair.den} = ${pair.decimal}`,
        metadata: { lang },
      };
    }

    case 'decimalToFraction': {
      const decimalOptions = [
        { decimal: 0.5, num: 1, den: 2 },
        { decimal: 0.25, num: 1, den: 4 },
        { decimal: 0.75, num: 3, den: 4 },
        { decimal: 0.2, num: 1, den: 5 },
        { decimal: 0.4, num: 2, den: 5 },
      ];
      const decPair = decimalOptions[Math.floor(Math.random() * decimalOptions.length)];

      const promptText = getInstruction('fraction', 'decimalToFraction', lang);

      return {
        question: `${promptText} ${decPair.decimal} = ___`,
        type: 'input',
        correctAnswer: `${decPair.num}/${decPair.den}`,
        difficulty: level,
        explanation: `${decPair.decimal} = ${decPair.num}/${decPair.den}`,
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
    // Remove all whitespace for comparison
    const normalize = (val: string) => val.replace(/\s/g, '');
    return normalize(userAnswer.toString()) === normalize(correctAnswer.toString());
  }
}

function getHint(questionData: Question): string {
  const lang = questionData.metadata?.lang || 'he';
  return getHintFromContent('fraction', lang as Language);
}

function getExplanation(questionData: Question, userAnswer: string | number) {
  const lang = questionData.metadata?.lang || 'he';
  return {
    detailed: questionData.explanation || (lang === 'he' ? 'תרגלי עוד תרגילי שברים' : 'Practice more fraction exercises'),
    tip: lang === 'he'
      ? 'כדי לצמצם שבר, חלקי את המונה והמכנה באותו מספר'
      : 'To simplify a fraction, divide both numerator and denominator by the same number',
    nextSteps: lang === 'he'
      ? 'המשיכי לתרגל השוואת שברים וחיבור שברים'
      : 'Continue practicing comparing and adding fractions',
  };
}

export const fractionModule: MathModule = {
  name: 'שברים',
  id: 'fraction',
  icon: '🍕',
  description: 'תרגול שברים - השוואה, חיבור, צמצום, המרה לעשרוני',
  generateQuestion,
  checkAnswer,
  getHint,
  getExplanation,
};
