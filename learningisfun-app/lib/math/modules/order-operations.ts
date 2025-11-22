/**
 * Order of Operations Module (סדר פעולות חשבון) - Headless
 * Extracted from Emma's Math Lab
 *
 * Teaches order of operations through multi-step word problems that
 * demonstrate WHY the rules exist - not arbitrary rules to memorize.
 */

import { MathModule, Level, Question, Language } from '../types';
import { generateWordProblem, getHint as getHintFromContent } from '../content';

function generateQuestion(level: Level = 'בינוני', lang: string = 'he'): Question {
  if (level === 'קל') {
    // Easy: Focus on single rule application
    const types = ['parens_first', 'mult_before_add'];
    const type = types[Math.floor(Math.random() * types.length)];

    if (type === 'parens_first') {
      // (a + b) × c or a × (b + c)
      const a = Math.floor(Math.random() * 8) + 2;
      const b = Math.floor(Math.random() * 8) + 2;
      const c = Math.floor(Math.random() * 5) + 2;

      if (Math.random() < 0.5) {
        const expr = `(${a} + ${b}) × ${c}`;
        const answer = (a + b) * c;
        return {
          question: `חשב: ${expr}`,
          type: 'input',
          correctAnswer: answer,
          difficulty: level,
          explanation: `קודם פותרים את הסוגריים: ${a} + ${b} = ${a + b}, ואז: ${a + b} × ${c} = ${answer}`,
        };
      } else {
        const expr = `${a} × (${b} + ${c})`;
        const answer = a * (b + c);
        return {
          question: `חשב: ${expr}`,
          type: 'input',
          correctAnswer: answer,
          difficulty: level,
          explanation: `קודם פותרים את הסוגריים: ${b} + ${c} = ${b + c}, ואז: ${a} × ${b + c} = ${answer}`,
        };
      }
    } else {
      // mult_before_add: a + b × c
      const a = Math.floor(Math.random() * 20) + 5;
      const b = Math.floor(Math.random() * 8) + 2;
      const c = Math.floor(Math.random() * 8) + 2;

      const expr = `${a} + ${b} × ${c}`;
      const answer = a + b * c;
      return {
        question: `חשב: ${expr}`,
        type: 'input',
        correctAnswer: answer,
        difficulty: level,
        explanation: `קודם פותרים את הכפל: ${b} × ${c} = ${b * c}, ואז: ${a} + ${b * c} = ${answer}`,
      };
    }
  } else if (level === 'בינוני') {
    // Medium: Multiple operations with parentheses
    const types = ['three_ops', 'subtract_divide', 'word_problem_simple'];
    const type = types[Math.floor(Math.random() * types.length)];

    if (type === 'three_ops') {
      // (a + b) × c - d or a × b + c × d
      const a = Math.floor(Math.random() * 10) + 2;
      const b = Math.floor(Math.random() * 10) + 2;
      const c = Math.floor(Math.random() * 5) + 2;
      const d = Math.floor(Math.random() * 15) + 5;

      if (Math.random() < 0.5) {
        const expr = `(${a} + ${b}) × ${c} - ${d}`;
        const step1Result = a + b;
        const step2Result = step1Result * c;
        const answer = step2Result - d;
        return {
          question: `חשב: ${expr}`,
          type: 'input',
          correctAnswer: answer,
          difficulty: level,
          explanation: `1) סוגריים: ${a} + ${b} = ${step1Result}\n2) כפל: ${step1Result} × ${c} = ${step2Result}\n3) חיסור: ${step2Result} - ${d} = ${answer}`,
        };
      } else {
        const expr = `${a} × ${b} + ${c} × ${d}`;
        const mult1 = a * b;
        const mult2 = c * d;
        const answer = mult1 + mult2;
        return {
          question: `חשב: ${expr}`,
          type: 'input',
          correctAnswer: answer,
          difficulty: level,
          explanation: `1) כפל ראשון: ${a} × ${b} = ${mult1}\n2) כפל שני: ${c} × ${d} = ${mult2}\n3) חיבור: ${mult1} + ${mult2} = ${answer}`,
        };
      }
    } else if (type === 'subtract_divide') {
      // (a - b) ÷ c
      const c = Math.floor(Math.random() * 5) + 2;
      const quotient = Math.floor(Math.random() * 10) + 3;
      const a = c * quotient + Math.floor(Math.random() * 10) + 5;
      const b = Math.floor(Math.random() * Math.min(10, a - c));

      const expr = `(${a} - ${b}) ÷ ${c}`;
      const diff = a - b;
      const answer = Math.floor(diff / c);
      return {
        question: `חשב: ${expr}`,
        type: 'input',
        correctAnswer: answer,
        difficulty: level,
        explanation: `1) סוגריים: ${a} - ${b} = ${diff}\n2) חילוק: ${diff} ÷ ${c} = ${answer}`,
      };
    } else {
      // Simple word problem
      const scenarios = [
        {
          template: 'order-operations-subtraction',
          variables: (a: number, b: number, c: number) => ({ total: a, items: b, price: c }),
          expr: (a: number, b: number, c: number) => `${a} - ${b} × ${c}`,
          calc: (a: number, b: number, c: number) => a - b * c,
        },
        {
          template: 'order-operations-addition',
          variables: (a: number, b: number, c: number) => ({ children: a, pencils: b, additional: c }),
          expr: (a: number, b: number, c: number) => `${a} × ${b} + ${c}`,
          calc: (a: number, b: number, c: number) => a * b + c,
        },
      ];

      const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
      const a = Math.floor(Math.random() * 20) + 10;
      const b = Math.floor(Math.random() * 8) + 2;
      const c = Math.floor(Math.random() * 15) + 5;

      // Generate word problem from template
      const wordProblem = generateWordProblem(
        'order-operations',
        scenario.variables(a, b, c),
        lang as Language
      );

      const answer = scenario.calc(a, b, c);
      return {
        question: (wordProblem || scenario.expr(a, b, c)) + `\n\nפתרי ע"י תרגיל אחד.`,
        type: 'input',
        correctAnswer: answer,
        difficulty: level,
        explanation: `התרגיל: ${scenario.expr(a, b, c)} = ${answer}`,
      };
    }
  } else {
    // Hard: Complex multi-step word problems
    const scenarios = [
      {
        setup: (lang: Language) => {
          const total = Math.floor(Math.random() * 30) + 50;
          const shirts = Math.floor(Math.random() * 3) + 2;
          const pricePerShirt = Math.floor(Math.random() * 15) + 10;
          const pants = Math.floor(Math.random() * 20) + 15;

          const text = generateWordProblem(
            'order-operations',
            { total, items: shirts, price: pricePerShirt, pants },
            lang
          );

          return {
            text: text || `${total} - (${shirts} × ${pricePerShirt} + ${pants})`,
            expr: `${total} - (${shirts} × ${pricePerShirt} + ${pants})`,
            answer: total - (shirts * pricePerShirt + pants),
            explanation: `1) עלות חולצות: ${shirts} × ${pricePerShirt} = ${shirts * pricePerShirt}\n2) סה"כ קניות: ${shirts * pricePerShirt} + ${pants} = ${shirts * pricePerShirt + pants}\n3) יתרה: ${total} - ${shirts * pricePerShirt + pants} = ${total - (shirts * pricePerShirt + pants)}`,
          };
        },
      },
      {
        setup: (lang: Language) => {
          const rows = Math.floor(Math.random() * 5) + 5;
          const cols = Math.floor(Math.random() * 6) + 4;
          const perSeat = Math.floor(Math.random() * 3) + 6;
          const borrowed = Math.floor(Math.random() * 10) + 5;

          const text = generateWordProblem(
            'order-operations',
            { rows, cols, perSeat, borrowed },
            lang
          );

          return {
            text: text || `${rows} × ${cols} × ${perSeat} - ${borrowed}`,
            expr: `${rows} × ${cols} × ${perSeat} - ${borrowed}`,
            answer: rows * cols * perSeat - borrowed,
            explanation: `1) כיסאות: ${rows} × ${cols} = ${rows * cols}\n2) ספרים: ${rows * cols} × ${perSeat} = ${rows * cols * perSeat}\n3) נשארו: ${rows * cols * perSeat} - ${borrowed} = ${rows * cols * perSeat - borrowed}`,
          };
        },
      },
      {
        setup: (lang: Language) => {
          const groups = Math.floor(Math.random() * 5) + 4;
          const perGroup = Math.floor(Math.random() * 6) + 5;
          const additional = Math.floor(Math.random() * 8) + 3;
          const divisor = Math.floor(Math.random() * 4) + 2;
          const total = groups * perGroup + additional;

          const text = generateWordProblem(
            'order-operations',
            { groups, perGroup, additional, divisor },
            lang
          );

          return {
            text: text || `(${groups} × ${perGroup} + ${additional}) ÷ ${divisor}`,
            expr: `(${groups} × ${perGroup} + ${additional}) ÷ ${divisor}`,
            answer: Math.floor(total / divisor),
            explanation: `1) ילדים בקבוצות: ${groups} × ${perGroup} = ${groups * perGroup}\n2) סה"כ ילדים: ${groups * perGroup} + ${additional} = ${total}\n3) בכל כיתה: ${total} ÷ ${divisor} = ${Math.floor(total / divisor)}`,
          };
        },
      },
    ];

    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    const problem = scenario.setup(lang as Language);

    return {
      question: problem.text + `\n\nפתרי ע"י תרגיל אחד.`,
      type: 'input',
      correctAnswer: problem.answer,
      difficulty: level,
      explanation: `התרגיל: ${problem.expr}\n\n${problem.explanation}`,
      metadata: {
        expression: problem.expr,
      },
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
  const lang = questionData.metadata?.lang || 'he';
  return getHintFromContent('order-operations', lang as Language);
}

function getExplanation(questionData: Question, userAnswer: string | number) {
  return {
    detailed: questionData.explanation || 'תרגלי עוד תרגילי סדר פעולות',
    tip: 'סדר הפעולות הוא לא כלל שרירותי - הוא הגיוני במילים!',
    nextSteps: 'המשיכי לתרגל עם בעיות מילוליות מורכבות יותר',
  };
}

export const orderOperationsModule: MathModule = {
  name: 'סדר פעולות חשבון',
  id: 'order-operations',
  icon: '🔢',
  description: 'תרגול סדר פעולות - סוגריים, כפל וחילוק, חיבור וחיסור',
  generateQuestion,
  checkAnswer,
  getHint,
  getExplanation,
};
