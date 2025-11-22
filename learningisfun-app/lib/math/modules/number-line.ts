/**
 * Number Line Module (ישר מספרים) - Headless
 * Extracted from Emma's Math Lab
 *
 * Visual number line exercises - understanding position and intervals
 */

import { MathModule, Level, Question, NumberLineVisualData } from '../types';

function getNumberlineRange(level: Level): NumberLineVisualData {
  if (level === 'קל') {
    return { min: 0, max: 100, interval: 10 };
  } else if (level === 'בינוני') {
    return { min: 0, max: 500, interval: 50 };
  } else {
    return { min: 0, max: 1000, interval: 100 };
  }
}

function generateQuestion(level: Level = 'בינוני', lang: string = 'he'): Question {
  const types = ['whatIsNumber', 'betweenNumbers', 'closerTo'];
  const type = types[Math.floor(Math.random() * types.length)];
  const range = getNumberlineRange(level);

  switch (type) {
    case 'whatIsNumber': {
      // Visual question with arrow pointing to a number
      const arrowPosition = Math.floor(Math.random() * (range.max / range.interval)) * range.interval;
      return {
        question: `איזה מספר מסומן בחץ?`,
        type: 'visual-input',
        correctAnswer: arrowPosition,
        difficulty: level,
        explanation: `החץ מצביע על המספר ${arrowPosition}`,
        visualData: {
          ...range,
          arrowPosition: arrowPosition,
        },
      };
    }

    case 'betweenNumbers': {
      // Find the number exactly in the middle between two numbers
      const num1 = Math.floor(Math.random() * (range.max / range.interval / 2)) * range.interval;
      const num2 = num1 + range.interval * 2;
      const between = (num1 + num2) / 2;
      return {
        question: `איזה מספר נמצא בדיוק באמצע בין ${num1} ל-${num2}?`,
        type: 'input',
        correctAnswer: between,
        difficulty: level,
        explanation: `המספר באמצע בין ${num1} ל-${num2} הוא ${between}`,
      };
    }

    case 'closerTo': {
      // Determine which number a given number is closer to
      const baseNum = Math.floor(Math.random() * (range.max / range.interval)) * range.interval;
      const testNum = baseNum + Math.floor(range.interval * 0.3);
      const option1 = baseNum;
      const option2 = baseNum + range.interval;

      const correctAnswer = Math.abs(testNum - option1) < Math.abs(testNum - option2) ? option1 : option2;

      return {
        question: `המספר ${testNum} קרוב יותר ל-${option1} או ל-${option2}?`,
        type: 'choice',
        correctAnswer: correctAnswer,
        choices: [option1, option2],
        difficulty: level,
        explanation: `המספר ${testNum} קרוב יותר ל-${correctAnswer} (מרחק: ${Math.abs(testNum - correctAnswer)})`,
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
  return '💡 שימי לב למיקום המספרים על הישר ולמרווחים ביניהם';
}

function getExplanation(questionData: Question, userAnswer: string | number) {
  return {
    detailed: questionData.explanation || 'תרגלי עוד תרגילי ישר מספרים',
    tip: 'ישר המספרים עוזר לדמיין מרחקים בין מספרים',
    nextSteps: 'המשיכי לתרגל עם טווחים שונים',
  };
}

export const numberLineModule: MathModule = {
  name: 'ישר מספרים',
  id: 'number-line',
  icon: '📏',
  description: 'תרגול ישר מספרים - מיקום מספרים, מספרים בין, קרוב יותר',
  generateQuestion,
  checkAnswer,
  getHint,
  getExplanation,
};
