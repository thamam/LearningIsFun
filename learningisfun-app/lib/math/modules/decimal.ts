/**
 * Decimal Module (מבנה עשרוני) - Headless
 * Extracted from Emma's Math Lab
 *
 * Place value understanding - decomposition, digit value, comparison
 */

import { MathModule, Level, Question } from '../types';

function getRandomNumber(level: Level): number {
  if (level === 'קל') {
    return Math.floor(Math.random() * 90) + 10; // 10-99 (two-digit)
  } else if (level === 'בינוני') {
    return Math.floor(Math.random() * 900) + 100; // 100-999 (three-digit)
  } else {
    return Math.floor(Math.random() * 9000) + 1000; // 1,000-9,999 (four-digit)
  }
}

function generateQuestion(level: Level = 'בינוני', lang: string = 'he'): Question {
  const types = ['decomposition', 'digitValue', 'nextPrevious', 'compare', 'missingDigit'];
  const type = types[Math.floor(Math.random() * types.length)];
  const num = getRandomNumber(level);

  switch (type) {
    case 'decomposition': {
      const digits = num.toString().split('').map(Number);
      const position = Math.floor(Math.random() * digits.length);
      const placeValues: string[] = [];
      let answer = 0;

      for (let i = 0; i < digits.length; i++) {
        const placeValue = digits[i] * Math.pow(10, digits.length - 1 - i);
        if (i === position) {
          placeValues.push('?');
          answer = placeValue;
        } else {
          placeValues.push(placeValue.toLocaleString('en-US'));
        }
      }

      const formattedNum = num.toLocaleString('en-US');
      return {
        question: `${formattedNum} = ${placeValues.join(' + ')}`,
        type: 'input',
        correctAnswer: answer,
        difficulty: level,
        explanation: `המספר ${formattedNum} מתפרק ל: ${placeValues.join(' + ')}, כאשר ? = ${answer}`,
      };
    }

    case 'digitValue': {
      const digitStr = num.toString();
      const digitPos = Math.floor(Math.random() * digitStr.length);
      const digit = parseInt(digitStr[digitPos]);
      const value = digit * Math.pow(10, digitStr.length - 1 - digitPos);
      const formattedNum = num.toLocaleString('en-US');

      return {
        question: `מה ערך הספרה ${digit} במספר ${formattedNum}?`,
        type: 'input',
        correctAnswer: value,
        difficulty: level,
        explanation: `הספרה ${digit} במספר ${formattedNum} שווה ${value}`,
      };
    }

    case 'nextPrevious': {
      const isNext = Math.random() < 0.5;
      const formattedNum = num.toLocaleString('en-US');
      const answer = isNext ? num + 1 : num - 1;

      return {
        question: isNext
          ? `מהו המספר העוקב של ${formattedNum}?`
          : `מהו המספר הקודם של ${formattedNum}?`,
        type: 'input',
        correctAnswer: answer,
        difficulty: level,
        explanation: isNext
          ? `המספר העוקב של ${formattedNum} הוא ${answer.toLocaleString('en-US')}`
          : `המספר הקודם של ${formattedNum} הוא ${answer.toLocaleString('en-US')}`,
      };
    }

    case 'compare': {
      const num2 = getRandomNumber(level);
      let correctSymbol: string;
      if (num < num2) correctSymbol = '<';
      else if (num > num2) correctSymbol = '>';
      else correctSymbol = '=';

      const formattedNum1 = num.toLocaleString('en-US');
      const formattedNum2 = num2.toLocaleString('en-US');

      return {
        question: `${formattedNum1} ___ ${formattedNum2}`,
        type: 'choice',
        correctAnswer: correctSymbol,
        choices: ['<', '=', '>'],
        difficulty: level,
        explanation: `${formattedNum1} ${correctSymbol} ${formattedNum2}`,
      };
    }

    case 'missingDigit': {
      const numStr = num.toString();
      const numDigits = numStr.length;
      const missingPos = Math.floor(Math.random() * numStr.length);
      const missingDigit = numStr[missingPos];
      const numWithMissing = numStr.substring(0, missingPos) + '_' + numStr.substring(missingPos + 1);

      // Calculate place value of missing digit
      const placeValue = Math.pow(10, numDigits - 1 - missingPos);

      // Generate random offset scaled by place value
      let offset: number;
      if (placeValue === 1) {
        offset = Math.floor(Math.random() * 10) + 1; // 1-10
      } else if (placeValue === 10) {
        offset = Math.floor(Math.random() * 41) + 10; // 10-50
      } else if (placeValue === 100) {
        offset = Math.floor(Math.random() * 301) + 100; // 100-400
      } else {
        offset = Math.floor(Math.random() * 2001) + 1000; // 1000-3000
      }

      // Calculate bounds with random offset
      const minNum = Math.pow(10, numDigits - 1);
      const maxNum = Math.pow(10, numDigits) - 1;
      let lowerBound = Math.max(num - offset, minNum);
      let upperBound = Math.min(num + offset, maxNum);

      const formattedLowerBound = lowerBound.toLocaleString('en-US');
      const formattedUpperBound = upperBound.toLocaleString('en-US');

      // For answer checking, we'll store the full answer info
      return {
        question: `מהי הספרה החסרה? ${numWithMissing}\n(המספר נמצא בין ${formattedLowerBound} ל-${formattedUpperBound})`,
        type: 'input',
        correctAnswer: parseInt(missingDigit),
        difficulty: level,
        explanation: `הספרה החסרה היא ${missingDigit}, והמספר המלא הוא ${num.toLocaleString('en-US')}`,
        metadata: {
          type: 'range',
          min: lowerBound,
          max: upperBound,
          pattern: numStr,
          missingPos: missingPos,
        },
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
  // Handle range validation for missingDigit questions
  if (questionData.metadata && questionData.metadata.type === 'range') {
    const answerInfo = questionData.metadata;
    const userNum = parseInt(
      answerInfo.pattern.substring(0, answerInfo.missingPos) +
        userAnswer.toString() +
        answerInfo.pattern.substring(answerInfo.missingPos + 1)
    );
    return userNum >= answerInfo.min && userNum <= answerInfo.max;
  }

  // Standard validation
  if (typeof correctAnswer === 'number') {
    return parseFloat(userAnswer.toString()) === correctAnswer;
  } else {
    return userAnswer.toString() === correctAnswer.toString();
  }
}

function getHint(questionData: Question): string {
  return '💡 חשבי על ערך כל ספרה לפי מקומה';
}

function getExplanation(questionData: Question, userAnswer: string | number) {
  return {
    detailed: questionData.explanation || 'תרגלי עוד תרגילי מבנה עשרוני',
    tip: 'ערך הספרה תלוי במקומה: אחדות, עשרות, מאות, אלפים',
    nextSteps: 'המשיכי לתרגל עם מספרים גדולים יותר',
  };
}

export const decimalModule: MathModule = {
  name: 'מבנה עשרוני',
  id: 'decimal',
  icon: '🔢',
  description: 'תרגול מבנה עשרוני - פירוק מספרים, ערך ספרתי, השוואה',
  generateQuestion,
  checkAnswer,
  getHint,
  getExplanation,
};
