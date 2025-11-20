/**
 * Headless Math Engine - Type Definitions
 * Extracted from Emma's Math Lab for use in Next.js
 */

export type Level = 'קל' | 'בינוני' | 'קשה';

export type QuestionType = 'input' | 'choice' | 'visual-input' | 'visual-choice';

export interface Question {
  question: string;
  type: QuestionType;
  correctAnswer: string | number;
  choices?: (string | number)[];
  explanation?: string;
  difficulty: Level;
  metadata?: Record<string, any>;
}

export interface MathModule {
  name: string;
  id: string;
  icon: string;
  description: string;
  generateQuestion: (level: Level) => Question;
  checkAnswer: (userAnswer: string | number, correctAnswer: string | number, questionData: Question) => boolean;
  getHint?: (questionData: Question) => string;
  getExplanation?: (questionData: Question, userAnswer: string | number) => {
    detailed: string;
    tip?: string;
    nextSteps?: string;
  };
}
