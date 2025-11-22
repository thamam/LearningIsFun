/**
 * Distributive Property Module (חוק הפילוג) - Headless
 * Extracted from Emma's Math Lab
 *
 * The distributive property connects place value to multiplication.
 * Example: 7 × 13 = 7 × (10 + 3) = (7 × 10) + (7 × 3) = 70 + 21 = 91
 */

import { MathModule, Level, Question } from '../types';

function generateQuestion(level: Level = 'בינוני', lang: string = 'he'): Question {
  if (level === 'קל') {
    // Easy: Visual decomposition with tens and ones
    const a = Math.floor(Math.random() * 7) + 3; // 3-9
    const tens = (Math.floor(Math.random() * 3) + 1) * 10; // 10, 20, or 30
    const ones = Math.floor(Math.random() * 8) + 2; // 2-9
    const b = tens + ones; // 12-39

    const types = ['fill_blank', 'calculate'];
    const type = types[Math.floor(Math.random() * types.length)];

    if (type === 'fill_blank') {
      // Fill in the blank: 7 × 13 = 7 × (10 + 3) = (7 × 10) + (7 × __) = ?
      const missingPart = Math.random() < 0.5 ? 'ones' : 'tens';

      if (missingPart === 'ones') {
        return {
          question: `${a} × ${b} = ${a} × (${tens} + ${ones})\n= (${a} × ${tens}) + (${a} × ___)\n\nמהו המספר החסר?`,
          type: 'input',
          correctAnswer: ones,
          difficulty: level,
          explanation: `התשובה: ${ones}\n\nהסבר: אנחנו מפרקים את ${b} ל-${tens} + ${ones}, ואז מכפילים כל חלק ב-${a}.\nאז צריך: (${a} × ${tens}) + (${a} × ${ones}) = ${a * tens} + ${a * ones} = ${a * b}`,
        };
      } else {
        return {
          question: `${a} × ${b} = ${a} × (${tens} + ${ones})\n= (${a} × ___) + (${a} × ${ones})\n\nמהו המספר החסר?`,
          type: 'input',
          correctAnswer: tens,
          difficulty: level,
          explanation: `התשובה: ${tens}\n\nהסבר: אנחנו מפרקים את ${b} ל-${tens} + ${ones}, ואז מכפילים כל חלק ב-${a}.\nאז צריך: (${a} × ${tens}) + (${a} × ${ones}) = ${a * tens} + ${a * ones} = ${a * b}`,
        };
      }
    } else {
      // Calculate final answer using distributive property
      const answer = a * b;
      return {
        question: `חשב בעזרת חוק הפילוג:\n\n${a} × ${b} = ${a} × (${tens} + ${ones})\n= (${a} × ${tens}) + (${a} × ${ones})\n= ___ + ___\n= ?`,
        type: 'input',
        correctAnswer: answer,
        difficulty: level,
        explanation: `פתרון:\n1) ${a} × ${tens} = ${a * tens}\n2) ${a} × ${ones} = ${a * ones}\n3) ${a * tens} + ${a * ones} = ${answer}`,
      };
    }
  } else if (level === 'בינוני') {
    // Medium: Larger numbers and both addition/subtraction decomposition
    const a = Math.floor(Math.random() * 8) + 3; // 3-10
    const base = (Math.floor(Math.random() * 9) + 2) * 10; // 20, 30, ..., 100
    const offset = Math.floor(Math.random() * 8) + 1; // 1-8

    const useSubtraction = Math.random() < 0.5;

    if (useSubtraction) {
      // Subtraction: 7 × 19 = 7 × (20 - 1)
      const b = base - offset;
      const answer = a * b;

      return {
        question: `חשב בעזרת חוק הפילוג:\n\n${a} × ${b}\n\nרמז: ${b} = ${base} - ${offset}`,
        type: 'input',
        correctAnswer: answer,
        difficulty: level,
        explanation: `פתרון:\n${a} × ${b} = ${a} × (${base} - ${offset})\n= (${a} × ${base}) - (${a} × ${offset})\n= ${a * base} - ${a * offset}\n= ${answer}\n\n💡 שימוש בחיסור עוזר כשהמספר קרוב לעשרת עגולה!`,
      };
    } else {
      // Addition with larger numbers: 8 × 47 = 8 × (40 + 7)
      const b = base + offset;
      const tens = Math.floor(b / 10) * 10;
      const ones = b % 10;
      const answer = a * b;

      return {
        question: `חשב בעזרת חוק הפילוג:\n\n${a} × ${b}\n\nרמז: ${b} = ${tens} + ${ones}`,
        type: 'input',
        correctAnswer: answer,
        difficulty: level,
        explanation: `פתרון:\n${a} × ${b} = ${a} × (${tens} + ${ones})\n= (${a} × ${tens}) + (${a} × ${ones})\n= ${a * tens} + ${a * ones}\n= ${answer}`,
      };
    }
  } else {
    // Hard: Three-digit numbers and connection to standard algorithm
    const a = Math.floor(Math.random() * 6) + 4; // 4-9
    const hundreds = (Math.floor(Math.random() * 3) + 1) * 100; // 100, 200, 300
    const tens = Math.floor(Math.random() * 10) * 10; // 0-90
    const ones = Math.floor(Math.random() * 10); // 0-9
    const b = hundreds + tens + ones; // 100-399

    const answer = a * b;

    const h = Math.floor(b / 100) * 100;
    const t = Math.floor((b % 100) / 10) * 10;
    const o = b % 10;

    const parts: string[] = [];
    let calculation = '';
    const sumParts: number[] = [];

    if (h > 0) {
      parts.push(`(${a} × ${h})`);
      calculation += `${a} × ${h} = ${a * h}\n`;
      sumParts.push(a * h);
    }
    if (t > 0) {
      parts.push(`(${a} × ${t})`);
      calculation += `${a} × ${t} = ${a * t}\n`;
      sumParts.push(a * t);
    }
    if (o > 0) {
      parts.push(`(${a} × ${o})`);
      calculation += `${a} × ${o} = ${a * o}\n`;
      sumParts.push(a * o);
    }

    const decomposition = parts.join(' + ');
    const decompositionValues = [h, t, o].filter((v) => v > 0).join(' + ');

    return {
      question: `חשב בעזרת חוק הפילוג:\n\n${a} × ${b.toLocaleString('en-US')}`,
      type: 'input',
      correctAnswer: answer,
      difficulty: level,
      explanation: `פתרון מלא:\n\n1) פירוק עשרוני: ${b.toLocaleString('en-US')} = ${decompositionValues}\n\n2) חוק הפילוג:\n${a} × ${b.toLocaleString('en-US')} = ${decomposition}\n\n3) חישוב:\n${calculation}\n4) חיבור:\n${sumParts.join(' + ')} = ${answer.toLocaleString('en-US')}\n\n💡 זה בדיוק מה שקורה באלגוריתם הכפל המאונך!`,
    };
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
  return '💡 פרקי את המספר לפי מבנה עשרוני והכפל כל חלק בנפרד';
}

function getExplanation(questionData: Question, userAnswer: string | number) {
  return {
    detailed: questionData.explanation || 'תרגלי עוד תרגילי חוק הפילוג',
    tip: 'חוק הפילוג הוא הגשר בין מבנה עשרוני לכפל',
    nextSteps: 'המשיכי לתרגל עם מספרים גדולים יותר',
  };
}

export const distributiveModule: MathModule = {
  name: 'חוק הפילוג',
  id: 'distributive',
  icon: '📐',
  description: 'תרגול חוק הפילוג - הגשר בין מבנה עשרוני לכפל',
  generateQuestion,
  checkAnswer,
  getHint,
  getExplanation,
};
